import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Mélange Fisher-Yates — distribution uniforme garantie.
 * Array.sort(() => Math.random() - 0.5) est biaisé ; cette version ne l'est pas.
 */
export const shuffle = (arr = []) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Mélange les options (opts) d'une question et retourne la question.
 * NE PAS aliaser à shuffle() : shuffle() opère sur des tableaux,
 * shuffleOpts() opère sur des objets-question.
 *
 * Usage : questions.map(shuffleOpts)
 */
export const shuffleOpts = (q) => ({
  ...q,
  opts: Array.isArray(q.opts) ? shuffle(q.opts) : q.opts,
});

/**
 * Retourne un élément aléatoire d'un tableau.
 */
export const rand = (arr = []) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Hook anti-répétition pour les banques de questions.
 * Garantit que toutes les questions sont vues avant de recirculer.
 * Usage : const { pick } = useQuestionPool(SPEEDRUN_QS);
 *         const q = pick();    // 1 question
 *         const qs = pick(10); // 10 questions
 */
export const useQuestionPool = (questions) => {
  const unusedRef = useRef([]);

  const pick = useCallback((n = 1) => {
    // Recharge quand le panier est vide (cycle complet)
    if (unusedRef.current.length < n) {
      // Mélange TOUTES les questions et repart à zéro
      const full = shuffle([...questions]);
      unusedRef.current = [...unusedRef.current, ...full];
    }
    const taken = unusedRef.current.splice(0, n);
    return n === 1 ? taken[0] : taken;
  }, [questions]);

  const reset = useCallback(() => { unusedRef.current = []; }, []);

  return { pick, reset };
};

/**
 * Petit toast XP
 */
export const XPPop = ({ xp, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="toast">
      <div style={{ fontSize: '2rem', marginBottom: '.2rem' }}>⭐</div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.6rem',
          color: 'var(--gold-light)',
          fontWeight: 700
        }}
      >
        +{xp} XP
      </div>
    </div>
  );
};

/**
 * Overlay pause
 */
export const PauseOverlay = ({ onResume, onQuit }) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.65)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}
  >
    <div
      className="card"
      style={{
        width: '100%',
        maxWidth: 360,
        textAlign: 'center',
        borderRadius: 16
      }}
    >
      <div style={{ fontSize: '2.2rem', marginBottom: '.4rem' }}>⏸</div>
      <h3 style={{ marginBottom: '.5rem' }}>Partie en pause</h3>
      <p className="text-small" style={{ marginBottom: '1rem' }}>
        Tu peux reprendre quand tu veux.
      </p>

      <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={onResume}>
          ▶ Reprendre
        </button>
        <button className="btn btn-secondary" onClick={onQuit}>
          ← Quitter
        </button>
      </div>
    </div>
  </div>
);

/**
 * Référence biblique — affichage discret après révélation de réponse.
 * Usage : {q.ref && <BibleRef ref={q.ref} />}
 */
export const BibleRef = ({ ref: refText }) => refText ? (
  <div style={{
    fontSize: '.65rem', color: 'var(--gold-dark)',
    fontFamily: 'var(--font-display)', opacity: .75,
    marginTop: '.3rem', letterSpacing: '.04em',
  }}>
    📖 {refText}
  </div>
) : null;

/**
 * Affichage d'indice
 */
export const HintBubble = ({ hint }) => (
  <div
    style={{
      background: 'rgba(255, 244, 214, 0.95)',
      color: 'var(--ink)',
      border: '1px solid rgba(201,168,76,.35)',
      borderRadius: 12,
      padding: '.75rem',
      marginBottom: '.75rem',
      fontSize: '.85rem',
      lineHeight: 1.5,
      boxShadow: '0 8px 24px rgba(0,0,0,.12)'
    }}
  >
    <div
      style={{
        fontFamily: 'var(--font-display)',
        color: 'var(--gold-dark)',
        marginBottom: '.25rem',
        fontSize: '.85rem'
      }}
    >
      💡 Indice
    </div>
    <div>{hint}</div>
  </div>
);

/**
 * Bouton de partage / copie
 */
export const ShareBtn = ({ onClick, copied = false }) => (
  <button className="btn btn-secondary" onClick={onClick}>
    {copied ? '✅ Copié' : '📤 Partager'}
  </button>
);

/**
 * Bouton pour ouvrir la carte score
 */
export const ScoreImageBtn = ({ onClick }) => (
  <button className="btn btn-secondary" onClick={onClick}>
    🖼 Carte score
  </button>
);

/**
 * Données des règles par jeu — utilisées par RulesBtn et RulesPage.
 */
