import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, responses, score } = location.state || { questions: [], responses: {}, score: 0 };

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="results-container">
      <h2>Votre score: {score} / 10</h2>
      <div className="summary">
        <h3>Résumé des questions</h3>
        <ul>
          {questions.map((question, index) => (
            <li key={index}>
              <p>{question.question}</p>
              <p>Votre réponse: {responses[index]}</p>
              <p style={{ color: responses[index] === question.correctAnswer ? 'green' : 'red' }}>
                {responses[index] === question.correctAnswer ? 'Correcte' : `Correcte: ${question.correctAnswer}`}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleRestart}>Recommencer</button>
    </div>
  );
};

export default ResultsPage;
