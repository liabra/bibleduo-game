import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',       icon: '🏠', label: 'Accueil' },
  { path: '/quiz',   icon: '📖', label: 'Quiz' },
  { path: '/games',  icon: '🎮', label: 'Jeux' },
  { path: '/duo',    icon: '👥', label: 'Duo' },
  { path: '/profil', icon: '🏅', label: 'Profil' },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ path, icon, label }) => (
        <Link
          key={path}
          to={path}
          className={`nav-item ${pathname === path ? 'active' : ''}`}
        >
          <span className="nav-icon">{icon}</span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
