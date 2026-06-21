import { loadWorld, analyzeFloor, worldSummary } from "../editor-server/services/world.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runEditorWorldTests() {
  const world = loadWorld();
  const summary = worldSummary(world);
  assert(summary.floorCount === 10, "ten floors in summary");
  assert(summary.floors.length === 10, "floor list");

  const f1 = analyzeFloor(world, 1);
  assert(f1.rows.length > 10, "office floor has height");
  assert(f1.entityCount >= 3, "office has entities");
  assert(f1.elevator, "office has elevator");
  assert(f1.entities.some((e) => e.name === "Pekka"), "Pekka on kerros 2");
  assert(f1.zones.length > 0, "zones detected");

  const layouts = new Set();
  for (let i = 1; i <= 9; i += 1) {
    const a = analyzeFloor(world, i);
    layouts.add(a.rows.join("\n"));
    assert(a.entities.length === a.entityCount, `floor ${i} entity count`);
  }
  assert(layouts.size >= 7, "floors are visually distinct");

  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEditorWorldTests();
  console.log("editor_world tests OK");
}
