const mongoose = require("mongoose");

const referenceSchema = new mongoose.Schema(
  {
    book: { type: String, default: "" },
    chapter: { type: Number, default: null },
    verse: { type: Number, default: null },
    ref: { type: String, default: "" } // ex: "Jean 3:16"
  },
  { _id: false }
);

const pairSchema = new mongoose.Schema(
  {
    left: { type: String, required: true },
    right: { type: String, required: true }
  },
  { _id: false }
);

const generatorMetaSchema = new mongoose.Schema(
  {
    sourceType: { type: String, default: "manual" }, // manual | script | ai
    generatorVersion: { type: String, default: "v1" },
    generatedFromVerseRefs: { type: [String], default: [] },
    batchId: { type: String, default: "" },
    modelName: { type: String, default: "" } // ex: claude-sonnet
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema({
  // Texte principal
  question: {
    type: String,
    required: true,
    trim: true
  },

  // Type de question
  type: {
    type: String,
    enum: [
      "QCM",
      "Texte",
      "GlisserDéposer",
      "VraiFaux",
      "Appariement",
      "Complétion",
      "Image",
      "Chronologie",
      "Reference"
    ],
    default: "QCM"
  },

  // Options pour QCM / certains jeux
  options: {
    type: [String],
    default: []
  },

  // Réponse correcte
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  // Pour appariement
  pairs: {
    type: [pairSchema],
    default: []
  },

  // Temps limite
  timeLimit: {
    type: Number,
    default: 30,
    min: 0
  },

  // Référence simple legacy
  reference: {
    type: String,
    default: ""
  },

  // Référence structurée
  referenceDetails: {
    type: referenceSchema,
    default: () => ({})
  },

  // Texte du verset source utilisé pour générer la question
  sourceVerseText: {
    type: String,
    default: ""
  },

  // Versets liés si une question s’appuie sur plusieurs passages
  sourceVerses: {
    type: [referenceSchema],
    default: []
  },

  // Indice
  hint: {
    type: String,
    default: ""
  },

  // Explication pédagogique affichable après réponse
  explanation: {
    type: String,
    default: ""
  },

  // Niveau
  level: {
    type: String,
    enum: ["Débutant", "Intermédiaire", "Avancé"],
    default: "Débutant"
  },

  // Score de difficulté numérique
  difficultyScore: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },

  // Grande catégorie
  category: {
    type: String,
    default: "Général",
    trim: true
  },

  // Thème plus précis
  theme: {
    type: String,
    default: "",
    trim: true
  },

  // Testament
  testament: {
    type: String,
    enum: ["AT", "NT", ""],
    default: ""
  },

  // Tags libres
  tags: {
    type: [String],
    default: []
  },

  // Statut de validation
  status: {
    type: String,
    enum: ["draft", "approved", "rejected"],
    default: "draft"
  },

  // Origine
  source: {
    type: String,
    enum: ["manual", "script", "claude", "mixed"],
    default: "manual"
  },

  // Métadonnées de génération
  generatorMeta: {
    type: generatorMetaSchema,
    default: () => ({})
  },

  // Empreinte anti-doublon
  questionHash: {
    type: String,
    default: "",
    index: true
  },

  // Soft delete
  isActive: {
    type: Boolean,
    default: true
  },

  // Audit
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

questionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Index utiles
questionSchema.index({ type: 1, level: 1, category: 1, theme: 1 });
questionSchema.index({ status: 1, isActive: 1 });
questionSchema.index({ "referenceDetails.book": 1, "referenceDetails.chapter": 1, "referenceDetails.verse": 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ testament: 1 });

module.exports = mongoose.model("Question", questionSchema);