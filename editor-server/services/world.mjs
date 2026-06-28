import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");
const defaultWorldPath = resolve(projectRoot, "content/worlds/corporate-hq-intro.json");

const WALKABLE = new Set(".,=E%L+JK".split(""));
const BLOCKED = new Set(["#"]);

let cachedWorld = null;
let cachedPath = defaultWorldPath;

export function getCachedWorldPath() {
  return cachedPath;
}

export function injectWorld(filePath, world) {
  validateWorldShape(world);
  cachedPath = filePath;
  cachedWorld = world;
  return cachedWorld;
}

function validateWorldShape(world) {
  if (!world || typeof world !== "object") throw new Error("Maailma ei ole objekti");
  if (!Array.isArray(world.floors) || world.floors.length < 1) {
    throw new Error("Maailmalla pitää olla floors-taulukko");
  }
  for (const floor of world.floors) {
    if (!Array.isArray(floor.rows) || floor.rows.length < 1) {
      throw new Error(`Kerros ${floor.id ?? "?"}: puuttuvat rows`);
    }
  }
}

export function validateWorld(world) {
  validateWorldShape(world);
  return true;
}

export function loadWorld(filePath = defaultWorldPath) {
  if (cachedWorld && cachedPath === filePath) return cachedWorld;
  cachedPath = filePath;
  cachedWorld = JSON.parse(readFileSync(filePath, "utf8"));
  validateWorldShape(cachedWorld);
  return cachedWorld;
}

export function clearWorldCache() {
  cachedWorld = null;
}

function parseFloorGrid(floor) {
  const rows = floor.rows.map((r) => r.line);
  const height = rows.length;
  const width = rows[0]?.length ?? 0;
  return { rows, width, height };
}

function isWalkable(ch) {
  return WALKABLE.has(ch) || (!BLOCKED.has(ch) && ch !== "");
}

function tileCounts(rows) {
  const counts = {};
  for (const line of rows) {
    for (const ch of line) {
      counts[ch] = (counts[ch] ?? 0) + 1;
    }
  }
  return counts;
}

function findElevator(rows) {
  for (let y = 0; y < rows.length; y += 1) {
    for (let x = 0; x < rows[y].length; x += 1) {
      if (rows[y][x] !== "E") continue;
      const left = rows[y][x - 1];
      const right = rows[y][x + 1];
      if (left === "#" && right === "#") return { x, y };
    }
  }
  return null;
}

/** Flood-fill walkable alueet → huoneet / käytävät. */
function detectZones(rows, width, height) {
  const visited = Array.from({ length: height }, () => Array(width).fill(-1));
  const zones = [];
  const minRoomArea = 18;

  function neighbors(x, y) {
    return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (visited[y][x] >= 0) continue;
      const ch = rows[y][x];
      if (!isWalkable(ch)) continue;

      const id = zones.length;
      const tiles = [];
      const queue = [[x, y]];
      visited[y][x] = id;
      let touchesEdge = false;

      while (queue.length > 0) {
        const [cx, cy] = queue.shift();
        tiles.push({ x: cx, y: cy });
        if (cx <= 1 || cy <= 1 || cx >= width - 2 || cy >= height - 2) {
          touchesEdge = true;
        }
        for (const [nx, ny] of neighbors(cx, cy)) {
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          if (visited[ny][nx] >= 0) continue;
          if (!isWalkable(rows[ny][nx])) continue;
          visited[ny][nx] = id;
          queue.push([nx, ny]);
        }
      }

      const xs = tiles.map((t) => t.x);
      const ys = tiles.map((t) => t.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      let kind = "niche";
      if (tiles.length >= minRoomArea) {
        kind = touchesEdge && tiles.length > 120 ? "corridor" : "room";
      }

      zones.push({
        id: `zone-${id}`,
        kind,
        area: tiles.length,
        bounds: { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 },
        center: { x: Math.floor((minX + maxX) / 2), y: Math.floor((minY + maxY) / 2) },
      });
    }
  }

  return { zones, zoneAt: visited };
}

function zoneForPoint(zoneAt, x, y) {
  if (y < 0 || y >= zoneAt.length) return null;
  if (x < 0 || x >= zoneAt[y].length) return null;
  const id = zoneAt[y][x];
  return id >= 0 ? id : null;
}

