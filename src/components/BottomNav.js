import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/games',   icon: '🎮', label: 'Jeux' },
  { path: '/updates', icon: '📰', label: 'Nouveautés' },
];

const BottomNav = () => {
  const { pathname } = useLocation();
  const isGames = pathname === '/' || pathname === '/games' || pathname.startsWith('/games/');

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ path, icon, label }) => (
        <Link
          key={path}
          to={path}
          className={`nav-item ${(path === '/games' && isGames) || pathname === path ? 'active' : ''}`}
        >
          <span className="nav-icon">{icon}</span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
