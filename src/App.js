import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import ProfilePage from './pages/ProfilePage';
import DuoPage from './pages/DuoPage';
import GamesPage from './pages/GamesPage';
import UpdatesPage from './components/UpdatesPage';
import './styles/global.css';

function App() {
  return (
    <GameProvider>
      <div className="app-wrapper">
        <Routes>
          <Route path="/"        element={<HomePage />} />
          <Route path="/quiz"    element={<QuizPage />} />
          <Route path="/result"  element={<ResultPage />} />
          <Route path="/profil"  element={<ProfilePage />} />
          <Route path="/duo"     element={<DuoPage />} />
          <Route path="/games"   element={<GamesPage />} />
          <Route path="/updates" element={<UpdatesPage />} />
        </Routes>
      </div>
    </GameProvider>
  );
}

export default App;
