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

function wallDirection(lines: string[], x: number, y: number): IsoDirection {
  const rows = lines.length;
  const cols = splitMapGraphemes(lines[0] ?? "").length;
  const north = isWallChar(glyphAt(lines, x, y - 1));
  const south = isWallChar(glyphAt(lines, x, y + 1));
  const east = isWallChar(glyphAt(lines, x + 1, y));
  const west = isWallChar(glyphAt(lines, x - 1, y));
  if (north && west) return "N";
  if (north && east) return "E";
  if (south && west) return "W";
  if (south && east) return "S";
  if (north) return "N";
  if (south) return "S";
  if (east) return "E";
  if (west) return "W";
  return "E";
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

  const dir = wallDirection(lines, x, y);
  if (glyph === "#" || glyph === "|") {
    return { kind: "tile", base: "wall", dir };
  }
  if (glyph === "%") {
    return { kind: "tile", base: "window", dir };
  }
  if (glyph === "+") {
    return { kind: "tile", base: "doorOpen", dir };
  }
  if (glyph === "L") {
    return { kind: "tile", base: "doorClosed", dir };
  }
  if (glyph === "=") {
    return { kind: "tile", base: "slab", dir };
  }
  if (glyph === "E" || glyph === "G" || glyph === "O" || glyph === "o" || glyph === "M") {
    return { kind: "tile", base: "switchFloorOn", dir: "E" };
  }
  if (glyph === "K" || glyph === "S") {
    return { kind: "tile", base: "crate", dir };
  }
  if (glyph === ">" || glyph === "<" || glyph === "^" || glyph === "v") {
    return { kind: "tile", base: "stairs", dir };
  }
  if (isFloorChar(glyph)) {
    return { kind: "tile", base: "floor", dir: "E" };
  }
  if (isWallChar(glyph)) {
    return { kind: "tile", base: "wall", dir };
  }
  return { kind: "tile", base: "floor", dir: "E" };
}
