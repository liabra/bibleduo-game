import React, { useState, useEffect, useRef, useCallback } from 'react';
import BottomNav from '../../components/BottomNav';
import { SPEEDRUN_QS } from '../../data/gamesData';
import { shuffle } from './shared';

const SpeedrunGame = ({ onBack, onXP }) => {
  const [phase, setPhase] = useState('ready'); // ready | running | done
  const [qs, setQs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [maxCombo, setMaxCombo] = useState(0);
  const [flashes, setFlashes] = useState([]);
  const timerRef = useRef(null);

  const addFlash = useCallback((text, color) => {
    const id = Date.now();
    setFlashes(f => [...f, { text, color, id }]);
    setTimeout(() => setFlashes(f => f.filter(x => x.id !== id)), 800);
  }, []);

  const start = () => {
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
    const correct = ans.trim().toLowerCase() === q.a.toLowerCase();
    if (correct) {
      const pts = 10 + combo * 5;
      setScore(s => s + pts);
      setCombo(c => { const n = c + 1; setMaxCombo(m => Math.max(m, n)); return n; });
      addFlash(`+${pts} ✓`, '#40916c');
    } else {
      setCombo(0);
      addFlash('✗', '#e63946');
    }
    setInput('');
    setIdx(i => i + 1);
  }, [qs, idx, combo, addFlash]);

  if (phase === 'ready') return (
    <div className="page-content">
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: '1rem' }}>← Retour</button>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '4rem' }}>⚡</div>
        <h2>Bible Speedrun</h2>
        <p className="text-small mt-1">60 secondes · Maximum de bonnes réponses · Combos explosifs</p>
      </div>
      <div className="card" style={{ marginBottom: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.75rem', textAlign: 'center' }}>
        {[['🕐', '60 secondes'], ['🔥', '+5 pts/combo'], ['⭐', 'XP selon score']].map(([icon, label]) => (
          <div key={label}>
            <div style={{ fontSize: '1.5rem' }}>{icon}</div>
            <div className="text-small mt-1">{label}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary w-full" style={{ padding: '1rem', fontSize: '1.1rem' }} onClick={start}>
        🚀 Lancer !
      </button>
      <BottomNav />
    </div>
  );

  if (phase === 'done') {
    const xp = Math.round(score * 0.8);
    onXP(xp);
    return (
      <div className="page-content" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>🏁</div>
        <h2 style={{ color: 'var(--gold-light)', margin: '1rem 0' }}>Temps écoulé !</h2>
        <div className="card-white" style={{ marginBottom: '1rem' }}>
          {[['Score', `${score} pts`], ['Meilleur combo', `×${maxCombo}`], ['XP gagnés', `+${xp}`]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid var(--gray-200)' }}>
              <span style={{ color: 'var(--ink-light)' }}>{l}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => setPhase('ready')} style={{ marginRight: '.5rem' }}>🔄 Rejouer</button>
        <button className="btn btn-secondary" onClick={onBack}>← Menu</button>
        <BottomNav />
      </div>
    );
  }

  const q = qs[idx % qs.length];
  const timerColor = timeLeft <= 10 ? 'var(--crimson)' : timeLeft <= 20 ? 'orange' : 'var(--gold-light)';

  return (
    <div className="page-content">
      {flashes.map(f => (
        <div key={f.id} style={{
          position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
          background: f.color, color: 'white', borderRadius: 8, padding: '.4rem 1rem',
          fontWeight: 700, fontSize: '1.2rem', pointerEvents: 'none', zIndex: 99,
        }}>{f.text}</div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: timerColor, fontWeight: 700 }}>{timeLeft}s</div>
        <div style={{ textAlign: 'center' }}>
          <div className="text-small">COMBO</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: combo > 0 ? 'orange' : 'var(--gray-400)' }}>×{combo}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="text-small">SCORE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold-light)' }}>{score}</div>
        </div>
      </div>

      <div className="xp-bar-track" style={{ marginBottom: '1rem' }}>
        <div className="xp-bar-fill" style={{ width: `${(timeLeft / 60) * 100}%`, background: timerColor, transition: 'width 1s linear, background .3s' }} />
      </div>

      <div className="card-white" style={{ minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--ink)' }}>{q?.q}</p>
      </div>

      {q?.type === 'tf' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
          {q.opts.map(opt => (
            <button key={opt} onClick={() => answer(opt)} style={{
              padding: '1rem', fontSize: '1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontFamily: 'var(--font-display)',
              background: opt === 'Vrai' ? 'var(--sage)' : 'var(--crimson)', color: 'white',
            }}>{opt}</button>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && answer(input)}
            autoFocus placeholder="Répondre..."
            style={{
              flex: 1, background: 'rgba(255,255,255,.08)',
              border: '1.5px solid rgba(201,168,76,.3)', borderRadius: 8,
              color: 'var(--parch)', padding: '.7rem 1rem', fontSize: '1rem', outline: 'none',
            }}
          />
          <button className="btn btn-primary" onClick={() => answer(input)}>→</button>
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default SpeedrunGame;
