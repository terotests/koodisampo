#!/usr/bin/env node
/**
 * Lisää puuttuvat lyhenneotsikot opiskelu/lyhenteet.md:hen skannauksen perusteella.
 * Olemassa olevia kuvauksia ei muokata eikä poisteta.
 *
 * Käyttö:
 *   npm run study:glossary:scan
 *   npm run study:glossary:update
 *   npm run study:glossary:update -- --dry-run
 *   npm run study:glossary:update -- --terms CVE,CI/CD,DNS
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  GLOSSARY_SOURCE,
  appendMissingGlossaryEntries,
  termToAnchor,
} from "./study-glossary.mjs";
import { SCAN_JSON, runGlossaryScan } from "./study-glossary-scan-lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const dryRun = argv.includes("--dry-run");
  const termsIdx = argv.indexOf("--terms");
  const onlyTerms = termsIdx >= 0
    ? argv[termsIdx + 1].split(",").map((t) => t.trim()).filter(Boolean)
    : null;
  return { dryRun, onlyTerms };
}

function loadMissingTerms(onlyTerms) {
  if (fs.existsSync(SCAN_JSON)) {
    const report = JSON.parse(fs.readFileSync(SCAN_JSON, "utf8"));
    let missing = report.missing || [];
    if (onlyTerms) {
      const wanted = new Set(onlyTerms.map((t) => t.toUpperCase()));
      missing = missing.filter((t) => wanted.has(t.term.toUpperCase()));
    }
    return missing.map((t) => ({ term: t.term, anchor: t.anchor }));
  }

  console.warn("study-glossary-update: scan file missing, running scan…");
  const report = runGlossaryScan();
  let missing = report.missing;
  if (onlyTerms) {
    const wanted = new Set(onlyTerms.map((t) => t.toUpperCase()));
    missing = missing.filter((t) => wanted.has(t.term.toUpperCase()));
  }
  return missing.map((t) => ({ term: t.term, anchor: t.anchor }));
}

function main() {
  const { dryRun, onlyTerms } = parseArgs(process.argv.slice(2));
  const toAdd = loadMissingTerms(onlyTerms);

  if (!toAdd.length) {
    console.log("study-glossary-update: nothing to add");
    return;
  }

  const markdown = fs.readFileSync(GLOSSARY_SOURCE, "utf8");
  const { markdown: updated, added } = appendMissingGlossaryEntries(markdown, toAdd);

  if (!added.length) {
    console.log("study-glossary-update: all requested terms already in glossary");
    return;
  }

  if (dryRun) {
    console.log(`study-glossary-update (dry-run): would add ${added.length} term(s):`);
    for (const term of added) console.log(`  - ${term} {#${termToAnchor(term)}}`);
    return;
  }

  fs.writeFileSync(GLOSSARY_SOURCE, updated);
  console.log(
    `study-glossary-update: added ${added.length} stub(s) → ${path.relative(root, GLOSSARY_SOURCE)}`,
  );
  for (const term of added) console.log(`  + ${term}`);
}

main();
