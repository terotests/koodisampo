import { splitMapGraphemes, isEmojiGlyph } from "../../../hosts/shared/mapGlyphs.mjs";
import type { IsoDirection } from "./isometricProjection";
import {
  DEFAULT_PLAYER_APPEARANCE,
  resolveLegoAppearance,
  resolveLegoEntityKind,
  type EntityAppearanceInput,
  type LegoAppearance,
  type LegoEntityKind,
} from "./legoAppearance";

const WALL_CHARS = new Set(["#", "%", "|"]);
const FLOOR_CHARS = new Set([".", " ", ",", "-", "x"]);

function glyphAt(lines: string[], x: number, y: number): string {
  if (y < 0 || y >= lines.length) return " ";
  const line = lines[y];
  if (!line) return " ";
  const cells = splitMapGraphemes(line);
  if (x < 0 || x >= cells.length) return " ";
  return cells[x] ?? " ";
}

function isWallChar(ch: string): boolean {
  return WALL_CHARS.has(ch);
}

function isFloorChar(ch: string): boolean {
  return FLOOR_CHARS.has(ch);
}

type WallSprite = { base: string; dir: IsoDirection };

/** Kenney wall dirs are mirrored vs our ASCII grid compass (E↔N, S↔W). */
function fixIsoWallDir(dir: IsoDirection): IsoDirection {
  const map: Record<IsoDirection, IsoDirection> = { N: "E", E: "N", S: "W", W: "S" };
  return map[dir];
}

/** Corner dirs use the open quadrant; Kenney corners are rotated vs straight walls. */
function cornerIsoDir(openN: boolean, openE: boolean, openS: boolean, openW: boolean): IsoDirection | null {
  if (openN && openW) return fixIsoWallDir("W");
  if (openN && openE) return fixIsoWallDir("N");
  if (openS && openW) return fixIsoWallDir("S");
  if (openS && openE) return fixIsoWallDir("E");
  return null;
}

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

  const cornerDir = cornerIsoDir(openN, openE, openS, openW);
  if (cornerDir) return { base: "wallCorner", dir: cornerDir };

  // Straight run dead-ends (e.g. outer border) use half-wall like mid segments, not end caps.
  if (openN && !openS && !openE && !openW && east && west) {
    return { base: "wallHalf", dir: fixIsoWallDir("E") };
  }
  if (openS && !openN && !openE && !openW && east && west) {
    return { base: "wallHalf", dir: fixIsoWallDir("E") };
  }
  if (openE && !openW && !openN && !openS && north && south) {
    return { base: "wallHalf", dir: fixIsoWallDir("N") };
  }
  if (openW && !openE && !openN && !openS && north && south) {
    return { base: "wallHalf", dir: fixIsoWallDir("N") };
  }

  if (openN && !openS && !openE && !openW) return { base: "wall", dir: fixIsoWallDir("N") };
  if (openS && !openN && !openE && !openW) return { base: "wall", dir: fixIsoWallDir("S") };
  if (openE && !openW && !openN && !openS) return { base: "wall", dir: fixIsoWallDir("E") };
  if (openW && !openE && !openN && !openS) return { base: "wall", dir: fixIsoWallDir("W") };

  if (openN && openS) return { base: "wallHalf", dir: fixIsoWallDir("E") };
  if (openE && openW) return { base: "wallHalf", dir: fixIsoWallDir("N") };

  if (openN) return { base: "wall", dir: fixIsoWallDir("N") };
  if (openS) return { base: "wall", dir: fixIsoWallDir("S") };
  if (openE) return { base: "wall", dir: fixIsoWallDir("E") };
  if (openW) return { base: "wall", dir: fixIsoWallDir("W") };

  return { base: "wall", dir: fixIsoWallDir("E") };
}

export type TileSprite = {
  kind: "tile";
  base: string;
  dir: IsoDirection;
};

export type EntitySprite = {
  kind: "entity";
  glyph: string;
  highlight?: boolean;
  police?: boolean;
  legoKind: LegoEntityKind;
  appearance: LegoAppearance;
};

export type EntityCellInfo = {
  x: number;
  y: number;
  glyph: string;
  kind?: string;
  id?: string;
  itemTool?: string;
  gender?: string;
  roleKey?: string;
  topic?: string;
  rewardFruit?: boolean;
  fruitSpawnMinute?: number;
  fruitExpireMinute?: number;
};

export type ItemSprite = {
  kind: "item";
  base: string;
  dir: IsoDirection;
  glyph: string;
  itemTool?: string;
  highlight?: boolean;
  legoProp?: "tv";
};

