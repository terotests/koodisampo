import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import type { WorldSummary } from "../types";
import type { BackupEntry, WorldFileEntry } from "../types/storage";

type Props = {
  activeFile: string;
  onWorldChanged: (summary: WorldSummary & { activeFile?: string }) => void;
};

export function WorldStoragePanel({ activeFile, onWorldChanged }: Props) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<WorldFileEntry[]>([]);
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [saveAs, setSaveAs] = useState("editor-data/worlds/uusi-maailma.json");
  const [backupName, setBackupName] = useState("");
  const [backupNote, setBackupNote] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const [f, b] = await Promise.all([api.worldFiles(), api.worldBackups()]);
    setFiles(f.files);
    setBackups(b.backups);
  }, []);

  useEffect(() => {
    if (open) refresh().catch(() => {});
  }, [open, refresh, activeFile]);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setStatus("");
    try {
      await action();
      await refresh();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="world-storage">
      <button type="button" className="storage-toggle" onClick={() => setOpen((v) => !v)}>
        Maailma: <code>{activeFile}</code>
      </button>

      {open && (
        <div className="storage-panel">
          <section>
            <h3>Lataa tiedosto</h3>
            <ul className="file-list">
              {files.map((f) => (
                <li key={f.path}>
                  <button
                    type="button"
                    disabled={busy || f.path === activeFile}
                    onClick={() => run(async () => {
                      const r = await api.loadWorld(f.path);
                      onWorldChanged({ ...r.summary, activeFile: r.activeFile });
                      setStatus(`Ladattu: ${f.path}`);
                    })}
                  >
                    {f.name}
                    {f.isDefault && " (oletus)"}
                  </button>
                  <span className="muted small">{f.path}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Tallenna tiedostoon</h3>
            <div className="storage-row">
              <input
                value={saveAs}
                onChange={(e) => setSaveAs(e.target.value)}
                placeholder="editor-data/worlds/nimi.json"
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => run(async () => {
                  const r = await api.saveWorld(saveAs, { overwrite: false });
                  onWorldChanged({ ...r.summary, activeFile: r.activeFile });
                  setStatus(`Tallennettu: ${r.path}`);
                })}
              >
                Tallenna nimellä
              </button>
            </div>
            <div className="storage-row">
              <button
                type="button"
                disabled={busy}
                onClick={() => run(async () => {
                  if (!window.confirm(`Korvataanko ${activeFile}?`)) return;
                  const r = await api.saveActiveWorld(true);
                  onWorldChanged({ ...r.summary, activeFile: r.activeFile });
                  setStatus(
                    r.gameSync?.synced
                      ? `Päivitetty: ${activeFile} — peli synkattu (F5 pelissä)`
                      : `Päivitetty: ${activeFile}`,
                  );
                })}
              >
                Tallenna aktiivinen tiedosto
              </button>
            </div>
            <p className="muted small">
              Uudet tallennukset: <code>editor-data/worlds/</code> · Pelin oletus: <code>content/worlds/</code>
            </p>
          </section>

          <section>
            <h3>Nimetty varmuuskopio</h3>
            <div className="storage-row">
              <input
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                placeholder="Esim. Ennen ruokala-muutosta"
              />
              <input
                value={backupNote}
                onChange={(e) => setBackupNote(e.target.value)}
                placeholder="Muistiinpano (valinnainen)"
              />
              <button
                type="button"
                disabled={busy || !backupName.trim()}
                onClick={() => run(async () => {
                  const r = await api.createBackup(backupName.trim(), backupNote.trim());
                  setStatus(`Varmuuskopio: ${r.name}`);
                  setBackupName("");
                  setBackupNote("");
                })}
              >
                Luo kopio
              </button>
            </div>
            <p className="muted small">Tallennetaan: <code>editor-data/backups/</code></p>

            <ul className="backup-list">
              {backups.map((b) => (
                <li key={b.id}>
                  <div className="backup-head">
                    <strong>{b.name}</strong>
                    <span className="muted small">{new Date(b.createdAt).toLocaleString("fi-FI")}</span>
                  </div>
                  <p className="muted small">{b.sourceFile} · {b.floorCount} kerrosta{b.note ? ` · ${b.note}` : ""}</p>
                  <div className="storage-row">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(async () => {
                        const r = await api.restoreBackup(b.id, {});
                        onWorldChanged({ ...r.summary, activeFile: r.activeFile });
                        setStatus(`Palautettu muistiin: ${b.name} (tallenna erikseen levylle)`);
                      })}
                    >
                      Palauta muistiin
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(async () => {
                        if (!window.confirm(`Korvataanko ${activeFile} varmuuskopiolla?`)) return;
                        const r = await api.restoreBackup(b.id, { saveActive: true });
                        onWorldChanged({ ...r.summary, activeFile: r.activeFile });
                        setStatus(`Palautettu ja tallennettu: ${activeFile}`);
                      })}
                    >
                      Palauta + tallenna
                    </button>
                    <button
                      type="button"
                      className="danger"
                      disabled={busy}
                      onClick={() => run(async () => {
                        if (!window.confirm(`Poistetaanko varmuuskopio ${b.name}?`)) return;
                        await api.deleteBackup(b.id);
                        setStatus(`Poistettu: ${b.name}`);
                      })}
                    >
                      Poista
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {status && <p className="status-msg">{status}</p>}
        </div>
      )}
    </div>
  );
}
