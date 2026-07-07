import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pickQuestion } from "../hosts/terminal/encounterQuestions.mjs";
import assert from "node:assert/strict";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { GameSession, NpcRelation } = require(
  resolve(projectRoot, "generated/es6/koodisampo.cjs"),
);

export function runKidsModeTests() {
  const coworker = { id: "staff-f2-1", kind: "coworker", topic: "tools", name: "Test" };

  const normal = pickQuestion(coworker, 50, null, { pickNonce: 1, playerSpecialty: "cpp", kidsMode: false });
  assert.ok(normal.question, "normal mode picks a question");
  assert.notEqual(normal.question.bankId, "kids-easy", "normal mode avoids kids bank by default");

  const kids = pickQuestion(coworker, 50, null, { pickNonce: 1, playerSpecialty: "cpp", kidsMode: true });
  assert.equal(kids.question.bankId, "kids-easy", "kids mode uses kids-easy bank");
  assert.ok((kids.question.difficulty ?? 5) <= 2, `kids question difficulty <= 2 (${kids.question.difficulty})`);

  const session = new GameSession();
  session.setKidsMode(true);
  session.pendingEntity.id = "staff-f2-1";
  session.pendingEntity.kind = "coworker";
  const rel = new NpcRelation();
  rel.setStat("anger", 10);
  const ent = { id: "staff-f2-1", kind: "coworker", name: "Test", mainTask: "" };
  assert.equal(
    session.shouldUseEmotionalDialogue(ent, rel),
    false,
    "kids mode skips emotional dialogue encounters",
  );

  session.setKidsMode(false);
  let sawEmotional = false;
  for (let i = 0; i < 50; i += 1) {
    if (session.shouldUseEmotionalDialogue(ent, rel)) {
      sawEmotional = true;
      break;
    }
  }
  assert.ok(sawEmotional, "normal mode can still use emotional dialogue");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runKidsModeTests();
  console.log("kids_mode.test.mjs OK");
}
