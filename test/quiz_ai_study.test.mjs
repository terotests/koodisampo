import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import * as gameHost from "../hosts/terminal/gameHost.mjs";
import { createWebGameController } from "../hosts/shared/webGameController.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import { buildLessonSolutionsIndex } from "../hosts/shared/lessonSolution.mjs";
import { getAiStudySolution, listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

function createQuizGame() {
  let save = {};
  return createWebGameController({
    mapJson: readFileSync(resolve(projectRoot, "content/worlds/corporate-hq-intro.json"), "utf8"),
    dialoguePackJson: readFileSync(resolve(projectRoot, "content/dialogues/pack.json"), "utf8"),
    npcBehaviorPackJson: readFileSync(resolve(projectRoot, "content/npc-behaviors/pack.json"), "utf8"),
    quizReactionPackJson: readFileSync(resolve(projectRoot, "content/quiz-reactions/pack.json"), "utf8"),
    storyCatalog: { list: () => [] },
    gameHost,
    loadSave: () => save,
    persistSave: (karma, deaths, quizHistory, studyBacklog, progress, personRegistry) => {
      save = {
        ...save,
        deaths,
        features: {
          ids: [...(karma.ids ?? [])],
          amounts: [...(karma.amounts ?? [])],
        },
        quizHistory,
        studyBacklog,
        personRegistry,
        progress,
      };
    },
    loadStoryJson: () => null,
    castListEnabled: () => true,
    lessonSolutions: buildLessonSolutionsIndex(listAllQuestions()),
  });
}

export function runQuizAiStudyTests() {
  const game = createQuizGame();

  try {
    game.setPlayerProfile("Testi", "cpp");
    const { session } = game;

    dispatch(session, () => {
      session.karma.add("test:ai-web", 30);
      const map = sessionMap(session);
      map.currentFloor = 1;
      map.recomputeSize();
      const coworker = map.activeFloor().entities.find((e) => e.id === "staff-f2-1");
      assert.ok(coworker, "coworker exists");
      map.playerX = coworker.x;
      map.playerY = coworker.y - 1;
      session.startEncounter(coworker);
      session.encounterResult = "quiz";
    });

    let snap = game.snapshot();
    assert.equal(snap.screen, "encounter");
    assert.ok(snap.quiz?.choices?.length, "quiz choices visible");
    const choicesBefore = snap.quiz?.choices?.map((c) => c.text).join("|");

    game.handleKey("a");
    snap = game.snapshot();
    assert.equal(snap.overlay?.type, "aiStudy");
    assert.ok(snap.overlay?.solutionChoiceN >= 1, "AI overlay exposes solution choice number");
    assert.equal(snap.quizAiUsed, true, "AI use tracked for later answer feedback");
    assert.ok(snap.overlay?.solutionText, "AI overlay exposes solution text");
    assert.ok(snap.overlay?.solutionMarkdown, "AI overlay exposes lesson markdown");

    game.handleKey("enter");
    snap = game.snapshot();
    assert.equal(snap.overlay, undefined, "Enter closes AI overlay");
    assert.equal(snap.screen, "encounter");
    assert.ok(snap.quiz?.choices?.length, "same quiz still available");
    assert.equal(snap.quiz?.choices?.map((c) => c.text).join("|"), choicesBefore, "AI return keeps same shuffled question");
    assert.equal(snap.quizAiUsed, true, "AI use remains until quiz completes");

    const avahi = listAllQuestions().find((q) => q.id === "avahi-mdns");
    assert.ok(avahi, "avahi-mdns exists for solution test");
    const avahiSolution = buildLessonSolutionsIndex([avahi])[avahi.id];
    assert.equal(avahiSolution.source, "lesson");
    assert.match(avahiSolution.markdown, /avahi-browse/u, "lesson index includes study Ratkaisu");

    const shuffled = [
      { text: "wrong", correct: false },
      { text: "right", correct: true },
      { text: "also wrong", correct: false },
    ];
    const solution = getAiStudySolution({ choices: shuffled });
    assert.equal(solution.choiceN, 2);
    assert.equal(solution.choiceText, "right");
  } finally {
    game.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runQuizAiStudyTests();
  console.log("quiz_ai_study.test.mjs OK");
}
