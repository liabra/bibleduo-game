import React, { useState } from 'react';
import BottomNav from '../../components/BottomNav';
import ScoreCard from '../../components/ScoreCard';
import { useGame } from '../../context/GameContext';
import { MEMORY_PAIRS } from '../../data/gamesData';
import { shuffle, ShareBtn, ScoreImageBtn, RulesBtn } from './shared';

// ── Fix : shuffle complet des PAIRES à chaque partie, pas slice fixe ──────────
// On prend les 12 paires et on les mélange vraiment, puis on tire 8 différentes
const makeCards = () => {
  const picked = shuffle(MEMORY_PAIRS).slice(0, 8);   // 8 paires aléatoires parmi 12
  return shuffle(
    picked.flatMap((pair, i) => [
      { id: `a${i}`, pairId: i, text: pair.a, flipped: false, matched: false },
      { id: `b${i}`, pairId: i, text: pair.b, flipped: false, matched: false },
    ])
  );
};

// Wrapper pour forcer le re-mount complet via key
const MemoryGame = ({ onBack, onXP }) => {
  const [gameKey, setGameKey] = useState(0);
  return <MemoryBoard key={gameKey} onBack={onBack} onXP={onXP} onReplay={() => setGameKey(k => k + 1)} />;
};

const MemoryBoard = ({ onBack, onXP, onReplay }) => {
  const { profile } = useGame();
  const [cards, setCards]             = useState(makeCards);   // ← nouveau à chaque montage
  const [selected, setSelected]       = useState([]);
  const [moves, setMoves]             = useState(0);
  const [done, setDone]               = useState(false);
  const [shakePair, setShakePair]     = useState(null);
  const [wrongPair, setWrongPair]     = useState(null);       // correction immédiate
  const [copied, setCopied]           = useState(false);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const xpFiredRef = React.useRef(false);

  React.useEffect(() => {
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
        setTimeout(() => {
          setCards(c => c.map(x => ns.includes(x.id) ? { ...x, matched: true } : x));
          setSelected([]);
          setWrongPair(null);
        }, 500);
      } else {
        // Mauvaise paire → afficher les deux textes brièvement
        setWrongPair({ a: a.text, b: b.text });
        setShakePair(ns);
        setTimeout(() => {
          setCards(c => c.map(x => ns.includes(x.id) ? { ...x, flipped: false } : x));
          setSelected([]);
          setShakePair(null);
          setWrongPair(null);
        }, 1100);
      }
    }
  };

  const perfect = moves <= 8;
  const xp      = perfect ? 120 : Math.max(40, 120 - (moves - 8) * 5);

  if (done && !xpFiredRef.current) {
    xpFiredRef.current = true;
    onXP(xp);
  }

  const copyScore = () => {
    const text = `🃏 Bible Memory — ${profile.name || 'Joueur'}\n✅ ${cards.filter(c => c.matched).length / 2}/8 paires\n🎯 ${moves} coups${perfect ? ' 🏆 Parfait !' : ''}\n⭐ +${xp} XP\n🎮 Bible Games`;
    navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  if (done) return (
    <div className="page-content">
      {showScoreCard && (
        <ScoreCard
          gameName="Bible Memory" playerName={profile.name || 'Joueur'} playerAvatar={profile.avatar}
          score={`${moves} coups`} xp={xp}
          details={[{ label: 'Paires trouvées', value: '8/8' }, { label: 'Performance', value: perfect ? '🏆 Parfait' : `${moves} coups` }]}
          onClose={() => setShowScoreCard(false)}
        />
      )}
      <div style={{ textAlign:'center', marginBottom:'1.25rem' }}>
        <div style={{ fontSize:'3rem' }}>🎉</div>
        <h2 style={{ margin:'.5rem 0' }}>{perfect ? 'Parfait !' : 'Terminé !'}</h2>
        <p className="text-small">Toutes les paires trouvées</p>
      </div>
      <div className="card-white" style={{ marginBottom:'1rem' }}>
        {[['Paires trouvées','8/8'],['Coups',moves],['XP gagnés',`+${xp}`]].map(([l,v]) => (
          <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'.55rem 0', borderBottom:'1px solid var(--gray-200)' }}>
            <span style={{ color:'var(--ink-light)' }}>{l}</span>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'var(--ink)' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
        <button className="btn btn-primary" onClick={onReplay}>🔄 Rejouer</button>
        <ShareBtn onClick={copyScore} copied={copied} />
        <ScoreImageBtn onClick={() => setShowScoreCard(true)} />
        <button className="btn btn-secondary" onClick={onBack}>← Menu</button>
      </div>
      <BottomNav />
    </div>
  );

  return (
    <div className="page-content">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.75rem' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Retour</button>
        <span style={{ fontFamily:'var(--font-display)', color:'var(--gold-light)', fontSize:'.9rem' }}>BIBLE MEMORY</span>
        <div style={{ display:'flex', gap:'.4rem', alignItems:'center' }}>
          <span style={{ fontFamily:'var(--font-display)', color:'var(--gold-light)', fontSize:'.9rem' }}>{moves} coups</span>
          <RulesBtn gameId="memory" />
        </div>
      </div>

      {/* Feedback mauvaise paire */}
      {wrongPair && (
        <div style={{ background:'rgba(230,57,70,.12)', border:'1.5px solid var(--crimson)', borderRadius:10, padding:'.6rem 1rem', marginBottom:'.75rem', fontSize:'.83rem', animation:'fadeUp .15s ease both' }}>
          <span style={{ color:'var(--crimson)', fontWeight:700 }}>❌ Pas une paire : </span>
          <span style={{ color:'var(--gray-400)' }}>{wrongPair.a}</span>
          <span style={{ color:'var(--gray-400)' }}> ≠ </span>
          <span style={{ color:'var(--gray-400)' }}>{wrongPair.b}</span>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'.4rem', marginBottom:'1rem' }}>
        {cards.map(card => (
          <div key={card.id}
            onClick={() => flip(card.id)}
            style={{
              height: 72, borderRadius: 10, cursor: card.matched ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '.3rem',
              fontSize: '.65rem', lineHeight: 1.3, fontWeight: 600,
              transition: 'all .25s',
              background: card.matched
                ? 'rgba(45,107,79,.25)'
                : card.flipped
                  ? 'var(--parch)'
                  : shakePair?.includes(card.id)
                    ? 'rgba(230,57,70,.2)'
                    : 'rgba(201,168,76,.1)',
              border: card.matched
                ? '1.5px solid rgba(45,107,79,.4)'
                : card.flipped
                  ? '1.5px solid rgba(201,168,76,.4)'
                  : '1.5px solid rgba(201,168,76,.15)',
              color: card.matched ? 'var(--sage-light)' : card.flipped ? 'var(--ink)' : 'transparent',
              transform: shakePair?.includes(card.id) ? 'scale(.95)' : 'scale(1)',
            }}
          >
            {card.matched || card.flipped ? card.text : '?'}
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default MemoryGame;
