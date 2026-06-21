const DB_NAME = "koodisampo-web-game";
const STORE = "save";
const KEY = "player";

type SavePayload = Record<string, unknown>;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onerror = () => reject(req.error);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
  });
}

export async function loadPlayerSave(): Promise<SavePayload | null> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(KEY);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve((req.result as SavePayload) ?? null);
    });
  } catch {
    return null;
  }
}

export async function savePlayerSave(
  karma: { ids?: string[]; amounts?: number[] },
  deaths: number,
  quizHistory: unknown,
  studyBacklog: unknown,
  progress: unknown,
): Promise<void> {
  const payload: SavePayload = {
    version: 4,
    updatedAt: Date.now(),
    deaths: deaths ?? 0,
    features: {
      ids: [...(karma.ids ?? [])],
      amounts: [...(karma.amounts ?? [])],
    },
    quizHistory,
    studyBacklog,
    progress,
  };
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const req = tx.objectStore(STORE).put(payload, KEY);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve();
  });
}
