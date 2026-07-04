const BASE = import.meta.env.BASE_URL;

const TILE_FILES = [
  "Isometric__floor_E.png",
  "Isometric__wall_E.png",
  "Isometric__wall_N.png",
  "Isometric__wall_S.png",
  "Isometric__wall_W.png",
  "Isometric__wallCorner_E.png",
  "Isometric__wallCorner_N.png",
  "Isometric__wallCorner_S.png",
  "Isometric__wallCorner_W.png",
  "Isometric__wallHalf_E.png",
  "Isometric__wallHalf_N.png",
  "Isometric__wallHalf_S.png",
  "Isometric__wallHalf_W.png",
  "Isometric__doorOpen_E.png",
  "Isometric__doorOpen_N.png",
  "Isometric__doorOpen_S.png",
  "Isometric__doorOpen_W.png",
  "Isometric__doorClosed_E.png",
  "Isometric__doorClosed_N.png",
  "Isometric__doorClosed_S.png",
  "Isometric__doorClosed_W.png",
  "Isometric__window_E.png",
  "Isometric__window_N.png",
  "Isometric__window_S.png",
  "Isometric__window_W.png",
  "Isometric__slab_E.png",
  "Isometric__slab_N.png",
  "Isometric__slab_S.png",
  "Isometric__slab_W.png",
  "Isometric__block_E.png",
  "Isometric__crate_E.png",
  "Isometric__crate_N.png",
  "Isometric__crate_S.png",
  "Isometric__crate_W.png",
  "Isometric__stairs_E.png",
  "Isometric__stairs_N.png",
  "Isometric__stairs_S.png",
  "Isometric__stairs_W.png",
  "Isometric__doorwayCenter_E.png",
  "Isometric__switchFloorOn_E.png",
  ...Array.from({ length: 8 }, (_, i) => `Characters__Human__Human_${i}_Idle0.png`),
] as const;

type TileKey = (typeof TILE_FILES)[number];

const cache = new Map<string, HTMLImageElement>();
let loadPromise: Promise<void> | null = null;

function urlFor(file: string): string {
  return `${BASE}tiles/iso/${file}`;
}

export function getIsoImage(key: string): HTMLImageElement | null {
  return cache.get(key) ?? null;
}

export function ensureIsoAssetsLoaded(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = Promise.all(
    TILE_FILES.map(
      (file) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            cache.set(file, img);
            resolve();
          };
          img.onerror = () => reject(new Error(`Failed to load isometric tile: ${file}`));
          img.src = urlFor(file);
        }),
    ),
  ).then(() => undefined);
  return loadPromise;
}

export function isoTileKey(base: string, dir = "E"): string {
  const file = `Isometric__${base}_${dir}.png`;
  if (cache.has(file)) return file;
  const fallback = `Isometric__${base}_E.png`;
  if (cache.has(fallback)) return fallback;
  return "Isometric__floor_E.png";
}

export function isoCharacterKey(skin: number): TileKey {
  const idx = Math.max(0, Math.min(7, skin));
  return `Characters__Human__Human_${idx}_Idle0.png` as TileKey;
}