export type CellSprite =
  | TileSprite
  | EntitySprite
  | ItemSprite
  | { kind: "emoji"; glyph: string; highlight?: boolean; opacity?: number; rewardFruit?: boolean }
  | { kind: "legoProp"; prop: "dog" | "tv"; glyph: string; highlight?: boolean };

function entityAtCell(
  entityCells: EntityCellInfo[] | undefined,
  x: number,
  y: number,
): EntityCellInfo | undefined {
  return entityCells?.find((cell) => cell.x === x && cell.y === y);
}

function entityAppearanceInput(entity: EntityCellInfo): EntityAppearanceInput {
  return {
    gender: entity.gender,
    roleKey: entity.roleKey,
    topic: entity.topic,
    kind: entity.kind,
    id: entity.id,
    glyph: entity.glyph,
  };
}

function resolveEntitySprite(entity: EntityCellInfo, opts: { recommended?: boolean; policeChase?: boolean }): EntitySprite | { kind: "legoProp"; prop: "dog" | "tv"; glyph: string; highlight?: boolean } {
  const input = entityAppearanceInput(entity);
  const legoKind = resolveLegoEntityKind(input);
  if (legoKind === "dog") {
    return { kind: "legoProp", prop: "dog", glyph: entity.glyph, highlight: opts.recommended };
  }
  if (legoKind === "tv") {
    return { kind: "legoProp", prop: "tv", glyph: entity.glyph, highlight: opts.recommended };
  }
  return {
    kind: "entity",
    glyph: entity.glyph,
    highlight: opts.recommended,
    police: opts.policeChase && entity.glyph === "P" && entity.kind === "police",
    legoKind,
    appearance: resolveLegoAppearance(input),
  };
}

function itemTileSprite(itemTool: string, glyph: string): ItemSprite {
  if (itemTool === "access_card" || itemTool === "coworker_card" || glyph === "k") {
    return { kind: "item", base: "switchFloorOn", dir: "E", glyph };
  }
  if (itemTool === "shed_key") {
    return { kind: "item", base: "switchFloorOn", dir: "N", glyph };
  }
  if (itemTool === "crowbar" || itemTool === "shovel") {
    return { kind: "item", base: "prop", dir: "E", glyph, itemTool };
  }
  if (itemTool === "sledgehammer") {
    return { kind: "item", base: "crate", dir: "E", glyph };
  }
  if (itemTool === "usb_drive") {
    return { kind: "item", base: "block", dir: "N", glyph };
  }
  return { kind: "item", base: "crate", dir: "E", glyph };
}

export function resolveCellSprite(
  glyph: string,
  lines: string[],
  x: number,
  y: number,
  opts: {
    recommended?: boolean;
    policeChase?: boolean;
    entityCells?: EntityCellInfo[];
  },
): CellSprite {
  const entity = entityAtCell(opts.entityCells, x, y);
  if (entity) {
    if (entity.kind === "item") {
      const glyph = entity.glyph;
      if (entity.rewardFruit) {
        return { kind: "emoji", glyph, highlight: true, rewardFruit: true };
      }
      if (glyph === "🖥️" || glyph === "📺") {
        return { kind: "legoProp", prop: "tv", glyph, highlight: opts.recommended };
      }
      return {
        ...itemTileSprite(entity.itemTool ?? "", glyph),
        highlight: opts.recommended,
      };
    }
    if (entity.kind === "pet") {
      return { kind: "legoProp", prop: "dog", glyph: entity.glyph, highlight: opts.recommended };
    }
    const resolved = resolveEntitySprite(entity, opts);
    if (resolved.kind === "legoProp") return resolved;
    return resolved;
  }
  if (glyph === "@") {
    return {
      kind: "entity",
      glyph,
      highlight: opts.recommended,
      legoKind: "minifig",
      appearance: DEFAULT_PLAYER_APPEARANCE,
    };
  }
  if (isEmojiGlyph(glyph)) {
    if (glyph === "🖥️" || glyph === "📺") {
      return { kind: "legoProp", prop: "tv", glyph, highlight: opts.recommended };
    }
    return { kind: "emoji", glyph, highlight: opts.recommended };
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
    return { kind: "tile", base: "slab", dir: "E" };
  }
  if (isWallChar(glyph)) {
    return { kind: "tile", base: wall.base, dir: wall.dir };
  }
  return { kind: "tile", base: "slab", dir: "E" };
}
