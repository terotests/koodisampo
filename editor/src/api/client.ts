import type {
  FloorAnalysis,
  QuestionList,
  QuestionPreview,
  QuestionStats,
} from "../types";
import type {
  BackupEntry,
  WorldFilesResponse,
  WorldSummaryResponse,
} from "../types/storage";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  return parseJson<T>(await fetch(path));
}

async function post<T>(path: string, body: unknown = {}): Promise<T> {
  return parseJson<T>(await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
}

async function del<T>(path: string): Promise<T> {
  return parseJson<T>(await fetch(path, { method: "DELETE" }));
}

export const api = {
  health: () => get<{ ok: boolean }>("/api/health"),
  world: () => get<WorldSummaryResponse>("/api/world"),
  worldFiles: () => get<WorldFilesResponse>("/api/world/files"),
  worldBackups: () => get<{ backups: BackupEntry[] }>("/api/world/backups"),
  loadWorld: (path: string) => post<{ activeFile: string; summary: WorldSummaryResponse }>("/api/world/load", { path }),
  saveWorld: (path: string, opts?: { overwrite?: boolean }) =>
    post<{ path: string; activeFile: string; summary: WorldSummaryResponse }>("/api/world/save", {
      path,
      overwrite: opts?.overwrite !== false,
    }),
  saveActiveWorld: (overwrite = true) =>
    post<{ path: string; activeFile: string; summary: WorldSummaryResponse }>("/api/world/save-active", { overwrite }),
  createBackup: (name: string, note = "") =>
    post<{ id: string; name: string; createdAt: string; sourceFile: string }>("/api/world/backups", { name, note }),
  restoreBackup: (id: string, opts?: { saveToSource?: boolean; saveActive?: boolean }) =>
    post<{ activeFile: string; summary: WorldSummaryResponse; inMemoryOnly?: boolean }>(
      "/api/world/backups/restore",
      { id, ...opts },
    ),
  deleteBackup: (id: string) => del<{ id: string; deleted: boolean }>(`/api/world/backups/${encodeURIComponent(id)}`),
  floorAnalysis: (index: number) => get<FloorAnalysis>(`/api/world/floors/${index}/analysis`),
  questionStats: () => get<QuestionStats>("/api/questions/stats"),
  questions: (params: { chapter?: string; domain?: string; q?: string; limit?: number }) => {
    const sp = new URLSearchParams();
    if (params.chapter) sp.set("chapter", params.chapter);
    if (params.domain) sp.set("domain", params.domain);
    if (params.q) sp.set("q", params.q);
    if (params.limit) sp.set("limit", String(params.limit));
    return get<QuestionList>(`/api/questions?${sp}`);
  },
  questionPreview: (topic: string, limit = 5) =>
    get<QuestionPreview>(`/api/questions/preview?topic=${encodeURIComponent(topic)}&limit=${limit}`),
};
