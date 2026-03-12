import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

const STORAGE_KEY = 'bibleapp_stats';

const DEFAULT = { xp: 0, totalQuizzes: 0, totalCorrect: 0 };

export function GameProvider({ children }) {
  const [stats, setStats] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? { ...DEFAULT, ...JSON.parse(s) } : DEFAULT;
    } catch { return DEFAULT; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  // Called by every game when it ends
  const recordQuizResult = ({ correct = 0, total = 0 }) => {
    const xpEarned = correct * 10 + (correct === total && total > 0 ? 20 : 0);
    setStats(prev => ({
      ...prev,
      xp: prev.xp + xpEarned,
      totalQuizzes: prev.totalQuizzes + 1,
      totalCorrect: prev.totalCorrect + correct,
    }));
    return xpEarned;
  };

  const level = Math.floor(stats.xp / 100) + 1;
  const xpProgress = stats.xp % 100;

  return (
    <GameContext.Provider value={{ stats, level, xpProgress, recordQuizResult }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
