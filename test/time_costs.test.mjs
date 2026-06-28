import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const worldJson = readFileSync(
  resolve(__dirname, "../content/worlds/corporate-hq-intro.json"),
  "utf8",
);

export function runTimeCostsTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({ id: "time-move", seed: 3, player: { floor: 0 }, clockMinutes: 480 });
    let snap = sim.snapshot();
    assert(snap.clockMinutes === 480, "starts at 08:00");

    sim.step({ move: "d" });
    snap = sim.snapshot();
    assert(snap.clockMinutes === 481, `move costs 1 min, got ${snap.clockMinutes}`);

    sim.step({ move: "d" });
    snap = sim.snapshot();
    assert(snap.clockMinutes === 482, `second move, got ${snap.clockMinutes}`);

    sim.tick(15);
    snap = sim.snapshot();
    assert(snap.clockMinutes === 497, `tick adds 15 min, got ${snap.clockMinutes}`);
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runTimeCostsTests();
  console.log("time_costs.test.mjs OK");
}
