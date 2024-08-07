import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultComponent.css';

const ResultComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { responses, questions } = location.state || {};

  if (!responses || !questions) {
    return <div>Loading...</div>;
  }

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="result-container">
      <header className="App-header">
        <h1>Résultats</h1>
      </header>
      <p>Votre score: {Object.values(responses).filter((response, index) => response === questions[index].correctAnswer).length} / 10</p>
      <details>
        <summary>Résumé des questions</summary>
        <ul>
          {questions.map((question, index) => {
            const isCorrect = responses[index] === question.correctAnswer;
            return (
              <li key={index} className={isCorrect ? 'correct' : 'incorrect'}>
                <p>{question.question}</p>
                <p>Votre réponse: {responses[index]}</p>
                {!isCorrect && <p>Correction: {question.correctAnswer}</p>}
              </li>
            );
          })}
        </ul>
      </details>
      <button onClick={handleRestart}>Recommencer</button>
    </div>
  );
};

export default ResultComponent;
