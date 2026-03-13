import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

/**
 * ProfileQR — génère un vrai QR code scannable (ISO 18004) via la lib `qrcode`.
 * Installez avec : npm install qrcode
 *
 * Props :
 *  - profile  : { name, avatar }
 *  - stats    : { xp, totalQuizzes, totalCorrect }
 *  - level    : number
 *  - onClose  : () => void
 */
const ProfileQR = ({ profile, stats, level, onClose }) => {
  const [qrSrc, setQrSrc] = useState('');
  const [error, setError]  = useState(false);

  const qrData = `BIBLE GAMES | ${profile?.name || 'Joueur'} | Niv.${level} | ${stats?.xp || 0} XP | ${stats?.totalQuizzes || 0} parties`;

  useEffect(() => {
    QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#1a1209', light: '#fdf6e3' },
    })
      .then(url => { setQrSrc(url); setError(false); })
      .catch(() => setError(true));
  }, [qrData]);

  const download = () => {
    if (!qrSrc) return;
    const a = document.createElement('a');
    a.download = 'bible-games-profil.png';
    a.href = qrSrc;
    a.click();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)', zIndex: 500,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{ background: '#fdf6e3', borderRadius: 16, padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 8px 40px rgba(0,0,0,.5)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '.75rem' }}>
          <div style={{ fontSize: '1.6rem' }}>{profile?.avatar || '📖'}</div>
          <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1a1209', fontSize: '1rem' }}>
            {profile?.name || 'Joueur'}
          </div>
          <div style={{ fontSize: '.75rem', color: '#6b4c32' }}>Niveau {level} · {stats?.xp || 0} XP</div>
        </div>

        {/* QR Code */}
        {error ? (
          <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0e8d0', borderRadius: 4, fontSize: '.75rem', color: '#8a7060', textAlign: 'center', padding: '.5rem' }}>
            Installez le package qrcode :<br /><code style={{ fontSize: '.7rem' }}>npm install qrcode</code>
          </div>
        ) : qrSrc ? (
          <img
            src={qrSrc}
            alt="QR code profil Bible Games"
            style={{ display: 'block', width: 200, height: 200, imageRendering: 'pixelated', borderRadius: 4 }}
          />
        ) : (
          <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0e8d0', borderRadius: 4 }}>
            <span style={{ fontSize: '.8rem', color: '#8a7060' }}>Génération…</span>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '.6rem', fontSize: '.65rem', color: '#8a7060', fontFamily: 'Georgia, serif' }}>
          ✦ Bible Games ✦
        </div>
      </div>

      <p style={{ color: 'rgba(253,246,227,.5)', fontSize: '.8rem', marginBottom: '1rem', textAlign: 'center', maxWidth: 260 }}>
        Partagez ce QR code pour montrer votre progression
      </p>

      <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={download}
          disabled={!qrSrc}
          style={{ background: 'linear-gradient(135deg,#c9a84c,#a07830)', color: '#1a1209', border: 'none', borderRadius: 8, padding: '.65rem 1.3rem', fontWeight: 700, fontSize: '.9rem', cursor: qrSrc ? 'pointer' : 'not-allowed', opacity: qrSrc ? 1 : .5 }}
        >
          ⬇️ Télécharger
        </button>
        <button
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,.1)', color: '#fdf6e3', border: '1px solid rgba(201,168,76,.3)', borderRadius: 8, padding: '.65rem 1rem', fontSize: '.9rem', cursor: 'pointer' }}
        >
          ✕ Fermer
        </button>
      </div>
    </div>
  );
};

export default ProfileQR;
