import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createTestController } from "./support/gameTestHarness.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import assert from "node:assert/strict";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { PlayerNeeds } = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

export function runEmojiEffectsTests() {
  const needs = new PlayerNeeds();
  needs.resetDefaults();
  const alertBefore = needs.alertness;
  needs.applyEmojiChar("☕");
  assert.ok(needs.alertness === alertBefore + 4, "coffee boosts alertness");
  assert.ok(needs.gas === 1, "coffee adds gas");

  needs.resetDefaults();
  needs.applyEmojiChar("🍱");
  assert.ok(needs.satiety === 20, `lunch clamps satiety to 20, got ${needs.satiety}`);

  const ctrl = createTestController();
  const { session } = ctrl;
  try {
    const map = sessionMap(session);
    dispatch(session, () => {
      session.applyPlayerProfile("Testi", "cpp");
      map.currentFloor = 0;
      map.recomputeSize();
      map.playerX = 14;
      map.playerY = 10;
      map.lastStatus = "";
      session.playerNeeds.resetDefaults();
      session.playerNeeds.alertness = 10;
    });
    const before = session.playerNeeds.alertness;
    ctrl.handleKey("d");
    assert.ok(
      session.playerNeeds.alertness === before + 4,
      `walking on coffee raises alertness, got ${session.playerNeeds.alertness}`,
    );
    const coffeeCell = map.entityAt(15, 10);
    assert.ok(!coffeeCell?.id, "coffee entity removed after walking over it");
    const mapView = session.getMapView();
    const coffeeInView = mapView.lines.some((line) => line && line.includes("☕"));
    assert.ok(!coffeeInView, "coffee glyph removed from map view after consumption");

    dispatch(session, () => {
      map.playerX = 26;
      map.playerY = 19;
      map.lastStatus = "";
    });
    const wcBefore = map.entityAt(27, 19)?.id;
    assert.ok(wcBefore, "WC entity exists before step");
    ctrl.handleKey("d");
    const wcAfter = map.entityAt(27, 19)?.id;
    assert.equal(wcAfter, wcBefore, "WC entity stays on map after walking over it");
  } finally {
    ctrl.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEmojiEffectsTests();
  console.log("emoji_effects.test.mjs OK");
}
