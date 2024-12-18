import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuestionsComponent from './components/QuestionsComponent';
import ResultComponent from './components/ResultComponent';
import UpdatesPage from './components/UpdatesPage'; // Importation
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Apprendre la Bible en jouant</h1>
      </header>
      <Routes>
        <Route path="/" element={<QuestionsComponent />} />
        <Route path="/result" element={<ResultComponent />} />
        <Route path="/updates" element={<UpdatesPage />} /> {/* Nouvelle route */}
      </Routes>
    </div>
  );
}

export default App;
