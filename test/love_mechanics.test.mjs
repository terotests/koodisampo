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

export function runLoveMechanicsTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "love-mechanics",
      seed: 8,
      player: { floor: 2, x: 10, y: 7 },
      relations: [{ npcId: "staff-f3-1", love: 60, anger: 25, respect: 50 }],
    });
    dispatch(sim.session, () => {
      const session = sim.session;
      const map = sessionMap(session);
      const ent = map.findEntityById("staff-f3-1");
      ent.x = 11;
      ent.y = 7;
      ent.romanticPreference = "any";
      session.pendingEntityId = "staff-f3-1";
      session.pendingEntityName = ent.name;
      session.pendingEntityKind = "coworker";
      session.pendingEntityChar = ent.char;
      session.screen = "encounter";
      session.encounterResult = "emotional";
      const rel = session.npcRelations.getOrCreate("staff-f3-1");
      session.pendingEmotionalDialogueIndex = session.dialogueCatalog.pickForEncounter(rel, ent);
      session.finishEmotionalChoice(1);
    });
    const rel = sim.session.npcRelations.getOrCreate("staff-f3-1");
    assert(rel.love > 60, `flirt answer raises love (${rel.love})`);
    const ent = sessionMap(sim.session).findEntityById("staff-f3-1");
    assert(ent.moveMode === "seek_player", `high love makes NPC seek player (${ent.moveMode})`);
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runLoveMechanicsTests();
  console.log("love_mechanics.test.mjs OK");
}
