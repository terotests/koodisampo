/** Karttaglyphit editorille — sama logiikka kuin hosts/shared/mapGlyphs.mjs */

const EMOJI_RE = /\p{Extended_Pictographic}/u;

export function isEmojiGlyph(char: string): boolean {
  if (!char) return false;
  return EMOJI_RE.test(char);
}

export function glyphDisplayWidth(glyph: string): number {
  return isEmojiGlyph(glyph) ? 2 : 1;
}

export function splitMapGraphemes(line: string): string[] {
  if (!line) return [];
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const seg = new Intl.Segmenter("fi", { granularity: "grapheme" });
    return [...seg.segment(line)].map((part) => part.segment);
  }
  return [...line];
}

export function isCellEatenByLeftEmoji(cells: string[], col: number): boolean {
  if (col <= 0 || col >= cells.length) return false;
  return isEmojiGlyph(cells[col - 1]);
}

/** Onko (x,y) emojin syömä — tarkistaa vasemman solun entityn tai ruudun. */
export function isMapCellEaten(
  line: string,
  entities: { x: number; y: number; char: string }[],
  x: number,
  y: number,
): boolean {
  if (x <= 0) return false;
  const cells = splitMapGraphemes(line);
  const leftEnt = entities.find((e) => e.x === x - 1 && e.y === y);
  const leftGlyph = leftEnt?.char ?? cells[x - 1] ?? "";
  return isEmojiGlyph(leftGlyph);
}

export function glyphAtMapCell(
  line: string,
  entities: { x: number; y: number; char: string }[],
  x: number,
  y: number,
): string {
  const ent = entities.find((e) => e.x === x && e.y === y);
  if (ent) return ent.char;
  const cells = splitMapGraphemes(line);
  return cells[x] ?? "";
}

export type EmojiPlaceCheck = { ok: true } | { ok: false; reason: string };

/** Emoji vie kaksi saraketta — ei sallita vierekkäisiä emojeja. */
export function canPlaceEmojiEntity(
  line: string,
  entities: { x: number; y: number; char: string }[],
  x: number,
  y: number,
  width: number,
): EmojiPlaceCheck {
  if (x < 0 || x >= width) {
    return { ok: false, reason: "emoji ei mahdu kartalle" };
  }
  if (x + 1 >= width) {
    return { ok: false, reason: "emoji tarvitsee vapaan solun oikealla reunalla" };
  }
  if (isMapCellEaten(line, entities, x, y)) {
    return { ok: false, reason: "solu on jo emojin peittämä (vasemmalla on emoji)" };
  }
  const right = glyphAtMapCell(line, entities, x + 1, y);
  if (isEmojiGlyph(right)) {
    return { ok: false, reason: "emoji ei voi olla vierekkäin toisen emojin kanssa" };
  }
  return { ok: true };
}

export function clearMapCell(line: string, col: number): string {
  const cells = splitMapGraphemes(line);
  if (col < 0 || col >= cells.length) return line;
  cells[col] = " ";
  return cells.join("");
}

export function replaceMapCell(line: string, col: number, glyph: string): string {
  const cells = splitMapGraphemes(line);
  if (col < 0 || col >= cells.length) return line;
  cells[col] = glyph;
  if (isEmojiGlyph(glyph) && col + 1 < cells.length) {
    cells[col + 1] = " ";
  }
  return cells.join("");
}
