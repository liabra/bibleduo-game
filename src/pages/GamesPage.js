import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import BottomNav from '../components/BottomNav';
import ProfileSetup from '../components/ProfileSetup';
import ProfileView  from '../components/ProfileView';
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

// profileModal :
//   null    → grille principale
//   'setup' → premier paramétrage (onboarding, pas de retour vers ProfileView)
//   'view'  → consultation du profil (stats + actions)
//   'edit'  → modification pseudo/avatar (retour vers ProfileView après)

const GamesPage = () => {
  const { recordQuizResult, stats, level, xpProgress, xpCurrent, xpNeeded, profile } = useGame();
  const location = useLocation();

  const [activeGame, setActiveGame] = useState(null);
  const [xpPop,      setXpPop]      = useState(null);
  const [profileModal, setProfileModal] = useState(
    profile.setupDone ? null : 'setup'
  );

  // Correction navigation : quand le joueur clique "Jeux" depuis un jeu actif,
  // React Router ne remonte pas GamesPage (même route). On écoute location.key
  // pour détecter la navigation et revenir à la grille.
  const mountedRef = useRef(false);
  useEffect(() => {
    if (mountedRef.current) {
      setActiveGame(null);
      setXpPop(null);
    }
    mountedRef.current = true;
  }, [location.key]);

  const handleXP = useCallback((xp, gameId = '') => {
    const correct = Math.max(1, Math.ceil(xp / 10));
    recordQuizResult({ correct, total: correct, gameId });
    setXpPop(xp);
  }, [recordQuizResult]);

  // ── Modales profil ────────────────────────────────────────────────────
  if (profileModal === 'view') {
    return (
      <ProfileView
        onClose={() => setProfileModal(null)}
        onEdit={()  => setProfileModal('edit')}
      />
    );
  }

  if (profileModal === 'setup' || profileModal === 'edit') {
    return (
      <ProfileSetup
        isEdit={profileModal === 'edit'}
        onDone={() => setProfileModal(profileModal === 'edit' ? 'view' : null)}
      />
    );
  }

  // ── Jeu actif ─────────────────────────────────────────────────────────
  if (activeGame) {
    const GameComponent = GAME_COMPONENTS[activeGame];
    // XPPop absent ici intentionnellement : il s'affiche dans la grille au retour,
    // évitant un double rendu toast.
    return (
      <GameComponent
        onBack={() => setActiveGame(null)}
        onXP={(xp) => handleXP(xp, activeGame)}
      />
    );
  }

  // ── Grille principale ─────────────────────────────────────────────────
  return (
    <div className="page-content">
      {xpPop && <XPPop xp={xpPop} onDone={() => setXpPop(null)} />}

      {/* En-tête profil */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          {/* Cliquer sur l'avatar → vue profil (pas le setup) */}
          <button
            onClick={() => setProfileModal('view')}
            style={{ fontSize: '1.8rem', background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.25)', borderRadius: 10, width: 44, height: 44, cursor: 'pointer' }}
          >
            {profile.avatar}
          </button>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', color: 'var(--parch)', fontWeight: 700 }}>
              {profile.name || 'Anonyme'}
            </div>
            <div className="text-tiny">{stats.xp} XP · {stats.totalQuizzes} parties</div>
          </div>
        </div>
        <div style={{ background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.25)', borderRadius: 10, padding: '.4rem .75rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-light)', lineHeight: 1 }}>{level}</div>
          <div className="text-tiny">niv.</div>
        </div>
      </div>

      {/* Barre XP */}
      <div className="xp-bar-track" style={{ marginBottom: '.3rem' }}>
        <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
      </div>
      <div className="text-tiny" style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
        {xpCurrent}/{xpNeeded} XP → Niv.{level + 1}
      </div>

      <h2 style={{ fontSize: '1.4rem', marginBottom: '.75rem' }}>⚡ Bible Games</h2>

      {/* Grille des jeux */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem', marginBottom: '1.25rem' }}>
        {GAMES_META.map(game => (
          <div
            key={game.id}
            className="game-card"
            onClick={() => setActiveGame(game.id)}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${game.color}55`}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,.15)'}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${game.color}, ${game.color}44)`, borderRadius: '14px 14px 0 0' }} />
            <div style={{ fontSize: '2rem', marginBottom: '.35rem', marginTop: '.15rem' }}>{game.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.88rem', color: 'var(--parch)', marginBottom: '.2rem' }}>{game.label}</div>
            <div className="text-tiny" style={{ marginBottom: '.6rem', lineHeight: 1.45 }}>{game.desc}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ background: `${game.color}22`, border: `1px solid ${game.color}44`, borderRadius: 99, padding: '.15rem .5rem', fontSize: '.6rem', color: game.color, fontWeight: 700 }}>{game.tag}</span>
              <span className="text-tiny">{game.xpMax} XP</span>
            </div>
          </div>
        ))}
      </div>

      {/* Événement saisonnier */}
      <div style={{ background: 'linear-gradient(135deg, rgba(139,26,26,.22), rgba(201,168,76,.08))', border: '1px solid rgba(201,168,76,.2)', borderRadius: 14, padding: '1rem', position: 'relative', overflow: 'hidden', marginBottom: '.65rem' }}>
        <div style={{ position: 'absolute', top: -4, right: 8, fontSize: '3.5rem', opacity: .07, lineHeight: 1 }}>⚔️</div>
        <div className="text-tiny" style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', letterSpacing: '.1em', marginBottom: '.3rem' }}>🎺 ÉVÉNEMENT SAISONNIER</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--parch)', marginBottom: '.25rem' }}>Défi Goliath — Boss Fight</div>
        <div className="text-small" style={{ marginBottom: '.75rem' }}>60s · 20 réponses parfaites · Vaincs Goliath !</div>
        <button className="btn btn-primary" style={{ fontSize: '.85rem', padding: '.5rem 1.2rem' }} onClick={() => setActiveGame('speedrun')}>Relever le défi →</button>
      </div>

      {/* Soutien + Feedback */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem', marginBottom: '.5rem' }}>
        <a href="https://ko-fi.com/liabalagnaranin" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', background: 'rgba(255,94,91,.1)', border: '1px solid rgba(255,94,91,.25)', borderRadius: 10, padding: '.55rem .5rem', color: '#ff8a87', textDecoration: 'none', fontSize: '.72rem', fontFamily: 'var(--font-display)', fontWeight: 700, textAlign: 'center' }}
        >
          ☕ Soutenir
        </a>
        <a href="https://forms.gle/PLQSfC26NsA3Gn6d9" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', background: 'rgba(30,58,95,.2)', border: '1px solid rgba(30,58,95,.4)', borderRadius: 10, padding: '.55rem .5rem', color: 'rgba(253,246,227,.6)', textDecoration: 'none', fontSize: '.72rem', fontFamily: 'var(--font-display)', fontWeight: 700, textAlign: 'center' }}
        >
          💬 Donner un avis
        </a>
      </div>

      <BottomNav />
    </div>
  );
};

export default GamesPage;
