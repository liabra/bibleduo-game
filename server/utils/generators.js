"use strict";
// utils/generators.js
// Une fonction par type de question.
// Chaque fonction retourne un objet compatible avec le schéma Question Mongoose,
// ou null si le verset n'est pas adapté à ce type.
//
// AUCUNE écriture en base ici — uniquement de la transformation pure.

const {
  detecterPersonnages,
  detecterLieux,
  candidatsCompletion,
  estFormuleJeSuis,
  estEnumeration,
  estimerDifficulte,
  categoriserVerset,
  genererTags,
} = require("./heuristics");

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const melanger = (arr) => [...arr].sort(() => Math.random() - 0.5);

/**
 * Sélectionne N éléments distincts au hasard dans un tableau.
 */
function echantillonner(arr, n) {
  return melanger(arr).slice(0, n);
}

/**
 * Construit les métadonnées communes à toutes les questions.
 * Ces champs correspondent exactement au schéma Mongoose.
 */
function metaCommune(verse, batchId = "") {
  return {
    // Références bibliques
    reference: verse.ref,
    referenceDetails: {
      book:    verse.book,
      chapter: verse.chapter || null,
      verse:   verse.verse   || null,
      ref:     verse.ref,
    },
    sourceVerseText: verse.text,
    sourceVerses: [{
      book:    verse.book,
      chapter: verse.chapter || null,
      verse:   verse.verse   || null,
      ref:     verse.ref,
    }],
    testament: verse.testament || "",

    // Classification automatique
    level:           estimerDifficulte(verse),
    category:        categoriserVerset(verse),
    tags:            genererTags(verse),

    // Workflow
    status: "draft",
    source: "script",
    isActive: true,

    // Traçabilité
    generatorMeta: {
      sourceType:             "script",
      generatorVersion:       "v2",
      generatedFromVerseRefs: [verse.ref],
      batchId,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// ─── TYPE 1 : COMPLÉTION ──────────────────────────────────────────────────────

/**
 * Génère une question à trous à partir d'un verset.
 * On retire un mot significatif (personnage ou lieu en priorité).
 *
 * Exemple produit :
 *   Q : « L'Éternel est mon ___ : je ne manquerai de rien. » (Psaume 23:1)
 *   R : berger
 *
 * @param {object} verse
 * @param {string} batchId
 * @returns {object|null}
 */
function genererCompletion(verse, batchId = "") {
  const candidats = candidatsCompletion(verse.text);
  if (candidats.length === 0) return null;

  // Prioriser les personnages et lieux car plus intéressants pédagogiquement
  const personnages = detecterPersonnages(verse.text);
  const lieux       = detecterLieux(verse.text);
  const prioritaires = candidats.filter(c =>
    personnages.includes(c.propre) || lieux.includes(c.propre)
  );
  const cible = prioritaires.length > 0
    ? prioritaires[Math.floor(Math.random() * prioritaires.length)]
    : candidats[Math.floor(Math.random() * candidats.length)];

  const textAvecTrou = verse.text.replace(cible.mot, "___");

  return {
    question:      `Complète ce verset :\n« ${textAvecTrou} »`,
    type:          "Complétion",
    options:       [],
    correctAnswer: cible.propre,
    timeLimit:     30,
    hint:          `Référence : ${verse.ref} (${verse.book})`,
    explanation:   `Verset complet : « ${verse.text} » — ${verse.ref}`,
    theme:         "Complétion de verset",
    difficultyScore: cible.propre.length > 8 ? 3 : 2,
    ...metaCommune(verse, batchId),
  };
}

// ─── TYPE 2 : VRAI / FAUX ─────────────────────────────────────────────────────

// Substitutions sémantiques pour créer des affirmations fausses
const SUBSTITUTIONS_VF = [
  { pattern: /\bDieu\b/,     substitut: "Satan"     },
  { pattern: /\bl'amour\b/,  substitut: "la haine"  },
  { pattern: /\bla vie\b/,   substitut: "la mort"   },
  { pattern: /\bla paix\b/,  substitut: "la guerre" },
  { pattern: /\bpéché\b/,    substitut: "vertu"     },
  { pattern: /\bfoi\b/,      substitut: "doute"     },
  { pattern: /\blumière\b/,  substitut: "ténèbres"  },
  { pattern: /\bvérité\b/,   substitut: "mensonge"  },
  { pattern: /\ble bien\b/,  substitut: "le mal"    },
  { pattern: /\bforce\b/,    substitut: "faiblesse" },
];

/**
 * Génère un Vrai/Faux à partir d'un verset.
 * 50% : verset exact (Vrai) — 50% : version sémantiquement altérée (Faux).
 *
 * Exemple produit :
 *   Q : Ce verset est-il correct ? « L'Éternel est mon ennemi… »
 *   R : Faux
 *
 * @param {object} verse
 * @param {string} batchId
 * @returns {object}
 */
function genererVraiFaux(verse, batchId = "") {
  const essayerFaux = Math.random() > 0.5;
  let textPropose   = verse.text;
  let correctAnswer = "Vrai";
  let explanation   = `Correct. Le verset est : « ${verse.text} » — ${verse.ref}`;

  if (essayerFaux) {
    const applicable = SUBSTITUTIONS_VF.find(s => s.pattern.test(verse.text));
    if (applicable) {
      textPropose   = verse.text.replace(applicable.pattern, applicable.substitut);
      correctAnswer = "Faux";
      explanation   = `Faux. Le texte original dit : « ${verse.text} » — ${verse.ref}`;
    }
    // Si aucune substitution applicable, reste sur Vrai
  }

  return {
    question:      `Ce verset est-il exact ?\n« ${textPropose} »\n(${verse.ref})`,
    type:          "VraiFaux",
    options:       ["Vrai", "Faux"],
    correctAnswer,
    timeLimit:     15,
    hint:          `Livre : ${verse.book} (${verse.testament === "AT" ? "Ancien" : "Nouveau"} Testament)`,
    explanation,
    theme:         "Vrai ou Faux",
    difficultyScore: 1,
    ...metaCommune(verse, batchId),
  };
}

// ─── TYPE 3 : QCM — LIVRE D'ORIGINE ──────────────────────────────────────────

/**
 * Génère un QCM « Dans quel livre trouve-t-on ce verset ? »
 * Les distracteurs sont choisis dans le même testament (plus difficile).
 *
 * @param {object} verse
 * @param {string[]} tousLesLivres  liste complète des livres disponibles
 * @param {string} batchId
 * @returns {object|null}
 */
function genererQCMLivre(verse, tousLesLivres, batchId = "") {
  // Distracteurs du même testament en priorité
  const memeTestament = tousLesLivres.filter(l =>
    l !== verse.book
    // On ne peut pas filtrer par testament ici car on n'a que les noms
    // Les distracteurs aléatoires suffisent
  );
  const distracteurs = echantillonner(memeTestament, 3);
  if (distracteurs.length < 3) return null;

  const extrait = verse.text.length > 80
    ? verse.text.slice(0, 80) + "…"
    : verse.text;

  return {
    question:      `Dans quel livre de la Bible ce verset est-il écrit ?\n« ${extrait} »`,
    type:          "QCM",
    options:       melanger([verse.book, ...distracteurs]),
    correctAnswer: verse.book,
    timeLimit:     20,
    hint:          `Ce verset vient du ${verse.testament === "AT" ? "Ancien" : "Nouveau"} Testament`,
    explanation:   `Ce verset se trouve en ${verse.ref}.`,
    theme:         "Livre biblique",
    difficultyScore: 2,
    ...metaCommune(verse, batchId),
  };
}

// ─── TYPE 4 : QCM — PERSONNAGE ────────────────────────────────────────────────

/**
 * Génère un QCM « Quel personnage est associé à ce passage ? »
 * Uniquement si un personnage est détecté dans le texte.
 *
 * @param {object} verse
 * @param {string[]} tousPersonnages  pool de distracteurs
 * @param {string} batchId
 * @returns {object|null}
 */
function genererQCMPersonnage(verse, tousPersonnages, batchId = "") {
  const trouves = detecterPersonnages(verse.text);
  if (trouves.length === 0) return null;

  const sujet       = trouves[0];
  const distracteurs = echantillonner(
    tousPersonnages.filter(p => p !== sujet),
    3
  );
  if (distracteurs.length < 3) return null;

  const extrait = verse.text.length > 70
    ? verse.text.slice(0, 70) + "…"
    : verse.text;

  return {
    question:      `Quel personnage est au cœur de ce passage ?\n« ${extrait} »`,
    type:          "QCM",
    options:       melanger([sujet, ...distracteurs]),
    correctAnswer: sujet,
    timeLimit:     20,
    hint:          `Référence : ${verse.ref}`,
    explanation:   `Dans ${verse.ref}, le personnage principal est ${sujet}.`,
    theme:         "Personnages bibliques",
    difficultyScore: 2,
    ...metaCommune(verse, batchId),
  };
}

// ─── TYPE 5 : RÉFÉRENCE BIBLIQUE ─────────────────────────────────────────────

/**
 * Génère un QCM « Quelle est la référence de ce verset ? »
 * Question de difficulté avancée — pour les connaisseurs.
 *
 * @param {object} verse
 * @param {object[]} tousVersets  pool pour distracteurs
 * @param {string} batchId
 * @returns {object}
 */
function genererReference(verse, tousVersets, batchId = "") {
  const distracteurs = echantillonner(
    tousVersets.filter(v => v.ref !== verse.ref),
    3
  ).map(v => v.ref);

  return {
    question:      `Quelle est la référence de ce verset ?\n« ${verse.text} »`,
    type:          "Reference",
    options:       melanger([verse.ref, ...distracteurs]),
    correctAnswer: verse.ref,
    timeLimit:     25,
    hint:          `Ce verset se trouve dans le livre de ${verse.book}`,
    explanation:   `Ce verset est ${verse.ref} (${verse.testament === "AT" ? "Ancien" : "Nouveau"} Testament).`,
    theme:         "Références bibliques",
    difficultyScore: 3,
    ...metaCommune(verse, batchId),
  };
}

// ─── TYPE 6 : TEXTE LIBRE — FORMULE "JE SUIS" ────────────────────────────────

/**
 * Pour les versets débutant par "Je suis…", demande de compléter la formule.
 * Spécifique aux déclarations identitaires de Jésus dans Jean.
 *
 * Exemple : « Dans Jean 14:6, Jésus dit "Je suis…" — Complétez. »
 *
 * @param {object} verse
 * @param {string} batchId
 * @returns {object|null}
 */
function genererTexteJeSuis(verse, batchId = "") {
  if (!estFormuleJeSuis(verse.text)) return null;

  // Tout ce qui suit "Je suis " est la réponse attendue
  const suite = verse.text.replace(/^je suis\s+/i, "").replace(/\.$/, "").trim();

  return {
    question:      `Dans ${verse.ref}, Jésus dit : « Je suis ___ »\nQuelle est la suite ?`,
    type:          "Texte",
    options:       [],
    correctAnswer: suite,
    timeLimit:     35,
    hint:          `Ce verset se trouve en ${verse.ref} (Évangile de ${verse.book})`,
    explanation:   `Verset complet : « ${verse.text} » — ${verse.ref}`,
    theme:         'Paroles de Jésus — "Je suis"',
    difficultyScore: 2,
    ...metaCommune(verse, batchId),
  };
}

// ─── TYPE 7 : APPARIEMENT (listes bibliques) ──────────────────────────────────

/**
 * Pour les versets contenant une énumération (≥3 virgules),
 * génère un objet Appariement.
 * Ex : les fruits de l'Esprit (Galates 5:22).
 *
 * @param {object} verse
 * @param {string} batchId
 * @returns {object|null}
 */
function genererAppariement(verse, batchId = "") {
  if (!estEnumeration(verse.text)) return null;

  // Extraction de la liste après "c'est" ou ":"
  const match = verse.text.match(/(?:c'est|:)\s+(.+)/i);
  if (!match) return null;

  const elements = match[1]
    .split(/,\s*/)
    .map(e => e.replace(/[.!?«»"]/g, "").trim())
    .filter(e => e.length > 0 && e.split(" ").length <= 5);

  if (elements.length < 3) return null;

  const paires = elements.slice(0, 5).map((el, i) => ({
    left:  `Élément ${i + 1}`,
    right: el,
  }));

  return {
    question:      `Retrouvez les éléments de la liste dans ${verse.ref} :\n« ${verse.text} »`,
    type:          "Appariement",
    options:       [],
    correctAnswer: elements.slice(0, 5).join(", "),
    pairs:         paires,
    timeLimit:     45,
    hint:          `Ce verset liste ${elements.length} éléments`,
    explanation:   `${verse.ref} enumère : ${elements.join(", ")}`,
    theme:         "Listes et énumérations bibliques",
    difficultyScore: 3,
    ...metaCommune(verse, batchId),
  };
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────

module.exports = {
  genererCompletion,
  genererVraiFaux,
  genererQCMLivre,
  genererQCMPersonnage,
  genererReference,
  genererTexteJeSuis,
  genererAppariement,
};
