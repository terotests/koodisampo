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

export function runWcAngerTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "wc-anger",
      seed: 11,
      player: { floor: 2 },
      npcTask: { id: "staff-f2-1", mainTask: "toilet" },
    });
    dispatch(sim.session, () => {
      const session = sim.session;
      session.pendingEntityId = "staff-f2-1";
      session.pendingEntityName = "Maija";
      session.pendingEntityKind = "coworker";
      session.pendingEntityChar = "c";
      session.screen = "encounter";
      session.encounterResult = "";
      const rel = session.npcRelations.getOrCreate("staff-f2-1");
      rel.setStat("anger", 40);
      session.onEncounterChoice("talk");
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
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runWcAngerTests();
  console.log("wc_anger.test.mjs OK");
}
