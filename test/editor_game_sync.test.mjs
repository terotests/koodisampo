import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { syncWorldToGame, GAME_WORLD_REL } from "../editor-server/services/gameSync.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runEditorGameSyncTests() {
  const root = process.cwd();
  const testWorld = join(root, "editor-data/worlds/_test-game-sync.json");
  const src = join(root, GAME_WORLD_REL);
  const dest = join(root, "web-game/public/content/worlds/corporate-hq-intro.json");

  const marker = `"id": "game-sync-test-marker"`;
  const originalDest = readFileSync(dest, "utf8");

  try {
    const world = JSON.parse(readFileSync(src, "utf8"));
    world._gameSyncTest = true;
    mkdirSync(join(root, "editor-data/worlds"), { recursive: true });
    writeFileSync(testWorld, `${JSON.stringify(world, null, 2)}\n`, "utf8");

    const skip = syncWorldToGame("editor-data/worlds/_test-game-sync.json");
    assert(skip.synced === false, "skips non-game world path");

    const ok = syncWorldToGame(GAME_WORLD_REL);
    assert(ok.synced === true, "syncs default game world");
    const copied = readFileSync(dest, "utf8");
    assert(copied.includes('"id": "corporate-hq-intro"'), "dest has world id");
    assert(readFileSync(src, "utf8") === copied, "dest matches source");
  } finally {
    writeFileSync(dest, originalDest, "utf8");
    try {
      rmSync(testWorld);
    } catch {
      // ignore
    }
  }

  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEditorGameSyncTests();
  console.log("editor_game_sync tests OK");
}