function summarizeEntity(ent, floorIndex, zoneAt, zones) {
  const zid = zoneForPoint(zoneAt, ent.x, ent.y);
  const zone = zid !== null ? zones[zid] : null;
  return {
    id: ent.id,
    char: ent.char,
    name: ent.name,
    kind: ent.kind ?? "role",
    x: ent.x,
    y: ent.y,
    topic: ent.topic ?? "",
    scheduleRole: ent.scheduleRole ?? "",
    storyId: ent.storyId ?? "",
    itemTool: ent.itemTool ?? "",
    sociability: ent.sociability ?? null,
    persistence: ent.persistence ?? null,
    behavior: ent.behavior ?? "",
    homeX: ent.homeX ?? ent.x,
    homeY: ent.homeY ?? ent.y,
    zoneId: zone?.id ?? null,
    zoneKind: zone?.kind ?? "wall",
    floor: floorIndex,
  };
}

export function analyzeFloor(world, floorIndex) {
  const floor = world.floors[floorIndex];
  if (!floor) {
    throw new Error(`Floor ${floorIndex} not found`);
  }

  const { rows, width, height } = parseFloorGrid(floor);
  const { zones, zoneAt } = detectZones(rows, width, height);
  const elevator = findElevator(rows);

  const entities = (floor.entities ?? []).map((e) =>
    summarizeEntity(e, floorIndex, zoneAt, zones),
  );

  const entitiesByZone = new Map();
  for (const ent of entities) {
    const key = ent.zoneId ?? "unplaced";
    if (!entitiesByZone.has(key)) entitiesByZone.set(key, []);
    entitiesByZone.get(key).push(ent);
  }

  const rooms = zones
    .map((z, i) => ({
      ...z,
      label: z.kind === "room" ? `Huone ${zones.filter((x, j) => j <= i && x.kind === "room").length}` :
        z.kind === "corridor" ? "Käytävä" :
          z.kind === "niche" ? `Alkovi ${i}` : `Alue ${i}`,
      entities: entitiesByZone.get(z.id) ?? [],
    }))
    .filter((z) => z.kind !== "niche" || z.entities.length > 0);

  const unplaced = entities.filter((e) => e.zoneId === null);

  return {
    floorIndex,
    id: floor.id,
    title: floor.title,
    width,
    height,
    rows,
    spawn: floor.spawn ?? null,
    cafeteria: floor.cafeteria ?? null,
    door: floor.door ?? null,
    elevator,
    tileCounts: tileCounts(rows),
    zones: rooms,
    entities,
    entitiesByZone: Object.fromEntries(entitiesByZone),
    unplaced,
    entityCount: entities.length,
    roomCount: rooms.filter((r) => r.kind === "room").length,
  };
}

export function getWorldClone(filePath = cachedPath) {
  const world = loadWorld(filePath);
  return JSON.parse(JSON.stringify(world));
}

function assertRowDimensions(floor, rows) {
  const height = floor.rows.length;
  if (rows.length !== height) {
    throw new Error(`Rivimäärä ei täsmää: odotettiin ${height}, saatiin ${rows.length}`);
  }
  for (let y = 0; y < rows.length; y += 1) {
    const expected = floor.rows[y]?.line?.length ?? 0;
    if (rows[y].length !== expected) {
      throw new Error(`Rivi ${y} leveys ei täsmää: odotettiin ${expected}, saatiin ${rows[y].length}`);
    }
  }
}

export function patchFloor(world, floorIndex, patch) {
  const floor = world.floors[floorIndex];
  if (!floor) throw new Error(`Kerrosta ${floorIndex} ei löydy`);

  if (patch.rows) {
    assertRowDimensions(floor, patch.rows);
    floor.rows = patch.rows.map((line) => ({ line }));
  }

  if (patch.entities !== undefined) {
    if (!Array.isArray(patch.entities)) throw new Error("entities pitää olla taulukko");
    floor.entities = patch.entities;
  }

  if (patch.spawn !== undefined) floor.spawn = patch.spawn;
  if (patch.cafeteria !== undefined) floor.cafeteria = patch.cafeteria;
  if (patch.door !== undefined) floor.door = patch.door;

  return floor;
}

export function worldSummary(world) {
  return {
    id: world.id,
    title: world.title,
    startFloor: world.startFloor ?? 0,
    playerAlias: world.playerAlias ?? "Larry",
    floorCount: world.floors.length,
    floors: world.floors.map((f, i) => ({
      index: i,
      id: f.id,
      title: f.title,
      width: f.rows?.[0]?.line?.length ?? 0,
      height: f.rows?.length ?? 0,
      entityCount: f.entities?.length ?? 0,
    })),
  };
}
