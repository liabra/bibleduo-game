import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import ProfileQR from './ProfileQR';

const KOFI_URL    = 'https://ko-fi.com/liabalagnaranin';
const FEEDBACK_URL = 'https://forms.gle/PLQSfC26NsA3Gn6d9';

const GAME_META = {
  speedrun:  { label: 'Speed Verse',    icon: '⚡' },
  battle:    { label: 'Bible Battle',   icon: '⚔️' },
  memory:    { label: 'Bible Memory',   icon: '🃏' },
  bingo:     { label: 'Bible Bingo',    icon: '🎯' },
  escape:    { label: 'Bible Escape',   icon: '🔐' },
  secretkey: { label: 'Clé Secrète',   icon: '🗝️' },
};

const ProfileView = ({ onClose, onEdit }) => {
  const { profile, stats, level, xpProgress, xpCurrent, xpNeeded, escapeBadges } = useGame();
  const [showQR,    setShowQR]    = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  if (showQR) {
    return <ProfileQR profile={profile} stats={stats} level={level} onClose={() => setShowQR(false)} />;
  }

  // ── URL de partage encodée en base64 ───────────────────────────────────────
  const shareUrl = (() => {
    try {
      const payload = btoa(unescape(encodeURIComponent(JSON.stringify({
        n: profile.name, a: profile.avatar, l: level, x: stats.xp,
      }))));
      return `${window.location.origin}?profil=${payload}`;
    } catch { return window.location.origin; }
  })();

  const copyLink = () => {
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    });
  };

  const precision = stats.totalQuizzes > 0
    ? Math.round((stats.totalCorrect / (stats.totalQuizzes * 5)) * 100)
    : 0;
  const gamesCount = Object.values(stats.gamesPlayed || {}).reduce((a, b) => a + b, 0);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(10,7,3,.92)', backdropFilter: 'blur(12px)',
      zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', overflowY: 'auto',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Avatar + nom */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '.5rem', filter: 'drop-shadow(0 4px 16px rgba(201,168,76,.4))' }}>
            {profile.avatar}
          </div>
          <h2 style={{ margin: '0 0 .25rem', fontFamily: 'var(--font-display)', color: 'var(--parch)' }}>
            {profile.name}
          </h2>
          <div style={{
            display: 'inline-block', background: 'rgba(201,168,76,.15)',
            border: '1px solid rgba(201,168,76,.3)', borderRadius: 99,
            padding: '.2rem .75rem', fontSize: '.78rem', color: 'var(--gold-light)',
          }}>
            ✦ Niveau {level}
          </div>
        </div>

        {/* XP bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.35rem' }}>
            <span className="text-tiny">Progression vers Niv.{level + 1}</span>
            <span className="text-tiny text-gold">{xpCurrent}/{xpNeeded} XP</span>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>

        {/* Stats */}
        <div className="card-white" style={{ marginBottom: '1rem' }}>
          {[
            ['⭐ XP total',        `${stats.xp} XP`],
            ['🎮 Parties jouées',  gamesCount],
            ['✅ Quiz complétés',  stats.totalQuizzes],
            ['🎯 Bonnes réponses', `${stats.totalCorrect}`],
          ].map(([label, value]) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '.55rem 0', borderBottom: '1px solid var(--gray-200)',
            }}>
              <span style={{ color: 'var(--ink-light)', fontSize: '.88rem' }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Historique des jeux */}
        {gamesCount > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '.75rem', letterSpacing: '.08em', marginBottom: '.5rem' }}>🎮 HISTORIQUE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
              {Object.entries(stats.gamesPlayed || {}).filter(([, n]) => n > 0).map(([gameId, count]) => {
                const meta = GAME_META[gameId];
                if (!meta) return null;
                return (
                  <div key={gameId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(201,168,76,.06)', borderRadius: 8, padding: '.45rem .75rem' }}>
                    <span style={{ fontSize: '.88rem' }}>{meta.icon} {meta.label}</span>
                    <span style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)', fontSize: '.8rem', fontWeight: 700 }}>{count}×</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Badges Bible Escape */}
        {escapeBadges.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '.75rem', letterSpacing: '.08em', marginBottom: '.5rem' }}>🏅 BADGES OBTENUS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
              {escapeBadges.map((badge) => (
                <div key={badge.id} title={badge.reward} style={{
                  background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.35)',
                  borderRadius: 10, padding: '.4rem .6rem', textAlign: 'center',
                  minWidth: 72, flex: '1 1 auto', maxWidth: 120,
                }}>
                  <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>{badge.icon}</div>
                  <div style={{ fontSize: '.62rem', color: 'var(--gold-light)', fontFamily: 'var(--font-display)', marginTop: '.2rem', lineHeight: 1.3 }}>{badge.title}</div>
                  <div style={{ fontSize: '.58rem', color: 'var(--gray-400)', marginTop: '.1rem' }}>{badge.reward}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions — Partage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '1rem' }}>
          <button onClick={() => setShowQR(true)} className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}>
            <span>⬡</span> QR Code profil
          </button>

          {/* Copier le lien */}
          <button onClick={copyLink} className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}>
            {linkCopied ? '✅ Lien copié !' : '🔗 Copier le lien de partage'}
          </button>

          <button onClick={onEdit} className="btn btn-secondary">
            ✏️ Modifier pseudo / avatar
          </button>

          <button onClick={onClose} className="btn btn-ghost"
            style={{ color: 'rgba(253,246,227,.4)', fontSize: '.85rem' }}>
            ✕ Fermer
          </button>
        </div>

        {/* Soutien + Feedback */}
        <div style={{
          borderTop: '1px solid rgba(201,168,76,.15)', paddingTop: '1rem',
          display: 'flex', flexDirection: 'column', gap: '.5rem',
        }}>
          <a href={KOFI_URL} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
              background: 'rgba(255,94,91,.12)', border: '1px solid rgba(255,94,91,.3)',
              borderRadius: 8, padding: '.6rem 1rem', color: '#ff8a87',
              textDecoration: 'none', fontSize: '.85rem', fontFamily: 'var(--font-display)',
              fontWeight: 700, transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,94,91,.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,94,91,.12)'}
          >
            ☕ Soutenir le projet sur Ko-fi
          </a>

          <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
              background: 'rgba(30,58,95,.25)', border: '1px solid rgba(30,58,95,.5)',
              borderRadius: 8, padding: '.6rem 1rem', color: 'var(--parch)',
              textDecoration: 'none', fontSize: '.85rem', fontFamily: 'var(--font-display)',
              fontWeight: 700, transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,95,.4)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(30,58,95,.25)'}
          >
            💬 Donner mon avis
          </a>
        </div>

      </div>
    </div>
  );
};

export default ProfileView;
