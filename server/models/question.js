"use strict";
// models/question.js
// Version finale — rétrocompatible avec la v1.
// Tous les champs existants sont conservés.
// Ajouts : statics tirer() et stats() pour les jeux.

const mongoose = require("mongoose");

// ─── SOUS-SCHÉMAS ─────────────────────────────────────────────────────────────

const referenceSchema = new mongoose.Schema(
  {
    book:    { type: String,  default: "" },
    chapter: { type: Number,  default: null },
    verse:   { type: Number,  default: null },
    ref:     { type: String,  default: "" },
  },
  { _id: false }
);

const pairSchema = new mongoose.Schema(
  {
    left:  { type: String, required: true },
    right: { type: String, required: true },
  },
  { _id: false }
);

const generatorMetaSchema = new mongoose.Schema(
  {
    sourceType:             { type: String, default: "manual" },
    generatorVersion:       { type: String, default: "v1" },
    generatedFromVerseRefs: { type: [String], default: [] },
    batchId:                { type: String,   default: "" },
    modelName:              { type: String,   default: "" },
  },
  { _id: false }
);

// ─── SCHÉMA PRINCIPAL ─────────────────────────────────────────────────────────

const questionSchema = new mongoose.Schema({

  // ── Contenu ────────────────────────────────────────────────────────────
  question: {
    type:     String,
    required: true,
    trim:     true,
  },

  type: {
    type: String,
    enum: [
      "QCM", "Texte", "GlisserDéposer", "VraiFaux",
      "Appariement", "Complétion", "Image", "Chronologie", "Reference",
    ],
    default: "QCM",
  },

  options: {
    type:    [String],
    default: [],
  },

  correctAnswer: {
    type:     mongoose.Schema.Types.Mixed,
    required: true,
  },

  pairs: {
    type:    [pairSchema],
    default: [],
  },

  timeLimit: {
    type:    Number,
    default: 30,
    min:     0,
  },

  // ── Références bibliques ───────────────────────────────────────────────
  reference: {
    type:    String,
    default: "",
  },

  referenceDetails: {
    type:    referenceSchema,
    default: () => ({}),
  },

  sourceVerseText: {
    type:    String,
    default: "",
  },

  sourceVerses: {
    type:    [referenceSchema],
    default: [],
  },

  // ── Pédagogie ──────────────────────────────────────────────────────────
  hint: {
    type:    String,
    default: "",
  },

  explanation: {
    type:    String,
    default: "",
  },

  // ── Difficulté ─────────────────────────────────────────────────────────
  level: {
    type:    String,
    enum:    ["Débutant", "Intermédiaire", "Avancé"],
    default: "Débutant",
  },

  difficultyScore: {
    type:    Number,
    default: 1,
    min:     1,
    max:     5,
  },

  // ── Classification ─────────────────────────────────────────────────────
  category: {
    type:    String,
    default: "Général",
    trim:    true,
  },

  theme: {
    type:    String,
    default: "",
    trim:    true,
  },

  testament: {
    type:    String,
    enum:    ["AT", "NT", ""],
    default: "",
  },

  tags: {
    type:    [String],
    default: [],
  },

  // ── Workflow ───────────────────────────────────────────────────────────
  status: {
    type:    String,
    enum:    ["draft", "approved", "rejected"],
    default: "draft",
  },

  source: {
    type:    String,
    enum:    ["manual", "script", "claude", "mixed"],
    default: "manual",
  },

  generatorMeta: {
    type:    generatorMetaSchema,
    default: () => ({}),
  },

  // ── Anti-doublon ───────────────────────────────────────────────────────
  questionHash: {
    type:    String,
    default: "",
    index:   true,
  },

  // ── Soft delete ────────────────────────────────────────────────────────
  isActive: {
    type:    Boolean,
    default: true,
  },

  // ── Audit ──────────────────────────────────────────────────────────────
  createdAt: {
    type:    Date,
    default: Date.now,
  },

  updatedAt: {
    type:    Date,
    default: Date.now,
  },
});

// ─── HOOKS ────────────────────────────────────────────────────────────────────

questionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// ─── INDEX ────────────────────────────────────────────────────────────────────

// Index identiques à la v1 uploadée (conservés sans modification)
questionSchema.index({ type: 1, level: 1, category: 1, theme: 1 });
questionSchema.index({ status: 1, isActive: 1 });
questionSchema.index({
  "referenceDetails.book":    1,
  "referenceDetails.chapter": 1,
  "referenceDetails.verse":   1,
});
questionSchema.index({ tags:      1 });
questionSchema.index({ testament: 1 });

// Index supplémentaires utiles
questionSchema.index({ "generatorMeta.batchId": 1 });
questionSchema.index({ testament: 1, level: 1, status: 1 });

// ─── MÉTHODES STATIQUES ───────────────────────────────────────────────────────

/**
 * Tire N questions aléatoires approuvées pour les jeux.
 * Utilise $sample MongoDB — efficace jusqu'à ~100k documents.
 *
 * Usage : const qs = await Question.tirer({ type: 'QCM', level: 'Débutant', n: 10 })
 *
 * @param {object} opts
 * @param {string}  [opts.type]       Filtre par type
 * @param {string}  [opts.level]      Filtre par niveau
 * @param {string}  [opts.testament]  'AT' | 'NT'
 * @param {number}  [opts.n=10]       Nombre de questions
 * @returns {Promise<object[]>}
 */
questionSchema.statics.tirer = async function ({
  type, level, testament, n = 10,
} = {}) {
  const filtre = { isActive: true, status: "approved" };
  if (type)      filtre.type      = type;
  if (level)     filtre.level     = level;
  if (testament) filtre.testament = testament;

  return this.aggregate([
    { $match: filtre },
    { $sample: { size: n } },
    // On retire les champs internes inutiles côté client
    { $project: { questionHash: 0, generatorMeta: 0, sourceVerseText: 0 } },
  ]);
};

/**
 * Statistiques de la collection pour le tableau de bord admin.
 * @returns {Promise<object>}
 */
questionSchema.statics.stats = async function () {
  const [total, parType, parNiveau, parTestament, parStatut] = await Promise.all([
    this.countDocuments({ isActive: true }),
    this.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$type",      count: { $sum: 1 } } },
      { $sort:  { count: -1 } },
    ]),
    this.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$level",     count: { $sum: 1 } } },
    ]),
    this.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$testament", count: { $sum: 1 } } },
    ]),
    this.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$status",    count: { $sum: 1 } } },
    ]),
  ]);

  return { total, parType, parNiveau, parTestament, parStatut };
};

module.exports = mongoose.model("Question", questionSchema);
