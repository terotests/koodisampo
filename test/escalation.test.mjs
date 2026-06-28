import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { dispatch } from "../hosts/terminal/gameHost.mjs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const worldJson = readFileSync(
  resolve(__dirname, "../content/worlds/corporate-hq-intro.json"),
  "utf8",
);

export function runEscalationTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "escalation-panic",
      seed: 3,
      player: { floor: 2 },
    });
    dispatch(sim.session, () => {
      for (const npcId of ["staff-f3-1", "staff-f3-2", "staff-f3-3"]) {
        sim.session.setNpcRelationStat(npcId, "panic", 80);
      }
    });
    sim.tick(5);
    const events = JSON.parse(sim.session.simDebugEventsJson()).events;
    const panic = events.find((e) => e.type === "WorkplacePanic");
    assert(panic, "3 panicked NPCs trigger WorkplacePanic event");
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEscalationTests();
  console.log("escalation.test.mjs OK");
}
