import React, { useState, useCallback } from 'react';
import BottomNav from '../../components/BottomNav';
import { BINGO_CHALLENGES } from '../../data/gamesData';
import { shuffle } from './shared';

// Build a 5×5 grid: 24 shuffled challenges + 1 free center cell at index 12
const makeGrid = () => {
  const pool = shuffle(BINGO_CHALLENGES.filter(c => c.type !== 'free')).slice(0, 24);
  const freeCell = BINGO_CHALLENGES.find(c => c.type === 'free');
  return [...pool.slice(0, 12), freeCell, ...pool.slice(12, 24)];
};

const checkBingoLines = (completed) => {
  const lines = [];
  for (let r = 0; r < 5; r++)
    if ([0,1,2,3,4].map(c => r*5+c).every(i => completed.has(i))) lines.push(`r${r}`);
  for (let c = 0; c < 5; c++)
    if ([0,1,2,3,4].map(r => r*5+c).every(i => completed.has(i))) lines.push(`c${c}`);
  if ([0,6,12,18,24].every(i => completed.has(i))) lines.push('diag1');
  if ([4,8,12,16,20].every(i => completed.has(i))) lines.push('diag2');
  return lines;
};

const BingoGame = ({ onBack, onXP }) => {
  const [cells] = useState(makeGrid);
  const [completed, setCompleted] = useState(new Set([12])); // center free
  const [activeIdx, setActiveIdx] = useState(null);
  const [input, setInput] = useState('');
  const [bingoLines, setBingoLines] = useState([]);
  const [xpTotal, setXpTotal] = useState(0);

  const completeCell = useCallback((idx, baseXp = 15) => {
    const nc = new Set([...completed, idx]);
    setCompleted(nc);
    const newLines = checkBingoLines(nc);
    const newBingos = newLines.filter(l => !bingoLines.includes(l));
    const earned = baseXp + newBingos.length * 50;
    setXpTotal(t => t + earned);
    onXP(earned);
    setBingoLines(newLines);
    setActiveIdx(null);
    setInput('');
  }, [completed, bingoLines, onXP]);

  const handleCellClick = (idx) => {
    if (completed.has(idx)) return;
    if (cells[idx].type === 'free') { completeCell(idx, 5); return; }
    setActiveIdx(idx);
    setInput('');
  };

  const validate = () => {
    if (activeIdx === null) return;
    const cell = cells[activeIdx];
    if (input.trim().toLowerCase() === cell.a.toLowerCase()) {
      completeCell(activeIdx);
    } else {
      setInput(''); // wrong — clear but keep challenge open
    }
  };

  const activeCell = activeIdx !== null ? cells[activeIdx] : null;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Retour</button>
        <span style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)', fontSize: '.9rem' }}>BIBLE BINGO</span>
        <div style={{ color: 'var(--sage-light)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>+{xpTotal} XP</div>
      </div>

      {bingoLines.length > 0 && (
        <div style={{
          background: 'rgba(201,168,76,.15)', border: '1px solid var(--gold)',
          borderRadius: 8, padding: '.5rem', textAlign: 'center', marginBottom: '.75rem',
          color: 'var(--gold-light)', fontWeight: 700,
        }}>
          🎉 BINGO × {bingoLines.length} !  (+{bingoLines.length * 50} XP bonus)
        </div>
      )}

      {/* 5×5 Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '.2rem', marginBottom: '1rem' }}>
        {cells.map((cell, i) => (
          <div key={i} onClick={() => handleCellClick(i)} style={{
            height: 62, borderRadius: 6,
            cursor: completed.has(i) ? 'default' : 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '.15rem',
            background: completed.has(i) ? 'rgba(45,106,79,.25)' : activeIdx === i ? 'rgba(201,168,76,.2)' : 'rgba(201,168,76,.06)',
            border: `1.5px solid ${completed.has(i) ? 'var(--sage)' : activeIdx === i ? 'var(--gold)' : 'rgba(201,168,76,.12)'}`,
            transition: 'all .2s',
          }}>
            <span style={{ fontSize: '.85rem' }}>{completed.has(i) ? '✅' : cell.icon}</span>
            <span style={{ fontSize: '.5rem', color: completed.has(i) ? 'var(--sage-light)' : 'var(--gray-400)', marginTop: '.1rem', lineHeight: 1.2 }}>
              {cell.label}
            </span>
          </div>
        ))}
      </div>

      {/* Active challenge panel */}
      {activeCell && (
        <div className="card" style={{ border: '1.5px solid rgba(201,168,76,.4)' }}>
          <p style={{ fontWeight: 700, color: 'var(--gold-light)', marginBottom: '.5rem', fontSize: '.9rem' }}>
            {activeCell.icon} {activeCell.q}
          </p>

          {activeCell.type === 'tf' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
              {['Vrai', 'Faux'].map(opt => (
                <button key={opt} onClick={() => { setInput(opt); setTimeout(validate, 50); }} style={{
                  padding: '.6rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontFamily: 'var(--font-display)',
                  background: opt === 'Vrai' ? 'var(--sage)' : 'var(--crimson)', color: 'white',
                }}>{opt}</button>
              ))}
            </div>
          )}

          {activeCell.type === 'mc' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              {activeCell.opts.map(opt => (
                <button key={opt} onClick={() => {
                  if (opt.toLowerCase() === activeCell.a.toLowerCase()) completeCell(activeIdx);
                  else setActiveIdx(null);
                }} style={{
                  background: 'rgba(253,246,227,.5)', border: '1px solid var(--gray-200)',
                  borderRadius: 6, padding: '.5rem .75rem', color: 'var(--ink)',
                  cursor: 'pointer', textAlign: 'left', fontSize: '.9rem',
                }}>{opt}</button>
              ))}
            </div>
          )}

          {activeCell.type === 'text' && (
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <input
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && validate()}
                autoFocus placeholder="Votre réponse..."
                style={{
                  flex: 1, background: 'rgba(255,255,255,.08)',
                  border: '1.5px solid rgba(201,168,76,.3)', borderRadius: 6,
                  color: 'var(--parch)', padding: '.6rem', fontSize: '.95rem', outline: 'none',
                }}
              />
              <button className="btn btn-primary" onClick={validate}>✓</button>
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
