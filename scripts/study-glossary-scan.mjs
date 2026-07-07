#!/usr/bin/env node
/**
 * Kerää potentiaaliset lyhenteet opiskelumateriaalista temp-tiedostoon.
 * Tarkistaa onko termi jo lyhennehakemistossa ja listaa viitteet.
 *
 * Käyttö:
 *   node scripts/study-glossary-scan.mjs
 *   npm run study:glossary:scan
 *
 * Tulostaa:
 *   .tmp/glossary-scan.json
 *   .tmp/glossary-scan.md
 */
import fs from "node:fs";
import {
  SCAN_JSON,
  SCAN_MD,
  SCAN_OUTPUT_DIR,
  renderScanMarkdown,
  runGlossaryScan,
} from "./study-glossary-scan-lib.mjs";

function main() {
  fs.mkdirSync(SCAN_OUTPUT_DIR, { recursive: true });
  const report = runGlossaryScan();
  fs.writeFileSync(SCAN_JSON, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(SCAN_MD, renderScanMarkdown(report));

  console.log(
    `study-glossary-scan: ${report.missingCount} missing / ${report.terms.length} candidates → ${report.outputJson}`,
  );
}

main();
