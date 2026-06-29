import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as gameHost from "../hosts/terminal/gameHost.mjs";
import { createWebGameController } from "../hosts/shared/webGameController.mjs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

function loadAssets() {
  return {
    mapJson: readFileSync(resolve(projectRoot, "content/worlds/corporate-hq-intro.json"), "utf8"),
    dialoguePackJson: readFileSync(resolve(projectRoot, "content/dialogues/pack.json"), "utf8"),
  };
}

function createController(initialSave = {}) {
  let save = { ...initialSave };
  const { mapJson, dialoguePackJson } = loadAssets();
  const game = createWebGameController({
    mapJson,
    dialoguePackJson,
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
  });
  return { game, getSave: () => save, setSave: (next) => { save = next; } };
}

let snap = createController().game.snapshot();
assert(snap.screen === "setup", `fresh game should start on setup, got ${snap.screen}`);
assert(snap.needsProfileSetup === true, "fresh game should need profile setup");

const filled = createController();
assert(filled.game.setPlayerProfile("Pekka", "cpp") === true, "setPlayerProfile should return true");
snap = filled.game.snapshot();
assert(snap.screen === "map", `profile fill should go to map, got ${snap.screen}`);
assert(snap.profileComplete === true, "profile should be complete");
assert(snap.playerDisplayName === "Pekka", "player name should persist");

const resetCase = createController({
  features: { ids: ["debug:boot"], amounts: [50] },
  progress: { profileComplete: false },
});
resetCase.game.setPlayerProfile("Matti", "js");
resetCase.setSave({
  ...resetCase.getSave(),
  progress: { profileComplete: false },
});
resetCase.game.reset(true);
snap = resetCase.game.snapshot();
assert(snap.screen === "setup", `reset without saved profile should show setup, got ${snap.screen}`);
assert(snap.needsProfileSetup === true, "reset without saved profile should need setup");

const restored = createController({
  features: { ids: ["debug:boot"], amounts: [50] },
  progress: {
    profileComplete: true,
    playerName: "Liisa",
    playerSpecialty: "python",
  },
});
snap = restored.game.snapshot();
assert(snap.screen === "map", `saved profile should skip setup, got ${snap.screen}`);
assert(snap.playerDisplayName === "Liisa", "saved profile name should restore");

const fullReset = createController({
  features: { ids: ["debug:boot", "cpp:test"], amounts: [50, 100] },
  deaths: 3,
  progress: {
    profileComplete: true,
    playerName: "Liisa",
    playerSpecialty: "python",
    guruIntroPassed: true,
    guruQuizCorrect: 2,
  },
});
fullReset.game.setPlayerProfile("Liisa", "python");
assert(fullReset.getSave().progress?.playerName === "Liisa", "profile should persist before reset");
fullReset.game.reset(false);
snap = fullReset.game.snapshot();
assert(snap.screen === "setup", `full reset should show setup, got ${snap.screen}`);
assert(snap.needsProfileSetup === true, "full reset should need profile setup");
assert(snap.karma === 50, `full reset karma should be boot only, got ${snap.karma}`);
assert(fullReset.getSave().deaths === 0, "full reset should clear deaths");
assert(!fullReset.getSave().progress?.profileComplete, "full reset should clear saved profile");
assert(fullReset.getSave().progress?.playerName === "", "full reset should clear saved name");

console.log("profile_setup.test.mjs OK");
