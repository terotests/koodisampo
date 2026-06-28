import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { AsciiMap } from "../components/AsciiMap";
import { MapEditorToolbar } from "../components/MapEditorToolbar";
import { useMapEditor } from "../hooks/useMapEditor";
import type { FloorAnalysis, FloorEntity, WorldSummary } from "../types";

type Props = {
  world: WorldSummary;
};

function entitiesToPatch(entities: FloorEntity[]) {
  return entities.map((e) => ({
    id: e.id,
    char: e.char,
    name: e.name,
    kind: e.kind,
    x: e.x,
    y: e.y,
    ...(e.topic ? { topic: e.topic } : {}),
    ...(e.scheduleRole ? { scheduleRole: e.scheduleRole } : {}),
    ...(e.storyId ? { storyId: e.storyId } : {}),
    ...(e.itemTool ? { itemTool: e.itemTool } : {}),
    ...(e.sociability != null ? { sociability: e.sociability } : {}),
    ...(e.persistence != null ? { persistence: e.persistence } : {}),
    ...(e.behavior ? { behavior: e.behavior } : {}),
    ...(e.homeX != null ? { homeX: e.homeX } : {}),
    ...(e.homeY != null ? { homeY: e.homeY } : {}),
  }));
}

export function FloorStudio({ world }: Props) {
  const [floorIndex, setFloorIndex] = useState(world.startFloor ?? 0);
  const [analysis, setAnalysis] = useState<FloorAnalysis | null>(null);
  const [editRows, setEditRows] = useState<string[]>([]);
  const [editEntities, setEditEntities] = useState<FloorEntity[]>([]);
  const [editSpawn, setEditSpawn] = useState<{ x: number; y: number } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ id: string; prompt: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  const loadFloor = useCallback(async (index: number) => {
    setLoading(true);
    setError("");
    try {
      const data = await api.floorAnalysis(index);
      setAnalysis(data);
      setEditRows(data.rows);
      setEditEntities(data.entities);
      setEditSpawn(data.spawn);
      setDirty(false);
      setSelectedId(null);
      setPreview([]);
      setSaveMsg("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFloor(floorIndex);
  }, [floorIndex, loadFloor]);

  const initialCursor = useMemo(() => {
    if (editSpawn) return editSpawn;
    if (analysis?.elevator) return analysis.elevator;
    return { x: 1, y: 1 };
  }, [editSpawn, analysis?.elevator]);

  const editor = useMapEditor({
    rows: editRows,
    entities: editEntities,
    width: analysis?.width ?? 1,
    height: analysis?.height ?? 1,
    enabled: editMode,
    initialCursor,
    onRowsChange: (rows) => {
      setEditRows(rows);
      setDirty(true);
    },
    onEntitiesChange: (entities) => {
      setEditEntities(entities);
      setDirty(true);
    },
    onSpawnChange: (spawn) => {
      setEditSpawn(spawn);
      setDirty(true);
    },
  });

  const switchFloor = (index: number) => {
    if (dirty && !window.confirm("Tallentamattomia muutoksia. Vaihdetaanko kerrosta?")) return;
    setEditMode(false);
    setFloorIndex(index);
  };

  const discardEdits = () => {
    if (!analysis) return;
    setEditRows(analysis.rows);
    setEditEntities(analysis.entities);
    setEditSpawn(analysis.spawn);
    setDirty(false);
    setSaveMsg("");
  };

  const saveFloor = async () => {
    if (!analysis) return;
    setSaving(true);
    setError("");
    try {
      const updated = await api.patchFloor(floorIndex, {
        rows: editRows,
        entities: entitiesToPatch(editEntities),
        spawn: editSpawn,
      });
      setAnalysis(updated);
      setEditRows(updated.rows);
      setEditEntities(updated.entities);
      setEditSpawn(updated.spawn);
      setDirty(false);
      if (updated.gameSync?.synced) {
        setSaveMsg(
          `Tallennettu: ${updated.savedTo ?? "aktiivinen tiedosto"}. `
          + "Peli synkattu — paina pelissä ↺ alusta tai päivitä sivu (F5).",
        );
      } else if (updated.savedTo) {
        setSaveMsg(
          `Tallennettu: ${updated.savedTo}. `
          + "Peli lukee vain content/worlds/corporate-hq-intro.json — lataa se aktiiviseksi tai synkkaa Maailma-valikosta.",
        );
      } else {
        setSaveMsg("Kerros tallennettu.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

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
                onClick={() => switchFloor(f.index)}
              >
                <span className="floor-title">{f.index}. {f.title}</span>
                <span className="floor-meta">{f.width}×{f.height} · {f.entityCount} hahmoa</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="floor-map-panel">
        {loading && <p className="muted">Ladataan…</p>}
        {error && <p className="error">{error}</p>}
        {saveMsg && <p className="status-msg">{saveMsg}</p>}
        {analysis && (
          <>
            <header className="panel-header">
              <div className="panel-header-row">
                <div>
                  <h2>{analysis.title}</h2>
                  <p className="muted">
                    {analysis.roomCount} huonetta · {analysis.entityCount} hahmoa
                    {analysis.elevator && ` · hissi (${analysis.elevator.x},${analysis.elevator.y})`}
                    {analysis.cafeteria && ` · ruokala (${analysis.cafeteria.x},${analysis.cafeteria.y})`}
                  </p>
                </div>
                <button
                  type="button"
                  className={editMode ? "btn-primary" : "btn-secondary"}
                  onClick={() => {
                    if (editMode && dirty && !window.confirm("Poistutaanko piirtotilasta tallentamatta?")) return;
                    if (!editMode) discardEdits();
                    setEditMode((v) => !v);
                  }}
                >
                  {editMode ? "Piirtotila päällä" : "Piirtotila"}
                </button>
              </div>
            </header>

            {editMode && (
              <MapEditorToolbar
                brush={editor.brush}
                onSelectBrush={editor.setBrush}
                cursor={editor.cursor}
                tileAtCursor={editor.tileAtCursor}
                entityAtCursor={editor.entityAtCursor}
                dirty={dirty}
                saving={saving}
                paintHint={editor.paintHint}
                onSave={saveFloor}
                onDiscard={discardEdits}
              />
            )}

            <AsciiMap
              rows={editMode ? editRows : analysis.rows}
              entities={editMode ? editEntities : analysis.entities}
              selectedId={selectedId}
              highlightZone={selectedZone?.bounds ?? null}
              onSelectEntity={editMode ? undefined : setSelectedId}
              cursor={editMode ? editor.cursor : null}
              editMode={editMode}
              emojiPlaceBlocked={editMode && !editor.canPlaceEmojiAtCursor}
              spawn={editMode ? editSpawn : analysis.spawn}
              mapRef={editor.mapRef}
              onKeyDown={editor.handleKeyDown}
              onCellClick={editor.handleCellClick}
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
          <p className="muted">
            {editMode
              ? "Piirtotilassa valitse hahmo kartalta tai käytä esine-/hahmosivellintä."
              : "Valitse hahmo kartalta tai huonelistasta."}
          </p>
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
