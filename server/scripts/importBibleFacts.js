require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("../models/question");
const { BIBLE_FACTS } = require("../../src/data/bibleData");

function shuffle(arr = []) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function slugify(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connecté à MongoDB");

  let inserted = 0;
  let skipped = 0;

  for (const fact of BIBLE_FACTS) {
    const options = shuffle([fact.answer, ...(fact.wrong || [])]);

    const questionHash = slugify(`${fact.question}-${fact.answer}`);

    const exists = await Question.findOne({ questionHash });

    if (exists) {
      skipped++;
      continue;
    }

    await Question.create({
      question: fact.question,
      type: "QCM",
      options,
      correctAnswer: fact.answer,
      pairs: [],
      timeLimit: 30,
      reference: "",
      referenceDetails: {
        book: "",
        chapter: null,
        verse: null,
        ref: ""
      },
      sourceVerseText: "",
      sourceVerses: [],
      hint: fact.hint || "",
      explanation: "",
      level: "Débutant",
      difficultyScore: 1,
      category: "Culture biblique",
      theme: "Connaissances générales",
      testament: "",
      tags: ["bible", "culture-biblique", "qcm"],
      status: "approved",
      source: "manual",
      generatorMeta: {
        sourceType: "manual",
        generatorVersion: "v1",
        generatedFromVerseRefs: [],
        batchId: "bible-facts-import",
        modelName: ""
      },
      questionHash,
      isActive: true
    });

    inserted++;
  }

  console.log(`✅ Questions insérées : ${inserted}`);
  console.log(`⏭️ Questions ignorées (déjà présentes) : ${skipped}`);

  await mongoose.disconnect();
  console.log("🏁 Import terminé");
}

main().catch((err) => {
  console.error("❌ Erreur import :", err);
  process.exit(1);
});