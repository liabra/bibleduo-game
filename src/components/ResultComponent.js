import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultComponent.css';

const generateVerseLink = (reference) => {
  const baseUrl = "https://bible-en-ligne.net/bible";
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
  };

  const [book, chapterVerse] = reference.split(' ');
  const [chapter, verse] = (chapterVerse || '').split(':');
  const bookCode = bookCodes[book] || "00O";

  return `${baseUrl},${bookCode}-${chapter || 1}-${verse || 1},${book.toLowerCase()}.php`;
};

const ResultComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { responses, questions } = location.state || {};

  if (!responses || !questions) return <div>Loading...</div>;

  const handleRestart = () => navigate('/');

  const formatAnswer = (answer) => {
    if (!answer) return null;

    // S’il s’agit déjà d’un tableau
    if (Array.isArray(answer)) {
      return answer.map((step, i) => (
        <div key={i}>{i + 1}️⃣ {step}</div>
      ));
    }

    // Sinon, découper la chaîne en morceaux logiques
    return answer
      .split(/,| - |–|—|→/)
      .filter(Boolean)
      .map((step, i) => (
        <div key={i}>{i + 1}️⃣ {step.trim()}</div>
      ));
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
              response !== "je ne sais pas" &&
              response === questions[index].correctAnswer
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
                <p><strong>{question.question}</strong></p>

                {/* 🧩 Réponse de l'utilisateur */}
                <p><strong>Votre réponse :</strong></p>
                <div className="answers-list">{formatAnswer(response)}</div>

                {/* 💡 Correction affichée proprement */}
                {!isCorrect && !isUnknown && (
                  <>
                    <p><strong>Correction :</strong></p>
                    <div className="answers-list">{formatAnswer(question.correctAnswer)}</div>
                  </>
                )}

                {/* 📖 Référence */}
                <p>
                  Référence :{" "}
                  <a href={verseLink} target="_blank" rel="noopener noreferrer">
                    {question.reference}
                  </a>
                </p>
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
