import {
  TILE_WIDTH,
  TILE_HEIGHT,
  gridToScreen,
  playerCenteredOrigin,
  tileDrawYOffset,
} from "./isometricProjection";
import {
  ensureIsoAssetsLoaded,
  getIsoImage,
  isoCharacterKey,
  isoTileKey,
} from "./isometricAssets";
import { resolveCellSprite, type CellSprite } from "./isometricTiles";
import { splitMapGraphemes } from "../../../hosts/shared/mapGlyphs.mjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MapState = any;

function recommendedSet(state: MapState): Set<string> {
  return new Set(state.recommendedCells ?? []);
}

function renderSignature(lines: string[], state: MapState): string {
  const rec = state.recommendedCells ?? [];
  return [
    lines.length,
    lines.join("\n"),
    rec.join(","),
    state.policeChase ? "1" : "0",
    state.player?.x ?? "",
    state.player?.y ?? "",
    state.camera?.x ?? "",
    state.camera?.y ?? "",
  ].join("\0");
}

function drawScaledImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  screenX: number,
  screenY: number,
) {
  const scale = TILE_WIDTH / img.naturalWidth;
  const drawW = TILE_WIDTH;
  const drawH = img.naturalHeight * scale;
  const yOff = tileDrawYOffset(drawH);
  ctx.drawImage(img, screenX, screenY - yOff, drawW, drawH);
}

function drawHighlight(ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
  ctx.save();
  ctx.fillStyle = "rgba(63, 185, 80, 0.35)";
  ctx.strokeStyle = "rgba(126, 231, 135, 0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(screenX + TILE_WIDTH / 2, screenY);
  ctx.lineTo(screenX + TILE_WIDTH, screenY + TILE_HEIGHT / 2);
  ctx.lineTo(screenX + TILE_WIDTH / 2, screenY + TILE_HEIGHT);
  ctx.lineTo(screenX, screenY + TILE_HEIGHT / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawEntityLabel(
  ctx: CanvasRenderingContext2D,
  glyph: string,
  screenX: number,
  screenY: number,
  police?: boolean,
) {
  ctx.save();
  ctx.font = `bold ${Math.max(11, TILE_WIDTH * 0.28)}px "Segoe UI", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (police) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(screenX + TILE_WIDTH * 0.2, screenY - TILE_HEIGHT * 0.2, TILE_WIDTH * 0.6, TILE_HEIGHT * 0.7);
    ctx.fillStyle = "#000";
  } else {
    ctx.fillStyle = "#f0883e";
  }
  ctx.fillText(glyph, screenX + TILE_WIDTH / 2, screenY + TILE_HEIGHT * 0.35);
  ctx.restore();
}

function drawEmoji(
  ctx: CanvasRenderingContext2D,
  glyph: string,
  screenX: number,
  screenY: number,
) {
  ctx.save();
  ctx.font = `${Math.max(18, TILE_WIDTH * 0.55)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", emoji, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyph, screenX + TILE_WIDTH / 2, screenY + TILE_HEIGHT * 0.2);
  ctx.restore();
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: CellSprite,
  lines: string[],
  x: number,
  y: number,
  screenX: number,
  screenY: number,
  recommended: Set<string>,
) {
  const key = `${y},${x}`;
  const highlight = recommended.has(key);

  if (sprite.kind === "tile") {
    const file = isoTileKey(sprite.base, sprite.dir);
    const img = getIsoImage(file);
    if (img) drawScaledImage(ctx, img, screenX, screenY);
    return;
  }

  if (highlight) drawHighlight(ctx, screenX, screenY);

  if (sprite.kind === "entity") {
    const img = getIsoImage(isoCharacterKey(sprite.skin));
    if (img) {
      drawScaledImage(ctx, img, screenX, screenY);
    } else {
      drawEntityLabel(ctx, sprite.glyph, screenX, screenY, sprite.police);
    }
    return;
  }

  if (sprite.kind === "emoji") {
    drawEmoji(ctx, sprite.glyph, screenX, screenY);
  }
}

function paintIsometricMap(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  lines: string[],
  state: MapState,
) {
  const recommended = recommendedSet(state);
  const player = state.player ?? {};
  const camera = state.camera ?? { x: 0, y: 0 };
  const playerVx = (player.x ?? 0) - (camera.x ?? 0);
  const playerVy = (player.y ?? 0) - (camera.y ?? 0);
  const origin = playerCenteredOrigin(playerVx, playerVy, canvas.width, canvas.height);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const rows = lines.length;
  for (let y = 0; y < rows; y += 1) {
    const cols = splitMapGraphemes(lines[y] ?? "").length;
    for (let x = 0; x < cols; x += 1) {
      const { x: sx, y: sy } = gridToScreen(x, y, origin.x, origin.y);
      const floor = getIsoImage(isoTileKey("floor", "E"));
      if (floor) drawScaledImage(ctx, floor, sx, sy);
    }
  }

  for (let y = 0; y < rows; y += 1) {
    const cols = splitMapGraphemes(lines[y] ?? "").length;
    for (let x = 0; x < cols; x += 1) {
      const glyph = splitMapGraphemes(lines[y] ?? "")[x] ?? " ";
      if (!glyph || glyph === " ") continue;
      const { x: sx, y: sy } = gridToScreen(x, y, origin.x, origin.y);
      const sprite = resolveCellSprite(glyph, lines, x, y, {
        recommended: recommended.has(`${y},${x}`),
        policeChase: !!state.policeChase,
      });
      if (sprite.kind === "tile" && sprite.base === "floor") continue;
      drawSprite(ctx, sprite, lines, x, y, sx, sy, recommended);
    }
  }
}

function resizeCanvasToContainer(canvas: HTMLCanvasElement, container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const width = Math.max(Math.floor(rect.width), 320);
  const height = Math.max(Math.floor(rect.height), 240);
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  return { width, height };
}

/** Render pseudo-isometric map with player centered on screen. */
export async function patchIsometricGrid(
  container: HTMLElement,
  lines: string[],
  state: MapState,
) {
  await ensureIsoAssetsLoaded();

  let canvas = container.querySelector<HTMLCanvasElement>("[data-iso-canvas]");
  if (!canvas) {
    container.textContent = "";
    container.classList.add("iso-map-host");
    canvas = document.createElement("canvas");
    canvas.dataset.isoCanvas = "1";
    canvas.className = "iso-map-canvas";
    canvas.setAttribute("aria-label", "Isometric map");
    container.appendChild(canvas);
  }

  const sig = renderSignature(lines, state);
  resizeCanvasToContainer(canvas, container);
  if (container.dataset.isoSig === sig && container.dataset.isoSized === `${canvas.width}x${canvas.height}`) {
    return;
  }
  container.dataset.isoSig = sig;
  container.dataset.isoSized = `${canvas.width}x${canvas.height}`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  paintIsometricMap(ctx, canvas, lines, state);
}

export function clearIsoMapHost(container: HTMLElement) {
  container.classList.remove("iso-map-host");
  delete container.dataset.isoSig;
  delete container.dataset.isoSized;
}
