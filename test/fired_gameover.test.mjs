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

export function runFiredGameoverTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({ id: "fired", seed: 5, player: { floor: 0 } });
    dispatch(sim.session, () => {
      sim.session.setNpcRelationStat("staff-f2-1", "anger", 80);
      sim.session.setNpcRelationStat("staff-f2-2", "anger", 80);
      sim.session.setNpcRelationStat("staff-f2-3", "anger", 80);
      sim.session.checkFiredGameOver();
    });
    const snap = sim.snapshot();
    assert(snap.screen === "epilogue", `fired game over, screen=${snap.screen}`);
    assert(
      snap.status.includes("potki"),
      `fired message, got: ${snap.status}`,
    );
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runFiredGameoverTests();
  console.log("fired_gameover.test.mjs OK");
}
