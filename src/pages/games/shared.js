import React, { useEffect } from 'react';

export const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
export const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Floating XP toast shown after a game ends
export const XPPop = ({ xp, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
      background: 'var(--ink-mid, #1a1209)', border: '2px solid var(--gold, #c9a84c)',
      borderRadius: 12, padding: '1rem 2rem', zIndex: 999, textAlign: 'center',
      animation: 'pop .35s ease both',
    }}>
      <div style={{ fontSize: '2rem' }}>⭐</div>
      <div style={{ fontFamily: 'var(--font-display, Georgia)', fontSize: '1.4rem', color: 'var(--gold-light, #e8c97a)' }}>
        +{xp} XP
      </div>
    </div>
  );
};
