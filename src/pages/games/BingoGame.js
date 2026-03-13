import React, { useState, useCallback } from 'react';
import BottomNav from '../../components/BottomNav';
import { BINGO_CHALLENGES } from '../../data/gamesData';
import ScoreCard from '../../components/ScoreCard';
import { useGame } from '../../context/GameContext';
import { shuffle, HintBubble, PauseOverlay, ShareBtn, ScoreImageBtn } from './shared';

// ── Fix : makeGrid appelé à chaque "Rejouer" via key, pas une seule fois ──────
const makeGrid = () => {
  const pool = shuffle(BINGO_CHALLENGES.filter(c => c.type !== 'free')).slice(0, 24);
  const free = BINGO_CHALLENGES.find(c => c.type === 'free');
  return [...pool.slice(0, 12), free, ...pool.slice(12, 24)];
};

const checkBingo = (completed) => {
  const lines = [];
  for (let r = 0; r < 5; r++) if ([0,1,2,3,4].map(c => r*5+c).every(i => completed.has(i))) lines.push(`r${r}`);
  for (let c = 0; c < 5; c++) if ([0,1,2,3,4].map(r => r*5+c).every(i => completed.has(i))) lines.push(`c${c}`);
  if ([0,6,12,18,24].every(i => completed.has(i))) lines.push('d1');
  if ([4,8,12,16,20].every(i => completed.has(i))) lines.push('d2');
  return lines;
};

