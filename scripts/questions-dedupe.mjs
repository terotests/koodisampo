#!/usr/bin/env node
/**
 * Poistaa toistokysymykset kaikista pankeista.
 * Lista: scripts/data/questions-dedupe.json — { removed: { poistettuId: säilytettyId } }
 *
 * - poistaa kysymyksen pankista ja sen oppitunnin opiskelu/lessons/{id}.md
 * - ohjaa sanaston (opiskelu/lyhenteet.md) oppituntilinkit säilytettyyn vastineeseen
 *
 * Käyttö: node scripts/questions-dedupe.mjs [--dry-run]
 * Ajettavissa uudelleen: jo poistetut ohitetaan.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const banksDir = path.join(root, "content/question-banks");
const lessonsDir = path.join(root, "opiskelu/lessons");
const glossaryPath = path.join(root, "opiskelu/lyhenteet.md");
const dryRun = process.argv.includes("--dry-run");

const { removed } = JSON.parse(fs.readFileSync(path.join(__dirname, "data/questions-dedupe.json"), "utf8"));
const removeIds = new Set(Object.keys(removed));

let total = 0;
const domainOf = new Map();
for (const file of fs.readdirSync(banksDir).filter((f) => f.endsWith(".json") && f !== "manifest.json").sort()) {
  const p = path.join(banksDir, file);
  const bank = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const q of bank.questions) domainOf.set(q.id, q.domain || bank.domain);
  const kept = bank.questions.filter((q) => !removeIds.has(q.id));
  const n = bank.questions.length - kept.length;
  if (!n) continue;
  total += n;
  console.log(`${file}: ${bank.questions.length} → ${kept.length} (-${n})`);
  if (!dryRun) {
    bank.questions = kept;
    fs.writeFileSync(p, `${JSON.stringify(bank, null, 2)}\n`);
  }
}

let lessons = 0;
for (const id of removeIds) {
  const p = path.join(lessonsDir, `${id}.md`);
  if (!fs.existsSync(p)) continue;
  lessons += 1;
  if (!dryRun) fs.rmSync(p);
}

// Sanaston "Oppitunnit:"-rivit: poistettu → säilytetty, ja sama linkki vain kerran.
let glossaryLinks = 0;
if (fs.existsSync(glossaryPath)) {
  const text = fs.readFileSync(glossaryPath, "utf8");
  const out = text.replace(/^\*\*Oppitunnit:\*\* (.*?)( \(\+\d+ muuta\))?$/gm, (line, list, more) => {
    const links = list.split(/,\s*/);
    const seen = new Set();
    const next = [];
    for (const link of links) {
      const m = link.match(/^\[`([^`]+)`\]\(\/docs\/topics\/([^#)]+)#([^)]+)\)$/);
      let id = m ? m[1] : null;
      let item = link;
      if (id && removeIds.has(id)) {
        while (removeIds.has(id)) id = removed[id];
        const domain = domainOf.get(id) || (m && m[2]);
        item = `[\`${id}\`](/docs/topics/${domain}#${id})`;
        glossaryLinks += 1;
      }
      const key = id || item;
      if (seen.has(key)) continue;
      seen.add(key);
      next.push(item);
    }
    return `**Oppitunnit:** ${next.join(", ")}${more || ""}`;
  });
  if (!dryRun && out !== text) fs.writeFileSync(glossaryPath, out);
}

console.log(`Removed ${total} questions, ${lessons} lessons; ${glossaryLinks} glossary links redirected${dryRun ? " (dry run)" : ""}`);
