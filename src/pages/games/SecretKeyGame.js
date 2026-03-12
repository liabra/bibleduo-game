import React, { useState } from 'react';
import BottomNav from '../../components/BottomNav';
import { SECRET_KEY_VERSES } from '../../data/gamesData';

const TODAY = new Date().toDateString();

const SecretKeyGame = ({ onBack, onXP }) => {
  const [keys, setKeys]         = useState(() => parseInt(localStorage.getItem('bibleKeys') || '0'));
  // FIX: was 'bibleKeyDone' in old code but 'bibleKeyDate' in new — unified to 'bibleKeyDate'
  const [done, setDone]         = useState(() => localStorage.getItem('bibleKeyDate') === TODAY);
  const [input, setInput]       = useState('');
  const [result, setResult]     = useState(null); // 'ok' | 'err' | null
  const [chestOpen, setChestOpen] = useState(false);
  const xpFiredRef = React.useRef(false);

  const verse = SECRET_KEY_VERSES[new Date().getDate() % SECRET_KEY_VERSES.length];
  const display = verse.verse.replace(verse.missing, '___');

  const validate = () => {
    const ok = input.trim().toLowerCase() === verse.missing.toLowerCase();
    if (ok && !done) {
      const nk = Math.min(5, keys + 1);
      localStorage.setItem('bibleKeys', nk);
      localStorage.setItem('bibleKeyDate', TODAY);
      setKeys(nk);
      setDone(true);
      setResult('ok');
      if (!xpFiredRef.current) { xpFiredRef.current = true; onXP(30); }
      if (nk >= 5) {
        setTimeout(() => { setChestOpen(true); localStorage.setItem('bibleKeys', '0'); setKeys(0); }, 700);
      }
    } else if (!ok) {
      setResult('err');
      setTimeout(() => { setResult(null); setInput(''); }, 900);
    }
  };

  return (
    <div className="page-content">
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: '.75rem' }}>← Retour</button>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem' }}>🗝️</div>
        <h2 style={{ margin: '.5rem 0 .25rem' }}>Clé Secrète</h2>
        <p className="text-small">1 verset par jour · 5 clés = coffre épique</p>
      </div>

      {/* Key progress */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '.6rem', marginBottom: '1.5rem' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ fontSize: '1.6rem', filter: i < keys ? 'none' : 'grayscale(1) opacity(.25)', transition: 'filter .4s' }}>
            🗝️
          </div>
        ))}
      </div>
      <div className="xp-bar-track" style={{ marginBottom: '1.5rem' }}>
        <div className="xp-bar-fill" style={{ width: `${(keys / 5) * 100}%` }} />
      </div>

      {/* Chest */}
      {chestOpen && (
        <div className="card" style={{ textAlign: 'center', borderColor: 'rgba(201,168,76,.5)', background: 'rgba(201,168,76,.08)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
          <h3 style={{ marginBottom: '.5rem' }}>Coffre Épique débloqué !</h3>
          <div style={{ fontSize: '1.3rem', margin: '1rem 0', color: 'var(--gold-light)' }}>⭐ +200 XP Bonus !</div>
          <button className="btn btn-primary" onClick={onBack}>Récupérer !</button>
        </div>
      )}

      {/* Already done */}
      {!chestOpen && done && (
        <div className="card" style={{ textAlign: 'center', background: 'rgba(45,106,79,.1)', borderColor: 'rgba(45,106,79,.3)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>✅</div>
          <p style={{ color: 'var(--sage-light)', fontWeight: 700 }}>Clé du jour récupérée !</p>
          <p className="text-small mt-1">Revenez demain pour la suivante</p>
          <p className="text-tiny" style={{ marginTop: '.75rem' }}>{keys}/5 clés collectées</p>
        </div>
      )}

      {/* Verse challenge */}
      {!chestOpen && !done && (
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '.75rem', color: 'var(--gold)', fontFamily: 'var(--font-display)', marginBottom: '.5rem', letterSpacing: '.05em' }}>
              ✦ {verse.ref} ✦
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--parch)', fontStyle: 'italic', lineHeight: 1.7 }}>
              « {display} »
            </p>
          </div>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <input
              className={`game-input ${result === 'err' ? 'error' : ''}`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && validate()}
              autoFocus
              placeholder="Complétez le verset..."
            />
            <button className="btn btn-primary" onClick={validate}>🗝️</button>
          </div>
          {result === 'ok' && <p style={{ color: 'var(--sage-light)', textAlign: 'center', marginTop: '.5rem', fontWeight: 700 }}>✅ Bonne réponse !</p>}
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default SecretKeyGame;
