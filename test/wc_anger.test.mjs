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

function talkToNpc(session, npcId, npcName) {
  session.pendingEntity.id = npcId;
  session.pendingEntity.name = npcName;
  session.pendingEntity.kind = "coworker";
  session.pendingEntity.char = "c";
  session.screen = "encounter";
  session.encounterResult = "";
  session.onEncounterChoice("talk");
}

export function runWcAngerTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "wc-anger",
      seed: 11,
      player: { floor: 1 },
      npcTask: { id: "staff-f2-1", mainTask: "toilet" },
    });
    dispatch(sim.session, () => {
      const session = sim.session;
      const map = sessionMap(session);
      const floorIdx = map.findFloorIndexForEntity("staff-f2-1");
      const floor = map.floors[floorIdx];
      assert(floor.wcX >= 0, `offices floor should have WC, wcX=${floor.wcX}`);
      const ent = map.findEntityById("staff-f2-1");
      ent.x = floor.wcX;
      ent.y = floor.wcY;
      const rel = session.npcRelations.getOrCreate("staff-f2-1");
      rel.setStat("anger", 40);
      talkToNpc(session, "staff-f2-1", "Maija");
    });
    const rel = sim.session.npcRelations.getOrCreate("staff-f2-1");
    assert(rel.anger === 55, `WC talk adds anger, got ${rel.anger}`);
    const map = sessionMap(sim.session);
    assert(
      map.lastStatus.includes("WC"),
      `status mentions WC, got: ${map.lastStatus}`,
    );
  } finally {
    sim.stop();
  }

  const simDesk = createGameSimulator(worldJson);
  try {
    simDesk.bootstrap({
      id: "wc-anger-desk",
      seed: 11,
      player: { floor: 1 },
      npcTask: { id: "staff-f2-1", mainTask: "toilet" },
    });
    dispatch(simDesk.session, () => {
      const session = simDesk.session;
      const map = sessionMap(session);
      const ent = map.findEntityById("staff-f2-1");
      ent.x = ent.homeX;
      ent.y = ent.homeY;
      const rel = session.npcRelations.getOrCreate("staff-f2-1");
      rel.setStat("anger", 40);
      talkToNpc(session, "staff-f2-1", "Maija");
    });
    const relDesk = simDesk.session.npcRelations.getOrCreate("staff-f2-1");
    assert(
      relDesk.anger === 40,
      `desk talk with toilet task should not add anger, got ${relDesk.anger}`,
    );
    const mapDesk = sessionMap(simDesk.session);
    assert(
      mapDesk.lastStatus.includes("WC") === false,
      `desk status should not mention WC, got: ${mapDesk.lastStatus}`,
    );
  } finally {
    simDesk.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runWcAngerTests();
  console.log("wc_anger.test.mjs OK");
}
