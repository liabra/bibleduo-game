"use strict";
// server/scripts/approveAll.js
// ─────────────────────────────────────────────────────────────────────────────
// Approuve en masse toutes les questions status:"draft" dans MongoDB.
// Utile après un premier generateQuestions.js sans --auto-approve.
//
// Usage :
//   node server/scripts/approveAll.js
//   node server/scripts/approveAll.js --dry-run   (affiche le compte sans modifier)
//   node server/scripts/approveAll.js --batch <batchId>  (un seul batch)
// ─────────────────────────────────────────────────────────────────────────────

require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("../models/question");

const args     = process.argv.slice(2);
const DRY_RUN  = args.includes("--dry-run");
const batchIdx = args.indexOf("--batch");
const BATCH_ID = batchIdx !== -1 ? args[batchIdx + 1] : null;

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("\n❌ MONGO_URI manquant dans .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("\n🔗 Connecté à MongoDB");

  const filter = { status: "draft" };
  if (BATCH_ID) filter["generatorMeta.batchId"] = BATCH_ID;

  const count = await Question.countDocuments(filter);

  console.log(`\n  Questions status:"draft" trouvées : ${count}`);
  if (BATCH_ID) console.log(`  Filtre batchId : ${BATCH_ID}`);

  if (count === 0) {
    console.log("\n  Rien à approuver.\n");
    await mongoose.disconnect();
    return;
  }

  if (DRY_RUN) {
    console.log("\n  🔍 DRY RUN — aucune modification effectuée.");
    console.log(`  ${count} questions seraient approuvées.\n`);
  } else {
    const result = await Question.updateMany(filter, {
      $set: { status: "approved", updatedAt: new Date() },
    });
    console.log(`\n  ✅ ${result.modifiedCount} questions approuvées.\n`);
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error("\n💥 Erreur :", err.message || err);
  process.exit(1);
});
