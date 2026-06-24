import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { runScenario } from "../scripts/run-scenario.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const worldJson = readFileSync(
  resolve(__dirname, "../content/worlds/corporate-hq-intro.json"),
  "utf8",
);

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runSeededRngTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({ id: "rng-test", seed: 42, bootKarma: 0, player: { floor: 0 } });
    const a = [];
    for (let i = 0; i < 5; i += 1) {
      a.push(sim.rngNext(0, 100));
    }
    sim.stop();

    const sim2 = createGameSimulator(worldJson);
    try {
      sim2.bootstrap({ id: "rng-test", seed: 42, bootKarma: 0, player: { floor: 0 } });
      const b = [];
      for (let i = 0; i < 5; i += 1) {
        b.push(sim2.rngNext(0, 100));
      }
      assert(a.join(",") === b.join(","), "seeded rng deterministic");
      assert(a.join(",") !== "0,0,0,0,0", "seeded rng not all zeros");
    } finally {
      sim2.stop();
    }
  } finally {
    try {
      sim.stop();
    } catch {
      // already stopped
    }
  }
}

export function runScenarioCourtyardMoveTests() {
  const result = runScenario(resolve(__dirname, "../content/scenarios/courtyard-move.json"));
  assert(result.report.outcome === "pass", `courtyard-move: ${JSON.stringify(result.report)}`);
  assert(result.snapshot.player.x >= 14, `player moved east: x=${result.snapshot.player.x}`);
  assert(result.snapshot.clockMinutes >= 495, `clock advanced: ${result.snapshot.clockMinutes}`);
}

export function runAllScenarioTests() {
  runSeededRngTests();
  runScenarioCourtyardMoveTests();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runAllScenarioTests();
  console.log("scenario tests OK");
}
