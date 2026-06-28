import type { KeyboardEvent, RefObject } from "react";
import { isEmojiGlyph, isMapCellEaten, splitMapGraphemes } from "../lib/mapGlyphs";

const TILE_CLASS: Record<string, string> = {
  "#": "tile-wall",
  ".": "tile-floor",
  ",": "tile-yard",
  "=": "tile-desk",
  E: "tile-elevator",
  L: "tile-locked",
  "%": "tile-storage",
  "+": "tile-meeting",
  J: "tile-cell",
  K: "tile-coffee",
};

const KIND_CLASS: Record<string, string> = {
  coworker: "ent-coworker",
  guru: "ent-guru",
  role: "ent-role",
  security: "ent-security",
  item: "ent-item",
  pet: "ent-pet",
  hostile: "ent-hostile",
};

type Props = {
  rows: string[];
  entities: { id: string; char: string; name: string; kind: string; x: number; y: number }[];
  selectedId?: string | null;
  highlightZone?: { x: number; y: number; w: number; h: number } | null;
  onSelectEntity?: (id: string) => void;
  cursor?: { x: number; y: number } | null;
  editMode?: boolean;
  emojiPlaceBlocked?: boolean;
  spawn?: { x: number; y: number } | null;
  mapRef?: RefObject<HTMLDivElement | null>;
  onKeyDown?: (e: KeyboardEvent) => void;
  onCellClick?: (x: number, y: number, shiftKey: boolean) => void;
};

export function AsciiMap({
  rows,
  entities,
  selectedId,
  highlightZone,
  onSelectEntity,
  cursor,
  editMode,
  emojiPlaceBlocked,
  spawn,
  mapRef,
  onKeyDown,
  onCellClick,
}: Props) {
  const entityAt = new Map(entities.map((e) => [`${e.x},${e.y}`, e]));

  return (
    <div
      className={`ascii-map-wrap ${editMode ? "edit-mode" : ""}`}
      ref={mapRef}
      tabIndex={editMode ? 0 : -1}
      onKeyDown={onKeyDown}
      role={editMode ? "application" : undefined}
      aria-label={editMode ? "Kerroskartta piirtotilassa" : "Kerroskartta"}
    >
      <pre className="ascii-map">
        {rows.map((line, y) => (
          <div key={y} className="ascii-row">
            <span className="row-num">{String(y).padStart(2, " ")}</span>
            {splitMapGraphemes(line).map((ch, x) => {
              if (isMapCellEaten(line, entities, x, y)) return null;
              const ent = entityAt.get(`${x},${y}`);
              const isCursor = cursor && cursor.x === x && cursor.y === y;
              const cursorBlocked = isCursor && emojiPlaceBlocked;
              const isSpawn = spawn && spawn.x === x && spawn.y === y;
              const inZone = highlightZone &&
                x >= highlightZone.x &&
                x < highlightZone.x + highlightZone.w &&
                y >= highlightZone.y &&
                y < highlightZone.y + highlightZone.h;

              const glyph = ent?.char ?? ch;
              const emoji = isEmojiGlyph(glyph);

              if (ent && !editMode) {
                const selected = ent.id === selectedId;
                return (
                  <button
                    key={x}
                    type="button"
                    className={[
                      "tile",
                      "entity",
                      KIND_CLASS[ent.kind] ?? "ent-role",
                      emoji ? "tile-emoji" : "",
                      selected ? "selected" : "",
                    ].filter(Boolean).join(" ")}
                    title={`${ent.name} (${ent.id})`}
                    onClick={() => onSelectEntity?.(ent.id)}
                  >
                    {ent.char}
                  </button>
                );
              }

              const displayChar = editMode && ent ? ent.char : ch;
              const tileClass = editMode && ent
                ? (KIND_CLASS[ent.kind] ?? "ent-role")
                : (TILE_CLASS[ch] ?? "tile-other");

              if (editMode) {
                return (
                  <button
                    key={x}
                    type="button"
                    className={[
                      "tile",
                      "tile-edit",
                      tileClass,
                      emoji ? "tile-emoji" : "",
                      isCursor ? (cursorBlocked ? "tile-cursor-blocked" : "tile-cursor") : "",
                      inZone ? "zone-hl" : "",
                      isSpawn ? "tile-spawn" : "",
                    ].filter(Boolean).join(" ")}
                    title={ent ? `${ent.name} (${ent.id})` : `(${x}, ${y})`}
                    onClick={(e) => onCellClick?.(x, y, e.shiftKey)}
                  >
                    {displayChar}
                  </button>
                );
              }

              return (
                <span
                  key={x}
                  className={`tile ${TILE_CLASS[ch] ?? "tile-other"} ${inZone ? "zone-hl" : ""}`}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        ))}
      </pre>
    </div>
  );
}
