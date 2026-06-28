import { MAP_BRUSHES, isEmojiGlyph, type MapBrush } from "../lib/mapBrushes";

type Props = {
  brush: MapBrush;
  onSelectBrush: (brush: MapBrush) => void;
  cursor: { x: number; y: number };
  tileAtCursor: string;
  entityAtCursor: { name: string; char: string } | null;
  dirty: boolean;
  saving: boolean;
  paintHint?: string;
  onSave: () => void;
  onDiscard: () => void;
};

export function MapEditorToolbar({
  brush,
  onSelectBrush,
  cursor,
  tileAtCursor,
  entityAtCursor,
  dirty,
  saving,
  paintHint,
  onSave,
  onDiscard,
}: Props) {
  const tileBrushes = MAP_BRUSHES.filter((b) => b.kind === "tile");
  const asciiEntityBrushes = MAP_BRUSHES.filter(
    (b) => (b.kind === "entity" || b.kind === "erase-entity") && !isEmojiGlyph(b.char),
  );
  const emojiBrushes = MAP_BRUSHES.filter((b) => b.kind === "entity" && isEmojiGlyph(b.char));

  return (
    <div className="map-editor-toolbar">
      <div className="toolbar-head">
        <strong>Piirtotila</strong>
        <span className="muted small">
          Nuoli = liiku · Välilyönti = aseta · Shift+klikkaus = aseta
        </span>
        <div className="toolbar-actions">
          {dirty && (
            <button type="button" className="btn-secondary" disabled={saving} onClick={onDiscard}>
              Peruuta
            </button>
          )}
          <button type="button" className="btn-primary" disabled={!dirty || saving} onClick={onSave}>
            {saving ? "Tallennetaan…" : "Tallenna kerros"}
          </button>
        </div>
      </div>

      <div className="cursor-info">
        Kursori ({cursor.x}, {cursor.y}) · ruutu <code>{tileAtCursor || "?"}</code>
        {entityAtCursor && (
          <> · hahmo <code>{entityAtCursor.char}</code> {entityAtCursor.name}</>
        )}
        {" · "}valittu <code>{brush.char || "∅"}</code> {brush.label}
        {paintHint && (
          <span className="paint-hint-warn"> · {paintHint}</span>
        )}
      </div>

      <div className="brush-groups">
        <div className="brush-group">
          <span className="brush-group-label">Pinnat</span>
          <div className="brush-list">
            {tileBrushes.map((b) => (
              <BrushButton key={b.id} brush={b} active={brush.id === b.id} onSelect={onSelectBrush} />
            ))}
          </div>
        </div>
        <div className="brush-group">
          <span className="brush-group-label">Hahmot / esineet (ASCII)</span>
          <div className="brush-list">
            {asciiEntityBrushes.map((b) => (
              <BrushButton key={b.id} brush={b} active={brush.id === b.id} onSelect={onSelectBrush} />
            ))}
          </div>
        </div>
        <div className="brush-group">
          <span className="brush-group-label">Työpaikka (emoji)</span>
          <p className="brush-group-hint muted small">
            Emoji vie 2 ruutua (syö oikeanpuoleisen). Ei kahta vierekkäistä emojia.
          </p>
          <div className="brush-list">
            {emojiBrushes.map((b) => (
              <BrushButton key={b.id} brush={b} active={brush.id === b.id} onSelect={onSelectBrush} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrushButton({
  brush,
  active,
  onSelect,
}: {
  brush: MapBrush;
  active: boolean;
  onSelect: (b: MapBrush) => void;
}) {
  const keyHint = brush.keys.find((k) => k.length === 1) ?? brush.keys[0];
  return (
    <button
      type="button"
      className={`brush-btn ${active ? "active" : ""}`}
      title={`${brush.label} (${keyHint})`}
      onClick={() => onSelect(brush)}
    >
      <span className={`brush-char ${isEmojiGlyph(brush.char) ? "brush-char-emoji" : ""}`}>{brush.char || "⌫"}</span>
      <span className="brush-label">{brush.label}</span>
      <kbd>{keyHint}</kbd>
    </button>
  );
}
