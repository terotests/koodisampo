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

export function runEpilogueTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "epilogue-fired",
      seed: 2,
      player: { floor: 0 },
    });
    dispatch(sim.session, () => {
      sim.session.setNpcRelationStat("staff-f2-1", "anger", 90);
      sim.session.setNpcRelationStat("staff-f2-2", "anger", 90);
      sim.session.setNpcRelationStat("staff-f2-3", "anger", 90);
      sim.session.checkFiredGameOver();
    });
    assert(sim.session.screen === "epilogue", `fired ends in epilogue (${sim.session.screen})`);
    const summary = JSON.parse(sim.session.simEpilogueJson());
    assert(summary.reason === "Fired", `epilogue reason Fired (${summary.reason})`);
    assert(summary.enemies >= 3, `epilogue lists enemies (${summary.enemies})`);
    assert(typeof summary.karma === "number", "epilogue includes karma");
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEpilogueTests();
  console.log("epilogue.test.mjs OK");
}
