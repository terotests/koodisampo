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

SQL ja ACID ovat yleisiä. \`SQL\` inline-koodissa ei linkity.

\`\`\`sql
-- ACID ei linkity koodissa
BEGIN;
\`\`\`

Katso [SQL](/docs/lyhenteet#sql) valmiina linkkinä.
`;

const terms = parseGlossaryTerms(fs.readFileSync(GLOSSARY_SOURCE, "utf8"));
assert.ok(terms.some((t) => t.term === "SQL" && t.anchor === "sql"));
assert.ok(terms.length >= 300, `expected glossary entries, got ${terms.length}`);

for (let i = 1; i < terms.length; i++) {
  assert.ok(
    terms[i - 1].term.localeCompare(terms[i].term, "fi", { sensitivity: "base", numeric: true }) <= 0,
    `glossary not sorted: ${terms[i - 1].term} before ${terms[i].term}`,
  );
}

const linked = linkGlossaryTerms(sample, terms);
assert.match(linked, /\[SQL\]\(\/docs\/lyhenteet#sql\)/);
assert.match(linked, /\[ACID\]\(\/docs\/lyhenteet#acid\)/);
assert.match(linked, /`SQL`/);
assert.match(linked, /-- ACID ei linkity koodissa/);
assert.match(linked, /Katso \[SQL\]\(\/docs\/lyhenteet#sql\) valmiina linkkinä/);
assert.equal(
  (linked.match(/\[SQL\]\(\/docs\/lyhenteet#sql\)/g) || []).length,
  2,
  "one auto-linked SQL plus one pre-existing markdown link",
);

syncGlossaryDoc();
assert.ok(fs.existsSync(path.join(root, "study/docs/lyhenteet.md")));
assert.equal(loadGlossaryTerms().length, terms.length);

console.log("study_glossary tests OK");
