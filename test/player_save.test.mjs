import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import {
  applyPlayerSave,
  loadPlayerSave,
  savePlayerSave,
} from "../hosts/terminal/playerSave.mjs";
import {
  emptyQuizHistory,
  normalizeQuizHistory,
  recordQuizAnswer,
} from "../hosts/terminal/quizHistory.mjs";
import {
  emptyStudyBacklog,
  normalizeStudyBacklog,
} from "../hosts/terminal/studyBacklog.mjs";
import { emptyPersonRegistry } from "../hosts/terminal/personStatus.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { FeatureKarma, StoryEngine } = require(
  resolve(projectRoot, "generated/es6/koodisampo.cjs"),
);

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runPlayerSaveTests() {
  const dir = mkdtempSync(join(tmpdir(), "koodisampo-save-"));
  const file = join(dir, "player.json");

  try {
    const karma = new FeatureKarma();
    const engine = new StoryEngine(karma);
    karma.add("cpp:auto", 7);
    karma.add("cpp:nullptr", 3);
    engine.deaths = 2;

    savePlayerSave(karma, engine.deaths, emptyQuizHistory(), emptyStudyBacklog(), {}, emptyPersonRegistry(), file);

    const karma2 = new FeatureKarma();
    const engine2 = new StoryEngine(karma2);
    applyPlayerSave(karma2, engine2, loadPlayerSave(file));

    assert(karma2.get("cpp:auto") === 7, "restore cpp:auto");
    assert(karma2.get("cpp:nullptr") === 3, "restore cpp:nullptr");
    assert(engine2.deaths === 2, "restore deaths");
    assert(karma2.total() === 10, "total karma");

    const raw = JSON.parse(readFileSync(file, "utf8"));
    assert(raw.version === 5, "save version");
    assert(raw.personRegistry?.byId, "person registry saved");
    assert(raw.progress?.guruIntroPassed === false, "guru progress saved");
    assert(raw.features.ids.length === 2, "saved feature count");
    assert(raw.quizHistory?.global?.asked, "global quiz history saved");
    assert(raw.studyBacklog?.wantMore, "study backlog saved");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }

  return true;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runPlayerSaveTests();
  console.log("player_save.test.mjs OK");
}
