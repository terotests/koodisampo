import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { generateCorporateHq, MAP_DIMENSIONS } from "../hosts/terminal/mapGenerator.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const { WorldMap } = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function findElevatorTile(map) {
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      if (map.tileAt(x, y) === "E") {
        return { x, y };
      }
    }
  }
  return null;
}

export function runWorldMapTests() {
  const world = generateCorporateHq(42);
  const mapJson = JSON.stringify(world);
  const map = new WorldMap();
  assert(map.loadFromText(mapJson), "loadFromText should succeed");
  assert(map.mapId === "corporate-hq-gen", "map id");
  assert(map.hasMap === true, "hasMap");
  assert(map.width >= MAP_DIMENSIONS.minWidth, "map width in range");
  assert(map.height >= MAP_DIMENSIONS.minHeight, "map height in range");
  assert(map.floorCount() === MAP_DIMENSIONS.floors, "10 floors");
  assert(map.currentFloor === 0, "start floor");

  assert(map.isBlockedTile("#") === true, "wall blocked");
  assert(map.isBlockedTile("%") === true, "drywall blocked");
  assert(map.isBlockedTile(".") === false, "floor walkable");

  const view = map.getView();
  assert(view.lines.length === map.viewPortH, "viewport height");
  assert(view.lines[0].length === map.viewPortW, "viewport width");
  assert(view.mapWidth === map.width, "full map width in view");

  let brokeWall = false;
  for (let fi = 0; fi < map.floorCount() && !brokeWall; fi += 1) {
    map.currentFloor = fi;
    for (let y = 1; y < map.height - 1; y += 1) {
    for (let x = 1; x < map.width - 1; x += 1) {
      if (map.tileAt(x, y) !== "%") {
        continue;
      }
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        const px = x - dx;
        const py = y - dy;
        if (map.tileAt(nx, ny) !== ".") {
          continue;
        }
        if (map.tileAt(px, py) !== ".") {
          continue;
        }
        map.playerX = px;
        map.playerY = py;
        map.facingX = dx;
        map.facingY = dy;
        const result = map.tryBreakFacing("crowbar");
        if (result === "medium") {
          brokeWall = true;
          assert(map.tileAt(x, y) === ".", "tile opened");
          break;
        }
      }
      if (brokeWall) {
        break;
      }
    }
    }
  }
  assert(brokeWall, "crowbar can break drywall somewhere on map");
  map.currentFloor = 0;

  const elev0 = findElevatorTile(map);
  assert(elev0, "floor 0 has elevator");
  map.playerX = elev0.x;
  map.playerY = elev0.y;
  assert(map.isOnElevator() === true, "on elevator tile");
  assert(map.tryElevatorTo(1) === true, "elevator to floor 2");
  assert(map.currentFloor === 1, "floor changed");

  const elev1 = findElevatorTile(map);
  assert(elev1, "floor 1 has elevator");

  map.currentFloor = 0;
  map.playerX = 10;
  map.playerY = 10;
  map.startPoliceChase();
  assert(map.policeChaseActive === true, "police chase active");
  const police = map.activeFloor().entities.filter((e) => e.kind === "police");
  assert(police.length === 3, "three police spawn");
  assert(police.every((p) => p.char === "P"), "police char is P");

  map.playerHidden = false;
  map.playerX = police[0].x;
  map.playerY = police[0].y;
  const caught = map.tickAgents();
  assert(caught.kind === "police", "police catch at same tile");

  map.clearPoliceSquad();
  assert(map.policeChaseActive === false, "clear police ends chase");
  assert(map.activeFloor().entities.every((e) => e.kind !== "police"), "police removed");

  return true;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runWorldMapTests();
  console.log("world_map tests OK");
}
