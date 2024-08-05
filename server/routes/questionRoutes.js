// routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// Route pour créer une question
router.post('/questions', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).send(question);
  } catch (error) {
    res.status(400).send({ errorResponse: error });
  }
});

// Route pour récupérer les questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).send(questions);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
