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

export function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
