import { createTestController } from "./support/gameTestHarness.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import { assert } from "./support/gameTestHarness.mjs";

export function runGreetSnubTests() {
  const ctrl = createTestController();
  try {
    dispatch(ctrl.session, () => {
      ctrl.session.applyPlayerProfile("Pekka", "cpp");
      const map = sessionMap(ctrl.session);
      map.currentFloor = 1;
      map.recomputeSize();
      const ent = map.findEntityById("staff-f2-1");
      if (!ent?.id) throw new Error("staff-f2-1 not found");
      ent.x = map.playerX + 2;
      ent.y = map.playerY;
      ent.greetCooldownUntil = 0;
      map.syncNpcOverlayEmotions(
        ctrl.session.npcRelations.npcIds,
        ctrl.session.npcRelations.relations,
      );
      ctrl.session.checkProximityGreetings();
    });

    const relBefore = ctrl.session.npcRelations.getOrCreate("staff-f2-1");
    assert(relBefore.respect === 50, `default respect 50, got ${relBefore.respect}`);

    dispatch(ctrl.session, () => {
      const map = sessionMap(ctrl.session);
      map.playerX = map.playerX + 10;
      map.playerY = map.playerY + 10;
      ctrl.session.checkProximityGreetings();
    });

    const relAfter = ctrl.session.npcRelations.getOrCreate("staff-f2-1");
    assert(relAfter.respect === 46, `snub lowers respect to 46, got ${relAfter.respect}`);
    assert(relAfter.anger === 6, `snub raises anger to 6, got ${relAfter.anger}`);
    assert(relAfter.friendliness === 47, `snub lowers friendliness to 47, got ${relAfter.friendliness}`);

    dispatch(ctrl.session, () => {
      ctrl.session.applyPlayerProfile("Matti", "cpp");
      const map = sessionMap(ctrl.session);
      map.currentFloor = 1;
      map.recomputeSize();
      const ent = map.findEntityById("staff-f2-1");
      ent.x = map.playerX + 1;
      ent.y = map.playerY;
      ent.greetCooldownUntil = 0;
      const rel = ctrl.session.npcRelations.getOrCreate("staff-f2-1");
      rel.setStat("respect", 50);
      rel.setStat("anger", 10);
      rel.setStat("friendliness", 50);
      map.syncNpcOverlayEmotions(
        ctrl.session.npcRelations.npcIds,
        ctrl.session.npcRelations.relations,
      );
      ctrl.session.checkProximityGreetings();
      const bump = map.findEntityById("staff-f2-1");
      ctrl.session.startEncounter(bump);
    });

    const relTalk = ctrl.session.npcRelations.getOrCreate("staff-f2-1");
    assert(relTalk.respect === 55, `talk ack raises respect to 55, got ${relTalk.respect}`);
    assert(relTalk.friendliness === 54, `talk ack raises friendliness to 54, got ${relTalk.friendliness}`);
    assert(relTalk.anger === 4, `talk ack lowers anger to 4, got ${relTalk.anger}`);
  } finally {
    ctrl.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runGreetSnubTests();
  console.log("greet_snub.test.mjs OK");
}
