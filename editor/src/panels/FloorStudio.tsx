import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import { AsciiMap } from "../components/AsciiMap";
import type { FloorAnalysis, FloorEntity, WorldSummary } from "../types";

type Props = {
  world: WorldSummary;
};

export function FloorStudio({ world }: Props) {
  const [floorIndex, setFloorIndex] = useState(world.startFloor ?? 0);
  const [analysis, setAnalysis] = useState<FloorAnalysis | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ id: string; prompt: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFloor = useCallback(async (index: number) => {
    setLoading(true);
    setError("");
    try {
      const data = await api.floorAnalysis(index);
      setAnalysis(data);
      setSelectedId(null);
      setPreview([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFloor(floorIndex);
  }, [floorIndex, loadFloor]);

  const selected = analysis?.entities.find((e) => e.id === selectedId) ?? null;
  const selectedZone = selected?.zoneId
    ? analysis?.zones.find((z) => z.id === selected.zoneId)
    : null;

  useEffect(() => {
    if (!selected?.topic) {
      setPreview([]);
      return;
    }
    api.questionPreview(selected.topic, 5).then((r) => setPreview(r.items)).catch(() => setPreview([]));
  }, [selected?.topic]);

  return (
    <div className="floor-studio">
      <aside className="floor-list">
        <h2>Kerrokset</h2>
        <ul>
          {world.floors.map((f) => (
            <li key={f.index}>
              <button
                type="button"
                className={f.index === floorIndex ? "active" : ""}
                onClick={() => setFloorIndex(f.index)}
              >
                <span className="floor-title">{f.title}</span>
                <span className="floor-meta">{f.width}×{f.height} · {f.entityCount} hahmoa</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="floor-map-panel">
        {loading && <p className="muted">Ladataan…</p>}
        {error && <p className="error">{error}</p>}
        {analysis && (
          <>
            <header className="panel-header">
              <h2>{analysis.title}</h2>
              <p className="muted">
                {analysis.roomCount} huonetta · {analysis.entityCount} hahmoa
                {analysis.elevator && ` · hissi (${analysis.elevator.x},${analysis.elevator.y})`}
                {analysis.cafeteria && ` · ruokala (${analysis.cafeteria.x},${analysis.cafeteria.y})`}
              </p>
            </header>
            <AsciiMap
              rows={analysis.rows}
              entities={analysis.entities}
              selectedId={selectedId}
              highlightZone={selectedZone?.bounds ?? null}
              onSelectEntity={setSelectedId}
            />
          </>
        )}
      </section>

      <aside className="detail-panel">
        <h2>Huoneet</h2>
        {analysis?.zones.filter((z) => z.entities.length > 0 || z.kind === "room").map((z) => (
          <details key={z.id} className="zone-card" open={selectedZone?.id === z.id}>
            <summary>
              {z.label}
              <span className="badge">{z.entities.length}</span>
            </summary>
            <p className="muted small">{z.kind} · {z.area} ruutua</p>
            <ul className="entity-mini-list">
              {z.entities.map((e) => (
                <li key={e.id}>
                  <button type="button" onClick={() => setSelectedId(e.id)}>
                    {e.name || e.id}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        ))}

        <h2>Hahmo</h2>
        {selected ? <EntityDetail entity={selected} preview={preview} /> : (
          <p className="muted">Valitse hahmo kartalta tai huonelistasta.</p>
        )}
      </aside>
    </div>
  );
}

function EntityDetail({
  entity,
  preview,
}: {
  entity: FloorEntity;
  preview: { id: string; prompt: string }[];
}) {
  return (
    <div className="entity-detail">
      <h3>{entity.name || entity.id}</h3>
      <dl>
        <dt>ID</dt><dd><code>{entity.id}</code></dd>
        <dt>Rooli</dt><dd>{entity.kind}</dd>
        <dt>Sijainti</dt><dd>({entity.x}, {entity.y})</dd>
        <dt>Huone</dt><dd>{entity.zoneKind} {entity.zoneId ?? "—"}</dd>
        {entity.topic && <><dt>Topic</dt><dd><code>{entity.topic}</code></dd></>}
        {entity.scheduleRole && <><dt>Aikataulu</dt><dd>{entity.scheduleRole}</dd></>}
        {entity.storyId && <><dt>Tarina</dt><dd>{entity.storyId}</dd></>}
        {entity.itemTool && <><dt>Esine</dt><dd>{entity.itemTool}</dd></>}
        {entity.sociability != null && <><dt>Sosiaalisuus</dt><dd>{entity.sociability}</dd></>}
        {entity.persistence != null && <><dt>Sinnikkyys</dt><dd>{entity.persistence}</dd></>}
        {entity.behavior && <><dt>Käyttäytyminen</dt><dd>{entity.behavior}</dd></>}
      </dl>
      {entity.topic && preview.length > 0 && (
        <>
          <h4>Esimerkkikysymyksiä (topic)</h4>
          <ul className="preview-list">
            {preview.map((q) => (
              <li key={q.id}>
                <span className="q-id">{q.id}</span>
                {q.prompt}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
