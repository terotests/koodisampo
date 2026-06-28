import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import {
  assert,
  createTestController,
  startEncounterViaBump,
  teleportToElevator,
} from "./support/gameTestHarness.mjs";

export function runGameControllerScreenTests() {
  const ctrl = createTestController();
  const { session } = ctrl;

  try {
    let snap = ctrl.snapshot();
    assert(snap.screen === "map", "starts on map");
    assert(Array.isArray(snap.lines), "map snapshot has lines");
    assert(snap.player?.x != null, "map snapshot has player position");
    assert(snap.clockMinutes === 480, "clock in base snapshot");

    snap = ctrl.handleKey("?");
    assert(snap.screen === "menu", "menu opens with ?");

    snap = ctrl.handleKey("m");
    assert(snap.screen === "map", "m closes menu");

    snap = ctrl.handleKey("i");
    assert(snap.screen === "inventory", "inventory opens with i");

    snap = ctrl.handleKey("enter");
    assert(snap.screen === "map", "enter closes inventory");

    snap = ctrl.handleKey("b");
    assert(snap.screen === "studylist", "study list opens with b");

    snap = ctrl.handleKey("enter");
    assert(snap.screen === "map", "enter closes study list");

    snap = startEncounterViaBump(ctrl, 0, "janitor");
    assert(snap.screen === "encounter", "janitor talk starts encounter");
    assert(snap.encounter?.entityName?.includes("Talkkari"), "encounter has entity name");
    assert(snap.encounter?.needsQuiz === false, "janitor has story not quiz");

    snap = ctrl.handleKey("3");
    assert(snap.screen === "map", "leave returns to map");

    snap = startEncounterViaBump(ctrl, 0, "receptionist");
    assert(snap.screen === "encounter", "receptionist encounter");
    assert(snap.encounter?.needsQuiz === true, "receptionist needs quiz");

    snap = ctrl.handleKey("1");
    assert(snap.screen === "encounter", "talk stays on encounter (quiz phase in web overlay)");

    snap = ctrl.handleKey("3");
    assert(snap.screen === "map", "leave from receptionist");

    teleportToElevator(session, dispatch, 0);
    snap = ctrl.snapshot();
    assert(snap.onElevator === true, "elevator fields on map snapshot");
    assert(snap.elevatorFloors?.length === 10, "elevator floors in map snapshot");

    dispatch(session, () => {
      session.screen = "blocked";
    });
    snap = ctrl.snapshot();
    assert(snap.screen === "blocked", "blocked screen snapshot");
    assert(snap.action != null, "blocked uses action view shape");

    dispatch(session, () => {
      session.screen = "map";
    });
    snap = ctrl.snapshot();
    assert(snap.screen === "map", "back to map after blocked reset");
  } finally {
    ctrl.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runGameControllerScreenTests();
  console.log("game controller screen tests OK");
}
