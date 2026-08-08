#!/usr/bin/env node
/**
 * One-shot / idempotent: extract language version tags from question text
 * and set bank-level defaultVersions for language-heavy banks.
 *
 * Usage: node scripts/backfill-question-versions.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const banksDir = resolve(__dirname, "../content/question-banks");

/** Canonical label + matchers (first match wins for that family). */
const EXTRACTORS = [
  { label: "C++23", re: /\bC\+\+23\b/i },
  { label: "C++20", re: /\bC\+\+20\b/i },
  { label: "C++17", re: /\bC\+\+17\b/i },
  { label: "C++14", re: /\bC\+\+14\b/i },
  { label: "C++11", re: /\bC\+\+11\b/i },
  { label: "ES2024", re: /\bES2024\b/i },
  { label: "ES2023", re: /\bES2023\b/i },
  { label: "ES2022", re: /\bES2022\b/i },
  { label: "ES2021", re: /\bES2021\b/i },
  { label: "ES2020", re: /\bES2020\b/i },
  { label: "ES2019", re: /\bES2019\b/i },
  { label: "ES2018", re: /\bES2018\b/i },
  { label: "ES2017", re: /\bES2017\b/i },
  { label: "ES2015", re: /\bES2015\b|\bES6\b/i },
  { label: "Qt 6", re: /\bQt\s*6\b/i },
  { label: "Qt 5", re: /\bQt\s*5\b/i },
  { label: "Edition 2024", re: /\bEdition\s*2024\b|\bRust\s*2024\b/i },
  { label: "Edition 2021", re: /\bEdition\s*2021\b|\bRust\s*2021\b/i },
  { label: "Edition 2018", re: /\bEdition\s*2018\b|\bRust\s*2018\b/i },
];

const BANK_DEFAULTS = {
  "cpp-best-practices": ["C++17"],
  "javascript-web": ["ES2020"],
  "qt-dev": ["Qt 6"],
  "qt-native-game": ["Qt 6"],
  rust: ["Edition 2021"],
};

function questionBlob(q) {
  return [
    q.prompt,
    q.correctFeedback,
    q.wrongFeedback,
    q.studyNotes,
    ...(q.choices || []).map((c) => c.text),
  ]
    .filter(Boolean)
    .join("\n");
}

function extractVersions(text) {
  const found = [];
  const seen = new Set();
  for (const { label, re } of EXTRACTORS) {
    if (re.test(text) && !seen.has(label)) {
      seen.add(label);
      found.push(label);
    }
  }
  return found;
}

function sameVersions(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

let banksTouched = 0;
let questionsTagged = 0;

for (const file of readdirSync(banksDir).filter((f) => f.endsWith(".json") && f !== "manifest.json")) {
  const path = resolve(banksDir, file);
  const bank = JSON.parse(readFileSync(path, "utf8"));
  const bankKey = bank.id || file.replace(/\.json$/, "");
  let changed = false;

  const defaults = BANK_DEFAULTS[bankKey];
  if (defaults && !sameVersions(bank.defaultVersions, defaults)) {
    bank.defaultVersions = defaults;
    changed = true;
  }

  for (const q of bank.questions || []) {
    const extracted = extractVersions(questionBlob(q));
    if (!extracted.length) continue;
    if (sameVersions(q.versions, extracted)) continue;
    q.versions = extracted;
    changed = true;
    questionsTagged += 1;
  }

  if (changed) {
    writeFileSync(path, `${JSON.stringify(bank, null, 2)}\n`, "utf8");
    banksTouched += 1;
    console.log(`updated ${file}`);
  }
}

console.log(`Banks touched: ${banksTouched}`);
console.log(`Questions with explicit versions set/updated: ${questionsTagged}`);
