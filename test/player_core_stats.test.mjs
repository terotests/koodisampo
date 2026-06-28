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

function inRange(n) {
  return n >= 1 && n <= 20;
}

export function runPlayerCoreStatsTests() {
  const sim = createGameSimulator(worldJson);
  let intelA = 0;
  let luckA = 0;
  let genderA = "?";
  try {
    sim.bootstrap({ id: "stats-a", seed: 99, player: { floor: 0 } });
    intelA = sim.session.playerStats.intelligence;
    luckA = sim.session.playerStats.luck;
    genderA = sim.session.playerStats.gender;
    assert(inRange(intelA), "intelligence in range");
    assert(inRange(sim.session.playerStats.appearance), "appearance in range");
    assert(genderA === "M" || genderA === "F", "gender rolled");
  } finally {
    sim.stop();
  }

  const sim2 = createGameSimulator(worldJson);
  try {
    sim2.bootstrap({ id: "stats-b", seed: 99, player: { floor: 0 } });
    assert(
      sim2.session.playerStats.intelligence === intelA,
      "seeded stats deterministic",
    );
    assert(
      sim2.session.playerStats.luck === luckA,
      "seeded luck deterministic",
    );
  } finally {
    sim2.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPlayerCoreStatsTests();
  console.log("player_core_stats.test.mjs OK");
}
