import { splitMapGraphemes, isEmojiGlyph } from "../../../hosts/shared/mapGlyphs.mjs";
import type { IsoDirection } from "./isometricProjection";

const WALL_CHARS = new Set(["#", "%", "|"]);
const FLOOR_CHARS = new Set([".", " ", ",", "-", "x"]);

function glyphAt(lines: string[], x: number, y: number): string {
  const line = lines[y];
  if (!line) return " ";
  const cells = splitMapGraphemes(line);
  return cells[x] ?? " ";
}

function isWallChar(ch: string): boolean {
  return WALL_CHARS.has(ch);
}

function isFloorChar(ch: string): boolean {
  return FLOOR_CHARS.has(ch);
}

type WallSprite = { base: string; dir: IsoDirection };

/** Pick wall/corner sprite facing open (floor) neighbors — Kenney iso convention. */
function wallSprite(lines: string[], x: number, y: number): WallSprite {
  const north = isWallChar(glyphAt(lines, x, y - 1));
  const south = isWallChar(glyphAt(lines, x, y + 1));
  const east = isWallChar(glyphAt(lines, x + 1, y));
  const west = isWallChar(glyphAt(lines, x - 1, y));
  const openN = !north;
  const openS = !south;
  const openE = !east;
  const openW = !west;

  if (openN && openW) return { base: "wallCorner", dir: "N" };
  if (openN && openE) return { base: "wallCorner", dir: "E" };
  if (openS && openW) return { base: "wallCorner", dir: "W" };
  if (openS && openE) return { base: "wallCorner", dir: "S" };

  if (openN && !openS && !openE && !openW) return { base: "wall", dir: "N" };
  if (openS && !openN && !openE && !openW) return { base: "wall", dir: "S" };
  if (openE && !openW && !openN && !openS) return { base: "wall", dir: "E" };
  if (openW && !openE && !openN && !openS) return { base: "wall", dir: "W" };

  if (openN && openS) return { base: "wallHalf", dir: "E" };
  if (openE && openW) return { base: "wallHalf", dir: "N" };

  if (openN) return { base: "wall", dir: "N" };
  if (openS) return { base: "wall", dir: "S" };
  if (openE) return { base: "wall", dir: "E" };
  if (openW) return { base: "wall", dir: "W" };

  return { base: "wall", dir: "E" };
}

export type TileSprite = {
  kind: "tile";
  base: string;
  dir: IsoDirection;
};

export type EntitySprite = {
  kind: "entity";
  skin: number;
  glyph: string;
  highlight?: boolean;
  police?: boolean;
};

export type CellSprite = TileSprite | EntitySprite | { kind: "emoji"; glyph: string; highlight?: boolean };

export function resolveCellSprite(
  glyph: string,
  lines: string[],
  x: number,
  y: number,
  opts: { recommended?: boolean; policeChase?: boolean },
): CellSprite {
  if (glyph === "@") {
    return { kind: "entity", skin: 0, glyph, highlight: opts.recommended };
  }
  if (isEmojiGlyph(glyph)) {
    return { kind: "emoji", glyph, highlight: opts.recommended };
  }
  if (/^[a-zA-Z]$/.test(glyph) || glyph === "!" || glyph === "?" || glyph === "P") {
    const skin = 1 + (glyph.charCodeAt(0) % 7);
    return {
      kind: "entity",
      skin,
      glyph,
      highlight: opts.recommended,
      police: opts.policeChase && glyph === "P",
    };
  }

  const wall = wallSprite(lines, x, y);
  if (glyph === "#" || glyph === "|") {
    return { kind: "tile", base: wall.base, dir: wall.dir };
  }
  if (glyph === "%") {
    return { kind: "tile", base: "window", dir: wall.dir };
  }
  if (glyph === "+") {
    return { kind: "tile", base: "doorOpen", dir: wall.dir };
  }
  if (glyph === "L") {
    return { kind: "tile", base: "doorClosed", dir: wall.dir };
  }
  if (glyph === "=") {
    return { kind: "tile", base: "slab", dir: wall.dir };
  }
  if (glyph === "E" || glyph === "G" || glyph === "O" || glyph === "o" || glyph === "M") {
    return { kind: "tile", base: "switchFloorOn", dir: "E" };
  }
  if (glyph === "K" || glyph === "S") {
    return { kind: "tile", base: "crate", dir: wall.dir };
  }
  if (glyph === ">" || glyph === "<" || glyph === "^" || glyph === "v") {
    return { kind: "tile", base: "stairs", dir: wall.dir };
  }
  if (isFloorChar(glyph)) {
    return { kind: "tile", base: "floor", dir: "E" };
  }
  if (isWallChar(glyph)) {
    return { kind: "tile", base: wall.base, dir: wall.dir };
  }
  return { kind: "tile", base: "floor", dir: "E" };
}
