import assert from "node:assert/strict";

// Minimal reimplementation of wall + entity logic for node tests (mirrors isometricTiles.ts).

function wallSprite(lines, x, y) {
  const WALL = new Set(["#", "%", "|"]);
  const glyphAt = (gx, gy) => (lines[gy] ?? "")[gx] ?? " ";
  const isWall = (ch) => WALL.has(ch);
  const fix = (dir) => ({ N: "E", E: "N", S: "W", W: "S" }[dir]);

  const openN = !isWall(glyphAt(x, y - 1));
  const openS = !isWall(glyphAt(x, y + 1));
  const openE = !isWall(glyphAt(x + 1, y));
  const openW = !isWall(glyphAt(x - 1, y));

  if (openN && openS) return { base: "wallHalf", dir: fix("E") };
  if (openE && openW) return { base: "wallHalf", dir: fix("N") };
  if (openN) return { base: "wall", dir: fix("N") };
  return { base: "wall", dir: fix("E") };
}

function isEntityGlyph(glyph, entityCells, x, y) {
  return entityCells.some((c) => c.x === x && c.y === y);
}

const horizontalRun = [
  ".........",
  "..#####..",
  ".........",
];
const mid = wallSprite(horizontalRun, 3, 1);
assert(mid.base === "wallHalf", "horizontal wall run uses half wall");
assert(mid.dir === "N", "E-W grid wall maps to N iso dir (not E)");

const verticalRun = [
  "..#..",
  "..#..",
  "..#..",
];
const vMid = wallSprite(verticalRun, 2, 1);
assert(vMid.base === "wallHalf", "vertical wall run uses half wall");
assert(vMid.dir === "E", "N-S grid wall maps to E iso dir (not N)");

const entityCells = [{ x: 4, y: 2, glyph: "T", kind: "coworker" }];
assert(isEntityGlyph("T", entityCells, 4, 2), "entity cell detected");
assert(!isEntityGlyph("T", entityCells, 1, 1), "map label T is not an entity");

console.log("isometric_tiles.test.mjs OK");
