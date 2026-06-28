import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as gameHost from "../../hosts/terminal/gameHost.mjs";
import { createGameController } from "../../hosts/shared/gameController/createGameController.mjs";
import { recordPersonEncounter } from "../../hosts/terminal/personStatus.mjs";
import { getFloorRecommendationStatus } from "../../hosts/terminal/personStatus.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");

export function loadIntroWorldJson() {
  return readFileSync(
    resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
    "utf8",
  );
}

export function createTestController(save = null) {
  return createGameController({
    mapJson: loadIntroWorldJson(),
    gameHost,
    save,
    bootKarma: 50,
  });
}

/** Etsi hissiruudun koordinaatit annetulta kerrokselta. */
export function findElevatorTile(map, floorIndex) {
  const saved = map.currentFloor;
  map.currentFloor = floorIndex;
  map.recomputeSize?.();
  let found = null;
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      if (map.tileAt(x, y) === "E") {
        found = { x, y };
        break;
      }
    }
    if (found) break;
  }
  map.currentFloor = saved;
  map.recomputeSize?.();
  return found;
}

/** Siirrä pelaaja hissiruudulle. */
export function teleportToElevator(session, dispatch, floorIndex = 0) {
  const map = gameHost.sessionMap(session);
  const tile = findElevatorTile(map, floorIndex);
  if (!tile) throw new Error(`No elevator on floor ${floorIndex}`);
  dispatch(session, () => {
    map.currentFloor = floorIndex;
    map.recomputeSize();
    map.playerX = tile.x;
    map.playerY = tile.y;
    map.ensurePlayerOnWalkable();
  });
}

export function grantFloorRecommendations(ctrl, floorIndex) {
  const status = getFloorRecommendationStatus(ctrl.session, ctrl.personRegistry, floorIndex);
  for (const ent of status.missing) {
    recordPersonEncounter(ctrl.personRegistry, {
      id: ent.id,
      name: ent.name,
      kind: "coworker",
      char: "c",
    }, { correct: true });
  }
}

export function findEntityOnFloor(map, floorIndex, id) {
  const saved = map.currentFloor;
  map.currentFloor = floorIndex;
  map.recomputeSize?.();
  const floor = map.activeFloor();
  const ent = floor.entities?.find?.((e) => e.id === id) ?? null;
  map.currentFloor = saved;
  map.recomputeSize?.();
  return ent;
}

/** Siirrä pelaajan viereen ja törmää kohteeseen. */
export function bumpIntoEntity(ctrl, floorIndex, entityId) {
  const { session } = ctrl;
  const map = gameHost.sessionMap(session);
  const ent = findEntityOnFloor(map, floorIndex, entityId);
  if (!ent) throw new Error(`Entity not found: ${entityId}`);
  const approaches = [
    { px: ent.x - 1, py: ent.y, key: "d", fx: 1, fy: 0 },
    { px: ent.x + 1, py: ent.y, key: "a", fx: -1, fy: 0 },
    { px: ent.x, py: ent.y - 1, key: "s", fx: 0, fy: 1 },
    { px: ent.x, py: ent.y + 1, key: "w", fx: 0, fy: -1 },
  ];
  for (const step of approaches) {
    gameHost.dispatch(session, () => {
      map.currentFloor = floorIndex;
      map.recomputeSize();
      map.playerX = step.px;
      map.playerY = step.py;
      map.facingX = step.fx;
      map.facingY = step.fy;
      map.ensurePlayerOnWalkable?.();
    });
    const snap = ctrl.handleKey(step.key);
    if (snap.screen === "encounter" || snap.screen === "blocked") {
      return snap;
    }
  }
  throw new Error(`Could not bump into ${entityId}`);
}

/** Törmäys → blocked-valikko → puhu (1) → encounter. */
export function startEncounterViaBump(ctrl, floorIndex, entityId) {
  const snap = bumpIntoEntity(ctrl, floorIndex, entityId);
  if (snap.screen === "encounter") {
    return snap;
  }
  if (snap.screen === "blocked") {
    return ctrl.handleKey("1");
  }
  throw new Error(`Unexpected screen after bump into ${entityId}: ${snap.screen}`);
}

export { dispatch, sessionMap } from "../../hosts/terminal/gameHost.mjs";

export function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
