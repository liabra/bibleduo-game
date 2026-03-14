import React, { useState, useEffect, useRef, useCallback } from 'react';
import BottomNav from '../../components/BottomNav';
import ScoreCard from '../../components/ScoreCard';
import { useGame, HINT_COSTS } from '../../context/GameContext';
import { BATTLE_QS } from '../../data/gamesData';
import { buildQuestionPool } from '../../data/bibleData';
import {
  shuffle,
  shuffleOpts,
  PauseOverlay,
  HintBubble,
  ShareBtn,
  ScoreImageBtn,
  BibleRef,
  RulesBtn,
} from './shared';

const buildPool = () => {
  const base = shuffle(BATTLE_QS).map(shuffleOpts).slice(0, 8);
  const dynamic = buildQuestionPool(8)
    .filter((q) => q.type === 'mc')
    .map((q) => ({ ...q, opts: shuffle(q.opts) }));

  return shuffle([...base, ...dynamic]);
};

// ── Fausse IA paramétrée par difficulté ────────────────────────────────────
const AI_LEVELS = {
  easy:   { label: '😇 Novice',  desc: 'Répond lentement, se trompe souvent',   color: '#40916c', accuracy: 0.28, thinkMin: 4000, thinkMax: 7000, xpBonus: 40  },
  medium: { label: '🤖 Standard',desc: 'Vitesse normale, taux de réussite moyen',color: '#ff9f1c', accuracy: 0.62, thinkMin: 1500, thinkMax: 3000, xpBonus: 70  },
  hard:   { label: '💀 Expert',  desc: 'Répond vite, se trompe rarement',        color: '#e63946', accuracy: 0.90, thinkMin: 200,  thinkMax: 900,  xpBonus: 100 },
};

const aiThinkTime = (diff) => {
  const { thinkMin, thinkMax } = AI_LEVELS[diff];
  return thinkMin + Math.random() * (thinkMax - thinkMin);
};
const aiIsCorrect = (diff) => Math.random() < AI_LEVELS[diff].accuracy;

