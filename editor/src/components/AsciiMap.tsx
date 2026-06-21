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
};

export function AsciiMap({ rows, entities, selectedId, highlightZone, onSelectEntity }: Props) {
  const entityAt = new Map(entities.map((e) => [`${e.x},${e.y}`, e]));

  return (
    <div className="ascii-map-wrap">
      <pre className="ascii-map" aria-label="Kerroskartta">
        {rows.map((line, y) => (
          <div key={y} className="ascii-row">
            <span className="row-num">{String(y).padStart(2, " ")}</span>
            {line.split("").map((ch, x) => {
              const ent = entityAt.get(`${x},${y}`);
              const inZone = highlightZone &&
                x >= highlightZone.x &&
                x < highlightZone.x + highlightZone.w &&
                y >= highlightZone.y &&
                y < highlightZone.y + highlightZone.h;

              if (ent) {
                const selected = ent.id === selectedId;
                return (
                  <button
                    key={x}
                    type="button"
                    className={`tile entity ${KIND_CLASS[ent.kind] ?? "ent-role"} ${selected ? "selected" : ""}`}
                    title={`${ent.name} (${ent.id})`}
                    onClick={() => onSelectEntity?.(ent.id)}
                  >
                    {ent.char}
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
