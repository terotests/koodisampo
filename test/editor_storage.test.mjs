import { unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import { loadWorld, clearWorldCache } from "../editor-server/services/world.mjs";
import {
  switchActiveWorld,
  saveActiveWorld,
  createNamedBackup,
  listBackups,
  restoreBackup,
  deleteBackup,
  listWorldFiles,
  DEFAULT_WORLD_REL,
  getActiveWorldRel,
} from "../editor-server/services/storage.mjs";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const TEST_WORLD = "editor-data/worlds/_test-storage.json";

export function runEditorStorageTests() {
  clearWorldCache();
  switchActiveWorld(DEFAULT_WORLD_REL);

  const filesBefore = listWorldFiles().length;
  assert(filesBefore >= 1, "at least default world file");

  const saved = saveActiveWorld(TEST_WORLD, { overwrite: true });
  assert(saved.path === TEST_WORLD, "saved test world path");
  assert(existsSync(join(process.cwd(), TEST_WORLD)), "test world on disk");

  const loaded = switchActiveWorld(TEST_WORLD);
  assert(loaded.activeFile === TEST_WORLD, "switched to test world");
  assert(getActiveWorldRel() === TEST_WORLD, "active rel path");

  const backup = createNamedBackup("Test backup", "unit test");
  assert(backup.id.includes("test-backup"), "backup id slug");
  const backups = listBackups();
  assert(backups.some((b) => b.id === backup.id), "backup listed");

  switchActiveWorld(DEFAULT_WORLD_REL);
  const restored = restoreBackup(backup.id, {});
  assert(restored.inMemoryOnly === true, "memory restore");
  assert(loadWorld().floors.length === 10, "restored world in memory");

  switchActiveWorld(TEST_WORLD);
  restoreBackup(backup.id, { saveActive: true });
  assert(getActiveWorldRel() === TEST_WORLD, "save active keeps path");

  deleteBackup(backup.id);
  assert(!listBackups().some((b) => b.id === backup.id), "backup deleted");

  unlinkSync(join(process.cwd(), TEST_WORLD));
  switchActiveWorld(DEFAULT_WORLD_REL);
  clearWorldCache();

  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEditorStorageTests();
  console.log("editor_storage tests OK");
}
