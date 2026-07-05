const STORAGE_KEY = "koodisampo-map-zoom";

/** Modest zoom range around the default player-focused scale. */
export const MAP_ZOOM_MIN = 0.85;
export const MAP_ZOOM_MAX = 1.2;
export const MAP_ZOOM_STEP = 0.05;
export const MAP_ZOOM_DEFAULT = 1;

function clampZoom(value: number): number {
  const stepped = Math.round(value / MAP_ZOOM_STEP) * MAP_ZOOM_STEP;
  return Math.min(MAP_ZOOM_MAX, Math.max(MAP_ZOOM_MIN, stepped));
}

function readStoredZoom(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return MAP_ZOOM_DEFAULT;
    const parsed = Number.parseFloat(raw);
    if (!Number.isFinite(parsed)) return MAP_ZOOM_DEFAULT;
    return clampZoom(parsed);
  } catch {
    return MAP_ZOOM_DEFAULT;
  }
}

let zoomMultiplier = readStoredZoom();

export function getMapZoomMultiplier(): number {
  return zoomMultiplier;
}

export function canZoomMapIn(): boolean {
  return zoomMultiplier < MAP_ZOOM_MAX - MAP_ZOOM_STEP * 0.5;
}

export function canZoomMapOut(): boolean {
  return zoomMultiplier > MAP_ZOOM_MIN + MAP_ZOOM_STEP * 0.5;
}

function persistZoom(): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(zoomMultiplier));
  } catch {
    /* ignore */
  }
}

function invalidateIsoMapCache(): void {
  document.querySelectorAll<HTMLElement>(".iso-map-host").forEach((el) => {
    delete el.dataset.isoSig;
    delete el.dataset.isoSized;
  });
}

function notifyZoomChange(): void {
  invalidateIsoMapCache();
  document.dispatchEvent(new CustomEvent("koodisampo-map-zoom-change"));
}

export function adjustMapZoom(delta: number): number {
  const next = clampZoom(zoomMultiplier + delta);
  if (next === zoomMultiplier) return zoomMultiplier;
  zoomMultiplier = next;
  persistZoom();
  notifyZoomChange();
  return zoomMultiplier;
}
