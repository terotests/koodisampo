/**
 * Rakenna intro-maailman kerrokset 2–10 uniikeilla pohjilla.
 * Kerros 0 (pihamaa) säilyy; kerrokset 1–9 ja 10 generoidaan intro-floor-builderista.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildOfficeCafeteriaFloor,
  buildUpperFloor,
  buildExecutiveFloor,
} from "./intro-floor-builder.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const worldPath = resolve(__dirname, "../content/worlds/corporate-hq-intro.json");

const world = JSON.parse(readFileSync(worldPath, "utf8"));

// Poista duplikaatti CEO pihamaalta jos on
world.floors[0].door = { x: 3, y: 3 };
const seenIds = new Set();
world.floors[0].entities = world.floors[0].entities.filter((e) => {
  if (seenIds.has(e.id)) return false;
  seenIds.add(e.id);
  return true;
});
if (!world.floors[0].entities.some((e) => e.id === "ceo-lunch-walk")) {
  world.floors[0].entities.push({
    id: "ceo-lunch-walk",
    char: "C",
    name: "Toimitusjohtaja",
    kind: "role",
    x: 3,
    y: 3,
    homeX: 3,
    homeY: 3,
    scheduleRole: "ceo_lunch",
    offDuty: 1,
  });
}

world.floors[1] = buildOfficeCafeteriaFloor();

for (let floorNum = 3; floorNum <= 9; floorNum += 1) {
  world.floors[floorNum - 1] = buildUpperFloor(floorNum);
}

world.floors[9] = buildExecutiveFloor();

writeFileSync(worldPath, `${JSON.stringify(world, null, 2)}\n`, "utf8");
console.log("Updated", worldPath, "— unique floors 2–10 with larger rooms");
