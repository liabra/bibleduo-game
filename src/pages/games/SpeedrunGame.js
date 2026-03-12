import React, { useState, useEffect, useRef, useCallback } from 'react';
import BottomNav from '../../components/BottomNav';
import { SPEEDRUN_QS } from '../../data/gamesData';
import { shuffle } from './shared';

const SpeedrunGame = ({ onBack, onXP }) => {
  const [phase, setPhase]       = useState('ready');
  const [qs, setQs]             = useState([]);
  const [idx, setIdx]           = useState(0);
  const [input, setInput]       = useState('');
  const [score, setScore]       = useState(0);
  const [combo, setCombo]       = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [maxCombo, setMaxCombo] = useState(0);
  const [flash, setFlash]       = useState(null);
  const timerRef = useRef(null);
  const xpFiredRef = useRef(false);

  const showFlash = useCallback((text, color) => {
    setFlash({ text, color });
    setTimeout(() => setFlash(null), 700);
  }, []);

  const start = () => {
    xpFiredRef.current = false;
    setQs(shuffle(SPEEDRUN_QS));
    setIdx(0); setScore(0); setCombo(0); setTimeLeft(60); setMaxCombo(0);
    setPhase('running');
  };

  useEffect(() => {
    if (phase !== 'running') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const answer = useCallback((ans) => {
    const q = qs[idx % qs.length];
    const ok = ans.trim().toLowerCase() === q.a.toLowerCase();
    if (ok) {
      const pts = 10 + combo * 5;
      setScore(s => s + pts);
      setCombo(c => { const n = c + 1; setMaxCombo(m => Math.max(m, n)); return n; });
      showFlash(`+${pts}`, '#40916c');
    } else {
      setCombo(0);
      showFlash('✗', '#e63946');
    }
    setInput('');
    setIdx(i => i + 1);
  }, [qs, idx, combo, showFlash]);

  /* ── READY ── */
  if (phase === 'ready') return (
    <div className="page-content">
      <button className="btn btn-ghost" onClick={onBack}>← Retour</button>
      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <div style={{ fontSize: '4rem' }}>⚡</div>
        <h2 style={{ margin: '.5rem 0 .3rem' }}>Bible Speedrun</h2>
        <p className="text-small">60 secondes · Combos · Max de réponses</p>
      </div>
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', textAlign: 'center', gap: '.75rem', marginBottom: '1.5rem' }}>
        {[['🕐','60s'], ['🔥','+5/combo'], ['⭐','XP bonus']].map(([ic,lb]) => (
          <div key={lb}>
            <div style={{ fontSize: '1.5rem' }}>{ic}</div>
            <div className="text-tiny" style={{ marginTop: '.25rem' }}>{lb}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary w-full" style={{ padding: '1rem', fontSize: '1.1rem' }} onClick={start}>🚀 Lancer !</button>
      <BottomNav />
    </div>
  );

  /* ── DONE ── */
  if (phase === 'done') {
    const xp = Math.round(score * 0.8);
    if (!xpFiredRef.current) { xpFiredRef.current = true; onXP(xp); }
    return (
      <div className="page-content" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem' }}>🏁</div>
        <h2 style={{ margin: '.75rem 0 1.25rem' }}>Temps écoulé !</h2>
        <div className="card-white" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          {[['Score', `${score} pts`], ['Meilleur combo', `×${maxCombo}`], ['XP gagnés', `+${xp}`]].map(([l,v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '.6rem 0', borderBottom: '1px solid var(--gray-200)' }}>
              <span style={{ color: 'var(--ink-light)' }}>{l}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={start}>🔄 Rejouer</button>
          <button className="btn btn-secondary" onClick={onBack}>← Menu</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  /* ── PLAYING ── */
  const q = qs[idx % qs.length];
  const tc = timeLeft <= 10 ? '#e63946' : timeLeft <= 20 ? '#ff9f1c' : 'var(--gold-light)';
  return (
    <div className="page-content">
      {flash && (
        <div style={{ position: 'fixed', top: '18%', left: '50%', transform: 'translateX(-50%)', background: flash.color, color: 'white', borderRadius: 8, padding: '.4rem 1.2rem', fontWeight: 700, fontSize: '1.3rem', pointerEvents: 'none', zIndex: 99, animation: 'pop .25s ease both' }}>
          {flash.text}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: tc, fontWeight: 700 }}>{timeLeft}s</div>
        <div style={{ textAlign: 'center' }}>
          <div className="text-tiny">COMBO</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: combo > 0 ? '#ff9f1c' : 'var(--gray-400)' }}>×{combo}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="text-tiny">SCORE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold-light)' }}>{score}</div>
        </div>
      </div>
      <div className="xp-bar-track" style={{ marginBottom: '1rem', height: 8 }}>
        <div className="xp-bar-fill" style={{ width: `${(timeLeft/60)*100}%`, background: tc, transition: 'width 1s linear, background .3s' }} />
      </div>
      <div className="card-white" style={{ minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--ink)', lineHeight: 1.5 }}>{q?.q}</p>
      </div>
      {q?.type === 'tf' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
          <button onClick={() => answer('Vrai')} style={{ padding: '1rem', borderRadius: 8, border: 'none', background: 'var(--sage)', color: 'white', fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>✓ Vrai</button>
          <button onClick={() => answer('Faux')} style={{ padding: '1rem', borderRadius: 8, border: 'none', background: 'var(--crimson)', color: 'white', fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>✗ Faux</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <input className="game-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && answer(input)} autoFocus placeholder="Répondre..." />
          <button className="btn btn-primary" onClick={() => answer(input)}>→</button>
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default SpeedrunGame;
