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

export function runRelationTickTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({ id: "relation-tick", seed: 3, player: { floor: 2 } });
    const map = sim.session.map ?? sessionMap(sim.session);
    const entBefore = map.findEntityById("staff-f2-2");
    const taskBefore = entBefore.mainTask;

    for (let i = 0; i < 4; i += 1) {
      sim.step({ move: "w" });
    }
    let entMid = map.findEntityById("staff-f2-2");
    assert(
      entMid.mainTask === taskBefore,
      "4 minutes of moves should not force relation task reroll alone",
    );

    sim.tick(5);
    entMid = map.findEntityById("staff-f2-2");
    assert(
      entMid.mainTask === "eating"
        || entMid.mainTask === taskBefore
        || entMid.mainTask === "toilet"
        || entMid.mainTask === "coffee"
        || entMid.mainTask === "searching_item",
      `5 min tick updates tasks, mainTask=${entMid.mainTask}`,
    );
    assert(
      sim.session.relationTickAccum < 5,
      "relation accum resets after 5 min tick",
    );
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runRelationTickTests();
  console.log("relation_tick.test.mjs OK");
}
