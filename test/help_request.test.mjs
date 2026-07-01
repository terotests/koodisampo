import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const worldJson = readFileSync(
  resolve(__dirname, "../content/worlds/corporate-hq-intro.json"),
  "utf8",
);

function startUsbHelpEncounter(session, { withUsb = true } = {}) {
  const map = sessionMap(session);
  const ent = map.findEntityById("staff-f3-1");
  ent.x = 11;
  ent.y = 7;
  ent.mainTask = "searching_item";
  session.pendingEntityId = "staff-f3-1";
  session.pendingEntityName = ent.name;
  session.pendingEntityKind = "coworker";
  session.pendingEntityChar = ent.char;
  session.screen = "encounter";
  session.encounterResult = "emotional";
  const rel = session.npcRelations.getOrCreate("staff-f3-1");
  session.pendingEmotionalDialogueIndex = session.dialogueCatalog.pickForEncounter(rel, ent);
  if (withUsb) {
    session.tools.grant("usb_drive");
  }
}

export function runHelpRequestTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "help-request",
      seed: 4,
      player: { floor: 2, x: 10, y: 7 },
      relations: [{ npcId: "staff-f3-1", respect: 50, anger: 25 }],
      npcTask: { id: "staff-f3-1", mainTask: "searching_item" },
    });
    startUsbHelpEncounter(sim.session, { withUsb: true });
    const karmaBefore = sim.session.karma.total();
    dispatch(sim.session, () => {
      sim.session.finishEmotionalChoice(0);
    });
    const karmaAfter = sim.session.karma.total();
    assert(karmaAfter > karmaBefore, "helping with USB grants karma");
    const ent = sessionMap(sim.session).findEntityById("staff-f3-1");
    assert(ent.mainTask === "working", `NPC stops searching after help (${ent.mainTask})`);
  } finally {
    sim.stop();
  }

  const sim2 = createGameSimulator(worldJson);
  try {
    sim2.bootstrap({
      id: "help-request-no-usb",
      seed: 4,
      player: { floor: 2, x: 10, y: 7 },
      relations: [{ npcId: "staff-f3-1", respect: 50, anger: 25 }],
      npcTask: { id: "staff-f3-1", mainTask: "searching_item" },
    });
    startUsbHelpEncounter(sim2.session, { withUsb: false });
    const view = sim2.session.getEncounterView();
    const answers = view.emotionalAnswers || [];
    assert(
      answers.every((a) => !a.includes("Minulla on tikku")),
      "give-USB answer hidden when player has not found the stick",
    );
    assert(answers.length === 2, `expected 2 answers without USB (${answers.length})`);
    dispatch(sim2.session, () => {
      sim2.session.onEmotionalAnswerKey("1");
    });
    const ent2 = sessionMap(sim2.session).findEntityById("staff-f3-1");
    assert(ent2.mainTask === "searching_item", "NPC still searching after 'not seen' answer");
  } finally {
    sim2.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runHelpRequestTests();
  console.log("help_request.test.mjs OK");
}
