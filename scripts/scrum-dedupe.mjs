#!/usr/bin/env node
/**
 * Poistaa toistuvat Scrum-kysymykset pankista.
 * Lista: scripts/data/scrum-dedupe-remove.json
 *
 * Käyttö: node scripts/scrum-dedupe.mjs [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const bankPath = path.join(root, "content/question-banks/scrum-best-practices.json");
const removePath = path.join(__dirname, "data/scrum-dedupe-remove.json");
const dryRun = process.argv.includes("--dry-run");

const removeIds = new Set(JSON.parse(fs.readFileSync(removePath, "utf8")));
const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const before = bank.questions.length;

const missing = [...removeIds].filter((id) => !bank.questions.some((q) => q.id === id));
if (missing.length) {
  console.warn("IDs not in bank:", missing.join(", "));
}

const kept = bank.questions.filter((q) => !removeIds.has(q.id));
const removed = bank.questions.filter((q) => removeIds.has(q.id));

console.log(`Before: ${before}, remove: ${removed.length}, after: ${kept.length}`);

if (dryRun) {
  console.log("\nRemoved:");
  removed.forEach((q) => console.log(`  ${q.id} (${q.chapter})`));
  process.exit(0);
}

bank.questions = kept;
fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);

const manifestPath = path.join(root, "content/study-manifest.json");
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  let updated = false;
  for (const entry of manifest.domains || manifest.topics || []) {
    if (entry.domain === "scrum" || entry.id === "scrum") {
      entry.questionCount = kept.length;
      updated = true;
    }
  }
  if (Array.isArray(manifest.banks)) {
    for (const b of manifest.banks) {
      if (b.id === "scrum-best-practices" || b.domain === "scrum") {
        b.questionCount = kept.length;
        updated = true;
      }
    }
  }
  if (manifest.byDomain?.scrum) {
    manifest.byDomain.scrum.total = kept.length;
    updated = true;
  }
  if (updated) {
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log("Updated content/study-manifest.json");
  }
}

console.log("Wrote", bankPath);
