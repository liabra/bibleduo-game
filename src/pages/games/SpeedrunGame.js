import React, { useState, useEffect, useRef, useCallback } from 'react';
import BottomNav from '../../components/BottomNav';
import ScoreCard from '../../components/ScoreCard';
import { useGame } from '../../context/GameContext';
import { SPEEDRUN_QS } from '../../data/gamesData';
import { buildQuestionPool } from '../../data/bibleData';
import { shuffle, shuffleOpts, PauseOverlay, HintBubble, ShareBtn, ScoreImageBtn } from './shared';

// Pool réellement différent à chaque appel
const buildPool = () => {
  const base    = shuffle(SPEEDRUN_QS).map(shuffleOpts);
  const dynamic = buildQuestionPool(20).map(q => ({ ...q, opts: q.opts ? shuffle(q.opts) : undefined }));
  // Mélange total des deux sources, pas de slice fixe → vrai aléatoire
  return shuffle([...base, ...dynamic]);
};

const SpeedrunGame = ({ onBack, onXP }) => {
  const { profile } = useGame();

  // ── Phase "prêt" : choix mode correction ───────────────────────────────
  const [phase, setPhase]       = useState('choose'); // choose | ready | running | done
  const [correctionMode, setCorrectionMode] = useState('immediate'); // immediate | recap

  const [qs, setQs]             = useState([]);
  const [idx, setIdx]           = useState(0);
  const [input, setInput]       = useState('');
  const [score, setScore]       = useState(0);
  const [combo, setCombo]       = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [maxCombo, setMaxCombo] = useState(0);
  const [flash, setFlash]       = useState(null);
  const [paused, setPaused]     = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showCorrection, setShowCorrection] = useState(null);
  const [history, setHistory]   = useState([]);
  const [showScoreCard, setShowScoreCard]   = useState(false);
  const [copied, setCopied]     = useState(false);

  const timerRef = useRef(null);
  const xpRef    = useRef(false);

  const addFlash = useCallback((text, color) => {
    setFlash({ text, color });
    setTimeout(() => setFlash(null), 700);
  }, []);

  const start = useCallback(() => {
    xpRef.current = false;
    // Nouveau pool à chaque partie → questions différentes
    setQs(buildPool());
    setIdx(0); setScore(0); setCombo(0); setTimeLeft(60); setMaxCombo(0);
    setHistory([]); setShowCorrection(null); setShowHint(false);
    setPhase('running');
  }, []);

  useEffect(() => {
    if (phase !== 'running' || paused) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, paused]);

  const answer = useCallback((ans) => {
    if (showCorrection) return;
    const q  = qs[idx % qs.length];
    const ok = ans.trim().toLowerCase() === String(q.a || q.opts?.[0] || '').toLowerCase();
    setHistory(h => [...h, { q: q.q, a: q.a, given: ans, ok }]);

    if (ok) {
      const pts = 10 + combo * 5;
      setScore(s => s + pts);
      setCombo(c => { const n = c + 1; setMaxCombo(m => Math.max(m, n)); return n; });
      addFlash(`+${pts}`, '#40916c');
      setInput(''); setIdx(i => i + 1); setShowHint(false);
    } else {
      setCombo(0);
      addFlash('✗', '#e63946');
      if (correctionMode === 'immediate') {
        setShowCorrection({ q: q.q, correct: q.a, given: ans });
        setTimeout(() => { setShowCorrection(null); setInput(''); setIdx(i => i + 1); setShowHint(false); }, 2000);
      } else {
        setInput(''); setIdx(i => i + 1); setShowHint(false);
      }
    }
  }, [qs, idx, combo, addFlash, showCorrection, correctionMode]);

  const copyScore = () => {
    const xp      = Math.round(score * 0.8);
    const correct = history.filter(h => h.ok).length;
    const text    = `⚡ Bible Speedrun — ${profile.name || 'Joueur'}\n🏆 Score : ${score} pts\n✅ ${correct}/${history.length} bonnes réponses\n🔥 Combo ×${maxCombo}\n⭐ +${xp} XP\n🎮 Bible Games`;
    navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  // ── CHOIX MODE CORRECTION ──────────────────────────────────────────────
  if (phase === 'choose') return (
    <div className="page-content">
      <button className="btn btn-ghost" onClick={onBack}>← Retour</button>
      <div style={{ textAlign:'center', margin:'1.5rem 0' }}>
        <div style={{ fontSize:'4rem' }}>⚡</div>
        <h2 style={{ margin:'.5rem 0 .3rem' }}>Bible Speedrun</h2>
        <p className="text-small">60 secondes · Combos bonus · Questions variées</p>
      </div>

      <div className="card" style={{ marginBottom:'1.25rem' }}>
        <p style={{ fontFamily:'var(--font-display)', color:'var(--gold-light)', fontSize:'.9rem', marginBottom:'.75rem' }}>
          📋 Mode de correction
        </p>
        {[
          { key:'immediate', icon:'⚡', title:'Correction immédiate', desc:'Chaque mauvaise réponse affiche la bonne réponse pendant 2 secondes' },
          { key:'recap',     icon:'📝', title:'Résumé en fin de partie', desc:'Tu vois toutes tes erreurs uniquement à la fin' },
        ].map(({ key, icon, title, desc }) => (
          <div
            key={key}
            onClick={() => setCorrectionMode(key)}
            style={{
              display:'flex', alignItems:'flex-start', gap:'.75rem',
              padding:'.75rem', borderRadius:10, marginBottom:'.5rem', cursor:'pointer',
              background: correctionMode === key ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.03)',
              border: `1.5px solid ${correctionMode === key ? 'rgba(201,168,76,.5)' : 'rgba(255,255,255,.06)'}`,
              transition:'all .2s',
            }}
          >
            <div style={{ fontSize:'1.4rem', flexShrink:0, marginTop:'.05rem' }}>{icon}</div>
            <div>
              <div style={{ fontFamily:'var(--font-display)', color:'var(--parch)', fontSize:'.9rem', fontWeight:700 }}>{title}</div>
              <div className="text-tiny" style={{ marginTop:'.2rem', lineHeight:1.4 }}>{desc}</div>
            </div>
            {correctionMode === key && (
              <div style={{ marginLeft:'auto', color:'var(--gold-light)', fontSize:'1.1rem', flexShrink:0 }}>✓</div>
            )}
          </div>
        ))}
      </div>

      <button className="btn btn-primary w-full" style={{ padding:'1rem', fontSize:'1.1rem' }} onClick={() => setPhase('ready')}>
        Continuer →
      </button>
      <BottomNav />
    </div>
  );

  // ── READY ──────────────────────────────────────────────────────────────
  if (phase === 'ready') return (
    <div className="page-content">
      <button className="btn btn-ghost" onClick={() => setPhase('choose')}>← Retour</button>
      <div style={{ textAlign:'center', margin:'1.5rem 0' }}>
        <div style={{ fontSize:'4rem' }}>⚡</div>
        <h2 style={{ margin:'.5rem 0 .3rem' }}>Bible Speedrun</h2>
        <p className="text-small">
          Mode : {correctionMode === 'immediate' ? '⚡ Correction immédiate' : '📝 Résumé final'}
        </p>
      </div>
      <div className="card" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', textAlign:'center', gap:'.75rem', marginBottom:'1.5rem' }}>
        {[['🕐','60s'], ['🔥','+5/combo'], ['💡','Indices']].map(([ic,lb]) => (
          <div key={lb}><div style={{ fontSize:'1.5rem' }}>{ic}</div><div className="text-tiny" style={{ marginTop:'.25rem' }}>{lb}</div></div>
        ))}
      </div>
      <button className="btn btn-primary w-full" style={{ padding:'1rem', fontSize:'1.1rem' }} onClick={start}>🚀 Lancer !</button>
      <BottomNav />
    </div>
  );

  // ── DONE ───────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const xp      = Math.round(score * 0.8);
    const correct = history.filter(h => h.ok).length;
    const wrong   = history.filter(h => !h.ok);
    if (!xpRef.current) { xpRef.current = true; onXP(xp); }

    return (
      <div className="page-content">
        {showScoreCard && (
          <ScoreCard
            gameName="Bible Speedrun" playerName={profile.name || 'Joueur'} playerAvatar={profile.avatar}
            score={`${score} pts`} xp={xp}
            details={[
              { label:'Bonnes réponses', value:`${correct}/${history.length}` },
              { label:'Meilleur combo',  value:`×${maxCombo}` },
              { label:'Précision',       value:`${history.length > 0 ? Math.round((correct/history.length)*100) : 0}%` },
            ]}
            onClose={() => setShowScoreCard(false)}
          />
        )}

        <div style={{ textAlign:'center', marginBottom:'1.25rem' }}>
          <div style={{ fontSize:'3rem' }}>🏁</div>
          <h2 style={{ margin:'.5rem 0' }}>Temps écoulé !</h2>
        </div>

        <div className="card-white" style={{ marginBottom:'1rem' }}>
          {[['Bonnes réponses', `${correct}/${history.length}`], ['Score', `${score} pts`], ['Meilleur combo', `×${maxCombo}`], ['XP gagnés', `+${xp}`]].map(([l,v]) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'.55rem 0', borderBottom:'1px solid var(--gray-200)' }}>
              <span style={{ color:'var(--ink-light)' }}>{l}</span>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'var(--ink)' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Révision erreurs (toujours visible en fin) */}
        {wrong.length > 0 && (
          <div className="card" style={{ marginBottom:'1rem' }}>
            <div style={{ fontFamily:'var(--font-display)', color:'var(--gold-light)', marginBottom:'.5rem', fontSize:'.9rem' }}>
              📚 Révision ({wrong.length} erreur{wrong.length > 1 ? 's' : ''})
            </div>
            {wrong.map((w, i) => (
              <div key={i} style={{ padding:'.4rem 0', borderBottom:'1px solid rgba(201,168,76,.1)', fontSize:'.82rem' }}>
                <div style={{ color:'var(--gray-400)', marginBottom:'.15rem' }}>{w.q}</div>
                <div style={{ display:'flex', gap:'.5rem' }}>
                  <span style={{ color:'#e63946' }}>✗ {w.given || '(vide)'}</span>
                  <span style={{ color:'var(--sage-light)' }}>✓ {w.a}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
          <button className="btn btn-primary" onClick={() => setPhase('choose')}>🔄 Rejouer</button>
          <ShareBtn onClick={copyScore} copied={copied} />
          <ScoreImageBtn onClick={() => setShowScoreCard(true)} />
          <button className="btn btn-secondary" onClick={onBack}>← Menu</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── RUNNING ────────────────────────────────────────────────────────────
  const q  = qs[idx % qs.length];
  const tc = timeLeft <= 10 ? '#e63946' : timeLeft <= 20 ? '#ff9f1c' : 'var(--gold-light)';

  return (
    <div className="page-content">
      {paused && <PauseOverlay onResume={() => setPaused(false)} onQuit={onBack} />}
      {flash && (
        <div style={{ position:'fixed', top:'18%', left:'50%', transform:'translateX(-50%)', background:flash.color, color:'white', borderRadius:8, padding:'.4rem 1.2rem', fontWeight:700, fontSize:'1.3rem', pointerEvents:'none', zIndex:99, animation:'pop .25s ease both' }}>
          {flash.text}
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.6rem' }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:tc, fontWeight:700 }}>{timeLeft}s</div>
        <div style={{ textAlign:'center' }}>
          <div className="text-tiny">COMBO</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', color: combo > 0 ? '#ff9f1c' : 'var(--gray-400)' }}>×{combo}</div>
        </div>
        <div style={{ display:'flex', gap:'.4rem', alignItems:'center' }}>
          <div style={{ textAlign:'right' }}>
            <div className="text-tiny">SCORE</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', color:'var(--gold-light)' }}>{score}</div>
          </div>
          <button onClick={() => setPaused(true)} style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.1)', borderRadius:6, color:'var(--parch)', cursor:'pointer', padding:'.3rem .5rem', fontSize:'.85rem' }}>⏸</button>
        </div>
      </div>

      <div className="xp-bar-track" style={{ marginBottom:'1rem', height:8 }}>
        <div className="xp-bar-fill" style={{ width:`${(timeLeft/60)*100}%`, background:tc, transition:'width 1s linear, background .3s' }} />
      </div>

      {/* Correction immédiate overlay */}
      {showCorrection ? (
        <div className="card-white" style={{ minHeight:110, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', marginBottom:'1rem', textAlign:'center', border:'2px solid var(--crimson)' }}>
          <div style={{ fontSize:'1.5rem', marginBottom:'.3rem' }}>❌</div>
          <p style={{ fontSize:'.85rem', color:'var(--ink-light)', marginBottom:'.25rem' }}>{showCorrection.q}</p>
          <p style={{ color:'var(--crimson)', fontSize:'.85rem' }}>Répondu : <b>{showCorrection.given || '(vide)'}</b></p>
          <p style={{ color:'var(--sage)', fontSize:'.9rem', fontWeight:700 }}>✓ {showCorrection.correct}</p>
        </div>
      ) : (
        <>
          <div className="card-white" style={{ minHeight:90, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'.75rem', textAlign:'center' }}>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'1.05rem', color:'var(--ink)', lineHeight:1.5 }}>{q?.q}</p>
          </div>
          {showHint && q?.hint && <HintBubble hint={q.hint} />}
          {!showHint && q?.hint && <button className="btn btn-ghost" style={{ fontSize:'.8rem', marginBottom:'.5rem' }} onClick={() => setShowHint(true)}>💡 Indice</button>}
          {q?.type === 'tf' ? (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem', marginTop:'.5rem' }}>
              <button onClick={() => answer('Vrai')} style={{ padding:'1rem', borderRadius:8, border:'none', background:'var(--sage)', color:'white', fontFamily:'var(--font-display)', fontWeight:700, cursor:'pointer' }}>✓ Vrai</button>
              <button onClick={() => answer('Faux')} style={{ padding:'1rem', borderRadius:8, border:'none', background:'var(--crimson)', color:'white', fontFamily:'var(--font-display)', fontWeight:700, cursor:'pointer' }}>✗ Faux</button>
            </div>
          ) : q?.type === 'mc' || q?.opts ? (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.5rem', marginTop:'.5rem' }}>
              {(q.opts || []).map(opt => <button key={opt} className="answer-btn" onClick={() => answer(opt)}>{opt}</button>)}
            </div>
          ) : (
            <div style={{ display:'flex', gap:'.5rem', marginTop:'.5rem' }}>
              <input className="game-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && answer(input)} autoFocus placeholder="Répondre…" />
              <button className="btn btn-primary" onClick={() => answer(input)}>→</button>
            </div>
          )}
        </>
      )}
      <BottomNav />
    </div>
  );
};

export default SpeedrunGame;
