#!/usr/bin/env node
/** Vie tyhjät batch-tiedostot subagenttien täytettäväksi. */
import { exportDescriptionBatches } from "./study-glossary-enrich.mjs";
import { runGlossaryScan, SCAN_JSON, SCAN_OUTPUT_DIR } from "./study-glossary-scan-lib.mjs";
import fs from "node:fs";

const batchCount = Number(process.argv[2] || 5);
if (!fs.existsSync(SCAN_JSON)) {
  fs.mkdirSync(SCAN_OUTPUT_DIR, { recursive: true });
  const report = runGlossaryScan();
  fs.writeFileSync(SCAN_JSON, `${JSON.stringify(report, null, 2)}\n`);
}
const result = exportDescriptionBatches(batchCount);
console.log(`study-glossary-export-batches: ${result.pending} terms → ${result.files.join(", ")}`);
