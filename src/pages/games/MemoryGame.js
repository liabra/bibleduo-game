import React, { useState, useEffect } from 'react';
import BottomNav from '../../components/BottomNav';
import { MEMORY_PAIRS } from '../../data/gamesData';
import { shuffle } from './shared';

const MemoryGame = ({ onBack, onXP }) => {
  const makeCards = () =>
    shuffle(
      MEMORY_PAIRS.slice(0, 8).flatMap((pair, i) => [
        { id: `a${i}`, pairId: i, text: pair.a, flipped: false, matched: false },
        { id: `b${i}`, pairId: i, text: pair.b, flipped: false, matched: false },
      ])
    );

  const [cards, setCards] = useState(makeCards);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [shakePair, setShakePair] = useState(null);

  // Check win condition whenever cards change
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) setDone(true);
  }, [cards]);

  const flip = (id) => {
    if (selected.length === 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    const newSel = [...selected, id];
    setSelected(newSel);

    if (newSel.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newSel.map(sid => newCards.find(c => c.id === sid));

      if (a.pairId === b.pairId) {
        // Match found
        setTimeout(() => {
          setCards(c => c.map(x => newSel.includes(x.id) ? { ...x, matched: true } : x));
          setSelected([]);
        }, 500);
      } else {
        // No match — shake and flip back
        setShakePair(newSel);
        setTimeout(() => {
          setCards(c => c.map(x => newSel.includes(x.id) ? { ...x, flipped: false } : x));
          setSelected([]);
          setShakePair(null);
        }, 900);
      }
    }
  };

  const reset = () => {
    setCards(makeCards());
    setSelected([]);
    setMoves(0);
    setDone(false);
    setShakePair(null);
  };

  if (done) {
    const xp = Math.max(10, 120 - moves * 5);
    onXP(xp);
    return (
      <div className="page-content" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>🏆</div>
        <h2 style={{ color: 'var(--gold-light)', margin: '1rem 0' }}>Toutes les paires trouvées !</h2>
        <div className="card-white" style={{ marginBottom: '1rem' }}>
          {[['Nombre de coups', moves], ['XP gagnés', `+${xp}`]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid var(--gray-200)' }}>
              <span style={{ color: 'var(--ink-light)' }}>{l}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" onClick={reset} style={{ marginRight: '.5rem' }}>🔄 Rejouer</button>
        <button className="btn btn-secondary" onClick={onBack}>← Menu</button>
        <BottomNav />
      </div>
    );
  }

  const matchedCount = cards.filter(c => c.matched).length / 2;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Retour</button>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)' }}>🔄 {moves} coups</div>
        <div className="text-small">{matchedCount}/8 paires</div>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: '.85rem', marginBottom: '1rem' }}>
        Associe chaque personnage à son histoire biblique
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.35rem' }}>
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => flip(card.id)}
            style={{
              height: 78, borderRadius: 8,
              cursor: card.matched ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '.25rem', fontSize: '.68rem', fontWeight: 600,
              transition: 'all .3s',
              background: card.matched
                ? 'rgba(45,106,79,.25)'
                : card.flipped ? 'var(--parch)' : 'rgba(201,168,76,.1)',
              border: `1.5px solid ${card.matched ? 'var(--sage)' : card.flipped ? 'var(--gold)' : 'rgba(201,168,76,.2)'}`,
              color: card.matched ? 'var(--sage)' : card.flipped ? 'var(--ink)' : 'transparent',
              animation: shakePair?.includes(card.id) ? 'shake .4s ease' : 'none',
            }}
          >
            {(card.flipped || card.matched) ? card.text : '📜'}
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default MemoryGame;
