import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

const STATS_KEY   = 'bibleapp_stats';
const PROFILE_KEY = 'bibleapp_profile';
const ESCAPE_KEY  = 'bibleapp_escape_badges';
const BEST_KEY    = 'bibleapp_best_scores';

const AVATARS = ['🦁','✝️','📖','🌿','🏛️','⚡','👑','🌟','🕊️','🔥','🌈','⭐'];

const DEFAULT_STATS   = { xp: 0, totalQuizzes: 0, totalCorrect: 0, gamesPlayed: {} };
const DEFAULT_PROFILE = { name: '', avatar: '📖', setupDone: false };

export { AVATARS };

// ── Courbe XP triangulaire ────────────────────────────────────────────────────
// Niveau n nécessite n*(n-1)/2*100 XP au total.
// Niv.1:0  Niv.2:100  Niv.3:300  Niv.4:600  Niv.5:1000  Niv.10:4500
export const xpForLevel = (n) => n <= 1 ? 0 : (n - 1) * n / 2 * 100;

const computeLevel = (xp) => {
  let n = 1;
  while (xpForLevel(n + 1) <= xp) n++;
  return n;
};

// ── Coûts des indices par jeu ─────────────────────────────────────────────────
export const HINT_COSTS = {
  speedrun: 5,
  bingo:    5,
  escape:   10,
  memory:   0,    // Memory n'a pas d'indices
  battle: { easy: 3, medium: 8, hard: 15 },
  secretkey: 0,
};

export function GameProvider({ children }) {
  const [stats, setStats] = useState(() => {
    try { const s = localStorage.getItem(STATS_KEY); return s ? { ...DEFAULT_STATS, ...JSON.parse(s) } : DEFAULT_STATS; }
    catch { return DEFAULT_STATS; }
  });
  const [profile, setProfile] = useState(() => {
    try { const p = localStorage.getItem(PROFILE_KEY); return p ? { ...DEFAULT_PROFILE, ...JSON.parse(p) } : DEFAULT_PROFILE; }
    catch { return DEFAULT_PROFILE; }
  });
  const [escapeBadges, setEscapeBadges] = useState(() => {
    try { const e = localStorage.getItem(ESCAPE_KEY); return e ? JSON.parse(e) : []; }
    catch { return []; }
  });
  const [bestScores, setBestScores] = useState(() => {
    try { const b = localStorage.getItem(BEST_KEY); return b ? JSON.parse(b) : {}; }
    catch { return {}; }
  });

  useEffect(() => { localStorage.setItem(STATS_KEY,   JSON.stringify(stats));        }, [stats]);
  useEffect(() => { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));      }, [profile]);
  useEffect(() => { localStorage.setItem(ESCAPE_KEY,  JSON.stringify(escapeBadges)); }, [escapeBadges]);
  useEffect(() => { localStorage.setItem(BEST_KEY,    JSON.stringify(bestScores));   }, [bestScores]);

  const recordQuizResult = ({ correct = 0, total = 0, gameId = '' }) => {
    const xpEarned = correct * 10 + (correct === total && total > 0 ? 20 : 0);
    setStats(prev => ({
      ...prev,
      xp: prev.xp + xpEarned,
      totalQuizzes: prev.totalQuizzes + 1,
      totalCorrect: prev.totalCorrect + correct,
      gamesPlayed: { ...prev.gamesPlayed, [gameId]: (prev.gamesPlayed[gameId] || 0) + 1 },
    }));
    return xpEarned;
  };

  const spendXP = (amount) => {
    setStats(prev => ({ ...prev, xp: Math.max(0, prev.xp - amount) }));
  };

  const saveProfile = (name, avatar) => {
    setProfile({ name: name.trim() || 'Anonyme', avatar, setupDone: true });
  };

  // Enregistre un badge Escape (dédoublonnage par id)
  const addEscapeBadge = (badge) => {
    setEscapeBadges(prev =>
      prev.find(b => b.id === badge.id) ? prev : [...prev, badge]
    );
  };

  // Met à jour le meilleur score d'un jeu
  const updateBestScore = (gameId, score) => {
    setBestScores(prev => ({
      ...prev,
      [gameId]: Math.max(prev[gameId] || 0, score),
    }));
  };

  // ── Calculs niveau / XP ───────────────────────────────────────────────────
  const level       = computeLevel(stats.xp);
  const currentXP   = xpForLevel(level);
  const nextXP      = xpForLevel(level + 1);
  const xpCurrent   = stats.xp - currentXP;
  const xpNeeded    = nextXP - currentXP;         // = level * 100
  const xpProgress  = Math.min(100, Math.floor(xpCurrent / xpNeeded * 100));

  return (
    <GameContext.Provider value={{
      stats, level, xpProgress, xpCurrent, xpNeeded,
      profile, saveProfile,
      recordQuizResult, spendXP,
      escapeBadges, addEscapeBadge,
      bestScores, updateBestScore,
      AVATARS,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() { return useContext(GameContext); }
