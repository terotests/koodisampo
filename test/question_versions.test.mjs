import assert from "node:assert/strict";
import {
  formatVersionTags,
  normalizeVersions,
  resolveQuestionVersions,
  versionTagsMetaSuffix,
} from "../hosts/shared/questionVersions.mjs";
import {
  buildAiStudyText,
  clearEncounterQuizCache,
  listAllQuestions,
} from "../hosts/terminal/encounterQuestions.mjs";

clearEncounterQuizCache();
const all = listAllQuestions();

assert.deepEqual(normalizeVersions([" C++17 ", "", "C++17", "ES2020"]), ["C++17", "ES2020"]);
assert.equal(formatVersionTags(["C++17", "ES2020"]), "C++17 · ES2020");
assert.equal(versionTagsMetaSuffix(["Qt 6"]), " · Qt 6");
assert.equal(versionTagsMetaSuffix([]), "");

assert.deepEqual(
  resolveQuestionVersions({ versions: ["C++11"] }, { defaultVersions: ["C++17"] }),
  ["C++11"],
);
assert.deepEqual(
  resolveQuestionVersions({}, { defaultVersions: ["C++17"] }),
  ["C++17"],
);

const nullptr = all.find((q) => q.id === "tools-nullptr");
assert.ok(nullptr, "tools-nullptr exists");
assert.deepEqual(nullptr.versions, ["C++11"]);

const structured = all.find((q) => q.id === "tools-structured-bindings");
assert.ok(structured, "structured bindings exists");
assert.ok(structured.versions.includes("C++17"), "structured bindings tagged C++17");

const study = buildAiStudyText(nullptr);
assert.match(study, /C\+\+11/, "AI study includes version tag");
assert.match(study, /Versio:\s*C\+\+11/, "AI study shows Versio line");

const withVersions = all.filter((q) => Array.isArray(q.versions) && q.versions.length > 0);
assert.ok(withVersions.length > 100, `expected many version-tagged questions, got ${withVersions.length}`);

console.log("question_versions tests OK");