const BattleGame = ({ onBack, onXP }) => {
  const { profile, spendXP } = useGame();

  const [phase, setPhase] = useState('choose');
  const [difficulty, setDifficulty] = useState('medium');
  const [qs, setQs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [fb, setFb] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [aiToast, setAiToast]   = useState(null); // message IA affiché brièvement
  const [paused, setPaused] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [history, setHistory] = useState([]);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [correctionMode, setCorrectionMode] = useState('immediate');

  const timerRef = useRef(null);
  const aiRef = useRef(null);
  const xpRef = useRef(false);
  const diffRef = useRef(difficulty);
  useEffect(() => { diffRef.current = difficulty; }, [difficulty]);

  const start = () => {
    xpRef.current = false;
    setQs(buildPool());
    setIdx(0);
    setScores([0, 0]);
    setCombo(0);
    setTimeLeft(10);
    setFb(null);
    setAiThinking(false);
    setAiAnswer(null);
    setHistory([]);
    setShowHint(false);
    setPhase('playing');
  };

  const nextQuestion = useCallback(
    (nextIdx, qList) => {
      const list = qList || qs;

      if (nextIdx >= list.length) {
        setPhase('done');
        return;
      }

      setIdx(nextIdx);
      setTimeLeft(10);
      setFb(null);
      setAiThinking(true);
      setAiAnswer(null);
      setShowHint(false);

      aiRef.current = setTimeout(() => {
        const correct = aiIsCorrect(diffRef.current);
        setAiAnswer(correct ? 'correct' : 'wrong');
        setAiThinking(false);
        // Toast IA visible 2.5s
        setAiToast(correct ? '🤖 L\'IA a trouvé !' : '🤖 L\'IA s\'est trompée');
        setTimeout(() => setAiToast(null), 2500);
      }, aiThinkTime(diffRef.current));
    },
    [qs]
  );

  const handleFbDone = useCallback(
    (playerOk, q, selectedOpt = null) => {
      clearTimeout(aiRef.current);

      const aiWon = aiAnswer === 'correct';

      setTimeout(() => {
        setHistory((h) => [
          ...h,
          {
            q: q?.q,
            a: q?.a,
            given: selectedOpt,
            ok: playerOk,
            aiWon
          }
        ]);

        nextQuestion(idx + 1);
      }, 1400);
    },
    [aiAnswer, idx, nextQuestion]
  );

  useEffect(() => {
    if (phase !== 'playing' || fb || paused || !qs[idx]) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);

          const q = qs[idx];
          setScores((s) => [s[0], s[1] + 8]);
          setCombo(0);

          if (correctionMode === 'immediate') {
            setFb({ ok: false, opt: '(timeout)', correct: q?.a });
          } else {
            setFb({ ok: false, opt: '(timeout)', correct: null });
          }

          handleFbDone(false, q || {}, '(timeout)');
          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, fb, paused, idx, qs, handleFbDone, correctionMode]);

  const answer = useCallback(
    (opt) => {
      if (fb) return;

      clearInterval(timerRef.current);

      const q = qs[idx];
      const ok = opt === q.a;
      const pts = ok ? 10 + combo * 3 + Math.ceil(timeLeft * 0.5) : 0;
      const aiPts = aiAnswer === 'correct' ? 8 : 0;

      if (correctionMode === 'immediate') {
        setFb({ ok, opt, correct: q.a });
      } else {
        setFb({ ok, opt, correct: null });
      }

      setScores((s) => [s[0] + pts, s[1] + aiPts]);

      if (ok) {
        setCombo((c) => c + 1);
      } else {
        setCombo(0);
      }

      handleFbDone(ok, q, opt);
    },
    [fb, qs, idx, combo, timeLeft, aiAnswer, handleFbDone, correctionMode]
  );

  const copyScore = () => {
    const won = scores[0] > scores[1];
    const correct = history.filter((h) => h.ok).length;
    const xp = won ? 100 : 40;

    const text = `⚔️ Bible Battle — ${profile.name || 'Joueur'}
${won ? '🏆 Victoire !' : '💪 Défaite'}
Moi: ${scores[0]} pts · IA: ${scores[1]} pts
✅ ${correct}/${history.length} bonnes réponses
⭐ +${xp} XP
🎮 Bible Games`;

    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(aiRef.current);
    };
  }, []);

  /* ── CHOOSE ── */
  if (phase === 'choose') {
    const ai = AI_LEVELS[difficulty];
    return (
      <div className="page-content">
        <button className="btn btn-ghost" onClick={onBack}>← Retour</button>

        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          <div style={{ fontSize: '4rem' }}>⚔️</div>
          <h2 style={{ margin: '.5rem 0 .3rem' }}>Bible Battle</h2>
          <p className="text-small">Toi vs IA · Questions variées · Choisis ta difficulté</p>
        </div>

        {/* Difficulté */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)', fontSize: '.9rem', marginBottom: '.75rem' }}>
            ⚔️ Difficulté de l'IA
          </p>
          {Object.entries(AI_LEVELS).map(([key, d]) => (
            <div key={key} onClick={() => setDifficulty(key)} style={{
              display: 'flex', alignItems: 'center', gap: '.75rem',
              padding: '.75rem', borderRadius: 10, marginBottom: '.4rem',
              cursor: 'pointer',
              background: difficulty === key ? `${d.color}22` : 'rgba(255,255,255,.03)',
              border: `1.5px solid ${difficulty === key ? d.color + '88' : 'rgba(255,255,255,.06)'}`,
              transition: 'all .2s',
            }}>
              <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{d.label.split(' ')[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', color: difficulty === key ? d.color : 'var(--parch)', fontSize: '.88rem', fontWeight: 700 }}>
                  {d.label}
                </div>
                <div className="text-tiny" style={{ marginTop: '.15rem' }}>{d.desc}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '.65rem', color: d.color, fontWeight: 700 }}>+{d.xpBonus} XP</div>
                {difficulty === key && <div style={{ color: 'var(--gold-light)', fontSize: '1rem' }}>✓</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Mode correction */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)', fontSize: '.9rem', marginBottom: '.75rem' }}>
            📋 Mode de correction
          </p>
          {[
            { key: 'immediate', icon: '⚡', title: 'Correction immédiate', desc: "La bonne réponse s'affiche 1.4s après chaque erreur" },
            { key: 'recap',     icon: '📝', title: 'Résumé en fin',        desc: 'Toutes les erreurs visibles uniquement en fin de partie' },
          ].map(({ key, icon, title, desc }) => (
            <div key={key} onClick={() => setCorrectionMode(key)} style={{
              display: 'flex', alignItems: 'flex-start', gap: '.75rem',
              padding: '.75rem', borderRadius: 10, marginBottom: '.4rem',
              cursor: 'pointer',
              background: correctionMode === key ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.03)',
              border: `1.5px solid ${correctionMode === key ? 'rgba(201,168,76,.5)' : 'rgba(255,255,255,.06)'}`,
              transition: 'all .2s',
            }}>
              <div style={{ fontSize: '1.3rem', flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', color: 'var(--parch)', fontSize: '.88rem', fontWeight: 700 }}>{title}</div>
                <div className="text-tiny" style={{ marginTop: '.2rem', lineHeight: 1.4 }}>{desc}</div>
              </div>
              {correctionMode === key && <div style={{ marginLeft: 'auto', color: 'var(--gold-light)', fontSize: '1rem' }}>✓</div>}
            </div>
          ))}
        </div>

        <button className="btn btn-primary w-full" style={{ padding: '1rem', fontSize: '1.1rem' }} onClick={() => setPhase('ready')}>
          Continuer →
        </button>
        <BottomNav />
      </div>
    );
  }

  /* ── READY ── */
  if (phase === 'ready') {
    return (
      <div className="page-content">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Retour
        </button>

        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          <div style={{ fontSize: '4rem' }}>⚔️</div>
          <h2 style={{ margin: '.5rem 0 .3rem' }}>Bible Battle</h2>
          <p className="text-small">Toi vs IA · Questions variées · L'IA pense vraiment</p>
        </div>

        <div
          className="card"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '.75rem',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}
        >
          {[
            [AI_LEVELS[difficulty].label.split(' ')[0], AI_LEVELS[difficulty].label],
            ['⚡', '10s/question'],
            ['🔥', 'Combos +3'],
            ['⚔️', `+${AI_LEVELS[difficulty].xpBonus} XP victoire`]
          ].map(([ic, lb]) => (
            <div key={lb}>
              <div style={{ fontSize: '1.3rem' }}>{ic}</div>
              <div className="text-tiny" style={{ marginTop: '.2rem' }}>
                {lb}
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary w-full"
          style={{ padding: '1rem', fontSize: '1.1rem' }}
          onClick={start}
        >
          ⚔️ Au combat !
        </button>

        <BottomNav />
      </div>
    );
  }

  /* ── DONE ── */
  if (phase === 'done') {
    const won = scores[0] > scores[1];
    const xp = won ? AI_LEVELS[difficulty].xpBonus : Math.floor(AI_LEVELS[difficulty].xpBonus * 0.4);
    const correct = history.filter((h) => h.ok).length;
    const wrong = history.filter((h) => !h.ok);

    if (!xpRef.current) {
      xpRef.current = true;
      onXP(xp);
    }

    return (
      <div className="page-content">
        {showScoreCard && (
          <ScoreCard
            gameName="Bible Battle"
            playerName={profile.name || 'Joueur'}
            playerAvatar={profile.avatar}
            score={`${won ? '🏆' : '💪'} ${scores[0]} pts`}
            xp={xp}
            details={[
              { label: 'Score IA', value: `${scores[1]} pts` },
              { label: 'Bonnes réponses', value: `${correct}/${history.length}` },
              { label: 'Résultat', value: won ? 'Victoire' : 'Défaite' }
            ]}
            onClose={() => setShowScoreCard(false)}
          />
        )}

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '3.5rem' }}>{won ? '🏆' : '💪'}</div>
          <h2
            style={{
              color: won ? 'var(--gold-light)' : 'var(--gray-400)',
              margin: '.5rem 0'
            }}
          >
            {won ? 'Victoire !' : 'Défaite…'}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '.75rem',
            marginBottom: '1rem'
          }}
        >
          {[
            ['Vous 🙋', scores[0], 'rgba(45,106,79,.15)', 'var(--sage-light)'],
            ['IA 🤖', scores[1], 'rgba(139,26,26,.15)', '#f87171']
          ].map(([l, s, bg, c]) => (
            <div
              key={l}
              style={{
                background: bg,
                borderRadius: 12,
                padding: '.75rem',
                textAlign: 'center'
              }}
            >
              <div className="text-small" style={{ marginBottom: '.2rem' }}>
                {l}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  color: c
                }}
              >
                {s}
              </div>
            </div>
          ))}
        </div>

        {wrong.length > 0 && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--gold-light)',
                marginBottom: '.5rem',
                fontSize: '.9rem'
              }}
            >
              📚 Révision
            </div>

            {wrong.map((w, i) => (
              <div
                key={i}
                style={{
                  padding: '.4rem 0',
                  borderBottom: '1px solid rgba(201,168,76,.1)',
                  fontSize: '.82rem'
                }}
              >
                <div style={{ color: 'var(--gray-400)', marginBottom: '.15rem' }}>
                  {w.q}
                </div>
                <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                  <span style={{ color: '#e63946' }}>✗ {w.given || '(timeout)'}</span>
                  <span style={{ color: 'var(--sage-light)' }}>✓ {w.a}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setPhase('choose')}>
            🔄 Rejouer
          </button>
          <ShareBtn onClick={copyScore} copied={copied} />
          <ScoreImageBtn onClick={() => setShowScoreCard(true)} />
          <button className="btn btn-secondary" onClick={onBack}>
            ← Menu
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  /* ── PLAYING ── */
  const q = qs[idx];
  const aiColor = aiAnswer === 'correct' ? 'var(--sage-light)' : 'var(--crimson)';
  const tc =
    timeLeft <= 3 ? '#e63946' : timeLeft <= 6 ? '#ff9f1c' : 'var(--gold-light)';

  return (
    <div className="page-content">
      {/* Toast IA */}
      {aiToast && (
        <div style={{
          position: 'fixed', top: '8%', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--ink-mid)', border: `2px solid ${aiColor}`,
          borderRadius: 10, padding: '.5rem 1.2rem', zIndex: 999,
          color: aiColor, fontFamily: 'var(--font-display)', fontSize: '.9rem',
          animation: 'popIn .3s cubic-bezier(.34,1.56,.64,1) both',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          {aiToast}
        </div>
      )}
      {paused && <PauseOverlay onResume={() => setPaused(false)} onQuit={onBack} />}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '.4rem',
          alignItems: 'center',
          marginBottom: '.75rem'
        }}
      >
        <div
          style={{
            background: 'rgba(45,106,79,.15)',
            borderRadius: 10,
            padding: '.5rem',
            textAlign: 'center'
          }}
        >
          <div className="text-tiny">VOUS</div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              color: 'var(--sage-light)'
            }}
          >
            {scores[0]}
          </div>
          {combo > 1 && (
            <div style={{ fontSize: '.6rem', color: '#ff9f1c' }}>🔥×{combo}</div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              color: tc,
              fontSize: '1.8rem',
              fontWeight: 700,
              lineHeight: 1
            }}
          >
            {timeLeft}
          </div>
          <div className="text-tiny">
            Q{idx + 1}/{qs.length}
          </div>
          <div style={{ display: 'flex', gap: '.3rem', alignItems: 'center', justifyContent: 'center', marginTop: '.2rem' }}>
            <button
              onClick={() => setPaused(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gray-400)',
                cursor: 'pointer',
                fontSize: '.8rem',
              }}
            >
              ⏸
            </button>
            <RulesBtn gameId="battle" />
          </div>
        </div>

        <div
          style={{
            background: aiAnswer === 'correct' ? 'rgba(45,106,79,.2)' : aiAnswer === 'wrong' ? 'rgba(139,26,26,.2)' : 'rgba(139,26,26,.15)',
            borderRadius: 10, padding: '.5rem', textAlign: 'center',
            transition: 'background .4s',
          }}
        >
          <div className="text-tiny">IA 🤖</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#f87171' }}>
            {scores[1]}
          </div>
          <div style={{ fontSize: '.6rem', minHeight: '1em',
            color: aiThinking ? '#ff9f1c' : aiAnswer === 'correct' ? 'var(--sage-light)' : aiAnswer === 'wrong' ? 'var(--crimson)' : 'transparent',
          }}>
            {aiThinking ? '🤔 réfléchit…' : aiAnswer === 'correct' ? '✓ bonne réponse' : aiAnswer === 'wrong' ? '✗ erreur' : '·'}
          </div>
        </div>
      </div>

      <div className="xp-bar-track" style={{ marginBottom: '1rem', height: 6 }}>
        <div
          className="xp-bar-fill"
          style={{
            width: `${(timeLeft / 10) * 100}%`,
            background: tc,
            transition: 'width 1s linear'
          }}
        />
      </div>

      <div
        className="card-white"
        style={{
          minHeight: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '.75rem',
          textAlign: 'center',
          border: fb
            ? `2px solid ${fb.ok ? 'var(--sage)' : 'var(--crimson)'}`
            : undefined,
          transition: 'border .3s'
        }}
      >
        {fb && correctionMode === 'immediate' && !fb.ok ? (
          <div style={{ fontSize: '.85rem', color: 'var(--ink)', lineHeight: 1.5 }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.3rem' }}>❌</div>
            <div style={{ color: 'var(--crimson)' }}>
              Ta réponse : <b>{fb.opt || '(timeout)'}</b>
            </div>
            <div style={{ color: 'var(--sage)', fontWeight: 700, marginTop: '.2rem' }}>
              ✓ {fb.correct}
            </div>
            <BibleRef verse={q?.ref} />
          </div>
        ) : fb?.ok ? (
          <div>
            <div style={{ fontSize: '2rem' }}>✅</div>
            <BibleRef verse={q?.ref} />
          </div>
        ) : fb && correctionMode === 'recap' && !fb.ok ? (
          <div style={{ fontSize: '1.6rem' }}>❌</div>
        ) : (
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              color: 'var(--ink)',
              lineHeight: 1.5
            }}
          >
            {q?.q}
          </p>
        )}
      </div>

      {!fb && showHint && q?.hint && <HintBubble hint={q.hint} />}

      {!fb && !showHint && q?.hint && (
        <button
          className="btn btn-ghost"
          style={{ fontSize: '.8rem', marginBottom: '.5rem' }}
          onClick={() => { setShowHint(true); spendXP(HINT_COSTS.battle[difficulty]); }}
        >
          💡 Indice <span style={{ color: 'var(--crimson)', fontSize: '.7rem' }}>−{HINT_COSTS.battle[difficulty]} XP</span>
        </button>
      )}

      {!fb && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '.5rem',
              marginBottom: '.6rem'
            }}
          >
            {q?.opts?.map((opt) => (
              <button key={opt} className="answer-btn" onClick={() => answer(opt)}>
                {opt}
              </button>
            ))}
          </div>

          {scores[0] >= 30 && (
            <button
              onClick={() =>
                setScores((s) => [s[0] - 30, Math.max(0, s[1] - 15)])
              }
              style={{
                width: '100%',
                padding: '.55rem',
                borderRadius: 8,
                background: 'rgba(255,159,28,.12)',
                border: '1px solid rgba(255,159,28,.35)',
                color: '#ff9f1c',
                cursor: 'pointer',
                fontSize: '.82rem'
              }}
            >
              ⚔️ Attaque spéciale (−30 pts → IA perd 15 pts)
            </button>
          )}
        </>
      )}

      <BottomNav />
    </div>
  );
};

export default BattleGame;