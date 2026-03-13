"use strict";
// server/scripts/generateQuestions.js
// ─────────────────────────────────────────────────────────────────────────────
// Génère et insère dans MongoDB des questions bibliques depuis bibleData.js.
//
// Sources :
//   • BIBLE_VERSES → 5 types de questions auto-générées
//   • BIBLE_FACTS  → questions QCM déjà rédigées, insérées directement
//
// Usage :
//   node server/scripts/generateQuestions.js
//   node server/scripts/generateQuestions.js --dry-run   (test sans écriture)
//   node server/scripts/generateQuestions.js --only-facts
//   node server/scripts/generateQuestions.js --only-verses
// ─────────────────────────────────────────────────────────────────────────────

require("dotenv").config();
const mongoose = require("mongoose");

// ── Imports internes ─────────────────────────────────────────────────────────
const Question             = require("../models/question");
const { filtrerLot,
        filtrerDoublonsBDD } = require("../utils/deduplication");
const {
  genererCompletion,
  genererVraiFaux,
  genererQCMLivre,
  genererQCMPersonnage,
  genererReference,
  genererTexteJeSuis,
  genererAppariement,
} = require("../utils/generators");

// ── Source de données ─────────────────────────────────────────────────────────
// bibleData.js exporte { BIBLE_VERSES, BIBLE_FACTS } — pas un tableau direct.
const bibleDataModule = require("../../src/data/bibleData");

const BIBLE_VERSES =
  bibleDataModule.BIBLE_VERSES ||       // format standard : { BIBLE_VERSES, BIBLE_FACTS }
  bibleDataModule.default?.BIBLE_VERSES ||
  (Array.isArray(bibleDataModule) ? bibleDataModule : null);

const BIBLE_FACTS =
  bibleDataModule.BIBLE_FACTS ||
  bibleDataModule.default?.BIBLE_FACTS ||
  [];

// ── Pool de distracteurs pour les QCM Personnage ─────────────────────────────
const PERSONNAGES_POOL = [
  "Moïse", "Abraham", "David", "Paul", "Pierre", "Jean", "Salomon",
  "Jonas", "Noé", "Élie", "Judas", "Thomas", "Marie", "Élisée", "Daniel",
  "Ésaïe", "Jérémie", "Samuel", "Josué", "Ruth", "Esther", "Zacharie", "Aaron",
];

// ─── ARGUMENTS CLI ────────────────────────────────────────────────────────────
const args      = process.argv.slice(2);
const DRY_RUN   = args.includes("--dry-run");
const ONLY_FACTS   = args.includes("--only-facts");
const ONLY_VERSES  = args.includes("--only-verses");

// ─── GÉNÉRATION DEPUIS UN VERSET ─────────────────────────────────────────────

/**
 * Génère toutes les questions pertinentes pour un verset donné.
 * Chaque générateur retourne null si le verset ne s'y prête pas.
 *
 * @param {object}   verse        - { ref, text, book, testament }
 * @param {string[]} tousLesLivres - liste de tous les livres (pour distracteurs)
 * @param {string}   batchId
 * @returns {object[]}
 */
function genererDepuisVerset(verse, tousLesLivres, batchId) {
  const resultats = [];

  const tentatives = [
    () => genererCompletion(verse, batchId),
    () => genererVraiFaux(verse, batchId),
    () => genererQCMLivre(verse, tousLesLivres, batchId),
    () => genererQCMPersonnage(verse, PERSONNAGES_POOL, batchId),
    () => genererReference(verse, BIBLE_VERSES, batchId),
    () => genererTexteJeSuis(verse, batchId),
    () => genererAppariement(verse, batchId),
  ];

  for (const fn of tentatives) {
    try {
      const q = fn();
      if (q) resultats.push(q);
    } catch (err) {
      // Une erreur sur un générateur ne bloque pas les autres
      console.warn(`  ⚠  Générateur échoué sur ${verse.ref} :`, err.message);
    }
  }

  return resultats;
}

// ─── CONVERSION BIBLE_FACTS → QUESTION MONGOOSE ───────────────────────────────

/**
 * Convertit un élément de BIBLE_FACTS en document Question compatible Mongoose.
 *
 * Les BIBLE_FACTS sont des questions déjà rédigées par un humain :
 *   - source: "manual"   (rédigées à la main, pas auto-générées)
 *   - status: "approved" (déjà vérifiées, jouables immédiatement)
 *
 * @param {object} fact  - { question, answer, wrong: [], hint }
 * @param {string} batchId
 * @returns {object|null}
 */
