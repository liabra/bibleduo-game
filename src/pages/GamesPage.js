import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import BottomNav from '../components/BottomNav';
import { GAMES_META } from '../data/gamesData';
import SpeedrunGame  from './games/SpeedrunGame';
import BattleGame    from './games/BattleGame';
import MemoryGame    from './games/MemoryGame';
import BingoGame     from './games/BingoGame';
import EscapeGame    from './games/EscapeGame';
import SecretKeyGame from './games/SecretKeyGame';
import { XPPop }     from './games/shared';

const GAME_COMPONENTS = {
  speedrun:  SpeedrunGame,
  battle:    BattleGame,
  memory:    MemoryGame,
  bingo:     BingoGame,
  escape:    EscapeGame,
  secretkey: SecretKeyGame,
};

const GamesPage = () => {
  const { recordQuizResult, stats, level, xpProgress } = useGame();
  const [activeGame, setActiveGame] = useState(null);
  const [xpPop, setXpPop] = useState(null);

  const handleXP = useCallback((xp) => {
    const correct = Math.max(1, Math.ceil(xp / 10));
    recordQuizResult({ correct, total: correct });
    setXpPop(xp);
  }, [recordQuizResult]);

  if (activeGame) {
    const GameComponent = GAME_COMPONENTS[activeGame];
    return (
      <>
        <GameComponent onBack={() => setActiveGame(null)} onXP={handleXP} />
        {xpPop && <XPPop xp={xpPop} onDone={() => setXpPop(null)} />}
      </>
    );
  }

  return (
    <div className="page-content">
      {xpPop && <XPPop xp={xpPop} onDone={() => setXpPop(null)} />}

      {/* Header with XP */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
          <div>
            <h2 style={{ fontSize: '1.55rem', marginBottom: '.1rem' }}>⚡ Bible Games</h2>
            <p className="text-tiny">{stats.xp} XP total · {stats.totalQuizzes} parties</p>
          </div>
          <div style={{
            background: 'rgba(201,168,76,.12)',
            border: '1px solid rgba(201,168,76,.3)',
            borderRadius: 12, padding: '.5rem .9rem', textAlign: 'center', minWidth: 52,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--gold-light)', lineHeight: 1 }}>{level}</div>
            <div className="text-tiny" style={{ marginTop: '.15rem' }}>niv.</div>
          </div>
        </div>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
        </div>
        <div className="text-tiny" style={{ textAlign: 'right', marginTop: '.2rem' }}>
          {xpProgress}/100 → Niv.{level + 1}
        </div>
      </div>

      {/* Game grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.7rem', marginBottom: '1.25rem' }}>
        {GAMES_META.map(game => (
          <div
            key={game.id}
            className="game-card"
            onClick={() => setActiveGame(game.id)}
            style={{ '--c': game.color }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${game.color}55`}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,.15)'}
          >
            {/* Top color stripe */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${game.color}, ${game.color}55)`,
              borderRadius: '14px 14px 0 0',
            }} />
            <div style={{ fontSize: '2rem', marginBottom: '.4rem', marginTop: '.2rem' }}>{game.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.88rem', color: 'var(--parch)', marginBottom: '.2rem' }}>
              {game.label}
            </div>
            <div className="text-tiny" style={{ marginBottom: '.6rem', lineHeight: 1.45 }}>
              {game.desc}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                background: `${game.color}22`, border: `1px solid ${game.color}44`,
                borderRadius: 99, padding: '.15rem .5rem',
                fontSize: '.6rem', color: game.color, fontWeight: 700,
              }}>{game.tag}</span>
              <span className="text-tiny">{game.xpMax} XP</span>
            </div>
          </div>
        ))}
      </div>

      {/* Seasonal banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139,26,26,.22), rgba(201,168,76,.08))',
        border: '1px solid rgba(201,168,76,.2)', borderRadius: 14, padding: '1rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -4, right: 8, fontSize: '3.5rem', opacity: .07, lineHeight: 1 }}>⚔️</div>
        <div className="text-tiny" style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', letterSpacing: '.1em', marginBottom: '.35rem' }}>
          🎺 ÉVÉNEMENT SAISONNIER
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--parch)', marginBottom: '.25rem' }}>
          Défi Goliath — Boss Fight
        </div>
        <div className="text-small" style={{ marginBottom: '.75rem' }}>
          60s · 20 réponses parfaites · Vaincs Goliath !
        </div>
        <button className="btn btn-primary" style={{ fontSize: '.85rem', padding: '.5rem 1.2rem' }} onClick={() => setActiveGame('speedrun')}>
          Relever le défi →
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default GamesPage;
