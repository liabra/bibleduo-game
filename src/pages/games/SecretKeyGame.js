import React, { useState } from 'react';
import BottomNav from '../../components/BottomNav';
import { SECRET_KEY_VERSES } from '../../data/gamesData';
import { rand } from './shared';

const TODAY = new Date().toDateString();

const SecretKeyGame = ({ onBack, onXP }) => {
  const [keys, setKeys] = useState(() => parseInt(localStorage.getItem('bibleKeys') || '0'));
  const [alreadyDone, setAlreadyDone] = useState(() => localStorage.getItem('bibleKeyDate') === TODAY);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null); // 'correct' | 'wrong' | null
  const [chestOpen, setChestOpen] = useState(false);

  // Pick a stable verse for today (same one all day via date seed)
  const [verse] = useState(() => {
    const dayIndex = new Date().getDate() % SECRET_KEY_VERSES.length;
    return SECRET_KEY_VERSES[dayIndex];
  });

  const [chestReward] = useState(() => rand([
    '⭐ +200 XP Bonus',
    '🏅 Badge Rare débloqué',
    '👑 Titre : Sage de la Parole',
    '✨ Supercharge XP (×2 pendant 1h)',
  ]));

  const validate = () => {
    const correct = input.trim().toLowerCase() === verse.missing.toLowerCase();
    if (correct && !alreadyDone) {
      const newKeys = Math.min(5, keys + 1);
      localStorage.setItem('bibleKeys', newKeys);
      localStorage.setItem('bibleKeyDate', TODAY);
      setKeys(newKeys);
      setAlreadyDone(true);
      setResult('correct');
      onXP(30);
      if (newKeys >= 5) {
        setTimeout(() => {
          setChestOpen(true);
          localStorage.setItem('bibleKeys', '0');
          setKeys(0);
        }, 800);
      }
    } else if (!correct) {
      setResult('wrong');
      setTimeout(() => setResult(null), 1000);
    }
  };

  const displayVerse = verse.verse.replace(verse.missing, '___');

  return (
    <div className="page-content">
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: '1rem' }}>← Retour</button>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem' }}>🗝️</div>
        <h2 style={{ marginTop: '.5rem' }}>Clé Secrète</h2>
        <p className="text-small mt-1">1 verset par jour · 5 clés = coffre épique</p>
      </div>

      {/* Key progress */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginBottom: '1.5rem' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{ fontSize: '1.5rem', filter: i < keys ? 'none' : 'grayscale(1) opacity(.3)', transition: 'filter .4s' }}>
            🗝️
          </div>
        ))}
      </div>

      {/* Chest reward */}
      {chestOpen && (
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
          <h3 style={{ color: 'var(--gold-light)' }}>Coffre Épique débloqué !</h3>
          <div style={{ fontSize: '1.5rem', margin: '1rem 0' }}>{chestReward}</div>
          <button className="btn btn-primary" onClick={() => { setChestOpen(false); onBack(); }}>
            Récupérer !
          </button>
        </div>
      )}

      {/* Already done today */}
      {!chestOpen && alreadyDone && (
        <div className="card" style={{ textAlign: 'center', background: 'rgba(45,106,79,.1)', borderColor: 'rgba(45,106,79,.3)' }}>
          <div style={{ fontSize: '2rem' }}>✅</div>
          <p style={{ color: 'var(--sage-light)', marginTop: '.5rem', fontWeight: 700 }}>Clé du jour récupérée !</p>
          <p className="text-small mt-1">Revenez demain pour une nouvelle clé</p>
        </div>
      )}

      {/* Verse challenge */}
      {!chestOpen && !alreadyDone && (
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '.75rem', color: 'var(--gold)', fontFamily: 'var(--font-display)', marginBottom: '.5rem' }}>
              ✦ {verse.ref} ✦
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--parch)', fontStyle: 'italic', lineHeight: 1.6 }}>
              « {displayVerse} »
            </p>
          </div>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && validate()}
              autoFocus
              placeholder="Complétez le verset..."
              style={{
                flex: 1,
                background: result === 'wrong' ? 'rgba(139,26,26,.15)' : 'rgba(255,255,255,.08)',
                border: `1.5px solid ${result === 'wrong' ? 'var(--crimson)' : 'rgba(201,168,76,.3)'}`,
                borderRadius: 8, color: 'var(--parch)', padding: '.7rem 1rem',
                fontSize: '1rem', outline: 'none', transition: 'all .2s',
              }}
            />
            <button className="btn btn-primary" onClick={validate}>🗝️</button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default SecretKeyGame;
