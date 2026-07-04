import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  GLOSSARY_SOURCE,
  linkGlossaryTerms,
  loadGlossaryTerms,
  parseGlossaryTerms,
  syncGlossaryDoc,
} from "../scripts/study-glossary.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const sample = `
## Tilanne

GUC ja OOM ovat yleisiä. \`GUC\` inline-koodissa ei linkity.

\`\`\`sql
-- OOM ei linkity koodissa
SET work_mem = '1GB';
\`\`\`

Katso [GUC](/docs/lyhenteet#guc) valmiina linkkinä.
`;

const terms = parseGlossaryTerms(fs.readFileSync(GLOSSARY_SOURCE, "utf8"));
assert.ok(terms.some((t) => t.term === "GUC" && t.anchor === "guc"));
assert.ok(terms.length >= 30, `expected glossary entries, got ${terms.length}`);

const linked = linkGlossaryTerms(sample, terms);
assert.match(linked, /\[GUC\]\(\/docs\/lyhenteet#guc\)/);
assert.match(linked, /\[OOM\]\(\/docs\/lyhenteet#oom\)/);
assert.match(linked, /`GUC`/);
assert.match(linked, /-- OOM ei linkity koodissa/);
assert.match(linked, /Katso \[GUC\]\(\/docs\/lyhenteet#guc\) valmiina linkkinä/);
assert.equal(
  (linked.match(/\[GUC\]\(\/docs\/lyhenteet#guc\)/g) || []).length,
  2,
  "one auto-linked GUC plus one pre-existing markdown link",
);

syncGlossaryDoc();
assert.ok(fs.existsSync(path.join(root, "study/docs/lyhenteet.md")));
assert.equal(loadGlossaryTerms().length, terms.length);

console.log("study_glossary tests OK");
