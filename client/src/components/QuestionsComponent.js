import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionsComponent.css';

const questionBank = [ { question: "Quel est le premier livre du Nouveau Testament ?", type: "QCM", options: ["Matthieu", "Marc", "Luc", "Jean"], correctAnswer: "Matthieu" }, { question: "Combien de jours et de nuits Jésus a-t-il jeûné dans le désert ?", type: "Complétion de Texte", options: [], correctAnswer: "40 jours et 40 nuits" }, { question: "Qui a baptisé Jésus ?", type: "QCM", options: ["Jean-Baptiste", "Pierre", "Paul", "Jacques"], correctAnswer: "Jean-Baptiste" }, { question: "Jésus a-t-il multiplié les pains et les poissons pour nourrir la foule ?", type: "Vrai ou Faux", options: ["Vrai", "Faux"], correctAnswer: "Vrai" }, { question: "Dans quel village est né Jésus ?", type: "QCM", options: ["Nazareth", "Bethléem", "Capharnaüm", "Jérusalem"], correctAnswer: "Bethléem" }, { question: "Combien de disciples Jésus avait-il ?", type: "QCM", options: ["10", "11", "12", "13"], correctAnswer: "12" }, { question: "Quel apôtre a trahi Jésus ?", type: "QCM", options: ["Pierre", "Judas", "Jean", "Jacques"], correctAnswer: "Judas" }, { question: "Quel miracle Jésus a-t-il accompli lors des noces de Cana ?", type: "QCM", options: ["Multiplication des pains", "Guérison d'un aveugle", "Transformation de l'eau en vin", "Marche sur l'eau"], correctAnswer: "Transformation de l'eau en vin" }, { question: "Quel est le symbole de l'Esprit Saint ?", type: "QCM", options: ["Feu", "Colombe", "Eau", "Vent"], correctAnswer: "Colombe" }, { question: "Quel est le dernier livre de la Bible ?", type: "QCM", options: ["Apocalypse", "Actes des Apôtres", "Éphésiens", "Jude"], correctAnswer: "Apocalypse" }, { question: "Jésus a-t-il marché sur l'eau ?", type: "Vrai ou Faux", options: ["Vrai", "Faux"], correctAnswer: "Vrai" }, { question: "Qui est connu comme l'apôtre des Gentils ?", type: "QCM", options: ["Pierre", "Jean", "Paul", "Jacques"], correctAnswer: "Paul" }, { question: "Quel apôtre a renié Jésus trois fois ?", type: "QCM", options: ["Pierre", "Jean", "Judas", "Jacques"], correctAnswer: "Pierre" }, { question: "Quelle est la prière enseignée par Jésus ?", type: "QCM", options: ["Je vous salue Marie", "Notre Père", "Gloire à Dieu", "Credo"], correctAnswer: "Notre Père" }, { question: "Quel était le métier de Matthieu avant de suivre Jésus ?", type: "QCM", options: ["Pêcheur", "Médecin", "Collecteur d'impôts", "Charpentier"], correctAnswer: "Collecteur d'impôts" }, { question: "Combien de personnes Jésus a-t-il nourries avec cinq pains et deux poissons ?", type: "QCM", options: ["3000", "4000", "5000", "6000"], correctAnswer: "5000" }, { question: "Quel était le nom de la mère de Jésus ?", type: "QCM", options: ["Marie", "Marthe", "Marie-Madeleine", "Elisabeth"], correctAnswer: "Marie" }, { question: "Quel disciple est surnommé 'le disciple que Jésus aimait' ?", type: "QCM", options: ["Pierre", "Jean", "Jacques", "André"], correctAnswer: "Jean" }, { question: "Quel était le nom du jardin où Jésus a été arrêté ?", type: "QCM", options: ["Gethsémani", "Éden", "Bethphagé", "Béthanie"], correctAnswer: "Gethsémani" }, { question: "Quel est le plus grand commandement selon Jésus ?", type: "QCM", options: ["Aime ton prochain comme toi-même", "Aime le Seigneur ton Dieu", "Ne pas tuer", "Ne pas voler"], correctAnswer: "Aime le Seigneur ton Dieu" }, { question: "Quel était le nom du fleuve où Jésus a été baptisé ?", type: "QCM", options: ["Nil", "Jourdain", "Euphrate", "Tigre"], correctAnswer: "Jourdain" }, { question: "Qui est le père de Jean-Baptiste ?", type: "QCM", options: ["Joseph", "Zacharie", "Siméon", "Lévi"], correctAnswer: "Zacharie" }, { question: "Qui a demandé la tête de Jean-Baptiste ?", type: "QCM", options: ["Hérodiade", "Salomé", "Hérode", "Pilate"], correctAnswer: "Salomé" }, { question: "Qui est le frère de Marthe ?", type: "QCM", options: ["Pierre", "Lazare", "Jean", "Jacques"], correctAnswer: "Lazare" }, { question: "Combien de tentations Jésus a-t-il subies dans le désert ?", type: "QCM", options: ["1", "2", "3", "4"], correctAnswer: "3" }, { question: "Quel est le signe de l'alliance entre Dieu et Noé ?", type: "QCM", options: ["Arc-en-ciel", "Colombe", "Olive", "Feu"], correctAnswer: "Arc-en-ciel" }, { question: "Qui a écrit les Actes des Apôtres ?", type: "QCM", options: ["Paul", "Jean", "Pierre", "Luc"], correctAnswer: "Luc" }, { question: "Combien de chapitres contient le livre de l'Apocalypse ?", type: "QCM", options: ["20", "21", "22", "23"], correctAnswer: "22" }, { question: "Quel apôtre a été le premier martyr ?", type: "QCM", options: ["Pierre", "Paul", "Jacques", "Étienne"], correctAnswer: "Étienne" }, { question: "Combien de fruits de l'Esprit sont mentionnés dans Galates ?", type: "QCM", options: ["7", "8", "9", "10"], correctAnswer: "9" }, { question: "Quelle est la première béatitude ?", type: "QCM", options: ["Bienheureux les pauvres en esprit", "Bienheureux ceux qui pleurent", "Bienheureux les doux", "Bienheureux ceux qui ont faim et soif de justice"], correctAnswer: "Bienheureux les pauvres en esprit" }, { question: "Qui a construit l'arche ?", type: "QCM", options: ["Noé", "Moïse", "Abraham", "Élie"], correctAnswer: "Noé" }, { question: "Quel prophète a été avalé par un grand poisson ?", type: "QCM", options: ["Jonas", "Ésaïe", "Ézéchiel", "Jérémie"], correctAnswer: "Jonas" }, { question: "Quel est le premier commandement ?", type: "QCM", options: ["Tu n'auras pas d'autres dieux devant moi", "Tu ne feras pas d'idoles", "Tu ne prendras pas le nom de l'Éternel en vain", "Souviens-toi du jour du repos"], correctAnswer: "Tu n'auras pas d'autres dieux devant moi" }, { question: "Combien de fois Jésus a-t-il prédit sa mort et sa résurrection ?", type: "QCM", options: ["1", "2", "3", "4"], correctAnswer: "3" }, { question: "Quel était le nom du géant vaincu par David ?", type: "QCM", options: ["Goliath", "Og", "Sihon", "Anak"], correctAnswer: "Goliath" }, { question: "Quel est le nom hébreu de Jésus ?", type: "QCM", options: ["Yeshua", "Yohanan", "Yitzhak", "Yaakov"], correctAnswer: "Yeshua" }, { question: "Quel est le plus grand commandement selon Jésus ?", type: "QCM", options: ["Aime le Seigneur ton Dieu", "Aime ton prochain comme toi-même", "Ne pas tuer", "Ne pas voler"], correctAnswer: "Aime le Seigneur ton Dieu" }, { question: "Quel est le signe de l'alliance entre Dieu et Abraham ?", type: "QCM", options: ["Circoncision", "Sabbat", "Arc-en-ciel", "Sacrifice"], correctAnswer: "Circoncision" }, { question: "Quel est le dernier mot de la Bible ?", type: "QCM", options: ["Amen", "Alléluia", "Fin", "Grâce"], correctAnswer: "Amen" }, { question: "Quel est le nom du premier martyr chrétien ?", type: "QCM", options: ["Étienne", "Jacques", "Jean", "Pierre"], correctAnswer: "Étienne" }, { question: "Quel est le premier miracle de Jésus ?", type: "QCM", options: ["Transformation de l'eau en vin", "Guérison d'un aveugle", "Multiplication des pains", "Marche sur l'eau"], correctAnswer: "Transformation de l'eau en vin" }, { question: "Quel est le plus court verset de la Bible ?", type: "QCM", options: ["Jésus pleura", "Dieu est amour", "Aime ton prochain", "Dieu est lumière"], correctAnswer: "Jésus pleura" }, { question: "Quel est le nom de l'ange qui a annoncé la naissance de Jésus ?", type: "QCM", options: ["Gabriel", "Michel", "Raphaël", "Uriel"], correctAnswer: "Gabriel" }, { question: "Quel est le plus grand commandement ?", type: "QCM", options: ["Aime le Seigneur ton Dieu", "Aime ton prochain comme toi-même", "Ne pas tuer", "Ne pas voler"], correctAnswer: "Aime le Seigneur ton Dieu" }, { question: "Combien de jours Jonas a-t-il passé dans le ventre du grand poisson ?", type: "QCM", options: ["1", "2", "3", "4"], correctAnswer: "3" }, { question: "Quel est le nom du disciple qui a douté de la résurrection de Jésus ?", type: "QCM", options: ["Thomas", "Pierre", "Jean", "Jacques"], correctAnswer: "Thomas" }, { question: "Quel est le nom de l'apôtre qui a écrit l'Apocalypse ?", type: "QCM", options: ["Jean", "Pierre", "Paul", "Jacques"], correctAnswer: "Jean" }, { question: "Quel est le nom de la mer où Jésus a marché sur l'eau ?", type: "QCM", options: ["Mer de Galilée", "Mer Morte", "Mer Rouge", "Mer Méditerranée"], correctAnswer: "Mer de Galilée" }, { question: "Quel est le nom de l'apôtre qui a trahi Jésus ?", type: "QCM", options: ["Judas", "Pierre", "Jean", "Jacques"], correctAnswer: "Judas" }, ];

