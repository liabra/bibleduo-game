import React from 'react';
import BottomNav from './BottomNav';

const UPDATES = [
  {
    version: 'v3.0',
    date: 'Mars 2026',
    title: 'Passe de finition',
    items: [
      '🔐 Bible Escape — 20 niveaux, skip XP, badges persistants',
      '⚔️ Bible Battle — IA à 3 niveaux de difficulté (Novice / Standard / Expert)',
      '🎯 Bible Bingo — rotation des questions sur mauvaise réponse',
      '📖 Références bibliques sur toutes les questions',
      '👤 Profil enrichi : historique, badges Escape, QR code, lien de partage',
      '📈 Progression XP triangulaire (niveaux plus profonds)',
      "💡 Système d'indices avec coût en XP par jeu",
      "🎮 Navigation : retour à la grille depuis n'importe quel jeu",
    ],
  },
  {
    version: 'v2.0',
    date: 'Février 2026',
    title: 'Expansion des jeux',
    items: [
      '🗝️ Nouveau jeu : Clé Secrète (coffre mystérieux)',
      '🃏 Bible Memory — 20 paires de cartes, anti-répétition',
      '🤖 IA simulée dans Bible Battle avec timing variable',
      '👤 Création de profil joueur (pseudo + avatar)',
      '⭐ Système XP global avec niveaux',
      '📸 Carte de score partageable',
      '🔀 Shuffle Fisher-Yates — mélange vraiment aléatoire',
      '🐛 Correction : questions vides dans Speedrun et Battle',
    ],
  },
  {
    version: 'v1.0',
    date: 'Janvier 2026',
    title: 'Lancement',
    items: [
      '⚡ Speed Verse — 60 secondes, versets à compléter',
      '⚔️ Bible Battle — Questions vs IA',
      '🎯 Bible Bingo — Grille 5×5 avec bonus BINGO',
      '🔐 Bible Escape — Énigmes bibliques par niveau',
      '🎮 Grille de jeux avec XP et niveaux',
      '📰 Page Nouveautés',
    ],
  },
];

const UpdatesPage = () => (
  <div className="page-content">
    <h2 style={{ fontSize: '1.4rem', marginBottom: '.25rem' }}>📰 Nouveautés</h2>
    <p className="text-tiny" style={{ marginBottom: '1.5rem' }}>Historique des mises à jour de Bible Games</p>

    {UPDATES.map((update, i) => (
      <div key={update.version} style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.6rem' }}>
          <div style={{
            background: i === 0 ? 'rgba(201,168,76,.2)' : 'rgba(255,255,255,.06)',
            border: `1px solid ${i === 0 ? 'rgba(201,168,76,.5)' : 'rgba(255,255,255,.12)'}`,
            borderRadius: 6, padding: '.18rem .55rem',
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '.78rem', color: i === 0 ? 'var(--gold-light)' : 'var(--gray-400)',
          }}>
            {update.version}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--parch)', fontSize: '.95rem' }}>
            {update.title}
          </div>
          <div className="text-tiny" style={{ marginLeft: 'auto' }}>{update.date}</div>
        </div>

        <div className="card" style={{
          padding: '.75rem 1rem',
          background: i === 0 ? 'rgba(201,168,76,.06)' : 'rgba(255,255,255,.02)',
          borderColor: i === 0 ? 'rgba(201,168,76,.2)' : 'rgba(255,255,255,.06)',
        }}>
          {update.items.map((item, j) => (
            <div key={j} style={{
              fontSize: '.84rem', color: 'var(--gray-300)', lineHeight: 1.6,
              paddingBottom: j < update.items.length - 1 ? '.3rem' : 0,
              borderBottom: j < update.items.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none',
              marginBottom: j < update.items.length - 1 ? '.3rem' : 0,
            }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    ))}

    <div style={{
      borderTop: '1px solid rgba(201,168,76,.15)', paddingTop: '1rem', marginBottom: '.5rem',
      display: 'flex', flexDirection: 'column', gap: '.5rem',
    }}>
      <a href="https://ko-fi.com/liabalagnaranin" target="_blank" rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', background: 'rgba(255,94,91,.1)', border: '1px solid rgba(255,94,91,.25)', borderRadius: 10, padding: '.6rem 1rem', color: '#ff8a87', textDecoration: 'none', fontSize: '.85rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}
      >
        ☕ Soutenir le projet sur Ko-fi
      </a>
      <a href="https://forms.gle/PLQSfC26NsA3Gn6d9" target="_blank" rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', background: 'rgba(30,58,95,.2)', border: '1px solid rgba(30,58,95,.4)', borderRadius: 10, padding: '.6rem 1rem', color: 'rgba(253,246,227,.6)', textDecoration: 'none', fontSize: '.85rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}
      >
        💬 Donner un avis
      </a>
    </div>

    <BottomNav />
  </div>
);

export default UpdatesPage;