// Composant interne réinitialisé via key à chaque "Rejouer"
const BingoBoard = ({ onBack, onXP, onReplay, correctionMode }) => {
  const { profile } = useGame();
  const [cells]                     = useState(makeGrid);   // ← appelé à chaque montage
  const [completed, setCompleted]   = useState(new Set([12]));
  const [activeIdx, setActiveIdx]   = useState(null);
  const [input, setInput]           = useState('');
  const [bingoLines, setBingoLines] = useState([]);
  const [xpTotal, setXpTotal]       = useState(0);
  const [paused, setPaused]         = useState(false);
  const [showHint, setShowHint]     = useState(false);
  const [copied, setCopied]         = useState(false);
  const [showScoreCard, setShowScoreCard] = useState(false);
  // Correction immédiate : feedback visuel sur la case
  const [wrongFlash, setWrongFlash] = useState(null);

  const completeCell = useCallback((idx, baseXp = 15) => {
    const nc = new Set([...completed, idx]);
    setCompleted(nc);
    const newLines  = checkBingo(nc);
    const newBingos = newLines.filter(l => !bingoLines.includes(l));
    const earned    = baseXp + newBingos.length * 50;
    setXpTotal(t => t + earned);
    onXP(earned);
    setBingoLines(newLines);
    setActiveIdx(null);
    setInput('');
    setShowHint(false);
  }, [completed, bingoLines, onXP]);

  const handleClick = (idx) => {
    if (completed.has(idx)) return;
    if (cells[idx].type === 'free') { completeCell(idx, 5); return; }
    if (activeIdx === idx) { setActiveIdx(null); setShowHint(false); return; }
    setActiveIdx(idx);
    setInput('');
    setShowHint(false);
  };

  const validateAnswer = (ans) => {
    if (activeIdx === null) return;
    const correct = cells[activeIdx].a.toLowerCase();
    if (ans.trim().toLowerCase() === correct) {
      completeCell(activeIdx);
    } else {
      // Mauvaise réponse
      if (correctionMode === 'immediate') {
        setWrongFlash({ idx: activeIdx, correct: cells[activeIdx].a, given: ans });
        setTimeout(() => { setWrongFlash(null); setActiveIdx(null); setInput(''); setShowHint(false); }, 2000);
      } else {
        // Mode résumé : on ferme juste la question, erreur visible en fin
        setActiveIdx(null);
        setInput('');
        setShowHint(false);
      }
    }
  };

  const handleShare = () => {
    const text = `🎯 Bible Bingo — ${profile.name || 'Joueur'}\n✅ ${completed.size - 1}/24 cases\n🎉 ${bingoLines.length} BINGO${bingoLines.length > 1 ? 's' : ''}\n⭐ +${xpTotal} XP\n🎮 Bible Games`;
    navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const active = activeIdx !== null ? cells[activeIdx] : null;

  return (
    <div className="page-content">
      {paused && <PauseOverlay onResume={() => setPaused(false)} onQuit={onBack} />}
      {showScoreCard && (
        <ScoreCard
          gameName="Bible Bingo" playerName={profile.name || 'Joueur'} playerAvatar={profile.avatar}
          score={`${completed.size - 1}/24`} xp={xpTotal}
          details={[{ label: 'Bingos', value: bingoLines.length }, { label: 'Cases validées', value: completed.size - 1 }]}
          onClose={() => setShowScoreCard(false)}
        />
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.75rem' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Retour</button>
        <span style={{ fontFamily:'var(--font-display)', color:'var(--gold-light)', fontSize:'.9rem' }}>BIBLE BINGO</span>
        <div style={{ display:'flex', gap:'.4rem', alignItems:'center' }}>
          <span style={{ color:'var(--sage-light)', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'.9rem' }}>+{xpTotal} XP</span>
          <button onClick={() => setPaused(true)} style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.1)', borderRadius:6, color:'var(--parch)', cursor:'pointer', padding:'.25rem .45rem', fontSize:'.8rem' }}>⏸</button>
        </div>
      </div>

      {bingoLines.length > 0 && (
        <div className="card" style={{ background:'rgba(201,168,76,.12)', borderColor:'rgba(201,168,76,.4)', textAlign:'center', marginBottom:'.75rem' }}>
          <span style={{ color:'var(--gold-light)', fontWeight:700 }}>🎉 BINGO ×{bingoLines.length} ! (+{bingoLines.length * 50} XP bonus)</span>
        </div>
      )}

      {/* Correction immédiate overlay */}
      {wrongFlash && (
        <div style={{ background:'rgba(230,57,70,.15)', border:'1.5px solid var(--crimson)', borderRadius:10, padding:'.75rem 1rem', marginBottom:'.75rem', animation:'fadeUp .2s ease both' }}>
          <div style={{ fontSize:'.85rem', color:'var(--crimson)', fontWeight:700, marginBottom:'.2rem' }}>❌ Mauvaise réponse</div>
          <div style={{ fontSize:'.8rem', color:'var(--gray-400)' }}>Ta réponse : <b>{wrongFlash.given || '(vide)'}</b></div>
          <div style={{ fontSize:'.85rem', color:'var(--sage-light)', marginTop:'.2rem' }}>✓ Bonne réponse : <b>{wrongFlash.correct}</b></div>
        </div>
      )}

      {/* Grille 5×5 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'.22rem', marginBottom:'1rem' }}>
        {cells.map((cell, i) => (
          <div key={i} onClick={() => handleClick(i)}
            className={`bingo-cell ${completed.has(i) ? 'completed' : activeIdx === i ? 'active' : ''}`}
            style={{ height:56 }}>
            <span style={{ fontSize:'.85rem' }}>{completed.has(i) ? '✅' : cell.icon}</span>
            <span style={{ fontSize:'.45rem', color:completed.has(i) ? 'var(--sage-light)' : 'var(--gray-400)', marginTop:'.08rem', lineHeight:1.2 }}>
              {cell.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.5rem' }}>
        <button className="btn btn-secondary" style={{ fontSize:'.8rem', padding:'.35rem .75rem' }} onClick={onReplay}>
          🔄 Nouvelle grille
        </button>
        <div style={{ display:'flex', gap:'.4rem' }}>
          <ShareBtn onClick={handleShare} copied={copied} />
          <ScoreImageBtn onClick={() => setShowScoreCard(true)} />
        </div>
      </div>

      {active && !wrongFlash && (
        <div className="card" style={{ border:'1.5px solid rgba(201,168,76,.4)', animation:'fadeUp .2s ease both' }}>
          <p style={{ fontWeight:700, color:'var(--gold-light)', marginBottom:'.75rem', fontSize:'.9rem' }}>
            {active.icon} {active.q}
          </p>

          {active.type === 'tf' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.5rem' }}>
              {['Vrai','Faux'].map(opt => (
                <button key={opt} onClick={() => validateAnswer(opt)} style={{ padding:'.7rem', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'var(--font-display)', fontWeight:700, background:opt==='Vrai'?'var(--sage)':'var(--crimson)', color:'white' }}>
                  {opt === 'Vrai' ? '✓ Vrai' : '✗ Faux'}
                </button>
              ))}
            </div>
          )}
          {active.type === 'mc' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'.4rem' }}>
              {active.opts.map(opt => <button key={opt} className="answer-btn" onClick={() => validateAnswer(opt)}>{opt}</button>)}
            </div>
          )}
          {active.type === 'text' && (
            <div style={{ display:'flex', gap:'.5rem' }}>
              <input className="game-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && validateAnswer(input)} autoFocus placeholder="Votre réponse..." />
              <button className="btn btn-primary" onClick={() => validateAnswer(input)}>✓</button>
            </div>
          )}
          {active.hint && (
            showHint
              ? <HintBubble hint={active.hint} />
              : <button className="btn btn-ghost" onClick={() => setShowHint(true)} style={{ marginTop:'.5rem', fontSize:'.8rem' }}>💡 Indice</button>
          )}
          <button className="btn btn-ghost" onClick={() => { setActiveIdx(null); setShowHint(false); }} style={{ marginTop:'.5rem', fontSize:'.8rem' }}>
            Annuler
          </button>
        </div>
      )}
      <BottomNav />
    </div>
  );
};

// Wrapper avec écran de choix mode correction + key pour reset total
const BingoGame = ({ onBack, onXP }) => {
  const [phase, setPhase]             = useState('choose');
  const [correctionMode, setCorrectionMode] = useState('immediate');
  const [gameKey, setGameKey]         = useState(0); // incrémenter = nouvelle grille

  if (phase === 'choose') return (
    <div className="page-content">
      <button className="btn btn-ghost" onClick={onBack}>← Retour</button>
      <div style={{ textAlign:'center', margin:'1.5rem 0' }}>
        <div style={{ fontSize:'4rem' }}>🎯</div>
        <h2 style={{ margin:'.5rem 0 .3rem' }}>Bible Bingo</h2>
        <p className="text-small">Grille 5×5 · Lignes = bonus XP · Questions variées</p>
      </div>
      <div className="card" style={{ marginBottom:'1.25rem' }}>
        <p style={{ fontFamily:'var(--font-display)', color:'var(--gold-light)', fontSize:'.9rem', marginBottom:'.75rem' }}>📋 Mode de correction</p>
        {[
          { key:'immediate', icon:'⚡', title:'Correction immédiate', desc:'La bonne réponse apparaît pendant 2s après chaque erreur' },
          { key:'recap',     icon:'📝', title:'Résumé en fin',        desc:'Les erreurs sont visibles uniquement quand tu fermes une case' },
        ].map(({ key, icon, title, desc }) => (
          <div key={key} onClick={() => setCorrectionMode(key)} style={{ display:'flex', alignItems:'flex-start', gap:'.75rem', padding:'.75rem', borderRadius:10, marginBottom:'.5rem', cursor:'pointer', background:correctionMode===key?'rgba(201,168,76,.15)':'rgba(255,255,255,.03)', border:`1.5px solid ${correctionMode===key?'rgba(201,168,76,.5)':'rgba(255,255,255,.06)'}`, transition:'all .2s' }}>
            <div style={{ fontSize:'1.4rem', flexShrink:0, marginTop:'.05rem' }}>{icon}</div>
            <div>
              <div style={{ fontFamily:'var(--font-display)', color:'var(--parch)', fontSize:'.9rem', fontWeight:700 }}>{title}</div>
              <div className="text-tiny" style={{ marginTop:'.2rem', lineHeight:1.4 }}>{desc}</div>
            </div>
            {correctionMode===key && <div style={{ marginLeft:'auto', color:'var(--gold-light)', fontSize:'1.1rem' }}>✓</div>}
          </div>
        ))}
      </div>
      <button className="btn btn-primary w-full" style={{ padding:'1rem', fontSize:'1.1rem' }} onClick={() => setPhase('playing')}>
        Lancer le Bingo →
      </button>
      <BottomNav />
    </div>
  );

  return (
    <BingoBoard
      key={gameKey}                        // ← change = makeGrid() rappelé = nouvelle grille
      onBack={onBack}
      onXP={onXP}
      correctionMode={correctionMode}
      onReplay={() => setGameKey(k => k + 1)}  // ← nouvelle grille sans quitter
    />
  );
};

export default BingoGame;
