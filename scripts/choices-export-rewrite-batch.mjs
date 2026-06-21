#!/usr/bin/env node
/**
 * Vie kysymykset aliagentin uudelleenkirjoitusta varten.
 *
 * Käyttö:
 *   node scripts/choices-export-rewrite-batch.mjs --bank cpp-best-practices.json
 *   node scripts/choices-export-rewrite-batch.mjs --bank cpp-best-practices.json --offset 0 --limit 40
 *   node scripts/choices-export-rewrite-batch.mjs --all --only-biased
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { choiceBiasMetrics } from "./choice-rewrite-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const banksDir = resolve(__dirname, "../content/question-banks");
const outDir = resolve(__dirname, "../scripts/data/choice-rewrite-batches");

const args = process.argv.slice(2);
const allBanks = args.includes("--all");
const onlyBiased = args.includes("--only-biased");
const bankArg = args.find((a) => a.startsWith("--bank="))?.slice(7) || args[args.indexOf("--bank") + 1];
const offset = Number.parseInt(args.find((a) => a.startsWith("--offset="))?.slice(9) ?? args[args.indexOf("--offset") + 1] ?? "0", 10);
const limit = Number.parseInt(args.find((a) => a.startsWith("--limit="))?.slice(8) ?? args[args.indexOf("--limit") + 1] ?? "9999", 10);

mkdirSync(outDir, { recursive: true });

function exportBank(file) {
  const bank = JSON.parse(readFileSync(resolve(banksDir, file), "utf8"));
  let questions = (bank.questions || []).map((q) => {
    const metrics = choiceBiasMetrics(q.choices);
    return {
      id: q.id,
      chapter: q.chapter,
      domain: q.domain,
      difficulty: q.difficulty,
      prompt: q.prompt,
      choices: q.choices.map((c) => ({ text: c.text, correct: c.correct })),
      correctFeedback: q.correctFeedback,
      wrongFeedback: q.wrongFeedback,
      bias: metrics,
    };
  });

  if (onlyBiased) {
    questions = questions.filter((q) => q.bias.biased);
  }

  const slice = questions.slice(offset, offset + limit);
  const slug = file.replace(".json", "");
  const outFile = resolve(outDir, `${slug}-o${offset}-l${slice.length}.json`);

  const payload = {
    instructions: "docs/question-bank-choice-rewrite-prompt.md",
    bank: file,
    offset,
    limit: slice.length,
    totalInBank: (bank.questions || []).length,
    biasedInSlice: slice.filter((q) => q.bias.biased).length,
    outputFormat: {
      bank: file,
      rewrites: [{ id: "question-id", choices: [{ text: "...", correct: true }] }],
    },
    questions: slice,
  };

  writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${slice.length} questions → ${outFile}`);
  return slice.length;
}

if (allBanks) {
  let n = 0;
  for (const file of readdirSync(banksDir).filter((f) => f.endsWith(".json")).sort()) {
    n += exportBank(file);
  }
  console.log(`Total exported: ${n}`);
} else if (bankArg) {
  exportBank(bankArg);
} else {
  console.error("Usage: --bank FILE [--offset N] [--limit N] [--only-biased]  OR  --all --only-biased");
  process.exit(1);
}
