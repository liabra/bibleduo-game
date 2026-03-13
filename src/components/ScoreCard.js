import React, { useRef, useState } from 'react';

/**
 * ScoreCard — renders a beautiful score image on a Canvas and provides
 * a "Download" button. Pure browser, zero dependencies.
 *
 * Props:
 *  - gameName : string
 *  - playerName : string
 *  - playerAvatar : string (emoji)
 *  - score : string or number
 *  - xp : number
 *  - details : Array<{label, value}>   (shown as stat rows)
 *  - onClose : () => void
 */
const ScoreCard = ({ gameName, playerName, playerAvatar, score, xp, details = [], onClose }) => {
  const canvasRef  = useRef(null);
  const [ready, setReady]   = useState(false);
  const [copied, setCopied] = useState(false);

  // Draw the card once component mounts
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 600, H = 360;
    canvas.width  = W * 2; // retina
    canvas.height = H * 2;
    canvas.style.width  = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(2, 2);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,   '#0d0a05');
    bg.addColorStop(0.5, '#1a1209');
    bg.addColorStop(1,   '#0d0a05');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Texture overlay — subtle gold dots
    ctx.fillStyle = 'rgba(201,168,76,.03)';
    for (let x = 0; x < W; x += 20) for (let y = 0; y < H; y += 20) {
      ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
    }

    // Glow top-left
    const glow = ctx.createRadialGradient(60, 60, 0, 60, 60, 200);
    glow.addColorStop(0, 'rgba(201,168,76,.12)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Border frame
    ctx.strokeStyle = 'rgba(201,168,76,.5)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 12, 12, W - 24, H - 24, 16);
    ctx.stroke();

    // Inner border
    ctx.strokeStyle = 'rgba(201,168,76,.18)';
    ctx.lineWidth = 0.5;
    roundRect(ctx, 18, 18, W - 36, H - 36, 12);
    ctx.stroke();

    // Corner ornaments
    drawOrnament(ctx, 20, 20);
    drawOrnament(ctx, W - 20, 20, true);
    drawOrnament(ctx, 20, H - 20, false, true);
    drawOrnament(ctx, W - 20, H - 20, true, true);

    // Avatar emoji
    ctx.font = '44px serif';
    ctx.textAlign = 'left';
    ctx.fillText(playerAvatar || '📖', 36, 80);

    // Game name tag
    ctx.fillStyle = 'rgba(201,168,76,.15)';
    roundRect(ctx, 94, 36, 180, 22, 11);
    ctx.fill();
    ctx.fillStyle = '#c9a84c';
    ctx.font = 'bold 11px "Arial Narrow", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(gameName.toUpperCase(), 104, 51);

    // Player name
    ctx.fillStyle = '#fdf6e3';
    ctx.font = 'bold 22px "Georgia", serif';
    ctx.textAlign = 'left';
    ctx.fillText(playerName || 'Joueur', 94, 80);

    // Score big display
    ctx.fillStyle = '#e8c97a';
    ctx.font = 'bold 64px "Georgia", serif';
    ctx.textAlign = 'left';
    ctx.fillText(String(score), 36, 160);

    // Score label
    ctx.fillStyle = 'rgba(201,168,76,.6)';
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText('SCORE', 36, 178);

    // XP badge
    ctx.fillStyle = 'rgba(201,168,76,.2)';
    roundRect(ctx, 36, 190, 120, 36, 8);
    ctx.fill();
    ctx.fillStyle = '#e8c97a';
    ctx.font = 'bold 18px "Georgia", serif';
    ctx.textAlign = 'center';
    ctx.fillText(`+${xp} XP`, 96, 213);

    // Details column
    const colX = 280;
    details.slice(0, 4).forEach(({ label, value }, i) => {
      const y = 80 + i * 44;
      // Row bg
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,.03)' : 'transparent';
      ctx.fillRect(colX - 8, y - 20, W - colX - 28, 34);
      // Label
      ctx.fillStyle = 'rgba(201,168,76,.5)';
      ctx.font = '11px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label.toUpperCase(), colX, y - 2);
      // Value
      ctx.fillStyle = '#fdf6e3';
      ctx.font = 'bold 16px "Georgia", serif';
      ctx.fillText(String(value), colX, y + 16);
    });

    // Divider
    ctx.strokeStyle = 'rgba(201,168,76,.2)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(colX - 20, 56);
    ctx.lineTo(colX - 20, H - 56);
    ctx.stroke();

    // Bottom watermark
    ctx.fillStyle = 'rgba(201,168,76,.35)';
    ctx.font = '12px "Georgia", serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ Bible Games ✦', W / 2, H - 28);

    // Date
    ctx.fillStyle = 'rgba(201,168,76,.25)';
    ctx.font = '10px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(new Date().toLocaleDateString('fr-FR'), W - 36, H - 28);

    setReady(true);
  }, [gameName, playerName, playerAvatar, score, xp, details]);

  const download = () => {
    const canvas = canvasRef.current;
    const a = document.createElement('a');
    a.download = `bible-games-${gameName.toLowerCase().replace(/ /g,'-')}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  const copyText = () => {
    const text = `🏆 Bible Games — ${gameName}\n👤 ${playerName || 'Joueur'}\n📊 Score : ${score}\n⭐ +${xp} XP\n${details.map(d => `${d.label}: ${d.value}`).join('\n')}\n🎮 Rejoins-moi sur Bible Games !`;
    navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 500,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      {/* Canvas card */}
      <canvas ref={canvasRef} style={{ borderRadius: 12, maxWidth: '100%', boxShadow: '0 8px 40px rgba(201,168,76,.25)', marginBottom: '1rem' }} />

      {ready && (
        <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={download}
            style={{ background: 'linear-gradient(135deg,#c9a84c,#a07830)', color: '#1a1209', border: 'none', borderRadius: 8, padding: '.65rem 1.3rem', fontWeight: 700, fontSize: '.9rem', cursor: 'pointer' }}
          >
            ⬇️ Télécharger
          </button>
          <button
            onClick={copyText}
            style={{ background: 'rgba(255,255,255,.1)', color: '#fdf6e3', border: '1px solid rgba(201,168,76,.3)', borderRadius: 8, padding: '.65rem 1.3rem', fontWeight: 700, fontSize: '.9rem', cursor: 'pointer' }}
          >
            {copied ? '✅ Copié !' : '📤 Copier texte'}
          </button>
          <button
            onClick={onClose}
            style={{ background: 'none', color: 'rgba(201,168,76,.6)', border: 'none', borderRadius: 8, padding: '.65rem 1rem', fontSize: '.9rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Canvas helpers ────────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawOrnament(ctx, x, y, flipX = false, flipY = false) {
  ctx.save();
  ctx.translate(x, y);
  if (flipX) ctx.scale(-1, 1);
  if (flipY) ctx.scale(1, -1);
  ctx.strokeStyle = 'rgba(201,168,76,.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(16, 0);
  ctx.moveTo(0, 0); ctx.lineTo(0, 16);
  ctx.stroke();
  ctx.fillStyle = 'rgba(201,168,76,.6)';
  ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export default ScoreCard;
