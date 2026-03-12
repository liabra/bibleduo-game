import React, { useState, useEffect } from 'react';
import BottomNav from '../../components/BottomNav';
import { MEMORY_PAIRS } from '../../data/gamesData';
import { shuffle } from './shared';

const makeCards = () =>
  shuffle(MEMORY_PAIRS.slice(0, 8).flatMap((pair, i) => [
    { id: `a${i}`, pairId: i, text: pair.a, flipped: false, matched: false },
    { id: `b${i}`, pairId: i, text: pair.b, flipped: false, matched: false },
  ]));

const MemoryGame = ({ onBack, onXP }) => {
  const [cards, setCards]       = useState(makeCards);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves]       = useState(0);
  const [done, setDone]         = useState(false);
  const [shakePair, setShakePair] = useState(null);
  const xpFiredRef = React.useRef(false);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) setDone(true);
  }, [cards]);

  const flip = (id) => {
    if (selected.length === 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    const nc = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(nc);
    const ns = [...selected, id];
    setSelected(ns);
    if (ns.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = ns.map(sid => nc.find(c => c.id === sid));
      if (a.pairId === b.pairId) {
        setTimeout(() => { setCards(c => c.map(x => ns.includes(x.id) ? { ...x, matched: true } : x)); setSelected([]); }, 500);
      } else {
        setShakePair(ns);
        setTimeout(() => { setCards(c => c.map(x => ns.includes(x.id) ? { ...x, flipped: false } : x)); setSelected([]); setShakePair(null); }, 900);
      }
    }
  };

  const reset = () => { xpFiredRef.current = false; setCards(makeCards()); setSelected([]); setMoves(0); setDone(false); setShakePair(null); };
  const matched = cards.filter(c => c.matched).length / 2;

  if (done) {
    const xp = Math.max(10, 120 - moves * 5);
    if (!xpFiredRef.current) { xpFiredRef.current = true; onXP(xp); }
    return (
      <div className="page-content" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem' }}>🏆</div>
        <h2 style={{ margin: '.75rem 0 1.25rem' }}>Toutes les paires !</h2>
        <div className="card-white" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          {[['Nombre de coups', moves], ['XP gagnés', `+${xp}`]].map(([l,v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '.6rem 0', borderBottom: '1px solid var(--gray-200)' }}>
              <span style={{ color: 'var(--ink-light)' }}>{l}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={reset}>🔄 Rejouer</button>
          <button className="btn btn-secondary" onClick={onBack}>← Menu</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Retour</button>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)' }}>🔄 {moves} coups</div>
        <div className="text-small">{matched}/8</div>
      </div>
      <div className="xp-bar-track" style={{ marginBottom: '.75rem' }}>
        <div className="xp-bar-fill" style={{ width: `${(matched/8)*100}%` }} />
      </div>
      <p className="text-small" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Associe chaque personnage à son histoire
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.4rem' }}>
        {cards.map(card => (
          <div key={card.id} onClick={() => flip(card.id)}
            className={`memory-card ${card.matched ? 'matched' : card.flipped ? 'flipped' : ''}`}
            style={{ animation: shakePair?.includes(card.id) ? 'shake .45s ease' : 'none' }}>
            {(card.flipped || card.matched) ? card.text : '📜'}
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default MemoryGame;
