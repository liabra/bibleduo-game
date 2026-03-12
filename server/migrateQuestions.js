// server/migrateQuestions.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
console.log("🔍 MONGO_URI détecté :", process.env.MONGO_URI);

const Question = require("./models/question");


// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log("✅ Connecté à MongoDB pour la migration…");

    const questions = await Question.find();
    console.log(`📦 ${questions.length} questions trouvées.`);

    let updatedCount = 0;

    for (const q of questions) {
      let updated = false;

      // 🧭 Niveau de difficulté par défaut
      if (!q.level) {
        q.level = "Débutant";
        updated = true;
      }

      // 🗂 Catégorie
      if (!q.category) {
        q.category = "Général";
        updated = true;
      }

      // 📖 Référence
      if (!q.reference) {
        q.reference = "";
        updated = true;
      }

      // 💡 Indice
      if (!q.hint) {
        q.hint = "";
        updated = true;
      }

      // 🕐 Temps limite
      if (typeof q.timeLimit !== "number") {
        q.timeLimit = 0;
        updated = true;
      }

      // 🧩 Options
      if (!Array.isArray(q.options)) {
        if (q.options && typeof q.options === "string") {
          q.options = [q.options];
        } else {
          q.options = [];
        }
        updated = true;
      }

      // ✅ Type cohérent
      const allowedTypes = [
        "QCM",
        "Texte",
        "GlisserDéposer",
        "VraiFaux",
        "Appariement",
        "Complétion",
        "Image",
        "Chronologie"
      ];
      if (!allowedTypes.includes(q.type)) {
        q.type = "QCM";
        updated = true;
      }

      // 📅 Date de création
      if (!q.createdAt) {
        q.createdAt = new Date();
        updated = true;
      }

      // Enregistrer si des champs ont été ajoutés
      if (updated) {
        await q.save();
        updatedCount++;
      }
    }

    console.log(`✨ Migration terminée. ${updatedCount} documents mis à jour.`);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion MongoDB :", err);
  });
