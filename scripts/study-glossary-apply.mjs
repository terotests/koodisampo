#!/usr/bin/env node
/**
 * Yhdistää käsin kirjoitetut kuvaukset (scripts/data/glossary-descriptions/)
 * lyhennehakemistoon + generoi takaisinlinkit oppituntien kappale-id:ihin.
 *
 * Käyttö:
 *   npm run study:glossary:scan
 *   npm run study:glossary:apply
 *   npm run study:glossary:apply -- --dry-run
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GLOSSARY_SOURCE } from "./study-glossary.mjs";
import { applyDescriptionsFromFiles } from "./study-glossary-enrich.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const result = applyDescriptionsFromFiles(dryRun);

  console.log(
    `study-glossary-apply${dryRun ? " (dry-run)" : ""}: `
    + `+${result.added.length} added, ~${result.updated.length} updated, `
    + `${result.skipped.length} skipped`,
  );
  if (result.added.length) console.log(`  added: ${result.added.join(", ")}`);
  if (result.updated.length) console.log(`  updated: ${result.updated.join(", ")}`);
  if (!dryRun && (result.added.length || result.updated.length)) {
    console.log(`  → ${path.relative(root, GLOSSARY_SOURCE)}`);
  }
}

main();
