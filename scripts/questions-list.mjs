#!/usr/bin/env node
/**
 * Tulostaa kysymyspankin inventaarion: määrät, luvut, puuttuvat topicit.
 * Käyttö: node scripts/questions-list.mjs [--json]
 */
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";

const EXPECTED_CHAPTERS = [
  "tools", "style", "safety", "maintainability", "performance", "portability",
  "threadability", "correctness",
  "scrum-dod", "scrum-dor", "scrum-estimation", "scrum-sprint", "scrum-team",
  "systemd", "journald", "linux-network", "avahi",
  "docker", "docker-network", "docker-volumes",
  "qt-widgets", "qt-signals", "qt-threading", "qt-models", "qt-opengl", "qt-shaders",
  "js-async", "js-types", "js-modules", "js-runtime", "js-typescript",
  "pg-indexes", "pg-explain", "pg-vacuum", "pg-config",
  "cpp-production", "docker-production",
  "git-workflow", "git-ci",
  "backend-data", "backend-api", "ops-incident",
  "web-security",
];

const asJson = process.argv.includes("--json");
const questions = listAllQuestions();

const byDomain = {};
const byChapter = {};
const ids = new Set();
const duplicates = [];

for (const q of questions) {
  byDomain[q.domain] = (byDomain[q.domain] || 0) + 1;
  const ch = q.chapter || "(none)";
  byChapter[ch] = (byChapter[ch] || 0) + 1;
  if (ids.has(q.id)) duplicates.push(q.id);
  ids.add(q.id);
}

const missingChapters = EXPECTED_CHAPTERS.filter((ch) => !byChapter[ch]);
const thinChapters = EXPECTED_CHAPTERS.filter((ch) => (byChapter[ch] || 0) < 3);

const summary = {
  total: questions.length,
  byDomain,
  byChapter,
  missingChapters,
  thinChapters,
  duplicateIds: duplicates,
  withSourceUrl: questions.filter((q) => q.sourceUrl).length,
};

if (asJson) {
  console.log(JSON.stringify({ summary, questions: questions.map((q) => ({
    id: q.id,
    domain: q.domain,
    chapter: q.chapter,
    difficulty: q.difficulty,
    audiences: q.audiences,
    sourceUrl: q.sourceUrl || null,
    prompt: q.prompt,
  })) }, null, 2));
  process.exit(duplicates.length ? 1 : 0);
}

console.log(`Koodisampo kysymyspankki — ${summary.total} kysymystä\n`);
console.log("Domain:");
for (const [d, n] of Object.entries(byDomain).sort()) {
  console.log(`  ${d}: ${n}`);
}
console.log("\nLuku (chapter):");
for (const [ch, n] of Object.entries(byChapter).sort()) {
  const flag = n < 3 ? " ⚠" : "";
  console.log(`  ${ch}: ${n}${flag}`);
}
if (missingChapters.length) {
  console.log("\nPuuttuvat luvut (0 kysymystä):", missingChapters.join(", "));
}
if (thinChapters.length) {
  console.log("Ohuet luvut (<3):", thinChapters.join(", "));
}
console.log(`\nsourceUrl: ${summary.withSourceUrl}/${summary.total}`);
if (duplicates.length) {
  console.error("DUPLICATE IDs:", duplicates.join(", "));
  process.exit(1);
}
