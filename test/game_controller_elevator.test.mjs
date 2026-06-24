import { buildElevatorSnapshot } from "../hosts/shared/gameController/elevatorSnapshot.mjs";
import { checkElevatorKeyGate } from "../hosts/shared/gameController/elevatorKeyGate.mjs";
import { elevatorKeyToFloorIndex } from "../hosts/terminal/personStatus.mjs";
import { createGameSession, dispatch, stopGameSession, sessionMap } from "../hosts/terminal/gameHost.mjs";
import {
  assert,
  loadIntroWorldJson,
  createTestController,
  teleportToElevator,
  grantFloorRecommendations,
} from "./support/gameTestHarness.mjs";

export function runGameControllerElevatorTests() {
  const mapJson = loadIntroWorldJson();
  const ctrl = createTestController();
  const { session, clock } = ctrl;

  try {
    let snap = ctrl.snapshot();
    assert(snap.screen === "map", "starts on map");
    assert(snap.onElevator === false, "not on elevator at spawn");
    assert(snap.elevatorFloors?.length === 0, "no elevator floors when off elevator");

    teleportToElevator(session, dispatch, 0);
    snap = ctrl.snapshot();
    assert(snap.onElevator === true, "on elevator after teleport");
    assert(snap.elevatorFloors.length === 10, "ten floor buttons");
    assert(snap.elevatorFloors[0].current === true, "floor 1 current");
    assert(snap.elevatorFloors[0].key === "1", "floor key 1");
    assert(snap.elevatorFloors[9].key === "0", "floor 10 key 0");
    assert(snap.elevatorPickerCollapsed === false, "picker open on first enter");

    dispatch(session, () => {
      session.tools.grant("access_card");
    });
    const blocked = ctrl.handleKey("2");
    assert(blocked.floor === 0, "recommendation gate blocks floor 1 without suositus");
    assert(blocked.status.includes("suosituksen"), `gate message: ${blocked.status}`);

    grantFloorRecommendations(ctrl, 0);
    snap = ctrl.handleKey("2");
    assert(snap.floor === 1, "elevator key 2 moves to floor index 1");
    assert(snap.onElevator === true, "still on elevator tile");
    assert(snap.elevatorPickerCollapsed === true, "picker collapses after floor change");

    snap = ctrl.expandElevatorPicker();
    assert(snap.elevatorPickerCollapsed === false, "expand reopens picker");

    snap = ctrl.handleKey("1");
    assert(snap.floor === 0, "can go back down to floor 0");

    teleportToElevator(session, dispatch, 0);
    grantFloorRecommendations(ctrl, 0);
    snap = ctrl.handleKey("3");
    assert(
      snap.status.includes("gurun") || snap.status.includes("Gurun") || snap.status.includes("lukittu"),
      `floor 3 blocked without guru: ${snap.status}`,
    );

    const mapOnly = buildElevatorSnapshot(sessionMap(session));
    assert(mapOnly.onElevator === true, "buildElevatorSnapshot standalone");

    assert(elevatorKeyToFloorIndex("0") === 9, "key 0 -> floor 9");
    assert(elevatorKeyToFloorIndex("5") === 4, "key 5 -> floor 4");

    const gateBlocked = checkElevatorKeyGate(
      session,
      sessionMap(session),
      { byId: {} },
      "3",
    );
    assert(gateBlocked.proceed === true, "guru block handled by Ranger not gate");

    clock.setMinutes(660);
    assert(clock.minutes === 660, "virtual clock set via controller");
    assert(clock.phaseLabel() === "lounas", "clock phase readable");
    clock.setMinutes(480);
    assert(clock.minutes === 480, "clock winds backward");
  } finally {
    ctrl.stop();
  }

  const { root, session: s2 } = createGameSession();
  dispatch(s2, () => {
    s2.loadMapFromText(mapJson);
  });
  const map = sessionMap(s2);
  teleportToElevator(s2, dispatch, 0);
  const offElevator = buildElevatorSnapshot(map);
  dispatch(s2, () => {
    map.playerX = map.playerX + 1;
  });
  const gateOff = checkElevatorKeyGate(s2, sessionMap(s2), { byId: {} }, "2");
  assert(gateOff.proceed === true, "off elevator: gate passes through");
  assert(offElevator.onElevator === true, "was on elevator before move");
  stopGameSession(root, s2);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runGameControllerElevatorTests();
  console.log("game controller elevator tests OK");
}
