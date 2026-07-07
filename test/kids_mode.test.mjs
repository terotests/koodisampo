import { pickQuestion } from "../hosts/terminal/encounterQuestions.mjs";
import assert from "node:assert/strict";

export function runKidsModeTests() {
  const coworker = { id: "staff-f2-1", kind: "coworker", topic: "tools", name: "Test" };

  const normal = pickQuestion(coworker, 50, null, { pickNonce: 1, playerSpecialty: "cpp", kidsMode: false });
  assert.ok(normal.question, "normal mode picks a question");
  assert.notEqual(normal.question.bankId, "kids-easy", "normal mode avoids kids bank by default");

  const kids = pickQuestion(coworker, 50, null, { pickNonce: 1, playerSpecialty: "cpp", kidsMode: true });
  assert.equal(kids.question.bankId, "kids-easy", "kids mode uses kids-easy bank");
  assert.ok((kids.question.difficulty ?? 5) <= 2, `kids question difficulty <= 2 (${kids.question.difficulty})`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runKidsModeTests();
  console.log("kids_mode.test.mjs OK");
}
