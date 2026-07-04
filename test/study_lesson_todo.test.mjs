import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jsonPath = path.join(root, "opiskelu/lessons/TODO.json");
const mdPath = path.join(root, "opiskelu/lessons/TODO.md");

assert.ok(fs.existsSync(jsonPath), "TODO.json exists — run npm run study:todo");
assert.ok(fs.existsSync(mdPath), "TODO.md exists");

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
assert.ok(data.summary.totalQuestions > 0, "has questions");
assert.equal(
  data.summary.readyLessons + data.summary.pendingLessons,
  data.summary.totalQuestions,
  "ready + pending = total",
);
assert.ok(Array.isArray(data.domains) && data.domains.length > 0, "domains array");

const pg = data.domains.find((d) => d.id === "postgres");
assert.ok(pg, "postgres domain");
const pgConfig = pg.chapters.find((c) => c.id === "pg-config");
assert.ok(pgConfig, "pg-config chapter");
assert.equal(pgConfig.questions.length, 24, "pg-config question count");

const md = fs.readFileSync(mdPath, "utf8");
assert.ok(md.includes("✅") && md.includes("⬜"), "markdown has status marks");
assert.ok(md.includes("npm run study:todo"), "markdown has command hint");

console.log("study_lesson_todo tests OK");
