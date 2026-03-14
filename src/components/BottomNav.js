import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/games',   icon: '🎮', label: 'Jeux' },
  { path: '/updates', icon: '📰', label: 'Nouveautés' },
  { path: '/about',   icon: '✦',  label: 'À propos' },
];

const BottomNav = () => {
  const navigate   = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ path, icon, label }) => {
        const isActive = path === '/games'
          ? (pathname === '/' || pathname === '/games')
          : pathname === path;

        return (
          <button
            key={path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(path)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
          >
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
          </button>
        );
      })}
      <a
        href="https://topbible.topchretien.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="nav-item"
        style={{ textDecoration: 'none', color: 'var(--gold)', opacity: .75 }}
      >
        <span className="nav-icon">📖</span>
        <span style={{ fontSize: '.62rem' }}>Bible</span>
      </a>
    </nav>
  );
};

export default BottomNav;
