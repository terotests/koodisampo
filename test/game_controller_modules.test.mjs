import { emptyPersonRegistry } from "../hosts/terminal/personStatus.mjs";
import { buildElevatorSnapshot, elevatorFloorKey } from "../hosts/shared/gameController/elevatorSnapshot.mjs";
import { createElevatorUiState } from "../hosts/shared/gameController/elevatorUiState.mjs";
import { checkElevatorKeyGate } from "../hosts/shared/gameController/elevatorKeyGate.mjs";
import { createGameSession, dispatch, stopGameSession, sessionMap } from "../hosts/terminal/gameHost.mjs";
import {
  assert,
  loadIntroWorldJson,
  teleportToElevator,
  grantFloorRecommendations,
  createTestController,
} from "./support/gameTestHarness.mjs";

export function runGameControllerModuleTests() {
  assert(elevatorFloorKey(0) === "1", "floor 0 key is 1");
  assert(elevatorFloorKey(8) === "9", "floor 8 key is 9");
  assert(elevatorFloorKey(9) === "0", "floor 9 key is 0");

  const mapJson = loadIntroWorldJson();
  const { root, session } = createGameSession();
  dispatch(session, () => {
    session.loadMapFromText(mapJson);
  });
  const map = sessionMap(session);

  assert(buildElevatorSnapshot(map).onElevator === false, "off elevator: empty floors");
  assert(buildElevatorSnapshot(map).floors.length === 0, "off elevator: no buttons");

  teleportToElevator(session, dispatch, 0);
  const elev = buildElevatorSnapshot(map);
  assert(elev.onElevator === true, "on elevator snapshot");
  assert(elev.floors.length === 10, "ten floors in snapshot");
  assert(elev.floors[0].current === true, "current floor marked");
  assert(elev.floors[0].hasElevator === true, "courtyard has elevator");
  assert(elev.floors[1].hasElevator === true, "office floor has elevator");
  assert(typeof elev.floors[0].title === "string" && elev.floors[0].title.length > 0, "floor title");

  const ui = createElevatorUiState();
  assert(ui.pickerCollapsed === false, "picker starts open");
  ui.syncOnElevator(true);
  assert(ui.pickerCollapsed === false, "first elevator enter opens picker");
  ui.collapseAfterElevatorKey("2", true);
  assert(ui.pickerCollapsed === true, "collapse after key");
  ui.syncOnElevator(true);
  assert(ui.pickerCollapsed === true, "stays collapsed while on elevator");
  ui.syncOnElevator(false);
  assert(ui.pickerCollapsed === false, "leaving elevator resets collapse");
  assert(ui.pickerCollapsed === false, "wasOnElevator reset");
  ui.syncOnElevator(true);
  ui.expand();
  assert(ui.pickerCollapsed === false, "expand reopens");
  ui.reset();
  ui.syncOnElevator(true);
  assert(ui.pickerCollapsed === false, "reset + re-enter opens picker");

  teleportToElevator(session, dispatch, 1);
  dispatch(session, () => {
    session.tools.grant("access_card");
  });
  const gateDown = checkElevatorKeyGate(session, map, { byId: {} }, "1");
  assert(gateDown.proceed === true, "downward elevator key skips recommendation gate");

  teleportToElevator(session, dispatch, 1);
  const gateSame = checkElevatorKeyGate(session, map, { byId: {} }, "2");
  assert(gateSame.proceed === true, "same floor key skips gate");

  teleportToElevator(session, dispatch, 0);
  const registry = emptyPersonRegistry();
  const gateUpBlocked = checkElevatorKeyGate(session, map, registry, "2");
  assert(gateUpBlocked.proceed === false, "up without suositus blocked");
  assert(gateUpBlocked.message.includes("suosituksen"), "gate message mentions suositus");

  grantFloorRecommendations({ session, personRegistry: registry }, 0);
  const gateUpOk = checkElevatorKeyGate(session, map, registry, "2");
  assert(gateUpOk.proceed === true, "up with suositus passes gate");

  const gateNonDigit = checkElevatorKeyGate(session, map, { byId: {} }, "w");
  assert(gateNonDigit.proceed === true, "non-digit passes gate");

  stopGameSession(root, session);

  const ctrl = createTestController();
  try {
    teleportToElevator(ctrl.session, dispatch, 0);
    dispatch(ctrl.session, () => {
      ctrl.session.tools.grant("access_card");
    });
    grantFloorRecommendations(ctrl, 0);
    let snap = ctrl.handleKey("2");
    assert(snap.floor === 1, "controller integrates gate + travel");
    snap = ctrl.handleKey("1");
    assert(snap.floor === 0, "controller downward travel");
    assert(snap.elevatorPickerCollapsed === true, "collapse after successful floor key");
  } finally {
    ctrl.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runGameControllerModuleTests();
  console.log("game controller module tests OK");
}
