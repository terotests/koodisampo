#!/usr/bin/env node
import fs from "node:fs";
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";

const lessonsDir = "opiskelu/lessons";
const chapter = process.argv[2] || "pg-config";
const domain = process.argv[3] || "postgres";

const qs = listAllQuestions()
  .filter((q) => q.domain === domain && q.chapter === chapter)
  .sort((a, b) => a.id.localeCompare(b.id));

const issues = [];

for (const q of qs) {
  const file = `${lessonsDir}/${q.id}.md`;
  if (!fs.existsSync(file)) {
    issues.push({ id: q.id, issue: "missing file" });
    continue;
  }
  const text = fs.readFileSync(file, "utf8");
  const body = text.replace(/^#\s+.+\n+/, "").trim();
  const sections = (body.match(/^## .+/gm) || []).length;
  const proseBlocks = body
    .split(/\n## /)
    .slice(1)
    .map((s) => s.replace(/^[^\n]+\n/, ""))
    .map((s) =>
      s
        .split(/\n\n+/)
        .filter(
          (p) =>
            p.trim() &&
            !p.startsWith("```") &&
            !p.startsWith("- ") &&
            !/^\d+\./.test(p.trim()),
        ),
    );

  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const shortSections = proseBlocks.filter((paras) => paras.length < 2).length;
  const hasWrongSection = /Miksi muut/i.test(body);

  if (sections < 3) issues.push({ id: q.id, issue: `only ${sections} sections` });
  if (wordCount < 250) issues.push({ id: q.id, issue: `short: ${wordCount} words` });
  if (shortSections > 0)
    issues.push({ id: q.id, issue: `${shortSections} section(s) with <2 prose paragraphs` });
  if (hasWrongSection) issues.push({ id: q.id, issue: "contains Miksi muut" });

  console.log(
    `${q.id.padEnd(40)} sec=${sections} words=${String(wordCount).padStart(4)} parasOK=${shortSections === 0 ? "yes" : "no"}`,
  );
}

console.log(`\n${qs.length} questions, ${issues.length} issues`);
for (const i of issues) console.log(`  ⚠ ${i.id}: ${i.issue}`);
