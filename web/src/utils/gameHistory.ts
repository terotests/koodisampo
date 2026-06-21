import type { GamePhase, FeedbackState } from '../hooks/useGameEngine';

const STORAGE_KEY = 'koodisampo';

/** Vite base path, e.g. `/koodisampo/` on GitHub Pages project sites. */
const BASE = import.meta.env.BASE_URL;

function stripBase(pathname: string): string {
  const prefix = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  if (prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    const rest = pathname.slice(prefix.length);
    return rest === '' ? '/' : rest;
  }
  return pathname;
}

/** Serialized into history.state and used for popstate restoration */
export type GameHistoryEntry = {
  v: 1;
  screen: 'list' | 'game';
  storyId?: string;
  nodeId?: string;
  phase?: GamePhase;
  feedback?: FeedbackState | null;
  totalPoints?: number;
};

export function isGameHistoryEntry(state: unknown): state is GameHistoryEntry {
  return (
    typeof state === 'object' &&
    state !== null &&
    'v' in state &&
    (state as GameHistoryEntry).v === 1 &&
    'screen' in state
  );
}

export function listEntry(): GameHistoryEntry {
  return { v: 1, screen: 'list' };
}

export function gameEntry(
  storyId: string,
  nodeId: string,
  phase: GamePhase,
  totalPoints: number,
  feedback: FeedbackState | null = null,
): GameHistoryEntry {
  return {
    v: 1,
    screen: 'game',
    storyId,
    nodeId,
    phase,
    feedback: feedback ?? null,
    totalPoints,
  };
}

export function entryToPath(entry: GameHistoryEntry): string {
  if (entry.screen === 'list') return BASE;
  if (!entry.storyId) return BASE;
  if (!entry.nodeId) return `${BASE}play/${entry.storyId}`;
  const path = `${BASE}play/${entry.storyId}/${entry.nodeId}`;
  if (entry.phase === 'feedback') return `${path}?view=feedback`;
  if (entry.phase === 'ended') return `${path}?view=ended`;
  return path;
}

export function parseLocation(
  pathname: string,
  search: string,
  state: unknown,
): GameHistoryEntry {
  if (isGameHistoryEntry(state)) return state;

  const localPath = stripBase(pathname);
  if (localPath === '/' || localPath === '') return listEntry();

  const match = localPath.match(/^\/play\/([^/]+)(?:\/([^/]+))?$/);
  if (!match) return listEntry();

  const [, storyId, nodeId] = match;
  const params = new URLSearchParams(search);
  const view = params.get('view');

  let phase: GamePhase = 'playing';
  if (view === 'feedback') phase = 'feedback';
  else if (view === 'ended') phase = 'ended';

  return {
    v: 1,
    screen: 'game',
    storyId,
    nodeId,
    phase,
  };
}

export function pushEntry(entry: GameHistoryEntry): void {
  const path = entryToPath(entry);
  window.history.pushState(entry, '', path);
}

export function replaceEntry(entry: GameHistoryEntry): void {
  const path = entryToPath(entry);
  window.history.replaceState(entry, '', path);
}

/** Tag for debugging in devtools */
export function historyLabel(entry: GameHistoryEntry): string {
  if (entry.screen === 'list') return 'Koodisampo — tarinat';
  return `Koodisampo — ${entry.storyId}/${entry.nodeId} (${entry.phase})`;
}

export { STORAGE_KEY };
