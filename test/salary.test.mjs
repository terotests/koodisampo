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
      sim.session.finishEncounterQuiz(true, "test:quiz", 3, "Hyvä!");
    });
    assert(sim.session.playerSalary() === 10, `quiz correct adds 10 € before employment (${sim.session.playerSalary()})`);

    dispatch(sim.session, () => {
      sim.session.finishEncounterQuiz(false, "", 0, "Väärin.");
    });
    assert(sim.session.playerSalary() === 5, `quiz wrong subtracts 5 € (${sim.session.playerSalary()})`);

    dispatch(sim.session, () => {
      sim.session.fruitSalaryBonus = 0;
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

  const fruitSim = createGameSimulator(worldJson);
  try {
    fruitSim.bootstrap({ id: "salary-fruit-unemployed", seed: 2, player: { floor: 0 } });
    dispatch(fruitSim.session, () => {
      fruitSim.session.fruitSalaryBonus = 50;
    });
    assert(fruitSim.session.playerSalary() === 50, `unemployed salary shows pickup bonus (${fruitSim.session.playerSalary()})`);
  } finally {
    fruitSim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSalaryTests();
  console.log("salary.test.mjs OK");
}
