import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const bank = JSON.parse(readFileSync(resolve(root, "content/question-banks/kids-easy.json"), "utf8"));
const cow = bank.questions.find((q) => q.id === "kids-animal-cow");

assert.ok(cow, "kids-animal-cow exists");
assert.match(cow.prompt, /muu/, "cow sound in Finnish is muu");
assert.doesNotMatch(cow.prompt, /mää/, "mää is not used for cow sound");
assert.match(cow.correctFeedback, /muu/);
assert.match(cow.wrongFeedback, /muu/);
assert.doesNotMatch(JSON.stringify(cow), /mää/);

console.log("kids_questions_finnish.test.mjs OK");
