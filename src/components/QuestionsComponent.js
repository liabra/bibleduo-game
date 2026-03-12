import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionsComponent.css';
import questionBank from './questionBank';
import ChronologyQuestion from './ChronologyQuestion'; 



const filterQuestions = (categories, numQuestions) => {
  if (categories.length === 0) return [];

  const filteredQuestions = questionBank.filter((q) => categories.includes(q.category));
  if (filteredQuestions.length === 0) return [];

  const shuffledQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
  return shuffledQuestions.slice(0, numQuestions);
};

const QuestionsComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [transitionMode, setTransitionMode] = useState("fade"); 
  const [fadeClass, setFadeClass] = useState("question-fade active");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackClass, setFeedbackClass] = useState(''); // ✅ Gérer l'animation sans `getElementById`
  const [errorMessage, setErrorMessage] = useState('');
  const [settings, setSettings] = useState({
      numQuestions: 5,
      timerEnabled: false,
      timerDuration: 30,
      categories: []
  });
  const [quizStarted, setQuizStarted] = useState(false);

  const navigate = useNavigate();
  const timerRef = useRef(null);

  const startQuiz = () => {
    if (!settings.categories || settings.categories.length === 0) {
      alert("Veuillez sélectionner au moins une catégorie.");
      return;
    }

    const selectedQuestions = filterQuestions(settings.categories, settings.numQuestions);
    if (selectedQuestions.length === 0) {
      alert("Aucune question disponible.");
      return;
    }

    setQuestions(selectedQuestions);
    setQuizStarted(true);
    setTimeLeft(settings.timerDuration);
  };

  const handleNextQuestion = useCallback(() => {
    setFeedback("");
    setShowFeedback(false);
    setIsAnswered(false);

    // 💫 animation de sortie selon le mode
    setFadeClass(transitionMode === "slide" ? "question-slide" : "question-fade");

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(settings.timerDuration);
        setErrorMessage('');
        // 💫 animation d’entrée selon le mode
        setFadeClass(
          transitionMode === "slide"
            ? "question-slide active"
            : "question-fade active"
        );
      } else {
        navigate('/result', { state: { responses, questions } });
      }
    }, 350);
  }, [currentQuestionIndex, questions, responses, navigate, settings.timerDuration]);



  const levenshteinDistance = (a, b) => {
    const matrix = Array(a.length + 1)
      .fill(null)
      .map(() => Array(b.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) {
      matrix[i][0] = i;
    }
    for (let j = 0; j <= b.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // Suppression
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j - 1] + cost // Substitution
        );
      }
    }

    return matrix[a.length][b.length];
  };

  const normalizeText = (text) => {
    return text
      .normalize("NFD") // ✅ Supprime les accents
      .replace(/[\u0300-\u036f]/g, "") // ✅ Supprime caractères spéciaux
      .toLowerCase() // ✅ Convertit en minuscule
      .trim(); // ✅ Supprime les espaces inutiles
  };

  const handleCheckAnswer = () => {
    const question = questions[currentQuestionIndex];
    let userAnswer = responses[currentQuestionIndex];

    if (!userAnswer || userAnswer.length === 0) {
      setErrorMessage("Veuillez répondre avant de valider.");
      setShowFeedback(false);
      setFeedbackClass("gray"); 
      setFeedback("Réponse non fournie.");
      return;
    }

    setErrorMessage("");
    let isCorrect = false;
    let formattedCorrection = "";

    if (question.type === "Chronologie") {
      isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
      formattedCorrection = question.correctAnswer
        .map((step, index) => `${index + 1} - ${step}`)
        .join("\n");
    } else if (question.type === "Complétion de Texte") {
      const normalizedUserAnswer = normalizeText(userAnswer);
      const normalizedCorrectAnswer = normalizeText(question.correctAnswer);

      isCorrect = normalizedUserAnswer === normalizedCorrectAnswer || levenshteinDistance(normalizedUserAnswer, normalizedCorrectAnswer) <= 2;
      formattedCorrection = question.correctAnswer;
    } else {
      isCorrect = userAnswer === question.correctAnswer;
      formattedCorrection = question.correctAnswer;
    }

    setResponses((prev) => ({
      ...prev,
      [currentQuestionIndex]: userAnswer,
    }));

    setFeedbackClass(isCorrect ? "green" : "red");
    setShowFeedback(false);
    setTimeout(() => {
      setShowFeedback(true);
      setFeedback(`${isCorrect ? "✅ Bonne réponse !" : "❌ Mauvaise réponse !"}\n\nCorrection :\n${formattedCorrection}\n\n📖 Référence : ${question.reference}`);
    }, 100);

    setIsAnswered(true);

    // ✅ Lancer un délai automatique de 5 secondes, sauf si l'utilisateur clique sur "Suivant"
    const nextTimeout = setTimeout(() => {
      handleNextQuestion();
    }, 5000);

    // ✅ Enregistrer le timeout pour l’annuler si l'utilisateur clique sur "Suivant"
    setAutoNextTimeout(nextTimeout);
  };

  const [autoNextTimeout, setAutoNextTimeout] = useState(null);

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
    setQuizStarted(false);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "Chronologie":
        return (
          <ChronologyQuestion
            questionData={question}
            onAnswerChange={(newOrder) =>
              setResponses((prev) => ({
                ...prev,
                [currentQuestionIndex]: newOrder, // 🔥 Corrige la mise à jour de l’état
              }))
            }
          />
        );

      case "Complétion de Texte":
        return (
          <div>
            <h2>{question.question}</h2>
            <input
              type="text"
              value={responses[currentQuestionIndex] || ""}
              onChange={(e) =>
                setResponses((prev) => ({
                  ...prev,
                  [currentQuestionIndex]: e.target.value, // 🔥 Assure que l’input reste modifiable
                }))
              }
              className="input-text"
              placeholder="Tapez votre réponse ici..."
            />
          </div>
        );

      default:
        return (
          <div>
            {question.options.map((option, idx) => (
              <label key={idx} className="option">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  onChange={() =>
                    setResponses((prev) => ({
                      ...prev,
                      [currentQuestionIndex]: option, // 🔥 Corrige la sélection
                    }))
                  }
                  checked={responses[currentQuestionIndex] === option}
                />
                {option}
              </label>
            ))}
          </div>
        );
    }
  };

  if (!quizStarted) {
    return (
      <div className="quiz-settings">
        <h2>Paramètres du Quiz</h2>

        {/* 🎯 Sélecteur du nombre de questions */}
        <label>
          Nombre de questions :
          <input
            type="number"
            min="1"
            max="50"
            value={settings.numQuestions}
            onChange={(e) =>
              setSettings({ ...settings, numQuestions: Number(e.target.value) })
            }
          />
        </label>

        {/* 🎨 Sélecteur du mode d’animation */}
        <div className="mode-selection">
          <label>Style d’animation :</label>
          <select
            value={transitionMode}
            onChange={(e) => setTransitionMode(e.target.value)}
          >
            <option value="fade">Fondu (classique)</option>
            <option value="slide">Glissement (mobile)</option>
          </select>
        </div>

        {/* 🗂 Choix des catégories */}
        <h3>Choisissez les catégories :</h3>
        {["Questions", "Devinettes", "Nombres", "Multi-Choix", "Chronologie"].map(
          (category) => (
            <label key={category}>
              <input
                type="checkbox"
                checked={settings.categories.includes(category)}
                onChange={(e) => {
                  const updatedCategories = e.target.checked
                    ? [...settings.categories, category]
                    : settings.categories.filter((cat) => cat !== category);
                  setSettings((prev) => ({ ...prev, categories: updatedCategories }));
                }}
              />
              {category}
            </label>
          )
        )}

        <button onClick={startQuiz}>Commencer le Quiz</button>
      </div>
    );
  }


  return (
    <div className="question-container">
        <div className="question-header">
          <p className="question-count">
            Question {currentQuestionIndex + 1} / {questions.length}
          </p>

          {questions[currentQuestionIndex] ? (
            <p className="question-text">{questions[currentQuestionIndex].question}</p>
          ) : (
            <p className="question-text">Chargement de la question...</p>
          )}
        </div>
        <div className={`questions-box ${fadeClass}`}>
          {questions[currentQuestionIndex] ? (
            renderQuestion(questions[currentQuestionIndex])
          ) : (
            <p>Chargement...</p>
          )}
      </div>

      {/* ✅ Regroupe le feedback et la navigation pour aligner proprement */}
      <div className="feedback-navigation-wrapper">
        <div className="feedback-box">
          {showFeedback && (
            <div className={`feedback-message ${feedbackClass}`}>
              {feedback.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
        </div>

        <div className="quiz-footer">
          {!isAnswered ? (
            <>
              <button onClick={handleCheckAnswer}>Valider</button>
              <button className="secondary" onClick={handleSkipQuestion}>Passer</button>
              <button className="secondary" onClick={handleQuitQuiz}>Quitter</button>
            </>
          ) : (
            <>
              <button onClick={handleNextQuestion}>Suivant</button>
              <button className="secondary" onClick={handleQuitQuiz}>Quitter</button>
            </>
          )}
        </div>
      </div>
    </div>



  );
};

export default QuestionsComponent;
