import React from 'react';
import BottomNav from '../components/BottomNav';
import { GAME_RULES } from './games/shared';

const ORDER = ['speedrun','battle','memory','bingo','escape','secretkey'];

const RulesPage = () => (
  <div className="page-content">
    <h2 style={{ fontSize: '1.4rem', marginBottom: '.25rem' }}>📋 Notice</h2>
    <p className="text-tiny" style={{ marginBottom: '1.5rem' }}>Comment jouer à chaque Bible Game</p>

    {ORDER.map(gameId => {
      const r = GAME_RULES[gameId];
      return (
        <div key={gameId} className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.6rem' }}>
            <div style={{ fontSize: '1.6rem', lineHeight: 1 }}>{r.icon}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--parch)', fontWeight: 700, fontSize: '.95rem' }}>{r.title}</div>
              <div style={{ fontSize: '.8rem', color: 'var(--gray-400)', marginTop: '.1rem' }}>{r.goal}</div>
            </div>
          </div>
          <div style={{ marginBottom: '.6rem' }}>
            {r.rules.map((rule, i) => (
              <div key={i} style={{ display: 'flex', gap: '.5rem', padding: '.25rem 0', fontSize: '.83rem', color: 'var(--gray-300)' }}>
                <span style={{ color: 'var(--gold-dark)', flexShrink: 0 }}>▸</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(201,168,76,.12)', paddingTop: '.5rem', fontSize: '.75rem', color: 'var(--gold-dark)', fontFamily: 'var(--font-display)' }}>
            ⭐ {r.xp}
          </div>
        </div>
      );
    })}

    <BottomNav />
  </div>
);

export default RulesPage;
