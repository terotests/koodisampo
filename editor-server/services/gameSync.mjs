import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_WORLD_REL } from "./storage.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");

/** Peli lukee tämän tiedoston (web-game dev lukee content/worlds/ suoraan). */
export const GAME_WORLD_REL = DEFAULT_WORLD_REL;

export function syncWorldToGame(relPath = GAME_WORLD_REL) {
  const normalized = relPath.split("\\").join("/");
  const src = resolve(projectRoot, normalized);
  if (!existsSync(src)) {
    throw new Error(`Maailmatiedostoa ei löydy: ${relPath}`);
  }

  const dest = resolve(projectRoot, "web-game/public/content/worlds/corporate-hq-intro.json");
  if (normalized !== GAME_WORLD_REL) {
    return { synced: false, reason: "not-game-world", source: normalized };
  }

  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  return {
    synced: true,
    source: normalized,
    dest: "web-game/public/content/worlds/corporate-hq-intro.json",
  };
}
