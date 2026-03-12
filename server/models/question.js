// server/models/question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  // 🧠 Texte principal de la question
  question: { type: String, required: true },

  // 🎯 Type de question (QCM, Vrai/Faux, Appariement, etc.)
  type: {
    type: String,
    enum: [
      'QCM',
      'Texte',
      'GlisserDéposer',
      'VraiFaux',
      'Appariement',
      'Complétion',
      'Image',
      'Chronologie'
    ],
    default: 'QCM'
  },

  // 🧩 Liste d’options (facultative)
  options: {
    type: [String],
    default: []
  },

  // ✅ Réponse correcte (texte ou structure)
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  // 🕐 Temps limite (secondes)
  timeLimit: { type: Number, default: 0 },

  // 📖 Référence biblique (ex: Matthieu 9:9)
  reference: { type: String },

  // 💡 Indice facultatif
  hint: { type: String },

  // 🧭 Niveau de difficulté
  level: {
    type: String,
    enum: ['Débutant', 'Intermédiaire', 'Avancé'],
    default: 'Débutant'
  },

  // 🗂 Catégorie (ex : Chronologie, Devinettes…)
  category: { type: String, default: 'Général' },

  // 📅 Date de création automatique
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
