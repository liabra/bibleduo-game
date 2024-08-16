import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionsComponent.css';
import questionBank from './questionBank';  // Assurez-vous que le fichier questionBank est bien importé

// Fonction pour obtenir un nombre aléatoire de questions équilibrées par type
const getRandomQuestions = (numQuestions) => {
  const questionTypes = {
    QCM: [],
    "Vrai ou Faux": [],
    Nombre: [],
    "Oui ou Non": [],
    "Complétion de Texte": []
  };

  // Classer les questions par type
  questionBank.forEach(question => {
    if (questionTypes[question.type]) {
      questionTypes[question.type].push(question);
    }
  });

  const selectedQuestions = [];

  // Assurer une distribution équilibrée
  Object.keys(questionTypes).forEach(type => {
    const shuffled = questionTypes[type].sort(() => 0.5 - Math.random());
    selectedQuestions.push(...shuffled.slice(0, Math.floor(numQuestions / 4)));
  });

  // Si moins de questions que numQuestions, remplir avec d'autres questions
  while (selectedQuestions.length < numQuestions) {
    const shuffled = questionBank.sort(() => 0.5 - Math.random());
    const remainingQuestions = shuffled.filter(
      question => !selectedQuestions.includes(question)
    );
    selectedQuestions.push(remainingQuestions[0]);
  }

  return selectedQuestions.sort(() => 0.5 - Math.random()); // Mélange final
};

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

const QuestionsComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);  
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setQuestions(getRandomQuestions(10));  // Limite à 10 questions
      setLoading(false);
    }, 1000);
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setShowFeedback(false);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setTimeLeft(30); 
    } else {
      const tempScore = questions.reduce((acc, question, index) => {
        if (responses[index] === question.correctAnswer) {
          return acc + 1;
        }
        return acc;
      }, 0);
      navigate('/result', { state: { responses, questions, score: tempScore } });
    }
  }, [currentQuestionIndex, questions, responses, navigate]);

  const handleChange = (response) => {
    setResponses({
      ...responses,
      [currentQuestionIndex]: response
    });
  };

  const handleCheckAnswer = useCallback(() => {
    const question = questions[currentQuestionIndex];
    const response = responses[currentQuestionIndex];
    const isCorrect = response === question.correctAnswer;
    const isUnknown = response?.toLowerCase() === "je ne sais pas";

    const verseLink = generateVerseLink(question.reference);

    if (isCorrect) {
      setFeedback('Bien joué');
      setFeedbackColor('green');
      setTimeout(handleNextQuestion, 1000); // Passer automatiquement à la question suivante après 1 seconde
    } else if (isUnknown) {
      setFeedback(
        <>
          Dommage, la bonne réponse est : {question.correctAnswer}.<br />
          Verset de référence : <a href={verseLink} target="_blank" rel="noopener noreferrer">
            {question.reference}
          </a>
        </>
      );
      setFeedbackColor('gray'); // Feedback en gris pour "Je ne sais pas"
    } else {
      setFeedback(
        <>
          Dommage, la bonne réponse est : {question.correctAnswer}.<br />
          Verset de référence : <a href={verseLink} target="_blank" rel="noopener noreferrer">
            {question.reference}
          </a>
        </>
      );
      setFeedbackColor('red'); // Feedback en rouge pour une mauvaise réponse
    }
    setShowFeedback(true);
    setIsAnswered(true);
  }, [currentQuestionIndex, questions, responses, handleNextQuestion]);

  useEffect(() => {
    if (timeLeft > 0 && currentQuestionIndex % 4 === 0 && !isAnswered) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleCheckAnswer();
    }

    if (timeLeft === 20) {
      document.getElementById('timer').classList.add('orange');
    } else if (timeLeft === 10) {
      document.getElementById('timer').classList.add('orange-blink');
    } else if (timeLeft === 5) {
      document.getElementById('timer').classList.add('red-blink');
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, currentQuestionIndex, isAnswered, handleCheckAnswer]);

  if (loading) return <div>Loading...</div>;  // Affiche "Loading..." tant que les questions ne sont pas prêtes

  if (!questions.length) return <div>Loading...</div>;

  const question = questions[currentQuestionIndex];

  return (
    <div className="question-container">
      <div className="question-header">
        <p className="question-count">Question {currentQuestionIndex + 1} / {questions.length}</p>
        <p className="question-text">{question.question}</p>
      </div>
      <form className="questions-box">
        <div className="question-box">
          {question.type === "QCM" && question.options.map((option, i) => (
            <label key={i} className="option">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                onChange={(e) => handleChange(e.target.value)}
                checked={responses[currentQuestionIndex] === option}
                disabled={isAnswered}
              />
              {option}
            </label>
          ))}
          {question.type === "Vrai ou Faux" && question.options.map((option, i) => (
            <label key={i} className="option">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                onChange={(e) => handleChange(e.target.value)}
                checked={responses[currentQuestionIndex] === option}
                disabled={isAnswered}
              />
              {option}
            </label>
          ))}
          {question.type === "Oui ou Non" && question.options.map((option, i) => (
            <label key={i} className="option">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                onChange={(e) => handleChange(e.target.value)}
                checked={responses[currentQuestionIndex] === option}
                disabled={isAnswered}
              />
              {option}
            </label>
          ))}
          {question.type === "Nombre" && question.options.map((option, i) => (
            <label key={i} className="option">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                onChange={(e) => handleChange(e.target.value)}
                checked={responses[currentQuestionIndex] === option}
                disabled={isAnswered}
              />
              {option}
            </label>
          ))}
          {question.type === "Complétion de Texte" && (
            <div>
              <label className="option">
                <input
                  type="text"
                  name={`question-${currentQuestionIndex}`}
                  value={responses[currentQuestionIndex] || ''}
                  onChange={(e) => handleChange(e.target.value)}
                  disabled={isAnswered || responses[currentQuestionIndex] === "je ne sais pas"}
                />
              </label>
              <label className="option">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value="je ne sais pas"
                  onChange={(e) => handleChange(e.target.value)}
                  checked={responses[currentQuestionIndex] === "je ne sais pas"}
                  disabled={isAnswered}
                />
                Je ne sais pas
              </label>
            </div>
          )}
          {currentQuestionIndex % 4 === 0 && (
            <p id="timer" className="timer">
              Temps restant: {timeLeft}s
            </p>
          )}
        </div>
        <div className="navigation">
          {!isAnswered && (
            <button type="button" onClick={handleCheckAnswer} disabled={!responses[currentQuestionIndex]}>
              Valider
            </button>
          )}
          {isAnswered && responses[currentQuestionIndex] !== questions[currentQuestionIndex].correctAnswer && showFeedback && (
            <button type="button" onClick={handleNextQuestion}>
              Suivant
            </button>
          )}
        </div>
        {showFeedback && (
          <p className={`feedback ${feedbackColor === 'gray' ? 'gray' : feedbackColor}`}>
            {feedback}
          </p>
        )}
      </form>
    </div>
  );
};

export default QuestionsComponent;
