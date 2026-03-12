import React, { useState, useEffect, useRef } from 'react';
import BottomNav from '../../components/BottomNav';
import { BATTLE_QS } from '../../data/gamesData';
import { shuffle } from './shared';

const BattleGame = ({ onBack, onXP }) => {
  const [phase, setPhase] = useState('ready'); // ready | playing | done
  const [qs, setQs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState([0, 0]); // [player, cpu]
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [feedback, setFeedback] = useState(null); // { correct, opt, answer }
  const timerRef = useRef(null);

  const start = () => {
    setQs(shuffle(BATTLE_QS));
    setIdx(0); setScores([0, 0]); setCombo(0); setTimeLeft(10); setFeedback(null);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing' || feedback) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setScores(s => [s[0], s[1] + 8]);
          setCombo(0);
          setTimeout(() => {
            setIdx(i => {
              const next = i + 1;
              if (next >= qs.length) { setPhase('done'); return i; }
              setTimeLeft(10);
              return next;
            });
          }, 500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, feedback, qs.length]);

  const answer = (opt) => {
    clearInterval(timerRef.current);
    const q = qs[idx];
    const correct = opt === q.a;
    const pts = correct ? 10 + combo * 3 + Math.ceil(timeLeft * 0.5) : 0;
    setFeedback({ correct, opt, answer: q.a });
    setScores(s => [s[0] + pts, s[1] + (correct ? 0 : 8)]);
    if (correct) setCombo(c => c + 1); else setCombo(0);
    setTimeout(() => {
      setFeedback(null);
      if (idx >= qs.length - 1) setPhase('done');
      else { setIdx(i => i + 1); setTimeLeft(10); }
    }, 1200);
  };

  // Special attack: spend 30 player points to remove 15 CPU points
  const useAttack = () => {
    if (scores[0] < 30) return;
    setScores(s => [s[0] - 30, Math.max(0, s[1] - 15)]);
  };

  if (phase === 'ready') return (
    <div className="page-content">
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: '1rem' }}>← Retour</button>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '4rem' }}>⚔️</div>
        <h2>Bible Battle</h2>
        <p className="text-small mt-1">Toi vs IA · 10s par question · Combos & attaques spéciales</p>
      </div>
      <div className="card" style={{ marginBottom: '1rem', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '.75rem', textAlign: 'center' }}>
        {[['⚡', '10s/question'], ['🔥', 'Combos ×3'], ['⚔️', 'Attaque spéciale'], ['🏆', '100 XP si victoire']].map(([icon, label]) => (
          <div key={label}>
            <div style={{ fontSize: '1.4rem' }}>{icon}</div>
            <div className="text-small mt-1">{label}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary w-full" style={{ padding: '1rem', fontSize: '1.1rem' }} onClick={start}>
        ⚔️ Au combat !
      </button>
      <BottomNav />
    </div>
  );

  if (phase === 'done') {
    const won = scores[0] > scores[1];
    const xp = won ? 100 : 40;
    onXP(xp);
    return (
      <div className="page-content" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem' }}>{won ? '🏆' : '💪'}</div>
        <h2 style={{ color: won ? 'var(--gold-light)' : 'var(--gray-400)', margin: '1rem 0' }}>
          {won ? 'Victoire !' : 'Défaite… Retentez !'}
        </h2>
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
          {[['Vous 🙋', scores[0]], ['IA 🤖', scores[1]]].map(([label, s]) => (
            <div key={label} style={{ textAlign: 'center', padding: '.75rem' }}>
              <div className="text-small">{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--gold-light)' }}>{s}</div>
            </div>
          ))}
        </div>
        <p style={{ color: 'var(--sage-light)', marginBottom: '1rem' }}>+{xp} XP</p>
        <button className="btn btn-primary" onClick={() => setPhase('ready')} style={{ marginRight: '.5rem' }}>🔄 Rejouer</button>
        <button className="btn btn-secondary" onClick={onBack}>← Menu</button>
        <BottomNav />
      </div>
    );
  }

  const q = qs[idx];
  const timerColor = timeLeft <= 3 ? 'var(--crimson)' : timeLeft <= 6 ? 'orange' : 'var(--gold-light)';

  return (
    <div className="page-content">
      {/* Scoreboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '.5rem', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ textAlign: 'center', padding: '.5rem', background: 'rgba(45,106,79,.15)', borderRadius: 8 }}>
          <div className="text-small">VOUS</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--sage-light)' }}>{scores[0]}</div>
          {combo > 1 && <div style={{ fontSize: '.65rem', color: 'orange' }}>🔥×{combo}</div>}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', color: timerColor, fontSize: '1.8rem', fontWeight: 700 }}>{timeLeft}</div>
          <div className="text-small">Q{idx + 1}/{qs.length}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '.5rem', background: 'rgba(139,26,26,.15)', borderRadius: 8 }}>
          <div className="text-small">IA 🤖</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#f87171' }}>{scores[1]}</div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="xp-bar-track" style={{ marginBottom: '1rem' }}>
        <div className="xp-bar-fill" style={{ width: `${(timeLeft / 10) * 100}%`, background: timerColor, transition: 'width 1s linear' }} />
      </div>

      {/* Question */}
      <div className="card-white" style={{
        minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1rem', textAlign: 'center',
        border: feedback ? `2px solid ${feedback.correct ? 'var(--sage)' : 'var(--crimson)'}` : undefined,
        transition: 'border-color .3s',
      }}>
        {feedback
          ? <div style={{ fontSize: '2rem' }}>{feedback.correct ? '✅' : '❌'}</div>
          : <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--ink)' }}>{q?.q}</p>
        }
      </div>

      {/* Answer buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem', marginBottom: '.75rem' }}>
        {q?.opts.map(opt => (
          <button key={opt} onClick={() => !feedback && answer(opt)} disabled={!!feedback} style={{
            background: feedback
              ? (opt === q.a ? 'rgba(45,106,79,.2)' : opt === feedback.opt && !feedback.correct ? 'rgba(139,26,26,.2)' : 'rgba(253,246,227,.5)')
              : 'rgba(253,246,227,.5)',
            border: `1.5px solid ${feedback ? (opt === q.a ? 'var(--sage)' : 'var(--gray-200)') : 'var(--gray-200)'}`,
            borderRadius: 8, padding: '.65rem .5rem',
            cursor: feedback ? 'default' : 'pointer',
            color: 'var(--ink)', fontSize: '.85rem', transition: 'all .15s',
          }}>{opt}</button>
        ))}
      </div>

      {/* Special attack button (unlocked at 30 pts) */}
      {scores[0] >= 30 && !feedback && (
        <button className="btn w-full" onClick={useAttack} style={{
          background: 'rgba(255,159,28,.15)', border: '1px solid rgba(255,159,28,.4)',
          color: '#ff9f1c', fontSize: '.85rem',
        }}>
          ⚔️ Attaque Spéciale ! (-30 pts → IA perd 15 pts)
        </button>
      )}
      <BottomNav />
    </div>
  );
};

export default BattleGame;
