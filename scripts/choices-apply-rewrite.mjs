#!/usr/bin/env node
/**
 * Sovella aliagentin tuottamat valintauudistukset pankkiin.
 *
 * Käyttö:
 *   node scripts/choices-apply-rewrite.mjs scripts/data/choice-rewrites/cpp-batch-01.json
 *   node scripts/choices-apply-rewrite.mjs scripts/data/choice-rewrites/*.json --dry-run
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validateRewrittenChoices } from "./choice-rewrite-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const banksDir = resolve(__dirname, "../content/question-banks");
const dryRun = process.argv.includes("--dry-run");
const inputs = process.argv.slice(2).filter((a) => !a.startsWith("--"));

if (inputs.length === 0) {
  console.error("Usage: node scripts/choices-apply-rewrite.mjs <rewrite.json> [...] [--dry-run]");
  process.exit(1);
}

const files = [];
for (const input of inputs) {
  if (input.includes("*")) continue;
  if (input.endsWith(".json")) {
    files.push(resolve(process.cwd(), input));
  }
}

/** @type {Map<string, { bank: string, byId: Map<string, object[]> }>} */
const pending = new Map();

for (const file of files) {
  const data = JSON.parse(readFileSync(file, "utf8"));
  const bank = data.bank;
  if (!bank) {
    console.error(`${file}: missing bank`);
    process.exit(1);
  }
  if (!pending.has(bank)) pending.set(bank, { bank, byId: new Map() });
  const bucket = pending.get(bank);

  for (const rw of data.rewrites || []) {
    if (!rw.id || !rw.choices) {
      console.error(`${file}: rewrite missing id/choices`);
      process.exit(1);
    }
    const errs = validateRewrittenChoices(rw.choices);
    if (errs.length) {
      console.error(`${file} ${rw.id}: ${errs.join("; ")}`);
      process.exit(1);
    }
    if (bucket.byId.has(rw.id)) {
      console.error(`Duplicate rewrite for ${rw.id} in ${bank}`);
      process.exit(1);
    }
    bucket.byId.set(rw.id, rw.choices);
  }
}

let applied = 0;
let skipped = 0;

for (const { bank, byId } of pending.values()) {
  const bankPath = resolve(banksDir, bank);
  const doc = JSON.parse(readFileSync(bankPath, "utf8"));
  const questions = doc.questions || [];

  for (let i = 0; i < questions.length; i += 1) {
    const q = questions[i];
    const newChoices = byId.get(q.id);
    if (!newChoices) continue;

    const correct = newChoices.find((c) => c.correct);
    if (!correct) {
      console.error(`${q.id}: rewrite has no correct`);
      process.exit(1);
    }

    questions[i] = {
      ...q,
      choices: newChoices.map((c) => ({ text: c.text.trim(), correct: Boolean(c.correct) })),
    };
    byId.delete(q.id);
    applied += 1;
  }

  if (byId.size > 0) {
    for (const id of byId.keys()) {
      console.error(`Unknown question id in ${bank}: ${id}`);
      process.exit(1);
    }
  }

  if (!dryRun) {
    writeFileSync(bankPath, `${JSON.stringify(doc, null, 2)}\n`);
    console.log(`Updated ${bank} (${applied} choices in this file)`);
  } else {
    console.log(`[dry-run] Would update ${bank}`);
  }
}

console.log(`Applied rewrites: ${applied}${dryRun ? " (dry-run)" : ""}`);
