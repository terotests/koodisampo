import workplaceEmojis from "../../../lib/map/workplace-emojis.json";

export type BrushKind = "tile" | "entity" | "erase-entity";

export type MapBrush = {
  id: string;
  label: string;
  keys: string[];
  char: string;
  kind: BrushKind;
  entityKind?: string;
  entityName?: string;
};

type EmojiBrushDef = {
  id: string;
  label: string;
  char: string;
  keys: string[];
  entityKind: string;
  entityName: string;
};

/** Monikoodipisteiset merkit (emoji) — kokeellinen karttakerros. */
export { isEmojiGlyph } from "./mapGlyphs";

const TILE_AND_ASCII_BRUSHES: MapBrush[] = [
  { id: "wall", label: "Seinä", keys: ["1", "#"], char: "#", kind: "tile" },
  { id: "floor", label: "Lattia", keys: ["2", "."], char: ".", kind: "tile" },
  { id: "yard", label: "Piha", keys: ["3", ","], char: ",", kind: "tile" },
  { id: "desk", label: "Työpiste", keys: ["4", "="], char: "=", kind: "tile" },
  { id: "elevator", label: "Hissi (ASCII)", keys: ["5", "e"], char: "E", kind: "tile" },
  { id: "locked", label: "Lukittu ovi", keys: ["6", "l"], char: "L", kind: "tile" },
  { id: "storage", label: "Varasto", keys: ["7", "%"], char: "%", kind: "tile" },
  { id: "meeting", label: "Kokouspöytä", keys: ["8", "+"], char: "+", kind: "tile" },
  { id: "cell", label: "Vankisolu", keys: ["9", "j"], char: "J", kind: "tile" },
  { id: "coffee-tile", label: "Kahvihuone (K)", keys: ["0", "k"], char: "K", kind: "tile" },
  {
    id: "item",
    label: "Kerättävä esine",
    keys: ["i"],
    char: "*",
    kind: "entity",
    entityKind: "item",
    entityName: "Esine",
  },
  {
    id: "coworker",
    label: "Työkaveri",
    keys: ["c"],
    char: "@",
    kind: "entity",
    entityKind: "coworker",
    entityName: "Työkaveri",
  },
  {
    id: "spawn",
    label: "Spawn-piste",
    keys: ["s"],
    char: "S",
    kind: "tile",
  },
  { id: "erase-entity", label: "Poista hahmo", keys: ["backspace", "delete", "x"], char: "", kind: "erase-entity" },
];

const EMOJI_BRUSHES: MapBrush[] = (workplaceEmojis as EmojiBrushDef[]).map((brush) => ({
  ...brush,
  kind: "entity" as const,
}));

/** Ruututyypit, ASCII-hahmot ja työpaikka-emojit — pikavalinnat näppäimistöllä. */
export const MAP_BRUSHES: MapBrush[] = [...TILE_AND_ASCII_BRUSHES, ...EMOJI_BRUSHES];

export function brushForKey(key: string): MapBrush | null {
  const k = key.length === 1 ? key.toLowerCase() : key.toLowerCase();
  return MAP_BRUSHES.find((b) => b.keys.some((bk) => bk.toLowerCase() === k)) ?? null;
}

export function defaultBrush(): MapBrush {
  return MAP_BRUSHES[0];
}
