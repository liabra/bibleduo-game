import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import ProfileQR from './ProfileQR';

const KOFI_URL    = 'https://ko-fi.com/liabalagnaranin';
const FEEDBACK_URL = 'https://forms.gle/PLQSfC26NsA3Gn6d9';

const ProfileView = ({ onClose, onEdit }) => {
  const { profile, stats, level, xpProgress } = useGame();
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
            <span className="text-tiny text-gold">{xpProgress}/100 XP</span>
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
