import assert from "node:assert/strict";
import {
  canPlaceEmojiEntity,
  colorizeMapLineHtml,
  expandMapLineForDisplay,
  formatMapLineTerminal,
  glyphDisplayWidth,
  isCellEatenByLeftEmoji,
  isEmojiGlyph,
  iterMapDisplayCells,
  mapLineColumnCount,
  mapLineDisplayWidth,
  replaceMapCell,
  splitMapGraphemes,
} from "../hosts/shared/mapGlyphs.mjs";

assert.equal(isEmojiGlyph("🚽"), true);
assert.equal(isEmojiGlyph("A"), false);
assert.equal(isEmojiGlyph("@"), false);

const mixed = ".." + "🚽" + "##";
assert.deepEqual(splitMapGraphemes(mixed), [".", ".", "🚽", "#", "#"]);
assert.equal(mapLineColumnCount(mixed), 5);
assert.equal(mapLineDisplayWidth(mixed), 5);
assert.equal(glyphDisplayWidth("🚽"), 2);
assert.equal(glyphDisplayWidth("#"), 1);

const cells = splitMapGraphemes(mixed);
assert.equal(isCellEatenByLeftEmoji(cells, 3), true);
assert.deepEqual(
  iterMapDisplayCells(mixed).map((c) => c.glyph),
  [".", ".", "🚽", "#"],
);

const expanded = expandMapLineForDisplay(mixed);
assert.equal(expanded, "..🚽#", "emoji eats right cell — walls stay aligned");

const terminal = formatMapLineTerminal(mixed, (g) => g);
assert.equal(terminal, "..🚽#", "terminal skips eaten cell, no extra space");

assert.equal(replaceMapCell("..##", 2, "🚽"), "..🚽 ", "placing emoji clears eaten slot in data");

const html = colorizeMapLineHtml("🚽#", {}, 0, (s) => s);
assert.ok(html.includes("map-emoji"), "emoji span in web colorize");
assert.ok(html.includes("🚽"), "emoji preserved");
assert.ok(html.includes("map-eaten"), "web uses zero-width eaten slot");

const html2 = colorizeMapLineHtml("🚽##", {}, 0, (s) => s);
assert.ok(html2.includes("map-emoji"), "wide glyph rendered");
assert.ok(html2.includes("map-eaten"), "first hash slot eaten in web");
assert.ok(html2.includes(">#<") || html2.endsWith("#"), "second wall cell visible after eaten slot");

const ents = [{ x: 4, y: 0, char: "🚽" }];
const line = ",,,,,";
assert.equal(canPlaceEmojiEntity(line, ents, 5, 0, 6).ok, false, "no emoji on eaten cell");
assert.equal(canPlaceEmojiEntity(line, ents, 3, 0, 6).ok, false, "no adjacent emoji right");
assert.equal(canPlaceEmojiEntity(line, [], 2, 0, 6).ok, true, "emoji fits with gap");

console.log("map_glyphs.test.mjs OK");
