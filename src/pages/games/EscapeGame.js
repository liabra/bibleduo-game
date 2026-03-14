import React, { useState } from 'react';
import BottomNav from '../../components/BottomNav';
import { ESCAPE_LEVELS } from '../../data/gamesData';
import { useGame } from '../../context/GameContext';
import { BibleRef, RulesBtn } from './shared';
import { HINT_COSTS } from '../../context/GameContext';

const EscapeGame = ({ onBack, onXP }) => {
  const { stats, spendXP, addEscapeBadge, escapeBadges } = useGame();
  const [levelIdx, setLevelIdx]     = useState(0);
  const [enigmaIdx, setEnigmaIdx]   = useState(0);
  const [input, setInput]           = useState('');
  const [codeInput, setCodeInput]   = useState('');
  const [phase, setPhase]           = useState('intro'); // intro | playing | code | solved
  const [hint, setHint]             = useState(false);
  const [result, setResult]         = useState(null); // 'ok' | 'err' | null
  const [codeError, setCodeError]   = useState(false);
  // Restaure les niveaux complétés depuis les badges persistés
  // badge.id est 1-based (Niv.1 = id:1), l'index dans ESCAPE_LEVELS est 0-based
  const [cleared, setCleared]       = useState(() => escapeBadges.map(b => b.id - 1));
  const xpFiredRef = React.useRef(false);

  const level  = ESCAPE_LEVELS[levelIdx];
  const enigma = level?.enigmas[enigmaIdx];

  const goLevel = (idx) => {
    setLevelIdx(idx); setEnigmaIdx(0); setInput('');
    setHint(false); setResult(null); setCodeInput('');
    setPhase('playing');
  };

  const checkAnswer = () => {
    if (!enigma || result !== null) return;
    const ok = input.trim().toLowerCase().includes(enigma.a.toLowerCase());
    setResult(ok ? 'ok' : 'err');
    if (ok) {
      setTimeout(() => {
        setResult(null);
        if (enigmaIdx < level.enigmas.length - 1) { setEnigmaIdx(e => e + 1); setInput(''); setHint(false); }
        else { setPhase('code'); setCodeInput(''); }
      }, 1100);
    } else {
      setTimeout(() => { setResult(null); setInput(''); }, 900);
    }
  };

  const checkCode = () => {
    if (codeInput.trim().toUpperCase() === level.code) {
      setCleared(c => [...c, levelIdx]);
      if (!xpFiredRef.current) {
        xpFiredRef.current = true;
        onXP(level.xp);
        // Persiste le badge dans le contexte global
        addEscapeBadge({ id: level.id, reward: level.reward, title: level.title, icon: level.icon });
      }
      setPhase('solved');
    } else {
      setCodeError(true);
      setTimeout(() => { setCodeError(false); setCodeInput(''); }, 1200);
    }
  };

  /* ── INTRO ── */
  if (phase === 'intro') return (
    <div className="page-content">
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: '.75rem' }}>← Retour</button>
      <h2 style={{ marginBottom: '.25rem' }}>🔐 Bible Escape</h2>
      <p className="text-tiny" style={{ marginBottom: '1rem' }}>⭐ {stats.xp} XP disponibles</p>
      {/* Grille de progression des badges */}
      <div className="card" style={{ marginBottom: '1rem', background: 'rgba(201,168,76,.05)', borderColor: 'rgba(201,168,76,.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '.78rem', letterSpacing: '.07em' }}>
            🏅 MES BADGES
          </div>
          <div className="text-tiny">{cleared.length}/{ESCAPE_LEVELS.length} débloqués</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '.35rem' }}>
          {ESCAPE_LEVELS.map((l, i) => {
            const earned = cleared.includes(i);
            return (
              <div key={l.id} title={earned ? `${l.title} — ${l.reward}` : `Niveau ${l.id} verrouillé`} style={{
                borderRadius: 8, padding: '.35rem .2rem', textAlign: 'center',
                background: earned ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.04)',
                border: `1px solid ${earned ? 'rgba(201,168,76,.4)' : 'rgba(255,255,255,.06)'}`,
                transition: 'all .2s',
              }}>
                <div style={{ fontSize: '1.1rem', lineHeight: 1, filter: earned ? 'none' : 'grayscale(1)', opacity: earned ? 1 : 0.35 }}>
                  {earned ? l.icon : '🔒'}
                </div>
                <div style={{ fontSize: '.52rem', color: earned ? 'var(--gold-light)' : 'var(--gray-400)', marginTop: '.2rem', fontFamily: 'var(--font-display)' }}>
                  {l.id}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {ESCAPE_LEVELS.map((l, i) => {
        const unlocked = i <= cleared.length;
        const done     = cleared.includes(i);
        const canSkip  = !unlocked && !done && stats.xp >= l.skipCost;
        const skipable = !unlocked && !done;
        return (
          <div key={l.id} className="card" style={{ marginBottom: '.6rem', transition: 'all .2s', opacity: unlocked || skipable ? 1 : .35 }}>
            <div
              onClick={() => unlocked && goLevel(i)}
              style={{ display: 'flex', alignItems: 'center', gap: '.75rem', cursor: unlocked ? 'pointer' : 'default' }}
              onMouseEnter={e => unlocked && (e.currentTarget.parentElement.style.borderColor = 'rgba(201,168,76,.4)')}
              onMouseLeave={e => (e.currentTarget.parentElement.style.borderColor = 'rgba(201,168,76,.18)')}
            >
              <span style={{ fontSize: '2rem' }}>{l.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '.15rem' }}>
                  Niv.{l.id} — {l.title}
                </div>
                <div className="text-tiny">{l.enigmas.length} énigmes · {l.reward} · {l.xp} XP</div>
              </div>
              <span style={{ fontSize: '1.2rem' }}>{done ? '✅' : unlocked ? '▶️' : '🔒'}</span>
            </div>
            {/* Bouton skip pour niveaux verrouillés */}
            {skipable && (
              <div style={{ marginTop: '.5rem', paddingTop: '.5rem', borderTop: '1px solid rgba(201,168,76,.12)' }}>
                <button
                  onClick={() => {
                    if (!canSkip) return;
                    spendXP(l.skipCost);
                    setCleared(c => [...c, i]);
                  }}
                  disabled={!canSkip}
                  style={{
                    background: canSkip ? 'rgba(201,168,76,.12)' : 'rgba(255,255,255,.04)',
                    border: `1px solid ${canSkip ? 'rgba(201,168,76,.35)' : 'rgba(255,255,255,.1)'}`,
                    borderRadius: 7, padding: '.3rem .7rem',
                    color: canSkip ? 'var(--gold)' : 'var(--gray-400)',
                    fontSize: '.72rem', cursor: canSkip ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {canSkip ? `⏭ Passer ce niveau (−${l.skipCost} XP)` : `🔒 Il faut ${l.skipCost} XP pour passer`}
                </button>
              </div>
            )}
          </div>
        );
      })}
      <BottomNav />
    </div>
  );

  /* ── SOLVED ── */
  if (phase === 'solved') return (
    <div className="page-content" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem' }}>🎉</div>
      <h2 style={{ margin: '.75rem 0 .5rem' }}>{level.title}</h2>
      <p style={{ color: 'var(--sage-light)', marginBottom: '1.25rem' }}>Niveau débloqué !</p>
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ color: 'var(--gold-light)', fontWeight: 700, fontSize: '1.1rem' }}>{level.reward}</div>
        <div className="text-small mt-1">+{level.xp} XP</div>
      </div>
      {levelIdx < ESCAPE_LEVELS.length - 1
        ? <button className="btn btn-primary" onClick={() => { xpFiredRef.current = false; goLevel(levelIdx + 1); }}>Niveau suivant →</button>
        : <button className="btn btn-primary" onClick={() => setPhase('intro')}>← Tous les niveaux</button>
      }
      <BottomNav />
    </div>
  );

  /* ── CODE ── */
  if (phase === 'code') return (
    <div className="page-content" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '.5rem' }}>🔐</div>
      <h3 style={{ marginBottom: '.75rem' }}>Entrez le code secret</h3>

      {/* Indice explicite du code */}
      <div className="card" style={{ background: 'rgba(201,168,76,.1)', borderColor: 'rgba(201,168,76,.4)', marginBottom: '1.25rem', textAlign: 'left' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '.75rem', letterSpacing: '.08em', marginBottom: '.35rem' }}>💡 INDICE</div>
        <p style={{ color: 'var(--parch)', fontSize: '.95rem', lineHeight: 1.5 }}>{level.codeHint}</p>
        <p className="text-tiny" style={{ marginTop: '.4rem' }}>
          {'_'.repeat(level.code.length).split('').join(' ')} &nbsp;·&nbsp; {level.code.length} lettres
        </p>
      </div>

      <input
        value={codeInput}
        onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError(false); }}
        onKeyDown={e => e.key === 'Enter' && checkCode()}
        placeholder={'_'.repeat(level.code.length).split('').join(' ')}
        maxLength={level.code.length}
        style={{
          width: '100%', textAlign: 'center',
          background: codeError ? 'rgba(139,26,26,.15)' : 'rgba(255,255,255,.08)',
          border: `2px solid ${codeError ? 'var(--crimson)' : 'rgba(201,168,76,.4)'}`,
          borderRadius: 8, color: 'var(--parch)',
          padding: '.75rem', fontSize: '1.5rem',
          fontFamily: 'var(--font-display)', letterSpacing: '.3em',
          outline: 'none', marginBottom: '.5rem',
          transition: 'border-color .2s, background .2s',
          animation: codeError ? 'shake .4s ease' : 'none',
        }}
      />

      {codeError && (
        <p style={{ color: 'var(--crimson)', fontSize: '.85rem', marginBottom: '.75rem' }}>
          ❌ Code incorrect — réessayez…
        </p>
      )}

      <button className="btn btn-primary w-full" style={{ marginTop: '.5rem' }} onClick={checkCode}>
        Ouvrir la porte 🚪
      </button>
      <BottomNav />
    </div>
  );

  /* ── PLAYING ── */
  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
        <button className="btn btn-ghost" onClick={() => setPhase('intro')}>← Niveaux</button>
        <span className="badge-pill">{level.icon} {level.title}</span>
        <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
          <span className="text-small">{enigmaIdx+1}/{level.enigmas.length}</span>
          <RulesBtn gameId="escape" />
        </div>
      </div>

      {/* Step dots */}
      <div className="step-bar">
        {level.enigmas.map((_, i) => (
          <div key={i} className={`step-dot ${i <= enigmaIdx ? 'done' : ''}`} />
        ))}
      </div>

      {/* Story (first enigma only) */}
      {enigmaIdx === 0 && (
        <div className="card" style={{ background: 'rgba(30,58,95,.2)', borderColor: 'rgba(30,58,95,.4)', marginBottom: '1rem' }}>
          <p style={{ fontStyle: 'italic', color: 'var(--gray-400)', fontSize: '.88rem' }}>{level.story}</p>
        </div>
      )}

      {/* Enigma */}
      <div className="card-white" style={{ marginBottom: '1rem', border: result === 'ok' ? '2px solid var(--sage)' : result === 'err' ? '2px solid var(--crimson)' : undefined, transition: 'border .3s' }}>
        <div className="text-tiny" style={{ color: 'var(--gold-dark)', marginBottom: '.4rem' }}>ÉNIGME {enigmaIdx+1}</div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.5 }}>{enigma.q}</p>
        {hint && (
          <div style={{ marginTop: '.5rem' }}>
            <p style={{ fontStyle: 'italic', color: 'var(--gold-dark)', fontSize: '.85rem' }}>💡 {enigma.hint}</p>
          </div>
        )}
        {result === 'ok' && enigma.ref && <BibleRef verse={enigma.ref} />}
        {result && <div style={{ textAlign: 'center', fontSize: '1.8rem', marginTop: '.5rem' }}>{result === 'ok' ? '✅' : '❌'}</div>}
      </div>

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem' }}>
        <input className="game-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && checkAnswer()} autoFocus placeholder="Votre réponse..." />
        <button className="btn btn-primary" onClick={checkAnswer}>→</button>
      </div>
      {!hint && (
        <button className="btn btn-ghost" onClick={() => {
          setHint(true);
          spendXP(HINT_COSTS.escape);
        }} style={{ fontSize: '.8rem' }}>
          💡 Voir l'indice <span style={{ color: 'var(--crimson)', fontSize: '.7rem' }}>−{HINT_COSTS.escape} XP</span>
        </button>
      )}
      <BottomNav />
    </div>
  );
};

export default EscapeGame;
