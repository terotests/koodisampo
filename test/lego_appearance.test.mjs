import assert from "node:assert/strict";
import {
  appearanceRoleKey,
  applyMapPersonDisplay,
  emptyPersonRegistry,
  inferGender,
} from "../hosts/terminal/personStatus.mjs";

assert.equal(appearanceRoleKey({ id: "receptionist", kind: "role" }), "reception");
assert.equal(appearanceRoleKey({ id: "office-dog", kind: "pet" }), "dog");
assert.equal(
  appearanceRoleKey({ id: "staff-f2-1", kind: "coworker", topic: "tools" }),
  "topic:tools",
);
assert.equal(appearanceRoleKey({ id: "janitor", kind: "role" }), "janitor");
assert.equal(inferGender("Maija"), "F");
assert.equal(inferGender("Pekka"), "M");

const lines = ["..........", "..........", ".........."];
const map = {
  playerX: 1,
  playerY: 1,
  playerHidden: false,
  cameraX: 0,
  cameraY: 0,
  activeFloor: () => ({
    entities: [
      {
        id: "receptionist",
        kind: "role",
        char: "S",
        name: "Vastaanottovirkailija",
        x: 4,
        y: 2,
      },
      {
        id: "office-dog",
        kind: "pet",
        char: "d",
        name: "Toimistokoira",
        x: 6,
        y: 2,
      },
      {
        id: "staff-f2-1",
        kind: "coworker",
        char: "c",
        name: "Maija",
        topic: "tools",
        x: 8,
        y: 2,
      },
      {
        id: "editor-emoji-desktop-10-14",
        kind: "item",
        char: "🖥️",
        name: "Työasema",
        x: 2,
        y: 2,
      },
    ],
  }),
};
const registry = emptyPersonRegistry();
const display = applyMapPersonDisplay(lines, map, registry);
const reception = display.entityCells.find((c) => c.id === "receptionist");
const dog = display.entityCells.find((c) => c.id === "office-dog");
const coworker = display.entityCells.find((c) => c.id === "staff-f2-1");
const desktop = display.entityCells.find((c) => c.id === "editor-emoji-desktop-10-14");

assert.equal(reception?.roleKey, "reception");
assert.equal(reception?.gender, "F");
assert.equal(dog?.roleKey, "dog");
assert.equal(coworker?.gender, "F");
assert.equal(coworker?.topic, "tools");
assert.equal(desktop?.glyph, "🖥️");

console.log("lego_appearance.test.mjs OK");
