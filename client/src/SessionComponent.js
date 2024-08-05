// src/SessionComponent.js
import React, { useEffect, useState } from 'react';
import QuestionsComponent from './QuestionsComponent';

const SessionComponent = ({ sessionId }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`https://35f2-34-23-100-200.ngrok-free.app/api/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error('Failed to fetch session:', error);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Session Questions</h2>
      <QuestionsComponent questions={session.questions} />
    </div>
  );
};

export default SessionComponent;
