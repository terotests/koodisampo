import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createTestController } from "./support/gameTestHarness.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import assert from "node:assert/strict";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { MapEntity } = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

export function runRewardFruitTests() {
  const ctrl = createTestController();
  const { session } = ctrl;
  try {
    dispatch(session, () => {
      session.applyPlayerProfile("Testi", "cpp");
      session.interviewPassed = true;
      const map = sessionMap(session);
      map.currentFloor = 0;
      map.recomputeSize();
      map.playerX = 14;
      map.playerY = 10;
      map.facingX = 1;
      map.facingY = 0;
      map.lastStatus = "";
      session.worldClock.setGameMinutes(500);
    });

    dispatch(session, () => {
      session.finishEncounterQuiz(true, "test:fruit", 3, "Hyvä!");
    });

    const map = sessionMap(session);
    const fruits = (map.activeFloor()?.entities ?? []).filter((e) => e.id?.startsWith("reward-fruit-"));
    assert.ok(fruits.length >= 1, `expected reward fruit after correct quiz, got ${fruits.length}`);
    assert.ok(map.isRewardFruitEntity(fruits[0]), "spawned entity is reward fruit");

    const fruit = fruits[0];
    const beforeSalary = session.playerSalary();
    dispatch(session, () => {
      map.playerX = fruit.x;
      map.playerY = fruit.y;
      session.afterPlayerAction();
    });
    assert.ok(session.fruitSalaryBonus >= 50, `fruit pickup adds salary bonus (${session.fruitSalaryBonus})`);
    assert.ok(session.playerSalary() >= beforeSalary + 50, "playerSalary includes fruit bonus");
    assert.equal(session.salaryPickupEffectAmount, 50, "fruit pickup publishes salary effect amount");
    assert.equal(session.salaryPickupEffectX, fruit.x, "fruit salary effect x follows pickup");
    assert.equal(session.salaryPickupEffectY, fruit.y, "fruit salary effect y follows pickup");
    assert.ok(session.salaryPickupEffectSeq > 0, "fruit pickup increments salary effect seq");

    const after = (map.activeFloor()?.entities ?? []).filter((e) => e.id === fruit.id);
    assert.equal(after.length, 0, "fruit removed after pickup");

    const card = new MapEntity();
    card.id = "test-coworker-card";
    card.char = "k";
    card.name = "Kulkukortti";
    card.kind = "item";
    card.itemTool = "coworker_card";
    card.x = fruit.x;
    card.y = fruit.y;
    map.activeFloor().entities.push(card);
    const seqBeforeCard = session.salaryPickupEffectSeq;
    dispatch(session, () => {
      map.playerX = card.x;
      map.playerY = card.y;
      session.afterPlayerAction();
    });
    assert.equal(session.salaryPickupEffectAmount, 200, "coworker card publishes salary effect amount");
    assert.equal(session.salaryPickupEffectX, card.x, "card salary effect x follows pickup");
    assert.equal(session.salaryPickupEffectY, card.y, "card salary effect y follows pickup");
    assert.ok(session.salaryPickupEffectSeq > seqBeforeCard, "card pickup increments salary effect seq");
    assert.ok(session.fruitSalaryBonus >= 250, "card pickup adds salary bonus");

    dispatch(session, () => {
      map.spawnQuizRewardFruits(520);
    });
    const fruit2 = (map.activeFloor()?.entities ?? []).find((e) => e.id?.startsWith("reward-fruit-"));
    assert.ok(fruit2, "second fruit spawn works");
    dispatch(session, () => {
      map.tickRewardFruits(fruit2.behaviorParam + 1);
    });
    const expired = (map.activeFloor()?.entities ?? []).find((e) => e.id === fruit2.id);
    assert.equal(expired, undefined, "expired fruit removed by tick");
  } finally {
    ctrl.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runRewardFruitTests();
  console.log("reward_fruit.test.mjs OK");
}
