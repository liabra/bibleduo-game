require("dotenv").config();
const mongoose = require("mongoose");

const bibleData = require("../../src/data/bibleData");

const Question = require("../models/question");

const { generateQuestionsFromVerse } = require("../utils/generators");
const { computeHash } = require("../utils/deduplication");

async function main() {

  await mongoose.connect(process.env.MONGO_URI);

  console.log("Bible verses:", bibleData.length);

  let inserted = 0;

  for (const verse of bibleData) {

    const questions = generateQuestionsFromVerse(verse);

    for (const q of questions) {

      q.questionHash = computeHash(q.question);

      const exists = await Question.findOne({
        questionHash: q.questionHash
      });

      if (exists) continue;

      await Question.create({
        ...q,
        source: "script",
        status: "draft",
        generatorMeta: {
          sourceType: "script",
          generatedFromVerseRefs: [verse.ref]
        }
      });

      inserted++;
    }
  }

  console.log("Questions insérées:", inserted);

  process.exit();
}

main();