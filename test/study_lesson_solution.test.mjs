import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractMarkdownSection,
  lessonSolutionMarkdown,
} from "../hosts/shared/lessonSolutionCore.mjs";
import { createLessonFileReader } from "../hosts/shared/lessonSolution.mjs";
import { buildAiStudyText, listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

export function runStudyLessonSolutionTests() {
  const sample = readFileSync(
    resolve(projectRoot, "opiskelu/lessons/b04-linux-avahi-browse.md"),
    "utf8",
  );
  const section = extractMarkdownSection(sample, "Ratkaisu");
  assert.match(section, /avahi-browse -a/u, "extracts Ratkaisu section from lesson md");

  const readLesson = createLessonFileReader();
  const avahi = listAllQuestions().find((q) => q.id === "avahi-mdns");
  assert.ok(avahi, "avahi-mdns question exists");
  const resolved = lessonSolutionMarkdown(avahi, readLesson);
  assert.equal(resolved.source, "lesson");
  assert.match(resolved.markdown, /avahi-browse/u, "lesson solution matches study material");

  const study = buildAiStudyText(avahi, readLesson);
  assert.match(study, /avahi-browse/u, "AI study text includes lesson Ratkaisu content");
  assert.match(study, /Ratkaisu/u, "AI study text has solution heading");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runStudyLessonSolutionTests();
  console.log("study_lesson_solution.test.mjs OK");
}
