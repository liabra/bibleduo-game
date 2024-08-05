const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const Question = require('../models/question');

// Route pour créer une session
router.post('/sessions', async (req, res) => {
  try {
    const questions = await Question.find().limit(40); // Limite à 40 questions
    const session = new Session({ userId: req.body.userId, questions });
    await session.save();
    res.status(201).send(session);
  } catch (error) {
    res.status(400).send({ errorResponse: error });
  }
});

// Route pour récupérer une session
router.get('/sessions/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('questions');
    res.status(200).send(session);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route pour enregistrer une réponse
router.post('/sessions/:id/responses', async (req, res) => {
  try {
    const { questionId, response } = req.body;
    const session = await Session.findById(req.params.id);
    const question = await Question.findById(questionId);

    if (!session || !question) {
      return res.status(404).send('Session or Question not found');
    }

    const isCorrect = question.correctAnswer === response;
    session.responses.push({ questionId, response, correct: isCorrect });
    await session.save();

    res.status(201).send(session);
  } catch (error) {
    res.status(400).send({ errorResponse: error });
  }
});

module.exports = router;
