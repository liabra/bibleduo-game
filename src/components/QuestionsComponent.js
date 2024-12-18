import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './QuestionsComponent.css';
import questionBank from './questionBank';

const filterQuestions = (category, numQuestions) => {
  let filteredQuestions = [];
  if (category === "Devinettes") {
    filteredQuestions = questionBank.filter((q) => q.type === "Devinette");
  } else if (category === "Questions") {
    filteredQuestions = questionBank.filter((q) => q.type !== "Devinette");
  } else {
    filteredQuestions = questionBank; // Mixte : toutes les questions
  }

  const shuffledQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
  return shuffledQuestions.slice(0, numQuestions);
};

const QuestionsComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [settings, setSettings] = useState({
    numQuestions: 5,
    timerEnabled: false,
    timerDuration: 30,
    category: "Mixte",
  });
  const [quizStarted, setQuizStarted] = useState(false);

  const navigate = useNavigate();
  const timerRef = useRef(null);

  const startQuiz = () => {
    const selectedQuestions = filterQuestions(settings.category, settings.numQuestions);
    setQuestions(selectedQuestions);
    setQuizStarted(true);
    setTimeLeft(settings.timerDuration);
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setShowFeedback(false);
      setTimeLeft(settings.timerDuration);
      setErrorMessage(''); // Réinitialise les erreurs
    } else {
      navigate('/result', { state: { responses, questions } });
    }
  }, [currentQuestionIndex, questions, responses, navigate, settings.timerDuration]);

  const handleSkipQuestion = useCallback(() => {
    setResponses((prevResponses) => ({ ...prevResponses, [currentQuestionIndex]: 'Non répondu' }));
    handleNextQuestion();
  }, [currentQuestionIndex, handleNextQuestion]);

  useEffect(() => {
    if (quizStarted && settings.timerEnabled && timeLeft > 0 && !isAnswered) {
      timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (settings.timerEnabled && timeLeft === 0 && !isAnswered) {
      handleSkipQuestion();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, isAnswered, quizStarted, settings.timerEnabled, handleSkipQuestion]);

  const handleQuitQuiz = () => {
    console.log("Redirection vers la page d'accueil...");
    setQuizStarted(false); // Réinitialise l'état pour afficher les paramètres du quiz
  };


  const handleCheckAnswer = () => {
    const question = questions[currentQuestionIndex];
    const userAnswer = responses[currentQuestionIndex];

    if (!userAnswer) {
      // Message d'erreur si aucune réponse n'est sélectionnée
      setErrorMessage('Veuillez choisir au moins une réponse avant de valider.');
      setShowFeedback(false);
      return;
    }

    setErrorMessage(''); // Réinitialise les erreurs

    const isCorrect = userAnswer === question.correctAnswer;

    if (isCorrect) {
      setFeedback('Bonne réponse !');
      setFeedbackColor('green');
    } else {
      setFeedback(`Mauvaise réponse. La bonne réponse est : ${question.correctAnswer}`);
      setFeedbackColor('red');
    }

    setIsAnswered(true);
    setShowFeedback(true);
  };

  if (!quizStarted) {
    return (
      <div className="quiz-settings">
        <h2>Paramètres du Quiz</h2>
        <label>
          Nombre de questions :
          <input
            type="number"
            min="1"
            max="50"
            value={settings.numQuestions}
            onChange={(e) => setSettings({ ...settings, numQuestions: Number(e.target.value) })}
          />
        </label>
        <label>
          Choisir la catégorie :
          <select
            value={settings.category}
            onChange={(e) => setSettings({ ...settings, category: e.target.value })}
          >
            <option value="Mixte">Mixte</option>
            <option value="Questions">Questions</option>
            <option value="Devinettes">Devinettes</option>
          </select>
        </label>
        <label>
          Activer le Timer :
          <input
            type="checkbox"
            checked={settings.timerEnabled}
            onChange={(e) => setSettings({ ...settings, timerEnabled: e.target.checked })}
          />
        </label>
        {settings.timerEnabled && (
          <label>
            Durée du Timer (secondes) :
            <input
              type="number"
              min="10"
              max="120"
              value={settings.timerDuration}
              onChange={(e) => setSettings({ ...settings, timerDuration: Number(e.target.value) })}
            />
          </label>
        )}
        <button onClick={startQuiz}>Commencer le Quiz</button>

        {/* Lien vers la page des mises à jour */}
        <div className="updates-section">
          <Link to="/updates" className="small-button">
            Voir les mises à jour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="question-container">
      <div className="question-header">
        <p className="question-count">
          Question {currentQuestionIndex + 1} / {questions.length}
        </p>
        <p className="question-text">{questions[currentQuestionIndex].question}</p>
      </div>
      <form className="questions-box">
        {questions[currentQuestionIndex].options.map((option, i) => (
          <label key={i} className="option">
            <input
              type="radio"
              name={`question-${currentQuestionIndex}`}
              value={option}
              onChange={(e) => setResponses({ ...responses, [currentQuestionIndex]: e.target.value })}
              disabled={isAnswered}
            />
            {option}
          </label>
        ))}
        {settings.timerEnabled && (
          <p id="timer" className="timer">Temps restant : {timeLeft}s</p>
        )}
      </form>
      <div className="navigation">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {!isAnswered && <button onClick={handleCheckAnswer}>Valider</button>}
        {!isAnswered && <button className="btn-small secondary" onClick={handleSkipQuestion}>Passer</button>}
        {isAnswered && <button onClick={handleNextQuestion}>Suivant</button>}
        <button className="btn-small quit-button" onClick={handleQuitQuiz}>
          Quitter
        </button>
      </div>
      {showFeedback && <p className={`feedback ${feedbackColor}`}>{feedback}</p>}
    </div>
  );
};

export default QuestionsComponent;
