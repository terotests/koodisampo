import assert from "node:assert/strict";

// Minimal reimplementation of wall + entity logic for node tests (mirrors isometricTiles.ts).

function wallSprite(lines, x, y) {
  const WALL = new Set(["#", "%", "|"]);
  const glyphAt = (gx, gy) => {
    if (gy < 0 || gy >= lines.length) return " ";
    const row = lines[gy] ?? "";
    if (gx < 0 || gx >= row.length) return " ";
    return row[gx] ?? " ";
  };
  const isWall = (ch) => WALL.has(ch);
  const fix = (dir) => ({ N: "E", E: "N", S: "W", W: "S" }[dir]);
  const cornerDir = (openN, openE, openS, openW) => {
    if (openN && openW) return fix("W");
    if (openN && openE) return fix("N");
    if (openS && openW) return fix("S");
    if (openS && openE) return fix("E");
    return null;
  };

  const openN = !isWall(glyphAt(x, y - 1));
  const openS = !isWall(glyphAt(x, y + 1));
  const openE = !isWall(glyphAt(x + 1, y));
  const openW = !isWall(glyphAt(x - 1, y));

  const corner = cornerDir(openN, openE, openS, openW);
  if (corner) return { base: "wallCorner", dir: corner };

  const north = isWall(glyphAt(x, y - 1));
  const south = isWall(glyphAt(x, y + 1));
  const east = isWall(glyphAt(x + 1, y));
  const west = isWall(glyphAt(x - 1, y));

  if (openN && !openS && !openE && !openW && east && west) {
    return { base: "wallHalf", dir: fix("E") };
  }
  if (openS && !openN && !openE && !openW && east && west) {
    return { base: "wallHalf", dir: fix("E") };
  }
  if (openE && !openW && !openN && !openS && north && south) {
    return { base: "wallHalf", dir: fix("N") };
  }
  if (openW && !openE && !openN && !openS && north && south) {
    return { base: "wallHalf", dir: fix("N") };
  }

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

const yardCorner = [
  ",,,",
  ",##",
  ",##",
];
const cornerCell = wallSprite(yardCorner, 1, 1);
assert(cornerCell.base === "wallCorner", "yard-facing wall uses corner tile");
assert(cornerCell.dir === "S", "open north+west maps to south iso corner");

const borderTop = [
  "#####",
  "#...#",
  "#...#",
  "#####",
];
const topMid = wallSprite(borderTop, 2, 0);
assert(topMid.base === "wallHalf", "straight outer border uses half wall, not end cap");
assert(topMid.dir === "N", "horizontal border maps to N iso half wall");

console.log("isometric_tiles.test.mjs OK");
