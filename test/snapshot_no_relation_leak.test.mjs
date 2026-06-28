import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import { createTestController, assert } from "./support/gameTestHarness.mjs";

const FORBIDDEN_SNAPSHOT_KEYS = [
  "anger",
  "friendliness",
  "respect",
  "love",
  "npcRelations",
  "overlayEmotion",
];

function walkKeys(value, path, hits) {
  if (value == null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkKeys(item, `${path}[${i}]`, hits));
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    const full = path ? `${path}.${key}` : key;
    if (FORBIDDEN_SNAPSHOT_KEYS.includes(key)) {
      hits.push(full);
    }
    walkKeys(child, full, hits);
  }
}

export function runSnapshotNoRelationLeakTests() {
  const ctrl = createTestController();
  try {
    dispatch(ctrl.session, () => {
      ctrl.session.setNpcRelationStat("staff-f2-1", "anger", 80);
      const map = sessionMap(ctrl.session);
      map.currentFloor = 2;
      map.recomputeSize();
      map.playerX = 7;
      map.playerY = 6;
    });

    const snap = ctrl.snapshot();
    const hits = [];
    walkKeys(snap, "", hits);
    assert(
      hits.length === 0,
      `player snapshot must not expose NPC relation stats: ${hits.join(", ")}`,
    );

    const debugJson = JSON.parse(ctrl.session.simDebugRelationsJson());
    assert(
      debugJson.relations.some((r) => r.npcId === "staff-f2-1" && r.anger === 80),
      "debug relations json available for tests",
    );
  } finally {
    ctrl.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSnapshotNoRelationLeakTests();
  console.log("snapshot_no_relation_leak.test.mjs OK");
}
