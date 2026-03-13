"use strict";
// utils/heuristics.js
// Fonctions d'analyse de texte biblique — aucune dépendance externe.
// Toutes les fonctions sont pures et testables unitairement.

// ─── DICTIONNAIRES ────────────────────────────────────────────────────────────

const PERSONNAGES = [
  "Dieu","Jésus","Christ","Seigneur","Éternel","Esprit",
  "Moïse","Abraham","Isaac","Jacob","Joseph","David","Salomon",
  "Noé","Adam","Ève","Paul","Pierre","Jean","Jacques","Marie",
  "Élie","Élisée","Jonas","Daniel","Ésaïe","Jérémie","Ézéchiel",
  "Abram","Saül","Josué","Ruth","Esther","Job","Samuel","Aaron",
  "Gabriel","Michel","Satan","Judas","Thomas","André","Philippe",
  "Lazare","Zacharie","Élisabeth","Siméon","Étienne","Barnabas",
  "Nicodème","Zachée","Luc","Marc","Matthieu","Timothée","Tite",
  "Cyrille","Corneille","Lydie","Priscille","Aquilas",
];

const LIEUX = [
  "Jérusalem","Bethléem","Nazareth","Galilée","Jourdain","Égypte",
  "Israël","Judée","Samarie","Capharnaüm","Béthanie","Gethsémané",
  "Sinaï","Canaan","Babylone","Ninive","Tarse","Corinthe","Éphèse",
  "Rome","Athènes","Antioche","Damas","Philippes","Thessalonique",
  "Patmos","Jéricho","Hébron","Carmel","Éden","Golgotha","Sion",
];

// Mots grammaticaux à ignorer dans la détection de candidats
const MOTS_VIDES = new Set([
  "dans","pour","avec","mais","tout","tous","toute","toutes","cette",
  "comme","nous","vous","leur","leurs","dont","plus","même","aussi",
  "bien","sous","vers","sans","entre","depuis","alors","encore","selon",
  "quand","celui","celle","ceux","celles","chaque","autre","autres",
  "notre","votre","leurs","aucun","aucune","jamais","toujours","souvent",
]);

// ─── DÉTECTION ────────────────────────────────────────────────────────────────

/**
 * Personnages détectés dans le texte.
 * @param {string} text
 * @returns {string[]}
 */
function detecterPersonnages(text) {
  return PERSONNAGES.filter(p =>
    new RegExp(`\\b${p}\\b`, "i").test(text)
  );
}

/**
 * Lieux détectés dans le texte.
 * @param {string} text
 * @returns {string[]}
 */
function detecterLieux(text) {
  return LIEUX.filter(l =>
    new RegExp(`\\b${l}\\b`, "i").test(text)
  );
}

/**
 * Nombres en chiffres arabes dans le texte.
 * @param {string} text
 * @returns {string[]}
 */
function detecterNombres(text) {
  const matches = text.match(/\b\d+\b/g) || [];
  return [...new Set(matches)];
}

/**
 * Détecte si le texte commence par "Je suis" (formules identitaires de Jésus).
 * Propice aux questions Texte libre et Complétion.
 * @param {string} text
 * @returns {boolean}
 */
function estFormuleJeSuis(text) {
  return /^je suis\b/i.test(text.trim());
}

/**
 * Détecte si le texte est une liste (≥2 virgules).
 * Propice aux questions Appariement et Complétion multiple.
 * @param {string} text
 * @returns {boolean}
 */
function estEnumeration(text) {
  return (text.match(/,/g) || []).length >= 2;
}

/**
 * Détecte une injonction directe au début du texte.
 * Propice aux questions Complétion et Texte libre.
 * @param {string} text
 * @returns {boolean}
 */
function estInjonction(text) {
  return /^(allez|va|fais|cherchez|aimez|confie|garde|repentez|venez|prêchez|aime|marche|cours)\b/i
    .test(text.trim());
}

/**
 * Retourne les mots candidats à l'effacement pour une question Complétion.
 * Filtre les mots trop courts, grammaticaux ou en début de phrase.
 * @param {string} text
 * @returns {{ mot: string, propre: string, index: number }[]}
 */
