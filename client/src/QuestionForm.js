import React, { useState } from 'react';

const QuestionForm = ({ questions, sessionId, token }) => {
  const [responses, setResponses] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://b5f3-34-23-100-200.ngrok-free.app/api/sessions/${sessionId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ responses }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setMessage('Responses submitted successfully!');
    } catch (error) {
      setMessage('Error submitting responses: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question) => (
        <div key={question._id}>
          <label>{question.question}</label>
          {question.type === 'QCM' && (
            <select onChange={(e) => handleChange(question._id, e.target.value)}>
              {question.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          )}
          {question.type === 'Champ de Texte' && (
            <input type="text" onChange={(e) => handleChange(question._id, e.target.value)} />
          )}
          {question.type === 'Vrai ou Faux' && (
            <div>
              <label>
                <input type="radio" value="Vrai" name={question._id} onChange={(e) => handleChange(question._id, e.target.value)} />
                Vrai
              </label>
              <label>
                <input type="radio" value="Faux" name={question._id} onChange={(e) => handleChange(question._id, e.target.value)} />
                Faux
              </label>
            </div>
          )}
          {/* Add other question types here */}
        </div>
      ))}
      <button type="submit">Submit Responses</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default QuestionForm;
