import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateCorporateHq, MAP_DIMENSIONS } from "../hosts/terminal/mapGenerator.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runMapGeneratorTests() {
  const world = generateCorporateHq(42);
  assert(world.floors.length === MAP_DIMENSIONS.floors, "floor count");
  assert(world.playerAlias === "Larry", "player alias");
  assert(world.mapWidth >= MAP_DIMENSIONS.minWidth, "world max width");
  assert(world.mapHeight >= MAP_DIMENSIONS.minHeight, "world max height");

  for (const floor of world.floors) {
    assert(floor.rows.length === floor.height, `${floor.id} row count matches height`);
    assert(floor.rows[0].line.length === floor.width, `${floor.id} consistent width`);
    assert(floor.width >= MAP_DIMENSIONS.minWidth && floor.width <= MAP_DIMENSIONS.maxWidth, `${floor.id} width range`);
    assert(floor.height >= MAP_DIMENSIONS.minHeight && floor.height <= MAP_DIMENSIONS.maxHeight, `${floor.id} height range`);

    const hasElevator = floor.rows.some((r) => r.line.includes("E"));
    assert(hasElevator, `${floor.id} has elevator`);
    const hasCubicles = floor.rows.some((r) => r.line.includes("="));
    assert(hasCubicles, `${floor.id} has workstations`);
    const hashWalls = floor.rows.some((r) => (r.line.match(/#/g) ?? []).length > 20);
    assert(hashWalls, `${floor.id} has interior walls`);

    const coworkers = floor.entities.filter((e) => e.kind === "coworker");
    assert(coworkers.length >= 12, `${floor.id} has many coworkers`);
    const agents = floor.entities.filter((e) => e.isAgent);
    assert(agents.length >= coworkers.length, `${floor.id} agents flagged`);

    const onDesk = coworkers.filter((e) => {
      const row = floor.rows[e.y]?.line ?? "";
      return row[e.x] === "=";
    });
    assert(onDesk.length >= Math.floor(coworkers.length * 0.5), `${floor.id} coworkers at desks`);
  }
  return true;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runMapGeneratorTests();
  console.log("map_generator tests OK");
}