const getRandomQuestions = (numQuestions) => {
  const shuffled = questionBank.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numQuestions);
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
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    setQuestions(getRandomQuestions(10));
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setShowFeedback(false);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      if ((currentQuestionIndex + 1) % 4 === 0) {
        setTimeLeft(30);
      }
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

  useEffect(() => {
    if (timeLeft > 0 && currentQuestionIndex % 4 === 0 && !isAnswered) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
    if (timeLeft === 20) {
      document.getElementById('timer').classList.add('orange');
    } else if (timeLeft === 10) {
      document.getElementById('timer').classList.add('orange-blink');
    } else if (timeLeft === 5) {
      document.getElementById('timer').classList.add('red-blink');
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, currentQuestionIndex, isAnswered]);

  const handleCheckAnswer = () => {
    const question = questions[currentQuestionIndex];
    const isCorrect = responses[currentQuestionIndex] === question.correctAnswer;
    if (isCorrect) {
      setFeedback('Bien joué');
      setFeedbackColor('green');
      setTimeout(handleNextQuestion, 1000); // Passer automatiquement à la question suivante après 1 seconde
    } else {
      setFeedback(`Dommage, la bonne réponse est : ${question.correctAnswer}`);
      setFeedbackColor('red');
    }
    setShowFeedback(true);
    setIsAnswered(true);
  };

  if (!questions.length) return <div>Loading...</div>;

  const question = questions[currentQuestionIndex];

  return (
    <div className="question-container">
      <div className="question-header">
        <p className="question-count">Question {currentQuestionIndex + 1} / {questions.length}</p>
        <p className="question-text">{question.question}</p>
      </div>
      <form>
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
          {question.type === "Complétion de Texte" && (
            <label className="option">
              <input
                type="text"
                name={`question-${currentQuestionIndex}`}
                value={responses[currentQuestionIndex] || ''}
                onChange={(e) => handleChange(e.target.value)}
                disabled={isAnswered}
              />
            </label>
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
        {showFeedback && <p style={{ color: feedbackColor }}>{feedback}</p>}
      </form>
    </div>
  );
};

export default QuestionsComponent;
