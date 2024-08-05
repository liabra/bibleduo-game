import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultComponent.css';

const ResultComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { responses, questions, score } = location.state || { responses: {}, questions: [], score: 0 };

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="result-container">
      <h2>Votre score: {score} / 10</h2>
      <button onClick={handleRestart}>Recommencer</button>
      <div className="summary">
        <details open>
          <summary>Résumé des questions</summary>
          <ul>
            {questions.map((question, index) => (
              <li key={index} style={{ color: responses[index] === question.correctAnswer ? 'green' : 'red' }}>
                <strong>Question:</strong> {question.question}<br />
                <strong>Réponse:</strong> {responses[index]}<br />
                <strong>Correction:</strong> {question.correctAnswer}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
};

export default ResultComponent;
