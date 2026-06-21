#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "data/existing-question-ids.txt");
const ids = listAllQuestions().map((q) => q.id).sort();
writeFileSync(out, `${ids.join("\n")}\n`);
console.log(`Wrote ${ids.length} ids → ${out}`);
