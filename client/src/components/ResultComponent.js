import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultComponent.css';

// Fonction pour générer le lien vers le verset de référence sur bible-en-ligne.net
const generateVerseLink = (reference) => {
  const baseUrl = "https://bible-en-ligne.net/bible";

  // Dictionnaire des livres de la Bible et leurs codes sur bible-en-ligne.net
  const bookCodes = {
    "Genèse": "01O",
    "Exode": "02O",
    "Lévitique": "03O",
    "Josué": "06O",
    "Ruth": "08O",
    "Matthieu": "40N",
    "Marc": "41N",
    "Luc": "42N",
    "Jean": "43N",
    // Ajoutez d'autres livres ici selon vos besoins
  };

  // Séparer le livre, chapitre et verset
  const [book, chapterVerse] = reference.split(' ');
  const [chapter, verse] = chapterVerse.split(':');

  // Obtenir le code du livre
  const bookCode = bookCodes[book] || "00O";  // Si le livre n'est pas trouvé, par défaut "00O"

  // Créer l'URL complète pour la Bible en ligne
  return `${baseUrl},${bookCode}-${chapter}-${verse},${book.toLowerCase()}.php`;
};

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
      <p>
        Votre score: {
          Object.values(responses)
            .filter((response, index) => 
              response !== "je ne sais pas" && response === questions[index].correctAnswer
            ).length
        } / {questions.length}
      </p>
      <details>
        <summary>Résumé des questions</summary>
        <ul>
          {questions.map((question, index) => {
            const response = responses[index];
            const isCorrect = response === question.correctAnswer;
            const isUnknown = response === "je ne sais pas";
            const verseLink = generateVerseLink(question.reference);
            return (
              <li key={index} className={isCorrect ? 'correct' : isUnknown ? 'unknown' : 'incorrect'}>
                <p>{question.question}</p>
                <p>Votre réponse: {response}</p>
                {!isCorrect && !isUnknown && <p>Correction: {question.correctAnswer}</p>}
                <p>Référence: <a href={verseLink} target="_blank" rel="noopener noreferrer">{question.reference}</a></p>
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
