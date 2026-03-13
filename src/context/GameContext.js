import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

const STATS_KEY   = 'bibleapp_stats';
const PROFILE_KEY = 'bibleapp_profile';

const AVATARS = ['🦁','✝️','📖','🌿','🏛️','⚡','👑','🌟','🕊️','🔥','🌈','⭐'];

const DEFAULT_STATS = { xp: 0, totalQuizzes: 0, totalCorrect: 0, gamesPlayed: {} };
const DEFAULT_PROFILE = { name: '', avatar: '📖', setupDone: false };

export { AVATARS };

export function GameProvider({ children }) {
  const [stats, setStats] = useState(() => {
    try { const s = localStorage.getItem(STATS_KEY); return s ? { ...DEFAULT_STATS, ...JSON.parse(s) } : DEFAULT_STATS; }
    catch { return DEFAULT_STATS; }
  });
  const [profile, setProfile] = useState(() => {
    try { const p = localStorage.getItem(PROFILE_KEY); return p ? { ...DEFAULT_PROFILE, ...JSON.parse(p) } : DEFAULT_PROFILE; }
    catch { return DEFAULT_PROFILE; }
  });

  useEffect(() => { localStorage.setItem(STATS_KEY,   JSON.stringify(stats));   }, [stats]);
  useEffect(() => { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }, [profile]);

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

  const saveProfile = (name, avatar) => {
    setProfile({ name: name.trim() || 'Anonyme', avatar, setupDone: true });
  };

  const level       = Math.floor(stats.xp / 100) + 1;
  const xpProgress  = stats.xp % 100;

  return (
    <GameContext.Provider value={{ stats, level, xpProgress, profile, saveProfile, recordQuizResult, AVATARS }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() { return useContext(GameContext); }
