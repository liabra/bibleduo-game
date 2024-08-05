// models/question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true },
  timeLimit: Number
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