export const GAME_RULES = {
  speedrun: {
    icon: '⚡', title: 'Speed Verse',
    goal: 'Réponds à un maximum de questions bibliques en 60 secondes.',
    rules: [
      'Chaque bonne réponse rapporte des points et augmente ton combo',
      'Le combo multiplie les points : plus tu enchaînes, plus tu gagnes',
      'Une erreur remet le combo à zéro',
      'Tu peux utiliser des indices mais ça coûte 5 XP',
    ],
    xp: "Jusqu'à 200 XP selon ton score final",
  },
  battle: {
    icon: '⚔️', title: 'Bible Battle',
    goal: "Réponds plus vite et mieux que l'IA pour remporter la bataille.",
    rules: [
      "Toi et l'IA répondez aux mêmes questions simultanément",
      "Bonne réponse avant l'IA = tu marques un point",
      "Choisis la difficulté : l'IA Experte est très rapide et précise",
      'Les indices coûtent entre 3 et 15 XP selon la difficulté',
    ],
    xp: 'Entre 40 et 100 XP selon la difficulté et le résultat',
  },
  memory: {
    icon: '🃏', title: 'Bible Memory',
    goal: 'Retrouve toutes les paires de cartes liées entre elles.',
    rules: [
      '16 cartes sont disposées face cachée (8 paires à trouver)',
      'Retourne 2 cartes à la fois pour trouver leur correspondance',
      "Ex. : « Moïse ✋ » correspond à « Mer Rouge séparée »",
      "Moins tu fais de coups, plus tu gagnes d'XP",
    ],
    xp: '40 à 120 XP — 120 XP si tu termines en 8 coups ou moins',
  },
  bingo: {
    icon: '🎯', title: 'Bible Bingo',
    goal: 'Valide des cases sur la grille 5×5 pour aligner des BINGO.',
    rules: [
      'Clique sur une case pour voir sa question biblique',
      'Réponds correctement pour valider la case ✅',
      'Chaque ligne complète (horizontale, verticale, diagonale) = BINGO',
      'Mauvaise réponse → la question change, mais la case reste à valider',
    ],
    xp: '15 XP par case validée + 50 XP bonus par ligne BINGO',
  },
  escape: {
    icon: '🔐', title: 'Bible Escape',
    goal: 'Résous toutes les énigmes du niveau pour trouver le code secret.',
    rules: [
      'Chaque niveau contient plusieurs énigmes bibliques à résoudre dans l\'ordre',
      'Résous toutes les énigmes pour débloquer le code secret du niveau',
      'Entre le bon code pour valider le niveau et gagner ton badge',
      'Les indices coûtent 10 XP — les niveaux verrouillés peuvent être passés avec des XP',
    ],
    xp: 'Entre 60 et 200 XP par niveau selon sa difficulté',
  },
  secretkey: {
    icon: '🗝️', title: 'Clé Secrète',
    goal: 'Complète le verset du jour pour collecter des clés et ouvrir le coffre.',
    rules: [
      'Un verset biblique avec un mot manquant est proposé chaque jour',
      'Trouve le mot exact manquant et valide pour obtenir une clé 🗝️',
      'Collecte 5 clés pour ouvrir le coffre mystérieux et gagner un bonus',
      'Une seule clé possible par jour — reviens chaque jour pour progresser !',
    ],
    xp: '30 XP par clé + 200 XP bonus à l\'ouverture du coffre',
  },
};

/**
 * Bouton "?" inline dans les headers de jeu.
 * Affiche les règles du jeu dans une modale légère au clic.
 * Usage : <RulesBtn gameId="speedrun" />
 */
export const RulesBtn = ({ gameId }) => {
  const [open, setOpen] = useState(false);
  const rules = GAME_RULES[gameId];
  if (!rules) return null;
  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        title="Comment jouer ?"
        style={{
          background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)',
          borderRadius: '50%', width: 28, height: 28, flexShrink: 0,
          color: 'var(--gray-400)', cursor: 'pointer', fontSize: '.82rem',
          fontFamily: 'var(--font-display)', fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ?
      </button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.72)', backdropFilter: 'blur(8px)',
            zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 380,
              background: 'rgba(20,15,8,.98)', border: '1.5px solid rgba(201,168,76,.35)',
              borderRadius: 16, padding: '1.25rem',
              animation: 'fadeUp .2s ease both',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.75rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)', fontWeight: 700, fontSize: '1rem' }}>
                  {rules.icon} {rules.title}
                </div>
                <div style={{ color: 'var(--parch)', fontSize: '.83rem', marginTop: '.25rem', lineHeight: 1.5 }}>
                  {rules.goal}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', fontSize: '1.1rem', padding: 0, marginLeft: '.75rem', flexShrink: 0 }}
              >✕</button>
            </div>

            <div style={{ marginBottom: '.75rem' }}>
              {rules.rules.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '.5rem', padding: '.28rem 0', fontSize: '.82rem', color: 'var(--gray-300)' }}>
                  <span style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: '.05rem' }}>▸</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '1px solid rgba(201,168,76,.15)', paddingTop: '.6rem',
              fontSize: '.75rem', color: 'var(--gold-dark)', fontFamily: 'var(--font-display)',
            }}>
              ⭐ {rules.xp}
            </div>
          </div>
        </div>
      )}
    </>
  );
};