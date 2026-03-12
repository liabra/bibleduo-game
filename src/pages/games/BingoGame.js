import React, { useState, useCallback } from 'react';
import BottomNav from '../../components/BottomNav';
import { BINGO_CHALLENGES } from '../../data/gamesData';
import { shuffle } from './shared';

const makeGrid = () => {
  const pool = shuffle(BINGO_CHALLENGES.filter(c => c.type !== 'free')).slice(0, 24);
  const free = BINGO_CHALLENGES.find(c => c.type === 'free');
  return [...pool.slice(0, 12), free, ...pool.slice(12, 24)];
};

const checkBingo = (completed) => {
  const lines = [];
  for (let r = 0; r < 5; r++)
    if ([0,1,2,3,4].map(c => r*5+c).every(i => completed.has(i))) lines.push(`r${r}`);
  for (let c = 0; c < 5; c++)
    if ([0,1,2,3,4].map(r => r*5+c).every(i => completed.has(i))) lines.push(`c${c}`);
  if ([0,6,12,18,24].every(i => completed.has(i))) lines.push('d1');
  if ([4,8,12,16,20].every(i => completed.has(i))) lines.push('d2');
  return lines;
};

const BingoGame = ({ onBack, onXP }) => {
  const [cells]                   = useState(makeGrid);
  const [completed, setCompleted] = useState(new Set([12])); // free center
  const [activeIdx, setActiveIdx] = useState(null);
  const [input, setInput]         = useState('');
  const [bingoLines, setBingoLines] = useState([]);
  const [xpTotal, setXpTotal]     = useState(0);

  const completeCell = useCallback((idx, baseXp = 15) => {
    const nc = new Set([...completed, idx]);
    setCompleted(nc);
    const newLines = checkBingo(nc);
    const newBingos = newLines.filter(l => !bingoLines.includes(l));
    const earned = baseXp + newBingos.length * 50;
    setXpTotal(t => t + earned);
    onXP(earned);
    setBingoLines(newLines);
    setActiveIdx(null);
    setInput('');
  }, [completed, bingoLines, onXP]);

  const handleClick = (idx) => {
    if (completed.has(idx)) return;
    if (cells[idx].type === 'free') { completeCell(idx, 5); return; }
    setActiveIdx(activeIdx === idx ? null : idx);
    setInput('');
  };

  // FIX: validate takes the answer as a parameter instead of reading stale state
  const validateAnswer = (ans) => {
    if (activeIdx === null) return;
    const cell = cells[activeIdx];
    if (ans.trim().toLowerCase() === cell.a.toLowerCase()) {
      completeCell(activeIdx);
    }
  };

  const active = activeIdx !== null ? cells[activeIdx] : null;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Retour</button>
        <span style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)', fontSize: '.9rem' }}>BIBLE BINGO</span>
        <span style={{ color: 'var(--sage-light)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>+{xpTotal} XP</span>
      </div>

      {bingoLines.length > 0 && (
        <div className="card" style={{ background: 'rgba(201,168,76,.12)', borderColor: 'rgba(201,168,76,.4)', textAlign: 'center', marginBottom: '.75rem' }}>
          <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>🎉 BINGO ×{bingoLines.length} ! (+{bingoLines.length * 50} XP bonus)</span>
        </div>
      )}

      {/* 5×5 Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '.22rem', marginBottom: '1rem' }}>
        {cells.map((cell, i) => (
          <div key={i} onClick={() => handleClick(i)}
            className={`bingo-cell ${completed.has(i) ? 'completed' : activeIdx === i ? 'active' : ''}`}
            style={{ height: 58 }}>
            <span style={{ fontSize: '.85rem' }}>{completed.has(i) ? '✅' : cell.icon}</span>
            <span style={{ fontSize: '.48rem', color: completed.has(i) ? 'var(--sage-light)' : 'var(--gray-400)', marginTop: '.1rem', lineHeight: 1.2 }}>
              {cell.label}
            </span>
          </div>
        ))}
      </div>

      {/* Active challenge panel */}
      {active && (
        <div className="card" style={{ border: '1.5px solid rgba(201,168,76,.4)', animation: 'fadeUp .2s ease both' }}>
          <p style={{ fontWeight: 700, color: 'var(--gold-light)', marginBottom: '.75rem', fontSize: '.9rem' }}>
            {active.icon} {active.q}
          </p>

          {active.type === 'tf' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
              {['Vrai','Faux'].map(opt => (
                <button key={opt} onClick={() => validateAnswer(opt)} style={{ padding: '.7rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, background: opt === 'Vrai' ? 'var(--sage)' : 'var(--crimson)', color: 'white' }}>
                  {opt === 'Vrai' ? '✓ Vrai' : '✗ Faux'}
                </button>
              ))}
            </div>
          )}

          {active.type === 'mc' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              {active.opts.map(opt => (
                <button key={opt} className="answer-btn" onClick={() => validateAnswer(opt)}>{opt}</button>
              ))}
            </div>
          )}

          {active.type === 'text' && (
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <input className="game-input" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && validateAnswer(input)}
                autoFocus placeholder="Votre réponse..." />
              <button className="btn btn-primary" onClick={() => validateAnswer(input)}>✓</button>
            </div>
          )}

          <button className="btn btn-ghost" onClick={() => setActiveIdx(null)} style={{ marginTop: '.5rem', fontSize: '.8rem' }}>
            Annuler
          </button>
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default BingoGame;
