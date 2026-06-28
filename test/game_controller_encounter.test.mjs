import {
  assert,
  createTestController,
  startEncounterViaBump,
  findEntityOnFloor,
} from "./support/gameTestHarness.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";

export function runGameControllerEncounterTests() {
  const ctrl = createTestController();
  const { session } = ctrl;

  try {
    let snap = startEncounterViaBump(ctrl, 1, "staff-f2-1");
    assert(snap.screen === "encounter", "coworker bump on office floor");
    assert(snap.encounter?.needsQuiz === true, "coworker quiz encounter");

    snap = ctrl.handleKey("3");
    assert(snap.screen === "map", "leave coworker");

    const map = sessionMap(session);
    const hr = findEntityOnFloor(map, 0, "hr-greeter");
    if (hr) {
      dispatch(session, () => {
        map.currentFloor = 0;
        map.recomputeSize();
        map.playerX = hr.x;
        map.playerY = hr.y - 1;
      });
      for (let i = 0; i < 5; i += 1) {
        dispatch(session, () => {
          session.handleAgentTick();
        });
      }
      snap = ctrl.snapshot();
      if (snap.screen === "encounter") {
        assert(session.pendingEntityId === "hr-greeter", "HR welcome encounter");
        assert(snap.encounter?.needsQuiz === true, "HR welcome quiz");
        snap = ctrl.handleKey("3");
        assert(snap.screen === "map", "leave HR encounter");
      }
    }

    snap = startEncounterViaBump(ctrl, 0, "office-dog");
    assert(snap.screen === "encounter", "pet encounter");
    assert(snap.encounter?.needsQuiz === false, "dog has story");

    snap = ctrl.handleKey("1");
    assert(
      snap.screen === "encounter" || snap.screen === "story",
      "talk opens story or stays in encounter",
    );

    if (snap.screen === "story") {
      snap = ctrl.handleKey("esc");
      assert(snap.screen === "map" || snap.screen === "encounter", "story dismiss");
    } else {
      snap = ctrl.handleKey("3");
      assert(snap.screen === "map", "leave dog encounter");
    }

    const resetSnap = ctrl.reset(false);
    assert(resetSnap.screen === "map", "reset returns to map");
    assert(resetSnap.floor === 0, "reset on courtyard");
    assert(resetSnap.onElevator === false, "reset off elevator");
  } finally {
    ctrl.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runGameControllerEncounterTests();
  console.log("game controller encounter tests OK");
}
