import assert from "node:assert/strict";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import { createTestController } from "./support/gameTestHarness.mjs";

const ctrl = createTestController();
const { session } = ctrl;

try {
  const map = sessionMap(session);

  dispatch(session, () => {
    session.applyPlayerProfile("Testi", "cpp");
    map.currentFloor = 2;
    map.recomputeSize();
    map.playerX = 4;
    map.playerY = 1;
    map.facingX = 1;
    map.facingY = 0;
    map.lastStatus = "";
    map.ensurePlayerOnWalkable?.();
  });

  let snap = ctrl.handleKey("d");
  assert.ok(
    snap.status.includes("helpottuneeksi"),
    `WC step should feel relieved, got: ${snap.status}`,
  );

  const statusAfterWc = snap.status;
  snap = ctrl.handleKey("d");
  assert.equal(
    snap.status,
    statusAfterWc,
    "status message should persist when next step has no new message",
  );

  dispatch(session, () => {
    map.currentFloor = 0;
    map.recomputeSize();
    map.playerX = 14;
    map.playerY = 10;
    map.lastStatus = "";
  });
  snap = ctrl.handleKey("d");
  assert.ok(
    snap.status.includes("Kahvin tuoksu"),
    `coffee emoji feeling, got: ${snap.status}`,
  );

  console.log("emoji_feelings.test.mjs OK");
} finally {
  ctrl.stop();
}
