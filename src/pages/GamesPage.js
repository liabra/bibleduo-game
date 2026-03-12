import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import BottomNav from '../components/BottomNav';
import { GAMES_META } from '../data/gamesData';

// One import per game — each lives in its own file
import SpeedrunGame  from './games/SpeedrunGame';
import BattleGame    from './games/BattleGame';
import MemoryGame    from './games/MemoryGame';
import BingoGame     from './games/BingoGame';
import EscapeGame    from './games/EscapeGame';
import SecretKeyGame from './games/SecretKeyGame';
import { XPPop }     from './games/shared';

// Map of game id → component
const GAME_COMPONENTS = {
  speedrun:  SpeedrunGame,
  battle:    BattleGame,
  memory:    MemoryGame,
  bingo:     BingoGame,
  escape:    EscapeGame,
  secretkey: SecretKeyGame,
};

const GamesPage = () => {
  const { recordQuizResult } = useGame();
  const [activeGame, setActiveGame] = useState(null); // game id string or null
  const [xpPop, setXpPop] = useState(null);

  const handleXP = useCallback((xp) => {
    // Feed XP into the main gamification engine
    recordQuizResult({ correct: Math.ceil(xp / 10), total: Math.ceil(xp / 10), isDuo: false });
    setXpPop(xp);
  }, [recordQuizResult]);

  // Render the active game if one is selected
  if (activeGame) {
    const GameComponent = GAME_COMPONENTS[activeGame];
    return (
      <>
        <GameComponent onBack={() => setActiveGame(null)} onXP={handleXP} />
        {xpPop && <XPPop xp={xpPop} onDone={() => setXpPop(null)} />}
      </>
    );
  }

  // ─── HUB ─────────────────────────────────────────────────────────────────
  return (
    <div className="page-content" style={{ maxWidth: 480, margin: '0 auto', padding: '1.5rem 1rem' }}>
      {xpPop && <XPPop xp={xpPop} onDone={() => setXpPop(null)} />}

      <h2 style={{ marginBottom: '.25rem' }}>🎮 Modes de Jeu</h2>
      <p className="text-small mb-2">Choisissez votre aventure biblique</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
        {GAMES_META.map(game => (
          <div
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className="card"
            style={{
              cursor: 'pointer', padding: '1.1rem',
              borderColor: `${game.color}33`,
              transition: 'all .2s', position: 'relative',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${game.color}66`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${game.color}33`; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '.4rem' }}>{game.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '.95rem', fontFamily: 'var(--font-display)', color: 'var(--parch)' }}>
              {game.label}
            </div>
            <div className="text-small" style={{ margin: '.2rem 0 .5rem' }}>{game.desc}</div>
            <span style={{
              background: `${game.color}22`, border: `1px solid ${game.color}44`,
              borderRadius: 99, padding: '.18rem .55rem', fontSize: '.65rem', color: game.color, fontWeight: 700,
            }}>
              {game.tag}
            </span>
            <div style={{ position: 'absolute', bottom: '.4rem', right: '.6rem', fontSize: '.6rem', color: 'var(--gray-400)' }}>
              max {game.xpMax} XP
            </div>
          </div>
        ))}
      </div>

      {/* Seasonal event banner */}
      <div style={{
        marginTop: '1.5rem',
        background: 'linear-gradient(135deg, rgba(139,26,26,.3), rgba(201,168,76,.15))',
        border: '1px solid rgba(201,168,76,.25)', borderRadius: 14, padding: '1rem',
      }}>
        <div style={{ fontSize: '.65rem', color: 'var(--gold)', fontFamily: 'var(--font-display)', letterSpacing: '.1em', marginBottom: '.4rem' }}>
          🎺 ÉVÉNEMENT SAISONNIER
        </div>
        <div style={{ fontWeight: 700, color: 'var(--parch)', marginBottom: '.3rem' }}>⚔️ Défi Goliath — Boss Fight</div>
        <div className="text-small" style={{ marginBottom: '.75rem' }}>
          Répondez à 20 questions parfaites pour vaincre Goliath
        </div>
        <button className="btn btn-primary" style={{ fontSize: '.85rem', padding: '.5rem 1.2rem' }}
          onClick={() => setActiveGame('speedrun')}>
          Relever le défi →
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default GamesPage;
