import { useCallback, useEffect, useState } from "react";
import { api } from "./api/client";
import { FloorStudio } from "./panels/FloorStudio";
import { QuestionBrowser } from "./panels/QuestionBrowser";
import { WorldStoragePanel } from "./panels/WorldStoragePanel";
import type { WorldSummary } from "./types";

type Tab = "floors" | "questions";

export default function App() {
  const [tab, setTab] = useState<Tab>("floors");
  const [world, setWorld] = useState<(WorldSummary & { activeFile?: string }) | null>(null);
  const [worldKey, setWorldKey] = useState(0);
  const [error, setError] = useState("");

  const reloadWorld = useCallback(() => {
    api.world()
      .then((w) => {
        setWorld(w);
        setWorldKey((k) => k + 1);
        setError("");
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    reloadWorld();
  }, [reloadWorld]);

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Koodisampo Game Editor</h1>
          <p className="muted">Kerrokset · hahmot · kysymykset</p>
        </div>
        <div className="header-actions">
          <WorldStoragePanel
            activeFile={world?.activeFile ?? "content/worlds/corporate-hq-intro.json"}
            onWorldChanged={(summary) => {
              setWorld(summary);
              setWorldKey((k) => k + 1);
            }}
          />
          <nav className="tabs">
            <button type="button" className={tab === "floors" ? "active" : ""} onClick={() => setTab("floors")}>
              Kerrokset
            </button>
            <button type="button" className={tab === "questions" ? "active" : ""} onClick={() => setTab("questions")}>
              Kysymykset
            </button>
          </nav>
        </div>
      </header>

      <main>
        {error && <p className="error banner">API-yhteys epäonnistui: {error}. Käynnistä <code>npm run editor:server</code>.</p>}
        {tab === "floors" && world && <FloorStudio key={worldKey} world={world} />}
        {tab === "questions" && <QuestionBrowser />}
      </main>
    </div>
  );
}
