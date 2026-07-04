import {
  applyRenderThemePixels,
  nativeCanvasFilterWorks,
} from "../../../hosts/shared/canvasFilterPixels.mjs";
import {
  readStoredRenderTheme,
  renderThemeFilter,
  shouldTintIsoAsset,
  type RenderThemeId,
} from "../renderTheme";

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
const tintedCache = new Map<string, HTMLCanvasElement>();
let loadPromise: Promise<void> | null = null;
let useNativeCanvasFilter: boolean | null = null;

function canvasFilterSupported(ctx: CanvasRenderingContext2D): boolean {
  if (useNativeCanvasFilter !== null) return useNativeCanvasFilter;
  useNativeCanvasFilter = nativeCanvasFilterWorks(ctx);
  return useNativeCanvasFilter;
}

export function clearIsoTintCache(): void {
  tintedCache.clear();
}

if (typeof document !== "undefined") {
  document.addEventListener("koodisampo-render-theme-change", () => {
    clearIsoTintCache();
  });
}

function tintCacheKey(file: string, theme: RenderThemeId): string {
  return `${file}\0${theme}`;
}

function buildTintedCanvas(
  img: HTMLImageElement,
  filter: string,
  theme: RenderThemeId,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  if (canvasFilterSupported(ctx)) {
    ctx.filter = filter;
    ctx.drawImage(img, 0, 0);
    ctx.filter = "none";
    return canvas;
  }
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  applyRenderThemePixels(imageData.data, theme);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function getTintedIsoCanvas(file: string): HTMLCanvasElement | null {
  const img = cache.get(file);
  if (!img) return null;
  const theme = readStoredRenderTheme();
  const filter = renderThemeFilter(theme);
  if (theme === "orange" || filter === "none") return null;
  const key = tintCacheKey(file, theme);
  let tinted = tintedCache.get(key);
  if (!tinted) {
    tinted = buildTintedCanvas(img, filter, theme);
    tintedCache.set(key, tinted);
  }
  return tinted;
}

function urlFor(file: string): string {
  return `${BASE}tiles/iso/${file}`;
}

export function getIsoImage(key: string): HTMLImageElement | null {
  return cache.get(key) ?? null;
}

/** Isometric tile bitmap with optional render-theme tint (walls, floors, props — not characters). */
export function getIsoDrawSource(key: string): CanvasImageSource | null {
  const img = cache.get(key);
  if (!img) return null;
  if (!shouldTintIsoAsset(key)) return img;
  return getTintedIsoCanvas(key) ?? img;
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
