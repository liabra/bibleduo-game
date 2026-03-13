import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import GamesPage from './pages/GamesPage';
import UpdatesPage from './components/UpdatesPage';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="app-wrapper">
        <Routes>
          <Route path="/"        element={<GamesPage />} />
          <Route path="/games"   element={<GamesPage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          {/* Catch-all — prevents white screen on unknown routes */}
          <Route path="*"        element={<GamesPage />} />
        </Routes>
      </div>
    </GameProvider>
  );
}

export default App;
