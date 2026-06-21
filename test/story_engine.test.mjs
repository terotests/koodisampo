import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const { FeatureKarma, StoryEngine } = require(
  resolve(projectRoot, "generated/es6/koodisampo.cjs"),
);

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runStoryEngineTests() {
  const karma = new FeatureKarma();
  const engine = StoryEngine.withKarma(karma);

  const storyPath = resolve(projectRoot, "content/stories/modern-cpp-intro.json");
  const json = readFileSync(storyPath, "utf8");
  assert(engine.loadFromText(json), "loadFromText should succeed");
  assert(engine.storyId === "modern-cpp-intro", "story id");
  assert(engine.phase === "playing", "phase playing");

  let view = engine.getView();
  assert(view.nodeKind === "narrative", "starts at narrative");

  engine.advanceNarrative();
  view = engine.getView();
  assert(view.nodeKind === "choice", "choice node after intro");
  assert(view.choiceTexts.length === 3, "three choices");

  let atZero = 0;
  const trials = 40;
  for (let t = 0; t < trials; t += 1) {
    const k = new FeatureKarma();
    const e = StoryEngine.withKarma(k);
    assert(e.loadFromText(json), "reload");
    e.advanceNarrative();
    const v = e.getView();
    const idx = v.choiceTexts.findIndex((text) => text.includes("type deduction"));
    if (idx === 0) atZero += 1;
  }
  assert(atZero < trials, "shuffle should move correct answer away from index 0 sometimes");

  let pick = -1;
  for (let i = 0; i < view.choiceTexts.length; i += 1) {
    if (view.choiceTexts[i].includes("type deduction")) {
      pick = i;
    }
  }
  assert(pick >= 0, "find shuffled correct answer");

  engine.submitChoice(pick);
  view = engine.getView();
  assert(view.screen === "feedback", "feedback after choice");
  assert(view.feedbackCorrect === true, "picked shuffled correct answer");

  engine.dismissFeedback();
  view = engine.getView();
  assert(view.nodeKind === "narrative", "narrative after correct");

  assert(karma.get("cpp:auto") >= 3, "karma granted for cpp:auto");

  return true;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runStoryEngineTests();
  console.log("story_engine.test.mjs OK");
}
