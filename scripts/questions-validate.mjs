#!/usr/bin/env node
/**
 * Validoi kysymyspankki. Exit 1 jos kriittisiä ongelmia.
 * Käyttö: node scripts/questions-validate.mjs [--strict]
 */
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";

const strict = process.argv.includes("--strict");
const qs = listAllQuestions();
const errors = [];
const warnings = [];

const TOPIC_DOMAINS = {
  tools: "cpp", style: "cpp", safety: "cpp", maintainability: "cpp", performance: "cpp",
  portability: "cpp", threadability: "cpp", correctness: "cpp",
  "scrum-dod": "scrum", "scrum-dor": "scrum", "scrum-estimation": "scrum",
  "scrum-sprint": "scrum", "scrum-team": "scrum",
  systemd: "linux", journald: "linux", "linux-network": "linux", avahi: "linux",
  docker: "docker", "docker-network": "docker", "docker-volumes": "docker",
  "qt-widgets": "qt", "qt-signals": "qt", "qt-threading": "qt", "qt-models": "qt",
  "qt-opengl": "qt", "qt-shaders": "qt",
  "js-async": "javascript", "js-types": "javascript", "js-modules": "javascript", "js-runtime": "javascript",
  "js-typescript": "javascript",
  "pg-indexes": "postgres", "pg-explain": "postgres", "pg-vacuum": "postgres", "pg-config": "postgres",
  "cpp-production": "cpp", "docker-production": "docker",
  "git-workflow": "git", "git-ci": "git",
  "backend-data": "backend", "backend-api": "backend", "ops-incident": "backend",
  "web-security": "security",
};

const ids = new Set();
const prompts = new Map();

for (const q of qs) {
  if (ids.has(q.id)) errors.push(`Duplicate id: ${q.id}`);
  ids.add(q.id);

  const req = ["id", "chapter", "domain", "difficulty", "audiences", "prompt", "choices", "correctFeedback", "wrongFeedback", "featureId", "featurePoints"];
  for (const k of req) {
    if (q[k] === undefined || q[k] === null || q[k] === "") errors.push(`${q.id}: missing ${k}`);
  }

  const correct = (q.choices || []).filter((c) => c.correct);
  if (correct.length !== 1) errors.push(`${q.id}: need exactly 1 correct (has ${correct.length})`);
  if ((q.choices || []).length < 2) errors.push(`${q.id}: need >= 2 choices`);

  if (!q.sourceUrl) warnings.push(`${q.id}: missing sourceUrl`);
  if (q.difficulty < 1 || q.difficulty > 5) errors.push(`${q.id}: difficulty out of range`);

  const expDomain = TOPIC_DOMAINS[q.chapter];
  if (expDomain && q.domain !== expDomain) errors.push(`${q.id}: chapter ${q.chapter} expects domain ${expDomain}, got ${q.domain}`);

  if (!(q.audiences || []).some((a) => ["coworker", "guru", "security", "ceo", "project-lead", "secretary", "hostile"].includes(a))) {
    warnings.push(`${q.id}: unusual audiences`);
  }

  const norm = q.prompt?.toLowerCase().replace(/\s+/g, " ").trim();
  if (norm) {
    if (!prompts.has(norm)) prompts.set(norm, []);
    prompts.get(norm).push(q.id);
  }
}

for (const [prompt, dupIds] of prompts.entries()) {
  if (dupIds.length > 1) errors.push(`Duplicate prompt (${dupIds.length}): ${dupIds.join(", ")}`);
}

if (qs.length < 1000) warnings.push(`Only ${qs.length} questions (expected >= 1000)`);

console.log(`Validated ${qs.length} questions`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

if (errors.length) {
  for (const e of errors.slice(0, 30)) console.error("ERROR", e);
  if (errors.length > 30) console.error(`... and ${errors.length - 30} more`);
}

if (strict && warnings.length) {
  for (const w of warnings.slice(0, 20)) console.warn("WARN", w);
}

if (errors.length || (strict && warnings.length)) process.exit(1);
console.log("OK");
