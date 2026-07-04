#!/usr/bin/env node
/**
 * Tulostaa oppituntidokumentaation kattavuuden.
 * Käyttö: node scripts/study-progress.mjs [--json]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";
import { DOMAIN_LABELS, CHAPTER_LABELS } from "../hosts/shared/studyLessonLinks.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const lessonsDir = path.join(root, "opiskelu/lessons");
const asJson = process.argv.includes("--json");

function listReadyLessonIds() {
  if (!fs.existsSync(lessonsDir)) return new Set();
  return new Set(
    fs.readdirSync(lessonsDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, "")),
  );
}

function main() {
  const questions = listAllQuestions();
  const ready = listReadyLessonIds();
  const withLessonRef = questions.filter((q) => q.lessonRef).length;

  const byDomain = {};
  for (const q of questions) {
    if (!byDomain[q.domain]) byDomain[q.domain] = { total: 0, ready: 0 };
    byDomain[q.domain].total += 1;
    if (ready.has(q.id)) byDomain[q.domain].ready += 1;
  }

  const summary = {
    totalQuestions: questions.length,
    readyLessons: [...ready].filter((id) => questions.some((q) => q.id === id)).length,
    stubLessons: questions.length - [...ready].filter((id) => questions.some((q) => q.id === id)).length,
    explicitLessonRef: withLessonRef,
    byDomain: Object.fromEntries(
      Object.entries(byDomain).map(([d, s]) => [d, { ...s, label: DOMAIN_LABELS[d] || d }]),
    ),
  };

  if (asJson) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  const pct = summary.totalQuestions
    ? Math.round((summary.readyLessons / summary.totalQuestions) * 1000) / 10
    : 0;

  console.log(`Oppituntidokumentaatio: ${summary.readyLessons}/${summary.totalQuestions} (${pct} %)`);
  console.log(`lessonRef eksplisiittinen: ${withLessonRef}`);
  console.log("");
  console.log("Domain:");
  for (const [d, s] of Object.entries(byDomain).sort()) {
    const p = s.total ? Math.round((s.ready / s.total) * 1000) / 10 : 0;
    console.log(`  ${DOMAIN_LABELS[d] || d}: ${s.ready}/${s.total} (${p} %)`);
  }

  const thin = Object.entries(byDomain)
    .filter(([, s]) => s.ready === 0)
    .map(([d]) => DOMAIN_LABELS[d] || d);
  if (thin.length) {
    console.log("\nEi yhtään valmista oppituntia:", thin.join(", "));
  }
}

main();
