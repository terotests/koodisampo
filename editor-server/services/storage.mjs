import {
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  existsSync,
  statSync,
  unlinkSync,
} from "node:fs";
import { resolve, dirname, relative, normalize, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorld, clearWorldCache, worldSummary, injectWorld, validateWorld } from "./world.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");

export const DEFAULT_WORLD_REL = "content/worlds/corporate-hq-intro.json";

const READ_DIRS = [
  resolve(projectRoot, "content/worlds"),
  resolve(projectRoot, "editor-data/worlds"),
];

const WRITE_DIRS = [
  resolve(projectRoot, "editor-data/worlds"),
  resolve(projectRoot, "content/worlds"),
];

const BACKUPS_DIR = resolve(projectRoot, "editor-data/backups");

let activeRelPath = DEFAULT_WORLD_REL;

export function ensureStorageDirs() {
  for (const dir of WRITE_DIRS) mkdirSync(dir, { recursive: true });
  mkdirSync(BACKUPS_DIR, { recursive: true });
}

function relToAbs(relPath) {
  const normalized = normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const abs = resolve(projectRoot, normalized);
  if (!abs.startsWith(projectRoot)) {
    throw new Error("Polku projektin ulkopuolella");
  }
  return abs;
}

function assertUnderDirs(absPath, dirs) {
  const ok = dirs.some((dir) => absPath === dir || absPath.startsWith(`${dir}/`));
  if (!ok) throw new Error(`Tiedosto ei sallitussa hakemistossa: ${relative(projectRoot, absPath)}`);
}

function assertJsonName(relPath) {
  if (!relPath.endsWith(".json")) throw new Error("Tiedoston pitää päättyä .json");
  if (relPath.includes("..")) throw new Error("Virheellinen polku");
}

export function getActiveWorldRel() {
  return activeRelPath;
}

export function getActiveWorldAbs() {
  return relToAbs(activeRelPath);
}

export function listWorldFiles() {
  ensureStorageDirs();
  const files = [];
  for (const dir of READ_DIRS) {
    if (!existsSync(dir)) continue;
    const relDir = relative(projectRoot, dir).split("\\").join("/");
    for (const name of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
      const abs = resolve(dir, name);
      const st = statSync(abs);
      files.push({
        path: `${relDir}/${name}`,
        name,
        size: st.size,
        modifiedAt: st.mtime.toISOString(),
        isDefault: `${relDir}/${name}` === DEFAULT_WORLD_REL,
      });
    }
  }
  return files;
}

export function switchActiveWorld(relPath) {
  assertJsonName(relPath);
  const abs = relToAbs(relPath);
  assertUnderDirs(abs, READ_DIRS);
  if (!existsSync(abs)) throw new Error(`Tiedostoa ei löydy: ${relPath}`);
  activeRelPath = relPath.split("\\").join("/");
  clearWorldCache();
  const world = loadWorld(abs);
  return {
    activeFile: activeRelPath,
    summary: worldSummary(world),
  };
}

export function saveWorldToFile(relPath, world, { overwrite = true } = {}) {
  ensureStorageDirs();
  assertJsonName(relPath);
  validateWorld(world);
  const abs = relToAbs(relPath);
  assertUnderDirs(abs, WRITE_DIRS);
  if (!overwrite && existsSync(abs)) {
    throw new Error(`Tiedosto on jo olemassa: ${relPath}`);
  }
  writeFileSync(abs, `${JSON.stringify(world, null, 2)}\n`, "utf8");
  if (relPath.split("\\").join("/") === activeRelPath) {
    clearWorldCache();
    loadWorld(abs);
  }
  return { path: relPath.split("\\").join("/"), size: statSync(abs).size };
}

export function saveActiveWorld(relPath, { overwrite = true } = {}) {
  const world = loadWorld(getActiveWorldAbs());
  return saveWorldToFile(relPath, world, { overwrite });
}

function slugify(name) {
  const base = String(name || "varmuuskopio")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || "varmuuskopio";
}

function uniqueBackupId(name) {
  ensureStorageDirs();
  const base = slugify(name);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  let id = `${base}-${stamp}`;
  let n = 1;
  while (existsSync(join(BACKUPS_DIR, `${id}.json`))) {
    id = `${base}-${stamp}-${n}`;
    n += 1;
  }
  return id;
}

export function createNamedBackup(name, note = "") {
  ensureStorageDirs();
  const world = loadWorld(getActiveWorldAbs());
  validateWorld(world);
  const id = uniqueBackupId(name);
  const payload = {
    id,
    name: String(name || id).trim() || id,
    note: String(note || "").trim(),
    createdAt: new Date().toISOString(),
    sourceFile: activeRelPath,
    world,
  };
  const file = join(BACKUPS_DIR, `${id}.json`);
  writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return {
    id,
    name: payload.name,
    createdAt: payload.createdAt,
    sourceFile: payload.sourceFile,
    file: relative(projectRoot, file).split("\\").join("/"),
  };
}

export function listBackups() {
  ensureStorageDirs();
  if (!existsSync(BACKUPS_DIR)) return [];
  return readdirSync(BACKUPS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = JSON.parse(readFileSync(join(BACKUPS_DIR, f), "utf8"));
      return {
        id: raw.id ?? f.replace(/\.json$/, ""),
        name: raw.name ?? f,
        note: raw.note ?? "",
        createdAt: raw.createdAt ?? "",
        sourceFile: raw.sourceFile ?? "",
        file: `editor-data/backups/${f}`,
        floorCount: raw.world?.floors?.length ?? 0,
      };
    })
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export function restoreBackup(id, { saveToSource = false, saveActive = false } = {}) {
  ensureStorageDirs();
  const file = join(BACKUPS_DIR, `${id}.json`);
  if (!existsSync(file)) throw new Error(`Varmuuskopiota ei löydy: ${id}`);
  const backup = JSON.parse(readFileSync(file, "utf8"));
  validateWorld(backup.world);

  if (saveToSource && backup.sourceFile) {
    saveWorldToFile(backup.sourceFile, backup.world, { overwrite: true });
    activeRelPath = backup.sourceFile.split("\\").join("/");
    clearWorldCache();
    loadWorld(getActiveWorldAbs());
  } else if (saveActive) {
    saveWorldToFile(activeRelPath, backup.world, { overwrite: true });
    clearWorldCache();
    loadWorld(getActiveWorldAbs());
  } else {
    injectWorld(getActiveWorldAbs(), backup.world);
  }

  return {
    id: backup.id,
    name: backup.name,
    activeFile: activeRelPath,
    summary: worldSummary(backup.world),
    savedToSource: !!saveToSource,
    savedActive: !!saveActive,
    inMemoryOnly: !saveToSource && !saveActive,
  };
}

export function deleteBackup(id) {
  const file = join(BACKUPS_DIR, `${id}.json`);
  if (!existsSync(file)) throw new Error(`Varmuuskopiota ei löydy: ${id}`);
  unlinkSync(file);
  return { id, deleted: true };
}
