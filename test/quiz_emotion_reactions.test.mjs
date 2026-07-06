import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { assert } from "./support/gameTestHarness.mjs";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import {
  buildQuizReaction,
  buildQuizReactionWithEmotion,
} from "../hosts/terminal/encounterQuestions.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { QuizReactionCatalog, NpcRelation } = require(
  resolve(projectRoot, "generated/es6/koodisampo.cjs"),
);
const worldJson = readFileSync(
  resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
  "utf8",
);
const quizPackJson = readFileSync(
  resolve(projectRoot, "content/quiz-reactions/pack.json"),
  "utf8",
);

export function runQuizEmotionReactionTests() {
  const catalog = new QuizReactionCatalog();
  catalog.loadDefaults();
  const neutral = new NpcRelation();
  const angry = new NpcRelation();
  angry.setStat("anger", 60);
  const romantic = new NpcRelation();
  romantic.setStat("love", 60);

  assert(
    catalog.pickStatusReaction(neutral, true, "staff-f2-1").includes("tyytyvä"),
    "neutral correct reaction",
  );
  const angryWrong = catalog.pickStatusReaction(angry, false, "staff-f2-1");
  assert(
    angryWrong.includes("ärty") || angryWrong.includes("raivo") || angryWrong.includes("purse"),
    `angry wrong reaction: ${angryWrong}`,
  );
  const romanticCorrect = catalog.pickStatusReaction(romantic, true, "staff-f3-1");
  assert(
    romanticCorrect.includes("ihastun") || romanticCorrect.includes("ilois") || romanticCorrect.includes("hymy"),
    `romantic correct reaction: ${romanticCorrect}`,
  );

  const catalog2 = new QuizReactionCatalog();
  assert(catalog2.loadFromText(quizPackJson), "quiz pack loads");
  const parsed = JSON.parse(quizPackJson);
  assert(parsed.reactions.length === 30, `expected 30 reactions, got ${parsed.reactions.length}`);

  const picks = new Set();
  for (let i = 0; i < 20; i += 1) {
    picks.add(catalog2.pickStatusReaction(neutral, true, `staff-neutral-${i}`));
  }
  assert(picks.size >= 2, `neutral correct variety: ${[...picks].join(" | ")}`);

  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "quiz-emotion",
      seed: 9,
      player: { floor: 2, x: 10, y: 7 },
      relations: [{ npcId: "staff-f3-1", love: 65, anger: 10, friendliness: 60 }],
    });
    dispatch(sim.session, () => {
      sim.session.loadQuizReactionsFromText(quizPackJson);
    });
    const entity = { id: "staff-f3-1", kind: "coworker", name: "Kollega Maija" };
    const social = buildQuizReaction(entity, true, sim.session);
    const full = buildQuizReactionWithEmotion(entity, true, sim.session);
    assert(full.includes(social), "full reaction includes social line");
    assert(
      full.includes("ihastun") || full.includes("ilois") || full.includes("hymy"),
      `romantic mood in quiz reaction: ${full}`,
    );

    dispatch(sim.session, () => {
      sim.session.pendingEntity.id = "staff-f3-1";
      sim.session.pendingEntity.name = entity.name;
      sim.session.pendingEntity.kind = "coworker";
      sim.session.finishEncounterQuiz(true, "cpp:test", 5, social);
    });
    const status = sessionMap(sim.session).lastStatus;
    assert(status.includes("✓"), "quiz status marked correct");
    assert(
      status.includes("näyttää") || status.includes("hymy") || status.includes("nyökkää"),
      `lastStatus includes emotion reaction: ${status}`,
    );
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runQuizEmotionReactionTests();
  console.log("quiz_emotion_reactions.test.mjs OK");
}
