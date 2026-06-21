#!/usr/bin/env node
/**
 * Generoi markdown-koosteen kaikista kysymyksistä.
 * Käyttö: node scripts/questions-export-md.mjs [tiedosto]
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(
  __dirname,
  process.argv[2] || "../docs/question-bank-index.md",
);

const qs = listAllQuestions().sort((a, b) => {
  const ka = `${a.domain}/${a.chapter}/${a.id}`;
  const kb = `${b.domain}/${b.chapter}/${b.id}`;
  return ka.localeCompare(kb);
});

const byDomain = new Map();
for (const q of qs) {
  if (!byDomain.has(q.domain)) byDomain.set(q.domain, new Map());
  const chapters = byDomain.get(q.domain);
  const ch = q.chapter || "(none)";
  if (!chapters.has(ch)) chapters.set(ch, []);
  chapters.get(ch).push(q);
}

const lines = [];
lines.push("# Koodisampo — kysymyspankin kooste");
lines.push("");
lines.push(`Yhteensä **${qs.length}** kysymystä. Generoitu: \`node scripts/questions-export-md.mjs\``);
lines.push("");
lines.push("Oikea vastaus merkitty **lihavoituna**.");
lines.push("");

for (const [domain, chapters] of [...byDomain.entries()].sort()) {
  const domainCount = [...chapters.values()].reduce((n, arr) => n + arr.length, 0);
  lines.push(`## ${domain} (${domainCount})`);
  lines.push("");

  for (const [chapter, items] of [...chapters.entries()].sort()) {
    lines.push(`### ${chapter} (${items.length})`);
    lines.push("");

    for (const q of items) {
      lines.push(`#### \`${q.id}\` · diff ${q.difficulty}`);
      lines.push("");
      lines.push(q.prompt);
      lines.push("");
      for (const c of q.choices || []) {
        const mark = c.correct ? "**" : "";
        const end = c.correct ? "** ✓" : "";
        lines.push(`- ${mark}${c.text}${end}`);
      }
      lines.push("");
    }
  }
}

writeFileSync(outPath, `${lines.join("\n")}\n`);
console.log(`Wrote ${qs.length} questions → ${outPath}`);
