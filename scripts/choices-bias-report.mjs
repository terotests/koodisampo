#!/usr/bin/env node
/**
 * Raportoi valintojen pituusvinouma.
 * Käyttö: node scripts/choices-bias-report.mjs [--json] [--bank cpp-best-practices.json]
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { choiceBiasMetrics } from "./choice-rewrite-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const banksDir = resolve(__dirname, "../content/question-banks");
const asJson = process.argv.includes("--json");
const bankFilter = process.argv.find((a) => a.endsWith(".json") && !a.includes("node"));

const files = readdirSync(banksDir)
  .filter((f) => f.endsWith(".json"))
  .filter((f) => !bankFilter || f === bankFilter)
  .sort();

let total = 0;
let biased = 0;
const byBank = [];

for (const file of files) {
  const bank = JSON.parse(readFileSync(resolve(banksDir, file), "utf8"));
  let bankTotal = 0;
  let bankBiased = 0;
  const worst = [];

  for (const q of bank.questions || []) {
    bankTotal += 1;
    total += 1;
    const m = choiceBiasMetrics(q.choices);
    if (m.biased) {
      bankBiased += 1;
      biased += 1;
      worst.push({ id: q.id, ratio: m.ratio, spread: m.spread, prompt: q.prompt?.slice(0, 70) });
    }
  }

  worst.sort((a, b) => b.ratio - a.ratio);
  byBank.push({ file, total: bankTotal, biased: bankBiased, pct: bankTotal ? ((100 * bankBiased) / bankTotal).toFixed(1) : "0", worst: worst.slice(0, 3) });
}

if (asJson) {
  console.log(JSON.stringify({ total, biased, pct: ((100 * biased) / total).toFixed(1), byBank }, null, 2));
} else {
  console.log(`Questions: ${total}`);
  console.log(`Length-biased: ${biased} (${((100 * biased) / total).toFixed(1)}%)`);
  console.log("");
  for (const b of byBank) {
    console.log(`${b.file}: ${b.biased}/${b.total} (${b.pct}%)`);
    for (const w of b.worst) {
      console.log(`  · ${w.id} (ratio ${w.ratio}) — ${w.prompt}…`);
    }
  }
}
