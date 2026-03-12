import React, { useState, useEffect, useRef } from 'react';
import BottomNav from '../../components/BottomNav';
import { BATTLE_QS } from '../../data/gamesData';
import { shuffle } from './shared';

const BattleGame = ({ onBack, onXP }) => {
  const [phase, setPhase]       = useState('ready');
  const [qs, setQs]             = useState([]);
  const [idx, setIdx]           = useState(0);
  const [scores, setScores]     = useState([0, 0]);
  const [combo, setCombo]       = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [fb, setFb]             = useState(null); // { ok, opt, correct }
  const timerRef = useRef(null);
  const xpFiredRef = useRef(false);

  const start = () => {
    xpFiredRef.current = false;
    setQs(shuffle(BATTLE_QS));
    setIdx(0); setScores([0,0]); setCombo(0); setTimeLeft(10); setFb(null);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing' || fb) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setScores(s => [s[0], s[1] + 8]);
          setCombo(0);
          setTimeout(() => setIdx(i => {
            const next = i + 1;
            if (next >= qs.length) { setPhase('done'); return i; }
            setTimeLeft(10); return next;
          }), 600);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, fb, qs.length]);

  const answer = (opt) => {
    clearInterval(timerRef.current);
    const q = qs[idx];
    const ok = opt === q.a;
    const pts = ok ? 10 + combo * 3 + Math.ceil(timeLeft * .5) : 0;
    setFb({ ok, opt, correct: q.a });
    setScores(s => [s[0] + pts, s[1] + (ok ? 0 : 8)]);
    if (ok) setCombo(c => c + 1); else setCombo(0);
    setTimeout(() => {
      setFb(null);
      if (idx >= qs.length - 1) setPhase('done');
      else { setIdx(i => i + 1); setTimeLeft(10); }
    }, 1200);
  };

  const useAttack = () => {
    if (scores[0] < 30) return;
    setScores(s => [s[0] - 30, Math.max(0, s[1] - 15)]);
  };

  /* ── READY ── */
  if (phase === 'ready') return (
    <div className="page-content">
      <button className="btn btn-ghost" onClick={onBack}>← Retour</button>
      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <div style={{ fontSize: '4rem' }}>⚔️</div>
        <h2 style={{ margin: '.5rem 0 .3rem' }}>Bible Battle</h2>
        <p className="text-small">Toi vs IA · 10s/question · Attaques spéciales</p>
      </div>
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', textAlign: 'center', marginBottom: '1.5rem' }}>
        {[['⚡','10s/Q'], ['🔥','Combos +3'], ['⚔️','Attaque'], ['🏆','100 XP']].map(([ic,lb]) => (
          <div key={lb}><div style={{ fontSize: '1.3rem' }}>{ic}</div><div className="text-tiny" style={{ marginTop: '.2rem' }}>{lb}</div></div>
        ))}
      </div>
      <button className="btn btn-primary w-full" style={{ padding: '1rem', fontSize: '1.1rem' }} onClick={start}>⚔️ Au combat !</button>
      <BottomNav />
    </div>
  );

  /* ── DONE ── */
  if (phase === 'done') {
    const won = scores[0] > scores[1];
    const xp = won ? 100 : 40;
    if (!xpFiredRef.current) { xpFiredRef.current = true; onXP(xp); }
    return (
      <div className="page-content" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem' }}>{won ? '🏆' : '💪'}</div>
        <h2 style={{ color: won ? 'var(--gold-light)' : 'var(--gray-400)', margin: '.75rem 0 1.25rem' }}>
          {won ? 'Victoire !' : 'Défaite… Retentez !'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '1.25rem' }}>
          {[['Vous 🙋', scores[0], 'rgba(45,106,79,.15)', 'var(--sage-light)'], ['IA 🤖', scores[1], 'rgba(139,26,26,.15)', '#f87171']].map(([l,s,bg,c]) => (
            <div key={l} style={{ background: bg, borderRadius: 12, padding: '.75rem', textAlign: 'center' }}>
              <div className="text-small" style={{ marginBottom: '.2rem' }}>{l}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: c }}>{s}</div>
            </div>
          ))}
        </div>
        <p style={{ color: 'var(--sage-light)', marginBottom: '1rem' }}>+{xp} XP</p>
        <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={start}>🔄 Rejouer</button>
          <button className="btn btn-secondary" onClick={onBack}>← Menu</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  /* ── PLAYING ── */
  const q = qs[idx];
  const tc = timeLeft <= 3 ? '#e63946' : timeLeft <= 6 ? '#ff9f1c' : 'var(--gold-light)';
  return (
    <div className="page-content">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '.4rem', alignItems: 'center', marginBottom: '.75rem' }}>
        <div style={{ background: 'rgba(45,106,79,.15)', borderRadius: 10, padding: '.5rem', textAlign: 'center' }}>
          <div className="text-tiny">VOUS</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--sage-light)' }}>{scores[0]}</div>
          {combo > 1 && <div style={{ fontSize: '.6rem', color: '#ff9f1c' }}>🔥×{combo}</div>}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', color: tc, fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{timeLeft}</div>
          <div className="text-tiny">Q{idx+1}/{qs.length}</div>
        </div>
        <div style={{ background: 'rgba(139,26,26,.15)', borderRadius: 10, padding: '.5rem', textAlign: 'center' }}>
          <div className="text-tiny">IA 🤖</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#f87171' }}>{scores[1]}</div>
        </div>
      </div>
      <div className="xp-bar-track" style={{ marginBottom: '1rem', height: 6 }}>
        <div className="xp-bar-fill" style={{ width: `${(timeLeft/10)*100}%`, background: tc, transition: 'width 1s linear' }} />
      </div>
      <div className="card-white" style={{ minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', textAlign: 'center', border: fb ? `2px solid ${fb.ok ? 'var(--sage)' : 'var(--crimson)'}` : undefined, transition: 'border-color .3s' }}>
        {fb
          ? <div style={{ fontSize: '2.5rem' }}>{fb.ok ? '✅' : '❌'}</div>
          : <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.5 }}>{q?.q}</p>
        }
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem', marginBottom: '.75rem' }}>
        {q?.opts.map(opt => (
          <button key={opt} disabled={!!fb}
            className={`answer-btn ${fb ? (opt === q.a ? 'correct' : opt === fb.opt && !fb.ok ? 'wrong' : '') : ''}`}
            onClick={() => !fb && answer(opt)}>
            {opt}
          </button>
        ))}
      </div>
      {scores[0] >= 30 && !fb && (
        <button onClick={useAttack} style={{ width: '100%', padding: '.6rem', borderRadius: 8, background: 'rgba(255,159,28,.12)', border: '1px solid rgba(255,159,28,.35)', color: '#ff9f1c', cursor: 'pointer', fontSize: '.85rem' }}>
          ⚔️ Attaque spéciale ! (−30 pts → IA perd 15 pts)
        </button>
      )}
      <BottomNav />
    </div>
  );
};

export default BattleGame;
