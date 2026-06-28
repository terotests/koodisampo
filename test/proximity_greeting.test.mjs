import { createTestController } from "./support/gameTestHarness.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import { assert } from "./support/gameTestHarness.mjs";

export function runProximityGreetingTests() {
  const ctrl = createTestController();
  try {
    dispatch(ctrl.session, () => {
      ctrl.session.applyPlayerProfile("Pekka", "cpp");
      const map = sessionMap(ctrl.session);
      map.currentFloor = 0;
      map.recomputeSize();
      const ent = map.findEntityById("janitor");
      if (!ent?.id) throw new Error("janitor not found");
      ent.x = map.playerX + 3;
      ent.y = map.playerY;
      ent.greetCooldownUntil = 0;
      map.syncNpcOverlayEmotions(
        ctrl.session.npcRelations.npcIds,
        ctrl.session.npcRelations.relations,
      );
      ctrl.session.checkProximityGreetings();
    });

    const janitorMsg = sessionMap(ctrl.session).overheardMsg;
    assert(janitorMsg.includes("Pekka"), `janitor greeting uses name: ${janitorMsg}`);
    assert(
      janitorMsg.includes("Talkkari") && (janitorMsg.includes("Piha") || janitorMsg.includes("Päivää") || janitorMsg.includes("Moro") || janitorMsg.includes("Hei")),
      `janitor flavor: ${janitorMsg}`,
    );

    dispatch(ctrl.session, () => {
      const map = sessionMap(ctrl.session);
      map.currentFloor = 0;
      map.recomputeSize();
      map.playerX = 10;
      map.playerY = 11;
      const janitor = map.findEntityById("janitor");
      if (!janitor?.id) throw new Error("janitor not found");
      janitor.x = 11;
      janitor.y = 11;
      janitor.greetCooldownUntil = 0;
      const receptionist = map.findEntityById("receptionist");
      if (!receptionist?.id) throw new Error("receptionist not found");
      receptionist.greetCooldownUntil = 0;
      map.syncNpcOverlayEmotions(
        ctrl.session.npcRelations.npcIds,
        ctrl.session.npcRelations.relations,
      );
      ctrl.session.checkProximityGreetings();
    });

    const outdoorJanitor = sessionMap(ctrl.session).overheardMsg;
    assert(
      outdoorJanitor.includes("Talkkari") && (outdoorJanitor.includes("Piha") || outdoorJanitor.includes("Päivää") || outdoorJanitor.includes("Moro") || outdoorJanitor.includes("Hei")),
      `janitor greets outdoors with clear LOS: ${outdoorJanitor}`,
    );

    dispatch(ctrl.session, () => {
      const map = sessionMap(ctrl.session);
      map.playerX = 9;
      map.playerY = 15;
      const receptionist = map.findEntityById("receptionist");
      receptionist.greetCooldownUntil = 0;
      map.overheardMsg = "";
      map.syncNpcOverlayEmotions(
        ctrl.session.npcRelations.npcIds,
        ctrl.session.npcRelations.relations,
      );
      ctrl.session.checkProximityGreetings();
    });

    const blocked = sessionMap(ctrl.session).overheardMsg;
    assert(
      blocked.length < 1,
      `receptionist should not greet through wall: ${blocked}`,
    );

    dispatch(ctrl.session, () => {
      const map = sessionMap(ctrl.session);
      map.currentFloor = 1;
      map.recomputeSize();
      map.ensurePlayerOnWalkable();
      const ent = map.findEntityById("staff-f2-1");
      if (!ent?.id) {
        throw new Error("staff-f2-1 not found on map");
      }
      ent.x = map.playerX + 2;
      ent.y = map.playerY;
      ent.greetCooldownUntil = 0;
      map.syncNpcOverlayEmotions(
        ctrl.session.npcRelations.npcIds,
        ctrl.session.npcRelations.relations,
      );
      ctrl.session.checkProximityGreetings();
    });

    const ambient = sessionMap(ctrl.session).overheardMsg;
    assert(ambient.includes("Pekka"), `greeting uses player name: ${ambient}`);
    assert(
      ambient.includes("Hei") || ambient.includes("Huomenta") || ambient.includes("Moro") || ambient.includes("Terve") || ambient.includes("Päivää"),
      `greeting is a salutation: ${ambient}`,
    );

    dispatch(ctrl.session, () => {
      ctrl.session.setNpcRelationStat("staff-f2-1", "anger", 80);
      const map = sessionMap(ctrl.session);
      map.currentFloor = 1;
      map.recomputeSize();
      const ent = map.findEntityById("staff-f2-1");
      ent.greetCooldownUntil = 0;
      map.syncNpcOverlayEmotions(
        ctrl.session.npcRelations.npcIds,
        ctrl.session.npcRelations.relations,
      );
      ctrl.session.checkProximityGreetings();
    });

    const angry = sessionMap(ctrl.session).overheardMsg;
    assert(
      angry.includes("vaikealta") || angry.includes("Hei."),
      `angry greeting: ${angry}`,
    );
  } finally {
    ctrl.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runProximityGreetingTests();
  console.log("proximity_greeting.test.mjs OK");
}
