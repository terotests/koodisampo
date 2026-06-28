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

export function runReportingTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "reporting",
      seed: 5,
      player: { floor: 2 },
      relations: [
        {
          npcId: "staff-f2-1",
          anger: 90,
          suspicion: 90,
          respect: 5,
          love: 5,
          friendliness: 5,
        },
      ],
    });

    sim.tick(5);

    const map = sessionMap(sim.session);
    const ent = map.findEntityById("staff-f2-1");
    assert(
      ent.mainTask === "reporting",
      `high report score sets reporting task, got ${ent.mainTask}`,
    );
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runReportingTests();
  console.log("reporting.test.mjs OK");
}
