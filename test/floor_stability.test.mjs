import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { sessionMap } from "../hosts/terminal/gameHost.mjs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const worldJson = readFileSync(
  resolve(__dirname, "../content/worlds/corporate-hq-intro.json"),
  "utf8",
);

export function runFloorStabilityTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "floor-stability",
      seed: 11,
      player: { floor: 0, x: 10, y: 8 },
    });
    const floorBefore = sessionMap(sim.session).currentFloor;
    assert(floorBefore === 0, `starts on courtyard floor (${floorBefore})`);
    sim.tick(5);
    const floorAfter = sessionMap(sim.session).currentFloor;
    assert(
      floorAfter === floorBefore,
      `relation tick keeps player floor (${floorAfter} vs ${floorBefore})`,
    );
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runFloorStabilityTests();
  console.log("floor_stability.test.mjs OK");
}
