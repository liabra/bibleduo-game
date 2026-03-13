import React, { useEffect } from 'react';

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