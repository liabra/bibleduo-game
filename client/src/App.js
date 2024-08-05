// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuestionsComponent from './components/QuestionsComponent';
import ResultComponent from './components/ResultComponent';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<QuestionsComponent />} />
        <Route path="/result" element={<ResultComponent />} />
      </Routes>
    </div>
  );
}

export default App;
