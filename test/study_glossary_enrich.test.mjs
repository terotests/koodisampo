import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  applyGlossaryEnrichment,
  collectLessonIds,
  docLinkForQuestion,
  formatBackLinks,
  formatGlossaryEntryBody,
} from "../scripts/study-glossary-enrich.mjs";
import { PENDING_STUB, parseGlossaryTerms } from "../scripts/study-glossary.mjs";

assert.equal(docLinkForQuestion("b08-docker-scan-image"), "/docs/topics/docker#b08-docker-scan-image");

const ids = collectLessonIds([
  { file: "opiskelu/lessons/b08-docker-scan-image.md", questionId: "b08-docker-scan-image" },
  { file: "opiskelu/lessons/apt-unattended-upgrades.md" },
]);
assert.deepEqual(ids, ["b08-docker-scan-image", "apt-unattended-upgrades"]);

const body = formatGlossaryEntryBody(
  "CVE",
  "**Common Vulnerabilities and Exposures** — testikuvaus.",
  ["b08-docker-scan-image"],
);
assert.match(body, /testikuvaus/);
assert.match(body, /\[`b08-docker-scan-image`\]\(\/docs\/topics\/docker#b08-docker-scan-image\)/);

const back = formatBackLinks(["b08-docker-scan-image", "apt-unattended-upgrades"]);
assert.match(back, /b08-docker-scan-image/);
assert.match(back, /apt-unattended-upgrades/);

const base = `# Lyhenteet\n\n## Test\n\n### GUC {#guc}\n\nGrand Unified Configuration — älä koske.\n`;
const scanned = [{
  term: "CVE",
  anchor: "cve",
  inGlossary: false,
  manualLinkCount: 0,
  refs: [{ file: "opiskelu/lessons/b08-docker-scan-image.md", line: 1, excerpt: "CVE", questionId: "b08-docker-scan-image" }],
}];
const descriptions = {
  CVE: { description: "**Common Vulnerabilities and Exposures** — uusi kuvaus.", _term: "CVE" },
  COPY: { description: "", skip: true, _term: "COPY" },
};

const { markdown, added, skipped } = applyGlossaryEnrichment(base, descriptions, scanned);
assert.ok(added.includes("CVE"));
assert.ok(skipped.includes("COPY"));
assert.match(markdown, /Grand Unified Configuration — älä koske/);
assert.match(markdown, /\[`b08-docker-scan-image`\]/);
assert.equal(parseGlossaryTerms(markdown).filter((t) => t.term === "GUC").length, 1);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "glossary-enrich-"));
const descDir = path.join(tmp, "descriptions");
fs.mkdirSync(descDir);
fs.writeFileSync(path.join(descDir, "sample.json"), JSON.stringify({
  DNS: { description: "**Domain Name System** — testi." },
}, null, 2));

console.log("study_glossary_enrich tests OK");
