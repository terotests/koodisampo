/** Karttaglyphit: emoji-tunnistus, leveys (2 saraketta) ja grapheme-tason käsittely. */

const EMOJI_RE = /\p{Extended_Pictographic}/u;

export function isEmojiGlyph(char) {
  if (!char) return false;
  return EMOJI_RE.test(char);
}

/** Näyttöleveys terminaalissa / monospace-ruudukossa (emoji = 2). */
export function glyphDisplayWidth(glyph) {
  return isEmojiGlyph(glyph) ? 2 : 1;
}

export function splitMapGraphemes(line) {
  if (!line) return [];
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const seg = new Intl.Segmenter("fi", { granularity: "grapheme" });
    return [...seg.segment(line)].map((part) => part.segment);
  }
  return [...line];
}

export function mapLineColumnCount(line) {
  return splitMapGraphemes(line).length;
}

/** Solu on emojin "syömä" — vasemmalla emoji, oikeaa ei renderöidä. */
export function isCellEatenByLeftEmoji(cells, col) {
  if (col <= 0 || col >= cells.length) return false;
  return isEmojiGlyph(cells[col - 1]);
}

/** Näytettävät solut (emoji syö oikeanpuoleisen merkin). */
export function iterMapDisplayCells(line) {
  const cells = splitMapGraphemes(line);
  const out = [];
  for (let col = 0; col < cells.length; col += 1) {
    if (isCellEatenByLeftEmoji(cells, col)) continue;
    out.push({ glyph: cells[col], col });
  }
  return out;
}

export function mapLineDisplayWidth(line) {
  return iterMapDisplayCells(line).reduce((sum, { glyph }) => sum + glyphDisplayWidth(glyph), 0);
}

export function glyphAtMapCell(line, entities, x, y) {
  const ent = entities.find((e) => e.x === x && e.y === y);
  if (ent) return ent.char;
  const cells = splitMapGraphemes(line);
  return cells[x] ?? "";
}

/** Emoji vie kaksi saraketta — ei sallita vierekkäisiä emojeja. */
export function canPlaceEmojiEntity(line, entities, x, y, width) {
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

export function isMapCellEaten(line, entities, x, y) {
  if (x <= 0) return false;
  const cells = splitMapGraphemes(line);
  const leftEnt = entities.find((e) => e.x === x - 1 && e.y === y);
  const leftGlyph = leftEnt?.char ?? cells[x - 1] ?? "";
  return isEmojiGlyph(leftGlyph);
}

export function clearMapCell(line, col) {
  const cells = splitMapGraphemes(line);
  if (col < 0 || col >= cells.length) return line;
  cells[col] = " ";
  return cells.join("");
}

export function replaceMapCell(line, col, glyph) {
  const cells = splitMapGraphemes(line);
  if (col < 0 || col >= cells.length) return line;
  cells[col] = glyph;
  if (isEmojiGlyph(glyph) && col + 1 < cells.length) {
    cells[col + 1] = " ";
  }
  return cells.join("");
}

/** Terminaali/pre: emoji 2 saraketta, seuraava looginen solu jätetään pois. */
export function expandMapLineForDisplay(line) {
  return formatMapLineTerminal(line, (glyph) => glyph);
}

export function formatMapLineTerminal(line, styleGlyph) {
  let out = "";
  for (const { glyph, col } of iterMapDisplayCells(line)) {
    out += styleGlyph(glyph, col);
  }
  return out;
}

export function colorizeMapLineHtml(line, state, row, esc) {
  const recommended = new Set(state.recommendedCells ?? []);
  const policeChase = !!state.policeChase;
  const cells = splitMapGraphemes(line);
  return cells
    .map((glyph, col) => {
      if (isCellEatenByLeftEmoji(cells, col)) {
        return `<span class="map-eaten"></span>`;
      }
      if (recommended.has(`${row},${col}`)) {
        return `<span class="npc-recommended">${esc(glyph)}</span>`;
      }
      if (isEmojiGlyph(glyph)) {
        return `<span class="map-emoji">${esc(glyph)}</span>`;
      }
      if (policeChase && glyph === "P") return `<span class="police">${glyph}</span>`;
      if (glyph === "@") return `<span style="color:#f0883e;font-weight:bold">${glyph}</span>`;
      if (glyph === ".") return `<span style="color:#3fb950">${glyph}</span>`;
      if (glyph === "#" || glyph === "%") return `<span style="color:#ffffff">${glyph}</span>`;
      return esc(glyph);
    })
    .join("");
}
