import { loadWorld, patchFloor, analyzeFloor } from "../editor-server/services/world.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runEditorFloorPatchTests() {
  const world = loadWorld();
  const before = analyzeFloor(world, 1);
  const rows = before.rows.map((line) => line);
  const testX = 5;
  const testY = 5;
  const original = rows[testY][testX];
  rows[testY] = rows[testY].slice(0, testX) + "#" + rows[testY].slice(testX + 1);

  patchFloor(world, 1, { rows });
  const after = analyzeFloor(world, 1);
  assert(after.rows[testY][testX] === "#", "patched tile");

  rows[testY] = rows[testY].slice(0, testX) + original + rows[testY].slice(testX + 1);
  patchFloor(world, 1, { rows });

  try {
    patchFloor(world, 1, { rows: ["too", "short"] });
    throw new Error("expected dimension error");
  } catch (e) {
    assert(String(e.message).includes("Rivimäärä"), "rejects bad row count");
  }

  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEditorFloorPatchTests();
  console.log("editor_floor_patch tests OK");
}
