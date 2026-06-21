import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { QuestionItem, QuestionStats } from "../types";

export function QuestionBrowser() {
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [q, setQ] = useState("");
  const [chapter, setChapter] = useState("");
  const [items, setItems] = useState<QuestionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.questionStats().then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      api.questions({ q, chapter, limit: 40 })
        .then((r) => {
          setItems(r.items);
          setTotal(r.total);
        })
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(t);
  }, [q, chapter]);

  const chapters = stats ? Object.keys(stats.byChapter).sort() : [];

  return (
    <div className="question-browser">
      <header className="panel-header">
        <h2>Kysymyspankki</h2>
        {stats && <p className="muted">Yhteensä {stats.total} kysymystä</p>}
      </header>

      <div className="question-filters">
        <input
          type="search"
          placeholder="Hae promptista tai id:stä…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={chapter} onChange={(e) => setChapter(e.target.value)}>
          <option value="">Kaikki luvut</option>
          {chapters.map((ch) => (
            <option key={ch} value={ch}>{ch} ({stats?.byChapter[ch]})</option>
          ))}
        </select>
      </div>

      <p className="muted">{loading ? "Haetaan…" : `${total} osumaa`}</p>

      <ul className="question-list">
        {items.map((item) => (
          <li key={item.id} className="question-card">
            <div className="question-meta">
              <code>{item.id}</code>
              <span>{item.chapter}</span>
              <span>diff {item.difficulty}</span>
            </div>
            <p>{item.prompt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
