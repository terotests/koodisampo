import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const worldJson = readFileSync(
  resolve(__dirname, "../content/worlds/corporate-hq-intro.json"),
  "utf8",
);

export function runSalaryTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({ id: "salary-start", seed: 1, player: { floor: 0 } });
    assert(sim.session.playerSalary() === 0, "unemployed salary is 0");

    dispatch(sim.session, () => {
      sim.session.interviewPassed = true;
      sim.session.tools.grant("official_badge");
    });
    assert(sim.session.playerSalary() === 2500, `employed base salary 2500 (${sim.session.playerSalary()})`);

    dispatch(sim.session, () => {
      sim.session.guruIntroPassed = true;
      sim.session.tools.grant("promoted_card");
      sessionMap(sim.session).currentFloor = 2;
    });
    const promoted = sim.session.playerSalary();
    assert(promoted === 3000, `floor 3 salary 3000 (${promoted})`);
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSalaryTests();
  console.log("salary.test.mjs OK");
}
