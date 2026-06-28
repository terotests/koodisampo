import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { readFileSync } from "node:fs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { PlayerNeeds } = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

const worldJson = readFileSync(
  resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
  "utf8",
);

export function runPlayerNeedsTests() {
  const needs = new PlayerNeeds();
  needs.resetDefaults();
  assert(needs.satiety === 18, "default satiety");
  assert(needs.thirst === 18, "default thirst");

  needs.satiety = 10;
  needs.tickMinutes(1000);
  assert(needs.satiety === 0, `satiety drains to 0 over time, got ${needs.satiety}`);

  needs.resetDefaults();
  needs.thirst = 5;
  needs.tickMinutes(300);
  assert(needs.thirst < 5, "thirst drains faster than satiety");

  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "starvation",
      seed: 7,
      player: { floor: 0 },
      needs: { satiety: 1, thirst: 18, alertness: 16, gas: 0 },
    });
    sim.tick(200);
    const snap = sim.snapshot();
    assert(snap.screen === "epilogue", `starvation game over, screen=${snap.screen}`);
    assert(
      snap.status.includes("nälkään"),
      `starvation message, got: ${snap.status}`,
    );
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPlayerNeedsTests();
  console.log("player_needs.test.mjs OK");
}
