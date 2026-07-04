#!/usr/bin/env node
/**
 * Tuo opiskelu/oppitunnit.md → opiskelu/lessons/{questionId}.md (ilman pelihahmoja).
 * Käyttö: node scripts/study-import-oppitunnit.mjs [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "opiskelu/oppitunnit.md");
const lessonsDir = path.join(root, "opiskelu/lessons");
const dryRun = process.argv.includes("--dry-run");

function normalizePrompt(s) {
  return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function stripCharacterSuffix(prompt) {
  return prompt.replace(/\s+\([^)]+\)\s*$/, "").trim();
}

function parseOppitunnit(text) {
  const entries = [];
  const blocks = text.split(/\n---\n/);
  for (const block of blocks) {
    const headerMatch = block.match(/^\s*\[\d+\]\s+(.+)$/m);
    const metaMatch = block.match(/^\s+(\S+)\/(\S+)\s+—/m);
    if (!headerMatch) continue;
    const prompt = stripCharacterSuffix(headerMatch[1].trim());
    const domain = metaMatch?.[1] || "";
    const chapter = metaMatch?.[2] || "";
    const body = block
      .replace(/^\s*\[\d+\].*$/m, "")
      .replace(/^\s+\S+\/\S+\s+—.*$/m, "")
      .trim();
    if (!body) continue;
    entries.push({ prompt, domain, chapter, body });
  }
  return entries;
}

function findQuestionId(questions, entry) {
  const norm = normalizePrompt(entry.prompt);
  const exact = questions.filter((q) => normalizePrompt(q.prompt) === norm);
  if (exact.length === 1) return exact[0].id;
  if (exact.length > 1) {
    const byChapter = exact.find((q) => q.chapter === entry.chapter);
    if (byChapter) return byChapter.id;
    return exact[0].id;
  }
  const partial = questions.filter((q) => {
    const qp = normalizePrompt(q.prompt);
    return qp.includes(norm.slice(0, 40)) || norm.includes(qp.slice(0, 40));
  });
  if (partial.length === 1) return partial[0].id;
  if (partial.length > 1) {
    const byChapter = partial.find((q) => q.chapter === entry.chapter && q.domain === entry.domain);
    if (byChapter) return byChapter.id;
  }
  return null;
}

function main() {
  if (!fs.existsSync(sourcePath)) {
    console.error("Missing", sourcePath);
    process.exit(1);
  }
  const text = fs.readFileSync(sourcePath, "utf8");
  const entries = parseOppitunnit(text);
  const questions = listAllQuestions();
  fs.mkdirSync(lessonsDir, { recursive: true });

  let written = 0;
  let skipped = 0;
  let unmatched = 0;

  for (const entry of entries) {
    const id = findQuestionId(questions, entry);
    if (!id) {
      unmatched += 1;
      console.warn("UNMATCHED:", entry.prompt.slice(0, 60));
      continue;
    }
    const out = path.join(lessonsDir, `${id}.md`);
    if (fs.existsSync(out)) {
      skipped += 1;
      continue;
    }
    const title = entry.prompt;
    const doc = [
      `# ${title}`,
      "",
      entry.body,
      "",
    ].join("\n");
    if (!dryRun) fs.writeFileSync(out, doc);
    written += 1;
  }

  console.log(`import-oppitunnit: ${entries.length} entries, ${written} written, ${skipped} skipped, ${unmatched} unmatched`);
  if (dryRun) console.log("(dry-run — ei kirjoitettu levylle)");
}

main();
