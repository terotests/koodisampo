import { createTestController } from "./support/gameTestHarness.mjs";
import { dispatch } from "../hosts/terminal/gameHost.mjs";
import { collectAllCastFromSession, formatCastRosterText } from "../hosts/terminal/staffRoster.mjs";
import assert from "node:assert/strict";

export function runCastRosterMoodTests() {
  const ctrl = createTestController();
  try {
    dispatch(ctrl.session, () => {
      ctrl.session.setNpcRelationStat("staff-f2-1", "anger", 80);
      ctrl.session.setNpcRelationStat("staff-f2-1", "love", 60);
    });

    const cast = collectAllCastFromSession(ctrl.session);
    const text = formatCastRosterText(cast, { session: ctrl.session });
    assert.ok(text.includes("sinua kohtaan:"), "mood line per character");
    assert.ok(text.includes("viha 80"), "anger stat visible");
    assert.ok(text.includes("vihainen"), "mood summary includes angry");
  } finally {
    ctrl.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCastRosterMoodTests();
  console.log("cast_roster_mood.test.mjs OK");
}