function candidatsCompletion(text) {
  const mots = text.split(" ");
  return mots
    .map((mot, index) => ({
      mot,
      propre: mot.replace(/[,;:.!?«»"'()\-]/g, ""),
      index,
    }))
    .filter(({ propre, index }) =>
      index > 2 &&                              // pas les 3 premiers mots
      propre.length > 4 &&                      // mot suffisamment long
      !MOTS_VIDES.has(propre.toLowerCase()) &&  // pas un mot grammatical
      !/^\d+$/.test(propre)                     // pas un nombre seul
    );
}

// ─── CLASSIFICATION ───────────────────────────────────────────────────────────

/**
 * Estime la difficulté d'un verset pour la génération de questions.
 * @param {object} verse - { text, ref, book }
 * @returns {"Débutant"|"Intermédiaire"|"Avancé"}
 */
function estimerDifficulte(verse) {
  const mots       = verse.text.split(" ").length;
  const connuDeTous = [
    "Jean 3:16","Psaume 23:1","Matthieu 6:9","Jean 14:6",
    "Romains 8:28","Philippiens 4:13","Luc 1:37","Jean 1:1",
  ].includes(verse.ref);

  if (connuDeTous || mots <= 10) return "Débutant";
  if (mots <= 22) return "Intermédiaire";
  return "Avancé";
}

/**
 * Catégorise un verset selon les thèmes détectés dans son texte.
 * @param {object} verse
 * @returns {string}
 */
function categoriserVerset(verse) {
  const t = verse.text.toLowerCase();
  if (/\bamour\b|\baimer\b|\baimez\b/.test(t))          return "Amour";
  if (/\bfoi\b|\bcroire\b|\bconfian/.test(t))            return "Foi";
  if (/\bprière\b|\bprier\b|\bnotre père\b/.test(t))    return "Prière";
  if (/\bsalut\b|\bsauvé\b|\bsauveur\b/.test(t))        return "Salut";
  if (/\besprit\b|\bsaint-esprit\b/.test(t))             return "Saint-Esprit";
  if (/\broyaume\b/.test(t))                             return "Royaume de Dieu";
  if (/\bpéché\b|\bpécheur\b|\bfaute\b/.test(t))        return "Péché";
  if (/\bpaix\b|\brepos\b|\bconsolation\b/.test(t))      return "Paix";
  if (/\bforce\b|\bpuissan/.test(t))                     return "Puissance";
  if (/\bcréation\b|\bcréa\b|\bcommencement\b/.test(t)) return "Création";
  if (/\bgloire\b|\bhonneur\b/.test(t))                  return "Gloire";
  if (/\bprophét|\bprophète\b/.test(t))                  return "Prophétie";
  if (/\bressuscité\b|\brésurrection\b/.test(t))         return "Résurrection";
  return "Général";
}

/**
 * Génère les tags automatiques pour un verset.
 * @param {object} verse
 * @returns {string[]}
 */
function genererTags(verse) {
  const tags = new Set();
  tags.add(verse.testament === "AT" ? "ancien-testament" : "nouveau-testament");
  tags.add(verse.book.toLowerCase().replace(/\s+/g, "-").replace(/['']/g, ""));

  detecterPersonnages(verse.text).forEach(p =>
    tags.add(`personnage:${p.toLowerCase()}`)
  );
  detecterLieux(verse.text).forEach(l =>
    tags.add(`lieu:${l.toLowerCase()}`)
  );
  if (estFormuleJeSuis(verse.text)) tags.add("formule:je-suis");
  if (estEnumeration(verse.text))   tags.add("structure:enumeration");
  if (estInjonction(verse.text))    tags.add("structure:injonction");

  return [...tags];
}

module.exports = {
  detecterPersonnages,
  detecterLieux,
  detecterNombres,
  estFormuleJeSuis,
  estEnumeration,
  estInjonction,
  candidatsCompletion,
  estimerDifficulte,
  categoriserVerset,
  genererTags,
};
