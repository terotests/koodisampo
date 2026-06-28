import { useCallback, useEffect, useRef, useState } from "react";
import type { FloorEntity } from "../types";
import { brushForKey, defaultBrush, isEmojiGlyph, type MapBrush } from "../lib/mapBrushes";
import { canPlaceEmojiEntity, clearMapCell } from "../lib/mapGlyphs";

type EntityInput = {
  id: string;
  char: string;
  name: string;
  kind: string;
  x: number;
  y: number;
};

function cloneRows(rows: string[]): string[] {
  return rows.map((line) => line);
}

function setTile(rows: string[], x: number, y: number, ch: string): string[] {
  const next = cloneRows(rows);
  const line = next[y];
  if (!line || x < 0 || x >= line.length) return rows;
  next[y] = line.slice(0, x) + ch + line.slice(x + 1);
  return next;
}

function entityAt(entities: FloorEntity[], x: number, y: number): FloorEntity | null {
  return entities.find((e) => e.x === x && e.y === y) ?? null;
}

function upsertEntity(entities: FloorEntity[], ent: EntityInput): FloorEntity[] {
  const without = entities.filter((e) => e.x !== ent.x || e.y !== ent.y);
  const existing = entities.find((e) => e.x === ent.x && e.y === ent.y);
  return [
    ...without,
    {
      id: existing?.id ?? ent.id,
      char: ent.char,
      name: ent.name,
      kind: ent.kind,
      x: ent.x,
      y: ent.y,
      topic: existing?.topic ?? "",
      scheduleRole: existing?.scheduleRole ?? "",
      storyId: existing?.storyId ?? "",
      itemTool: existing?.itemTool ?? "",
      sociability: existing?.sociability ?? null,
      persistence: existing?.persistence ?? null,
      behavior: existing?.behavior ?? "",
      homeX: existing?.homeX ?? ent.x,
      homeY: existing?.homeY ?? ent.y,
      zoneId: null,
      zoneKind: "wall",
      floor: existing?.floor ?? 0,
    },
  ];
}

function removeEntityAt(entities: FloorEntity[], x: number, y: number): FloorEntity[] {
  return entities.filter((e) => e.x !== x || e.y !== y);
}

type Options = {
  rows: string[];
  entities: FloorEntity[];
  width: number;
  height: number;
  enabled: boolean;
  initialCursor?: { x: number; y: number } | null;
  onRowsChange: (rows: string[]) => void;
  onEntitiesChange: (entities: FloorEntity[]) => void;
  onSpawnChange?: (spawn: { x: number; y: number } | null) => void;
};

export function useMapEditor({
  rows,
  entities,
  width,
  height,
  enabled,
  initialCursor,
  onRowsChange,
  onEntitiesChange,
  onSpawnChange,
}: Options) {
  const [brush, setBrush] = useState<MapBrush>(defaultBrush);
  const [cursor, setCursor] = useState(() => initialCursor ?? { x: 0, y: 0 });
  const [paintHint, setPaintHint] = useState("");
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialCursor) setCursor(initialCursor);
  }, [initialCursor?.x, initialCursor?.y]);

  useEffect(() => {
    if (enabled) mapRef.current?.focus();
  }, [enabled]);

  const clamp = useCallback(
    (x: number, y: number) => ({
      x: Math.max(0, Math.min(width - 1, x)),
      y: Math.max(0, Math.min(height - 1, y)),
    }),
    [width, height],
  );

  const moveCursor = useCallback(
    (dx: number, dy: number) => {
      setCursor((c) => clamp(c.x + dx, c.y + dy));
    },
    [clamp],
  );

  const emojiPlaceCheck = useCallback(
    (x: number, y: number) =>
      canPlaceEmojiEntity(rows[y] ?? "", entities, x, y, width),
    [rows, entities, width],
  );

  useEffect(() => {
    if (!isEmojiGlyph(brush.char)) {
      setPaintHint("");
      return;
    }
    const check = emojiPlaceCheck(cursor.x, cursor.y);
    setPaintHint(check.ok ? "" : check.reason);
  }, [brush, cursor.x, cursor.y, emojiPlaceCheck]);

  const paintAt = useCallback(
    (x: number, y: number, activeBrush: MapBrush = brush) => {
      if (activeBrush.kind === "tile") {
        if (activeBrush.id === "spawn") {
          onSpawnChange?.({ x, y });
          return;
        }
        onRowsChange(setTile(rows, x, y, activeBrush.char));
        return;
      }
      if (activeBrush.kind === "erase-entity") {
        onEntitiesChange(removeEntityAt(entities, x, y));
        return;
      }
      if (activeBrush.kind === "entity") {
        if (isEmojiGlyph(activeBrush.char)) {
          const check = emojiPlaceCheck(x, y);
          if (!check.ok) {
            setPaintHint(check.reason);
            return;
          }
        }
        const id = `editor-${activeBrush.id}-${x}-${y}`;
        let nextEntities = upsertEntity(entities, {
          id,
          char: activeBrush.char,
          name: activeBrush.entityName ?? activeBrush.label,
          kind: activeBrush.entityKind ?? "item",
          x,
          y,
        });
        if (isEmojiGlyph(activeBrush.char) && x + 1 < width) {
          nextEntities = removeEntityAt(nextEntities, x + 1, y);
          onRowsChange(
            rows.map((row, yi) => (yi === y ? clearMapCell(row, x + 1) : row)),
          );
        }
        onEntitiesChange(nextEntities);
        setPaintHint("");
      }
    },
    [brush, rows, entities, width, emojiPlaceCheck, onRowsChange, onEntitiesChange, onSpawnChange],
  );

  const paintCursor = useCallback(() => {
    paintAt(cursor.x, cursor.y);
  }, [cursor.x, cursor.y, paintAt]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return;

      const key = e.key.toLowerCase();

      if (key === "arrowup") {
        e.preventDefault();
        moveCursor(0, -1);
        return;
      }
      if (key === "arrowdown") {
        e.preventDefault();
        moveCursor(0, 1);
        return;
      }
      if (key === "arrowleft") {
        e.preventDefault();
        moveCursor(-1, 0);
        return;
      }
      if (key === "arrowright") {
        e.preventDefault();
        moveCursor(1, 0);
        return;
      }
      if (key === " " || key === "enter") {
        e.preventDefault();
        paintCursor();
        return;
      }

      const nextBrush = brushForKey(key);
      if (nextBrush) {
        e.preventDefault();
        setBrush(nextBrush);
      }
    },
    [enabled, moveCursor, paintCursor],
  );

  const handleCellClick = useCallback(
    (x: number, y: number, shiftKey: boolean) => {
      setCursor({ x, y });
      if (shiftKey && enabled) paintAt(x, y);
    },
    [enabled, paintAt],
  );

  return {
    brush,
    setBrush,
    cursor,
    setCursor,
    mapRef,
    moveCursor,
    paintAt,
    paintCursor,
    paintHint,
    canPlaceEmojiAtCursor: !isEmojiGlyph(brush.char) || emojiPlaceCheck(cursor.x, cursor.y).ok,
    handleKeyDown,
    handleCellClick,
    entityAtCursor: entityAt(entities, cursor.x, cursor.y),
    tileAtCursor: rows[cursor.y]?.[cursor.x] ?? "",
  };
}
