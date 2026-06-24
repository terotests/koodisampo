import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import {
  assert,
  createTestController,
  teleportToElevator,
  grantFloorRecommendations,
} from "./support/gameTestHarness.mjs";

export function runGameControllerSimTests() {
  const ctrl = createTestController();
  const { session, clock } = ctrl;

  try {
    let snap = ctrl.snapshot();
    assert(snap.screen === "map", "sim: map screen");
    assert(snap.lines?.length > 0, "sim: map lines without UI");
    assert(typeof snap.karma === "number", "sim: karma in snapshot");

    const startX = snap.player.x;
    snap = ctrl.handleKey("d");
    assert(snap.player.x !== startX || snap.status.length > 0, "sim: movement changes state");

    clock.setMinutes(900);
    snap = ctrl.snapshot();
    assert(snap.clockMinutes === 900, "sim: clock in snapshot");
    assert(snap.time?.includes("15:") || snap.clockLine.includes("15:"), "sim: afternoon time visible");

    clock.jumpToPhase("lounas");
    assert(clock.phaseLabel() === "lounas", "sim: jumpToPhase lunch");
    clock.jumpToPhase("aamu");
    assert(clock.minutes === 480, "sim: jump back to morning");

    clock.advance(60);
    assert(clock.minutes === 540, "sim: advance 60 min");

    teleportToElevator(session, dispatch, 0);
    snap = ctrl.snapshot();
    assert(snap.onElevator === true, "sim: at elevator");

    dispatch(session, () => {
      session.tools.grant("access_card");
    });
    grantFloorRecommendations(ctrl, 0);
    snap = ctrl.handleKey("2");
    assert(snap.floor === 1, "sim: elevator to office floor");

    teleportToElevator(session, dispatch, 1);
    dispatch(session, () => {
      session.guruIntroPassed = true;
      session.tools.grant("promoted_card");
    });
    grantFloorRecommendations(ctrl, 1);
    snap = ctrl.handleKey("3");
    assert(snap.floor === 2, `sim: floor 3 after guru+promotion, status=${snap.status}`);

    snap = ctrl.reset(false);
    assert(snap.floor === 0, "sim: reset returns to start floor");
    assert(snap.karma >= 50, "sim: reset restores boot karma");
  } finally {
    ctrl.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runGameControllerSimTests();
  console.log("game controller sim tests OK");
}
