import { createTestController } from "./support/gameTestHarness.mjs";
import { dispatch } from "../hosts/terminal/gameHost.mjs";
import { formatRelationsDebugText } from "../hosts/shared/formatRelationsDebug.mjs";
import assert from "node:assert/strict";

export function runRelationsDebugFormatTests() {
  const ctrl = createTestController();
  try {
    dispatch(ctrl.session, () => {
      ctrl.session.setNpcRelationStat("staff-f2-1", "anger", 80);
      ctrl.session.setNpcRelationStat("staff-f2-1", "love", 60);
    });

    const text = formatRelationsDebugText(ctrl.session);
    assert.ok(text.includes("Tunnetilat (DEBUG)"), "debug header");
    assert.ok(text.includes("staff-f2-1"), "npc id in output");
    assert.ok(text.includes("viha 80"), "anger value visible in debug panel only");
    assert.ok(text.includes("rakkaus 60"), "love value visible");
  } finally {
    ctrl.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runRelationsDebugFormatTests();
  console.log("relations_debug_format.test.mjs OK");
}
