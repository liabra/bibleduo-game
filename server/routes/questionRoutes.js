"use strict";
// routes/questionRoutes.js
// Routes API Questions — extension rétrocompatible de la v1.
//
// Toutes les routes existantes sont conservées.
// Nouvelles routes préfixées par un commentaire [NOUVEAU].

const express  = require("express");
const router   = express.Router();
const Question = require("../models/question");

// ─── ROUTES V1 (INCHANGÉES) ───────────────────────────────────────────────────

// POST /questions — créer une question manuellement
router.post("/questions", async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).send(question);
  } catch (error) {
    res.status(400).send({ errorResponse: error.message });
  }
});

// GET /questions — récupérer les questions
// [AMÉLIORÉ] filtres optionnels en query string
// ex: GET /questions?type=QCM&level=Débutant&testament=NT&status=approved&limit=20
router.get("/questions", async (req, res) => {
  try {
    const filtre = { isActive: true };

    if (req.query.type)      filtre.type                    = req.query.type;
    if (req.query.level)     filtre.level                   = req.query.level;
    if (req.query.testament) filtre.testament               = req.query.testament;
    if (req.query.status)    filtre.status                  = req.query.status;
    if (req.query.category)  filtre.category                = req.query.category;
    if (req.query.book)      filtre["referenceDetails.book"] = req.query.book;

    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const skip  = parseInt(req.query.skip) || 0;

    const [questions, total] = await Promise.all([
      Question.find(filtre)
        .select("-questionHash -generatorMeta -sourceVerseText")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      Question.countDocuments(filtre),
    ]);

    res.status(200).send({ total, count: questions.length, skip, limit, data: questions });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// ─── ROUTES V2 [NOUVELLES] ────────────────────────────────────────────────────

// [NOUVEAU] GET /questions/random — tirage aléatoire pour les jeux
// ex: GET /questions/random?n=10&type=QCM&testament=NT&level=Débutant
router.get("/questions/random", async (req, res) => {
  try {
    const n         = Math.min(parseInt(req.query.n) || 10, 50);
    const type      = req.query.type      || undefined;
    const level     = req.query.level     || undefined;
    const testament = req.query.testament || undefined;

    const questions = await Question.tirer({ type, level, testament, n });

    if (questions.length === 0) {
      return res.status(404).send({
        error: "Aucune question approuvée avec ces critères.",
        conseil: "Vérifiez que des questions ont le statut 'approved'.",
      });
    }

    res.status(200).send({ count: questions.length, data: questions });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// [NOUVEAU] GET /questions/stats — statistiques pour tableau de bord admin
router.get("/questions/stats", async (req, res) => {
  try {
    const stats = await Question.stats();
    res.status(200).send(stats);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// [NOUVEAU] GET /questions/:id — une question par ID
router.get("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).lean();
    if (!question) return res.status(404).send({ error: "Question introuvable." });
    res.status(200).send(question);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// [NOUVEAU] PATCH /questions/:id/approve — approuver une question (draft → approved)
router.patch("/questions/:id/approve", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { status: "approved", updatedAt: new Date() },
      { new: true }
    );
    if (!question) return res.status(404).send({ error: "Question introuvable." });
    res.status(200).send(question);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// [NOUVEAU] PATCH /questions/:id/reject — rejeter une question
router.patch("/questions/:id/reject", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", updatedAt: new Date() },
      { new: true }
    );
    if (!question) return res.status(404).send({ error: "Question introuvable." });
    res.status(200).send(question);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// [NOUVEAU] PATCH /questions/batch/approve — approuver tout un lot par batchId
// Body : { "batchId": "batch-1234567890" }
router.patch("/questions/batch/approve", async (req, res) => {
  try {
    const { batchId } = req.body;
    if (!batchId) {
      return res.status(400).send({ error: "batchId requis dans le body." });
    }

    const resultat = await Question.updateMany(
      { "generatorMeta.batchId": batchId, status: "draft" },
      { $set: { status: "approved", updatedAt: new Date() } }
    );

    res.status(200).send({
      message:       `${resultat.modifiedCount} question(s) approuvée(s)`,
      batchId,
      modifiedCount: resultat.modifiedCount,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// [NOUVEAU] DELETE /questions/:id — soft delete (isActive: false)
router.delete("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    if (!question) return res.status(404).send({ error: "Question introuvable." });
    res.status(200).send({ message: "Question désactivée.", id: req.params.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