function convertirFact(fact, batchId) {
  if (!fact.question || !fact.answer) return null;

  // Construire les 4 options : bonne réponse + 3 mauvaises, mélangées
  const mauvaises = Array.isArray(fact.wrong) ? fact.wrong.slice(0, 3) : [];
  if (mauvaises.length < 1) return null; // pas de distracteurs = pas de QCM valide

  const melanger = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const options  = melanger([fact.answer, ...mauvaises]);

  // Classification automatique selon le contenu
  const q = fact.question.toLowerCase();
  let category = "Général";
  let level    = "Intermédiaire";
  let tags     = ["bible-facts", "culture-biblique"];

  if (/combien|nombre/.test(q))         { category = "Chiffres bibliques"; tags.push("chiffres"); }
  else if (/quel (roi|prophète|apôtre|disciple|livre)/.test(q)) { category = "Personnages bibliques"; tags.push("personnages"); }
  else if (/où|ville|pays|lieu/.test(q)) { category = "Géographie biblique"; tags.push("géographie"); }
  else if (/langue|écrit/.test(q))       { category = "Histoire de la Bible"; tags.push("histoire"); }

  if (/jean 3:16|psaume 23|notre père/.test(q)) level = "Débutant";
  else if (/apocryphes|deutérocanon|grec|hébreu/.test(q)) level = "Avancé";

  return {
    question:      fact.question,
    type:          "QCM",
    options,
    correctAnswer: fact.answer,
    pairs:         [],
    timeLimit:     20,
    reference:     "",
    referenceDetails: { book: "", chapter: null, verse: null, ref: "" },
    sourceVerseText:  "",
    sourceVerses:     [],
    hint:          fact.hint || "",
    explanation:   `La bonne réponse est : ${fact.answer}`,
    level,
    difficultyScore: 2,
    category,
    theme:         "Culture biblique générale",
    testament:     "",
    tags,
    status:        "approved",  // déjà vérifiés manuellement → jouables directement
    source:        "manual",
    isActive:      true,
    generatorMeta: {
      sourceType:             "manual",
      generatorVersion:       "v2",
      generatedFromVerseRefs: [],
      batchId,
      modelName:              "",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// ─── PIPELINE PRINCIPAL ───────────────────────────────────────────────────────

async function main() {

  // ── Validation de la source ───────────────────────────────────────────
  if (!Array.isArray(BIBLE_VERSES)) {
    console.error("\n❌ BIBLE_VERSES n'est pas un tableau.");
    console.error("   Vérifiez que src/data/bibleData.js exporte bien { BIBLE_VERSES, BIBLE_FACTS }");
    console.error("   Type reçu :", typeof BIBLE_VERSES);
    process.exit(1);
  }

  // ── En-tête ───────────────────────────────────────────────────────────
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║   Générateur de questions bibliques — v2    ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log(`  Mode      : ${DRY_RUN ? "🔍 DRY RUN (aucune écriture)" : "💾 INSERT MongoDB"}`);
  console.log(`  Versets   : ${BIBLE_VERSES.length}`);
  console.log(`  Facts     : ${BIBLE_FACTS.length}`);
  console.log(`  Sources   : ${ONLY_FACTS ? "BIBLE_FACTS seulement" : ONLY_VERSES ? "BIBLE_VERSES seulement" : "les deux"}`);

  // ── Connexion MongoDB ─────────────────────────────────────────────────
  if (!DRY_RUN) {
    if (!process.env.MONGO_URI) {
      console.error("\n❌ MONGO_URI manquant. Ajoutez-le dans un fichier .env à la racine.");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("\n🔗 Connecté à MongoDB\n");
  } else {
    console.log("\n🔍 Mode DRY RUN — pas de connexion MongoDB\n");
  }

  const batchId        = `batch-${Date.now()}`;
  const tousLesLivres  = [...new Set(BIBLE_VERSES.map(v => v.book).filter(Boolean))];

  let totalGenerees  = 0;
  let totalAcceptees = 0;
  let totalRejetees  = 0;
  let totalIgnorees  = 0; // doublons déjà en base
  let totalInserees  = 0;

  // ══════════════════════════════════════════════════════════════════════
  // PARTIE 1 — BIBLE_VERSES
  // ══════════════════════════════════════════════════════════════════════
  if (!ONLY_FACTS) {
    console.log("📖 Génération depuis BIBLE_VERSES...");

    for (let i = 0; i < BIBLE_VERSES.length; i++) {
      const verse   = BIBLE_VERSES[i];
      const vBatchId = `${batchId}-verse-${i + 1}`;

      // Générer toutes les questions possibles pour ce verset
      const brutes = genererDepuisVerset(verse, tousLesLivres, vBatchId);
      totalGenerees += brutes.length;

      // Valider + dédupliquer dans le lot
      const { acceptees, rejetees } = filtrerLot(brutes);
      totalAcceptees += acceptees.length;
      totalRejetees  += rejetees.length;

      if (DRY_RUN || acceptees.length === 0) continue;

      // Filtrer les doublons déjà en base
      const nouvelles = await filtrerDoublonsBDD(acceptees, Question);
      totalIgnorees  += acceptees.length - nouvelles.length;
      totalInserees  += nouvelles.length;

      if (nouvelles.length > 0) {
        await Question.insertMany(nouvelles, { ordered: false }).catch(err => {
          if (err.code !== 11000) throw err; // ignorer les doublons sur index unique
        });
      }
    }

    console.log(`  ✅ ${totalGenerees} générées → ${totalAcceptees} valides → ${totalInserees} insérées`);
    if (totalRejetees > 0) console.log(`  ⚠️  ${totalRejetees} rejetées (qualité insuffisante)`);
    if (totalIgnorees > 0) console.log(`  ⏭️  ${totalIgnorees} ignorées (déjà en base)`);
  }

  // ══════════════════════════════════════════════════════════════════════
  // PARTIE 2 — BIBLE_FACTS
  // ══════════════════════════════════════════════════════════════════════
  if (!ONLY_VERSES && BIBLE_FACTS.length > 0) {
    console.log("\n📚 Insertion des BIBLE_FACTS...");

    const factsConverties = BIBLE_FACTS
      .map((fact, i) => convertirFact(fact, `${batchId}-fact-${i + 1}`))
      .filter(Boolean);

    const { acceptees: factsAcceptees, rejetees: factsRejetees } = filtrerLot(factsConverties);
    totalRejetees += factsRejetees.length;

    let factsInserees = 0;

    if (!DRY_RUN && factsAcceptees.length > 0) {
      const nouvellesFacts = await filtrerDoublonsBDD(factsAcceptees, Question);
      totalIgnorees += factsAcceptees.length - nouvellesFacts.length;
      factsInserees  = nouvellesFacts.length;
      totalInserees += factsInserees;

      if (nouvellesFacts.length > 0) {
        await Question.insertMany(nouvellesFacts, { ordered: false }).catch(err => {
          if (err.code !== 11000) throw err;
        });
      }
    } else if (DRY_RUN) {
      factsInserees = factsAcceptees.length;
    }

    console.log(`  ✅ ${BIBLE_FACTS.length} facts → ${factsAcceptees.length} valides → ${factsInserees} insérées`);
    console.log(`  ℹ️  Les BIBLE_FACTS sont insérés avec status: "approved" (jouables immédiatement)`);
  }

  // ── Résumé final ─────────────────────────────────────────────────────
  console.log("\n══════════════════════════════════════════");
  console.log("  RÉSUMÉ FINAL");
  console.log("══════════════════════════════════════════");
  if (!ONLY_FACTS) {
  console.log(`  Questions générées depuis versets : ${totalGenerees}`);
  }
  console.log(`  Questions acceptées (valides)     : ${totalAcceptees}`);
  console.log(`  Questions rejetées (qualité)      : ${totalRejetees}`);
  console.log(`  Questions ignorées (doublons BDD) : ${totalIgnorees}`);
  console.log(`  Questions insérées en MongoDB     : ${DRY_RUN ? "(dry run)" : totalInserees}`);
  console.log(`  Batch ID                          : ${batchId}`);

  if (!DRY_RUN && totalInserees > 0) {
    console.log("\n  → Pour approuver les questions générées depuis les versets :");
    console.log(`    PATCH /api/questions/batch/approve`);
    console.log(`    Body: { "batchId": "${batchId}" }`);
    console.log("\n  → Les BIBLE_FACTS sont déjà status: approved, jouables immédiatement.");
  }

  if (!DRY_RUN) await mongoose.disconnect();
  console.log("\n✅ Script terminé.\n");
}

// ─── LANCEMENT ────────────────────────────────────────────────────────────────
main().catch(err => {
  console.error("\n💥 Erreur fatale :", err.message || err);
  process.exit(1);
});
