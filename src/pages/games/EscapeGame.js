import React, { useState } from 'react';
import BottomNav from '../../components/BottomNav';
import { ESCAPE_LEVELS } from '../../data/gamesData';

const EscapeGame = ({ onBack, onXP }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const [enigmaIdx, setEnigmaIdx] = useState(0);
  const [input, setInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [phase, setPhase] = useState('intro'); // intro | playing | code | solved
  const [hint, setHint] = useState(false);
  const [result, setResult] = useState(null); // 'correct' | 'wrong' | null
  const [clearedLevels, setClearedLevels] = useState([]);

  const level = ESCAPE_LEVELS[levelIdx];
  const enigma = level?.enigmas[enigmaIdx];

  const goToLevel = (idx) => {
    setLevelIdx(idx);
    setEnigmaIdx(0);
    setInput('');
    setHint(false);
    setResult(null);
    setPhase('playing');
  };

  const validateAnswer = () => {
    const correct = input.trim().toLowerCase().includes(enigma.a.toLowerCase());
    setResult(correct ? 'correct' : 'wrong');
    if (correct) {
      setTimeout(() => {
        setResult(null);
        if (enigmaIdx < level.enigmas.length - 1) {
          setEnigmaIdx(e => e + 1);
          setInput('');
          setHint(false);
        } else {
          setPhase('code');
          setCodeInput('');
        }
      }, 1200);
    } else {
      setTimeout(() => { setResult(null); setInput(''); }, 1000);
    }
  };

  const validateCode = () => {
    if (codeInput.trim().toUpperCase() === level.code) {
      setClearedLevels(c => [...c, levelIdx]);
      onXP(level.xp);
      setPhase('solved');
    }
  };

  // ─── INTRO: level selection ───────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="page-content">
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: '1rem' }}>← Retour</button>
      <h2 style={{ marginBottom: '1rem' }}>🔐 Bible Escape</h2>
      {ESCAPE_LEVELS.map((l, i) => {
        const unlocked = i <= clearedLevels.length;
        return (
          <div key={l.id} onClick={() => unlocked && goToLevel(i)} className="card" style={{
            marginBottom: '.75rem', cursor: unlocked ? 'pointer' : 'default', opacity: unlocked ? 1 : .4,
            transition: 'opacity .2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <span style={{ fontSize: '2rem' }}>{l.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--gold-light)' }}>Niveau {l.id} : {l.title}</div>
                <div className="text-small">{l.enigmas.length} énigmes · {l.reward} · {l.xp} XP</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>{clearedLevels.includes(i) ? '✅' : '🔒'}</span>
            </div>
          </div>
        );
      })}
      <BottomNav />
    </div>
  );

  // ─── SOLVED: level complete ───────────────────────────────────────────────
  if (phase === 'solved') return (
    <div className="page-content" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem' }}>🎉</div>
      <h2 style={{ color: 'var(--gold-light)', margin: '1rem 0' }}>{level.title} — Débloqué !</h2>
      <div className="card" style={{ marginBottom: '1rem', textAlign: 'left' }}>
        <div style={{ color: 'var(--sage-light)', fontWeight: 700 }}>🏆 {level.reward}</div>
        <div className="text-small mt-1">+{level.xp} XP</div>
      </div>
      {levelIdx < ESCAPE_LEVELS.length - 1
        ? <button className="btn btn-primary" onClick={() => goToLevel(levelIdx + 1)}>Niveau suivant →</button>
        : <button className="btn btn-primary" onClick={() => setPhase('intro')}>← Niveaux</button>
      }
      <BottomNav />
    </div>
  );

  // ─── CODE: enter unlock code ──────────────────────────────────────────────
  if (phase === 'code') return (
    <div className="page-content" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem' }}>🔐</div>
      <h3 style={{ color: 'var(--gold-light)', margin: '1rem 0' }}>Entrez le code final</h3>
      <p className="text-small" style={{ marginBottom: '1rem' }}>Indice : un mot-clé de l'histoire du niveau…</p>
      <input
        value={codeInput}
        onChange={e => setCodeInput(e.target.value.toUpperCase())}
        onKeyDown={e => e.key === 'Enter' && validateCode()}
        placeholder="_ _ _ _"
        maxLength={8}
        style={{
          width: '100%', textAlign: 'center',
          background: 'rgba(255,255,255,.08)', border: '2px solid rgba(201,168,76,.4)',
          borderRadius: 8, color: 'var(--parch)', padding: '.75rem',
          fontSize: '1.5rem', fontFamily: 'var(--font-display)', letterSpacing: '.3em',
          outline: 'none', marginBottom: '1rem',
        }}
      />
      <button className="btn btn-primary w-full" onClick={validateCode}>Ouvrir la porte</button>
      <BottomNav />
    </div>
  );

  // ─── PLAYING: enigma ──────────────────────────────────────────────────────
  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="btn btn-ghost" onClick={() => setPhase('intro')}>← Niveaux</button>
        <span className="badge-pill">{level.icon} {level.title}</span>
        <span className="text-small">{enigmaIdx + 1}/{level.enigmas.length}</span>
      </div>

      {/* Story intro (first enigma only) */}
      {enigmaIdx === 0 && (
        <div className="card" style={{ background: 'rgba(30,58,95,.25)', borderColor: 'rgba(30,58,95,.5)', marginBottom: '1rem' }}>
          <p style={{ fontStyle: 'italic', color: 'var(--gray-400)', fontSize: '.9rem' }}>{level.story}</p>
        </div>
      )}

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1rem' }}>
        {level.enigmas.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= enigmaIdx ? 'var(--gold)' : 'rgba(255,255,255,.1)',
            transition: 'background .3s',
          }} />
        ))}
      </div>

      {/* Enigma card */}
      <div className="card-white" style={{
        marginBottom: '1rem',
        border: result === 'correct' ? '2px solid var(--sage)' : result === 'wrong' ? '2px solid var(--crimson)' : undefined,
        transition: 'border-color .3s',
      }}>
        <div className="text-small" style={{ color: 'var(--gold-dark)', marginBottom: '.5rem' }}>ÉNIGME {enigmaIdx + 1}</div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--ink)', marginBottom: hint ? '.5rem' : 0 }}>
          {enigma.q}
        </p>
        {hint && (
          <p style={{ fontStyle: 'italic', color: 'var(--gold-dark)', fontSize: '.85rem' }}>💡 {enigma.hint}</p>
        )}
        {result && (
          <div style={{ textAlign: 'center', fontSize: '1.5rem', marginTop: '.5rem' }}>
            {result === 'correct' ? '✅' : '❌'}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && validateAnswer()}
          autoFocus placeholder="Votre réponse..."
          style={{
            flex: 1, background: 'rgba(255,255,255,.08)',
            border: '1.5px solid rgba(201,168,76,.3)', borderRadius: 8,
            color: 'var(--parch)', padding: '.7rem 1rem', fontSize: '1rem', outline: 'none',
          }}
        />
        <button className="btn btn-primary" onClick={validateAnswer}>→</button>
      </div>

      {!hint && (
        <button className="btn btn-ghost" onClick={() => setHint(true)} style={{ marginTop: '.5rem', fontSize: '.8rem' }}>
          💡 Afficher l'indice
        </button>
      )}
      <BottomNav />
    </div>
  );
};

export default EscapeGame;
