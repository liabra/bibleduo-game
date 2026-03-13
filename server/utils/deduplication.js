"use strict";
// utils/deduplication.js
// Anti-doublons et validation qualité des questions générées.
// Utilise `crypto` (module natif Node.js) — aucune dépendance externe.

const crypto = require("crypto");

// ─── HASH ─────────────────────────────────────────────────────────────────────

/**
 * Hash SHA-256 de la question, basé sur son texte et sa réponse normalisés.
 * Deux questions identiques produisent toujours le même hash.
 *
 * @param {object} q
 * @returns {string} 64 caractères hexadécimaux
 */
function genererHash(q) {
  const entree = [
    String(q.question   || "").toLowerCase().replace(/\s+/g, " ").trim(),
    String(q.correctAnswer || "").toLowerCase().trim(),
    String(q.type        || "").toLowerCase(),
  ].join("||");

  return crypto.createHash("sha256").update(entree, "utf8").digest("hex");
}

// ─── VALIDATION QUALITÉ ───────────────────────────────────────────────────────

/**
 * Valide qu'une question générée est utilisable dans un quiz.
 * Retourne { valide: boolean, raisons: string[] }
 *
 * @param {object} q
 * @returns {{ valide: boolean, raisons: string[] }}
 */
function validerQuestion(q) {
  const raisons = [];

  // ── Champs obligatoires ────────────────────────────────────────────────
  if (!q.question || q.question.trim().length < 10) {
    raisons.push("question trop courte ou vide");
  }
  if (q.correctAnswer === undefined || q.correctAnswer === null ||
      String(q.correctAnswer).trim() === "") {
    raisons.push("réponse correcte absente");
  }
  if (!q.type) {
    raisons.push("type manquant");
  }

  // ── Règles par type ────────────────────────────────────────────────────
  if (q.type === "QCM" || q.type === "Reference" || q.type === "VraiFaux") {
    if (!Array.isArray(q.options) || q.options.length < 2) {
      raisons.push(`${q.type} sans options suffisantes (minimum 2)`);
    }
    if (Array.isArray(q.options) && !q.options.includes(q.correctAnswer)) {
      raisons.push("la réponse correcte n'est pas dans les options");
    }
    if (Array.isArray(q.options)) {
      const uniques = new Set(q.options);
      if (uniques.size !== q.options.length) {
        raisons.push("options dupliquées");
      }
    }
  }

  if (q.type === "VraiFaux" && !["Vrai", "Faux"].includes(q.correctAnswer)) {
    raisons.push("VraiFaux : correctAnswer doit être \"Vrai\" ou \"Faux\"");
  }

  if (q.type === "Complétion") {
    const nbMots = String(q.correctAnswer).split(" ").length;
    if (nbMots > 5) {
      raisons.push("Complétion : réponse trop longue (> 5 mots)");
    }
  }

  if (q.type === "Appariement") {
    if (!Array.isArray(q.pairs) || q.pairs.length < 2) {
      raisons.push("Appariement sans paires suffisantes");
    }
  }

  // ── Sanity check général ───────────────────────────────────────────────
  if (/undefined|null/.test(q.question)) {
    raisons.push("question contient \"undefined\" ou \"null\" en chaîne");
  }
  if (String(q.correctAnswer) === "undefined" || String(q.correctAnswer) === "null") {
    raisons.push("correctAnswer sérialisé en \"undefined\" ou \"null\"");
  }

  return { valide: raisons.length === 0, raisons };
}

// ─── FILTRE DE LOT ────────────────────────────────────────────────────────────

/**
 * Filtre un tableau de questions brutes :
 * 1. Valide chaque question
 * 2. Ajoute le questionHash
 * 3. Déduplique dans le lot
 *
 * @param {object[]} questions
 * @returns {{
 *   acceptees: object[],
 *   rejetees: { question: object, raisons: string[] }[]
 * }}
 */
function filtrerLot(questions) {
  const hashesSeen = new Set();
  const acceptees  = [];
  const rejetees   = [];

  for (const q of questions) {
    if (!q) {
      rejetees.push({ question: q, raisons: ["question null/undefined"] });
      continue;
    }

    const { valide, raisons } = validerQuestion(q);
    if (!valide) {
      rejetees.push({ question: q, raisons });
      continue;
    }

    const hash = genererHash(q);
    if (hashesSeen.has(hash)) {
      rejetees.push({ question: q, raisons: ["doublon dans ce lot"] });
      continue;
    }

    hashesSeen.add(hash);
    acceptees.push({ ...q, questionHash: hash });
  }

  return { acceptees, rejetees };
}

/**
 * Filtre les questions dont le hash existe déjà en base MongoDB.
 * À appeler APRÈS filtrerLot, juste avant insertMany.
 *
 * @param {object[]} questions  Questions avec questionHash déjà calculé
 * @param {object}   QuestionModel  Modèle Mongoose
 * @returns {Promise<object[]>}  Questions absentes de la base
 */
async function filtrerDoublonsBDD(questions, QuestionModel) {
  const hashes = questions.map(q => q.questionHash).filter(Boolean);
  if (hashes.length === 0) return questions;

  const existants = await QuestionModel
    .find({ questionHash: { $in: hashes } }, { questionHash: 1 })
    .lean();

  const existantsSet = new Set(existants.map(e => e.questionHash));
  return questions.filter(q => !existantsSet.has(q.questionHash));
}

module.exports = {
  genererHash,
  validerQuestion,
  filtrerLot,
  filtrerDoublonsBDD,
};
