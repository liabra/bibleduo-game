import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import GamesPage from './pages/GamesPage';
import BattleGame from './pages/games/BattleGame';
import BingoGame from './pages/games/BingoGame';
import EscapeGame from './pages/games/EscapeGame';
import MemoryGame from './pages/games/MemoryGame';
import SecretKeyGame from './pages/games/SecretKeyGame';
import SpeedrunGame from './pages/games/SpeedrunGame';
import UpdatesPage from './components/UpdatesPage';
import LoginForm from './LoginForm';
import ProfileForm from './ProfileForm';
import ResultsPage from './ResultsPage';
import SessionComponent from './SessionComponent';
import UserList from './UserList';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<GamesPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/battle" element={<BattleGame />} />
          <Route path="/games/bingo" element={<BingoGame />} />
          <Route path="/games/escape" element={<EscapeGame />} />
          <Route path="/games/memory" element={<MemoryGame />} />
          <Route path="/games/secret-key" element={<SecretKeyGame />} />
          <Route path="/games/speedrun" element={<SpeedrunGame />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/profil" element={<ProfileForm />} />
          <Route path="/resultats" element={<ResultsPage />} />
          <Route path="/session" element={<SessionComponent />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </div>
    </GameProvider>
  );
}

export default App;