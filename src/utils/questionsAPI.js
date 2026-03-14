/**
 * questionsAPI.js
 *
 * Utilitaire unique pour récupérer des questions depuis le backend MongoDB.
 *
 * - Adapte le format MongoDB → format interne des jeux (q / a / opts / type / hint)
 * - Timeout configurable (défaut 3 s) pour ne pas bloquer l'expérience
 * - Lève une erreur si l'API ne répond pas ou renvoie une erreur HTTP
 *   → l'appelant doit gérer le fallback local
 *
 * Format MongoDB (server/models/question.js) :
 *   { question, type, options, correctAnswer, hint, level, testament, ... }
 *
 * Format jeux (gamesData.js / bibleData.js) :
 *   { q, a, opts?, type, hint }
 */

// En production : Express sert React sur le même port → URL relative /api/...
// En développement : react-scripts proxy vers http://localhost:3001 (voir package.json)
const API_BASE = '';

/**
 * Correspondance des types MongoDB → types internes des jeux.
 * MongoDB  → jeu
 * VraiFaux → 'tf'
 * QCM      → 'mc'
 * Texte    → 'text'
 * Autres   → 'text' (fallback sûr)
 */
const TYPE_MAP = {
  VraiFaux:  'tf',
  QCM:       'mc',
  Texte:     'text',
};

/**
 * Convertit une question MongoDB en format utilisable par les jeux React.
 * @param {object} q - Question issue de l'API
 * @returns {{ q: string, a: string, opts?: string[], type: string, hint: string, ref?: string }}
 */
function adaptQuestion(q) {
  // Résolution de la référence biblique : priorité à referenceDetails.ref, puis reference, sinon absent
  const ref = q.referenceDetails?.ref || q.reference || undefined;
  return {
    q:    q.question,
    a:    String(q.correctAnswer ?? ''),
    opts: Array.isArray(q.options) && q.options.length > 0 ? q.options : undefined,
    type: TYPE_MAP[q.type] ?? 'text',
    hint: q.hint ?? '',
    ...(ref ? { ref } : {}),
  };
}

/**
 * Récupère N questions aléatoires approuvées depuis MongoDB.
 *
 * @param {object} opts
 * @param {string}  [opts.type]       Filtre par type MongoDB ('QCM', 'Texte', 'VraiFaux'…)
 * @param {string}  [opts.level]      Filtre par niveau ('Débutant', 'Intermédiaire', 'Avancé')
 * @param {string}  [opts.testament]  Filtre par testament ('AT' ou 'NT')
 * @param {number}  [opts.limit=10]   Nombre de questions demandées (max 50 côté API)
 * @param {number}  [opts.timeoutMs=3000] Timeout en ms avant abandon
 *
 * @returns {Promise<Array>} Tableau de questions au format jeu
 * @throws  {Error} Si l'API est injoignable, timeout, ou renvoie une erreur HTTP
 */
export async function fetchRandomQuestions({
  type,
  level,
  testament,
  limit     = 10,
  timeoutMs = 3000,
} = {}) {
  const params = new URLSearchParams({ n: limit });
  if (type)      params.set('type',      type);
  if (level)     params.set('level',     level);
  if (testament) params.set('testament', testament);

  const url = `${API_BASE}/api/questions/random?${params}`;

  // Course entre la requête et un timeout manuel (compatible tous navigateurs)
  const fetchPromise   = fetch(url);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout après ${timeoutMs} ms`)), timeoutMs)
  );

  const res = await Promise.race([fetchPromise, timeoutPromise]);

  if (!res.ok) {
    throw new Error(`API questions/random → HTTP ${res.status}`);
  }

  const data = await res.json();
  return (data.data ?? []).map(adaptQuestion);
}

/**
 * Version "sans échec" : retourne un tableau vide en cas d'erreur.
 * Pratique pour un usage silencieux avec fallback.
 *
 * @param {object} opts - Mêmes options que fetchRandomQuestions
 * @returns {Promise<Array>} Questions adaptées, ou [] si erreur
 */
export async function fetchRandomQuestionsSafe(opts = {}) {
  try {
    return await fetchRandomQuestions(opts);
  } catch (err) {
    console.warn('[questionsAPI] fallback local activé :', err.message);
    return [];
  }
}
