import React, { useEffect } from 'react';

export const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
export const rand    = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const XPPop = ({ xp, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="toast">
      <div style={{ fontSize: '2rem', marginBottom: '.2rem' }}>⭐</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold-light)', fontWeight: 700 }}>
        +{xp} XP
      </div>
    </div>
  );
};
