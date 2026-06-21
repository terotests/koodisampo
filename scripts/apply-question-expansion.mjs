#!/usr/bin/env node
/**
 * Yhdistää expansion-erän question-bank JSON-tiedostoihin.
 * Käyttö: node scripts/apply-question-expansion.mjs [polku/expansion-batch-NN.mjs]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const banksDir = resolve(__dirname, "../content/question-banks");
const dataDir = resolve(__dirname, "./data");

const FILE_MAP = {
  "cpp-best-practices": "cpp-best-practices.json",
  "scrum-best-practices": "scrum-best-practices.json",
  "linux-ops": "linux-ops.json",
  "docker-ops": "docker-ops.json",
  "qt-dev": "qt-dev.json",
  "javascript-web": "javascript-web.json",
  "postgresql-tuning": "postgresql-tuning.json",
  "git-ci": "git-ci.json",
  "backend-ops": "backend-ops.json",
  "web-security": "web-security.json",
};

function loadExistingIds() {
  const ids = new Set();
  for (const file of Object.values(FILE_MAP)) {
    const path = resolve(banksDir, file);
    const bank = JSON.parse(readFileSync(path, "utf8"));
    for (const q of bank.questions || []) ids.add(q.id);
  }
  return ids;
}

function validateQuestion(q, index) {
  const req = ["id", "chapter", "domain", "difficulty", "audiences", "prompt", "choices", "correctFeedback", "wrongFeedback", "featureId", "featurePoints"];
  for (const k of req) {
    if (q[k] === undefined || q[k] === null || q[k] === "") {
      throw new Error(`Question ${q.id || index}: missing ${k}`);
    }
  }
  if (!Array.isArray(q.choices) || q.choices.length < 2) {
    throw new Error(`Question ${q.id}: need >=2 choices`);
  }
  const correct = q.choices.filter((c) => c.correct);
  if (correct.length !== 1) throw new Error(`Question ${q.id}: need exactly 1 correct`);
}

async function applyBatch(batchPath) {
  const { EXPANSION } = await import(pathToFileURL(batchPath).href);
  const existing = loadExistingIds();
  let added = 0;
  const batchIds = new Set();

  for (const [bankKey, newQuestions] of Object.entries(EXPANSION)) {
    const file = FILE_MAP[bankKey];
    if (!file) throw new Error(`Unknown bank: ${bankKey}`);
    const path = resolve(banksDir, file);
    const bank = JSON.parse(readFileSync(path, "utf8"));

    for (let i = 0; i < newQuestions.length; i += 1) {
      const q = newQuestions[i];
      validateQuestion(q, i);
      if (batchIds.has(q.id) || existing.has(q.id)) {
        throw new Error(`Duplicate id: ${q.id}`);
      }
      batchIds.add(q.id);
      existing.add(q.id);
      bank.questions.push(q);
      added += 1;
    }
    writeFileSync(path, `${JSON.stringify(bank, null, 2)}\n`);
    console.log(`${file}: +${newQuestions.length}`);
  }
  console.log(`Batch ${batchPath}: +${added} (total ids now ${existing.size})`);
  return added;
}

async function main() {
  const arg = process.argv[2];
  if (arg === "--all") {
    const files = readdirSync(dataDir)
      .filter((f) => f.startsWith("expansion-batch-") && f.endsWith(".mjs"))
      .sort();
    let total = 0;
    for (const f of files) {
      total += await applyBatch(resolve(dataDir, f));
    }
    console.log(`Applied ${files.length} batches, +${total} total`);
    return;
  }
  const batchPath = arg
    ? resolve(process.cwd(), arg)
    : resolve(dataDir, "expansion-100.mjs");
  if (!existsSync(batchPath)) throw new Error(`Not found: ${batchPath}`);
  await applyBatch(batchPath);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
