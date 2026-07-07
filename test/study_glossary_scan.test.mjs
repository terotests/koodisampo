import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  appendMissingGlossaryEntries,
  linkGlossaryTerms,
  parseGlossaryTerms,
  termToAnchor,
} from "../scripts/study-glossary.mjs";
import {
  loadGlossaryFilter,
  scanTextForAbbreviations,
  shouldFilterTerm,
} from "../scripts/study-glossary-scan-lib.mjs";

assert.equal(termToAnchor("CI/CD"), "ci-cd");
assert.equal(termToAnchor("CVE"), "cve");

const sample = `
## Tilanne

CI/CD-putki skannaa CVE:t ennen deploya. \`SQL\` inline-koodissa.

\`\`\`sql
SELECT id FROM users WHERE active;
\`\`\`

Katso [CVE](/docs/lyhenteet#cve) valmiina linkkinä.
https://developer.mozilla.org/en-US/docs/Web/API
`;

const refs = scanTextForAbbreviations(sample, "sample.md");
assert.ok(refs.has("CI/CD"), "CI/CD detected");
assert.ok(refs.has("CVE"), "CVE detected");
assert.ok(!refs.get("CI/CD").some((r) => r.excerpt.includes("SELECT")), "skips fenced code");
assert.ok(!refs.has("US"), "URL segment US ignored");

const linked = linkGlossaryTerms("CVE ja CI/CD testissä.", [
  { term: "CVE", anchor: "cve" },
  { term: "CI/CD", anchor: "ci-cd" },
]);
assert.match(linked, /\[CVE\]\(\/docs\/lyhenteet#cve\)/);
assert.match(linked, /\[CI\/CD\]\(\/docs\/lyhenteet#ci-cd\)/);

const filter = loadGlossaryFilter();
assert.equal(shouldFilterTerm("SELECT", filter), "ignore-list");
assert.equal(shouldFilterTerm("CVE", filter), null);

const existing = `## Test\n\n### GUC {#guc}\n\nGrand Unified Configuration — älä koske.\n`;
const { markdown: updated, added } = appendMissingGlossaryEntries(existing, [
  { term: "GUC", anchor: "guc" },
  { term: "CVE", anchor: "cve" },
]);
assert.deepEqual(added, ["CVE"]);
assert.match(updated, /Grand Unified Configuration — älä koske/);
assert.match(updated, /### CVE \{#cve\}/);
assert.match(updated, /Kuvaus puuttuu/);

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "glossary-scan-"));
const lessonsDir = path.join(tmpDir, "opiskelu/lessons");
fs.mkdirSync(lessonsDir, { recursive: true });
fs.writeFileSync(
  path.join(lessonsDir, "demo.md"),
  "# Demo\n\nTuotanto tarvitsee CI/CD- ja CVE-korjauksia.\n",
);
fs.writeFileSync(
  path.join(tmpDir, "opiskelu/lyhenteet.md"),
  "---\ntitle: Lyhenteet\n---\n\n# Lyhenteet\n\n## Test\n\n### GUC {#guc}\n\nKuvaus.\n",
);

const demoRefs = scanTextForAbbreviations(
  fs.readFileSync(path.join(lessonsDir, "demo.md"), "utf8"),
  "demo.md",
);
assert.ok(demoRefs.has("CI/CD"));
assert.ok(demoRefs.has("CVE"));

console.log("study_glossary_scan tests OK");
