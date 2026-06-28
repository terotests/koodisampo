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

export function runHelpRequestTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "help-request",
      seed: 4,
      player: { floor: 2, x: 10, y: 7 },
      tool: "usb_drive",
      relations: [{ npcId: "staff-f3-1", respect: 50, anger: 25 }],
      npcTask: { id: "staff-f3-1", mainTask: "searching_item" },
    });
    const karmaBefore = sim.session.karma.total();
    dispatch(sim.session, () => {
      const session = sim.session;
      const map = sessionMap(session);
      const ent = map.findEntityById("staff-f3-1");
      ent.x = 11;
      ent.y = 7;
      session.pendingEntityId = "staff-f3-1";
      session.pendingEntityName = ent.name;
      session.pendingEntityKind = "coworker";
      session.pendingEntityChar = ent.char;
      session.screen = "encounter";
      session.encounterResult = "emotional";
      const rel = session.npcRelations.getOrCreate("staff-f3-1");
      session.pendingEmotionalDialogueIndex = session.dialogueCatalog.pickForEncounter(rel, ent);
      session.finishEmotionalChoice(0);
    });
    const karmaAfter = sim.session.karma.total();
    assert(karmaAfter > karmaBefore, "helping with USB grants karma");
    const ent = sessionMap(sim.session).findEntityById("staff-f3-1");
    assert(ent.mainTask === "working", `NPC stops searching after help (${ent.mainTask})`);
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runHelpRequestTests();
  console.log("help_request.test.mjs OK");
}
