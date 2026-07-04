import {
  TILE_WIDTH,
  TILE_HEIGHT,
  gridToScreen,
  playerCenteredOrigin,
  tileDrawYOffset,
  playerFocusedScale,
} from "./isometricProjection";
import {
  ensureIsoAssetsLoaded,
  getIsoImage,
  isoTileKey,
} from "./isometricAssets";
import { resolveCellSprite, type CellSprite } from "./isometricTiles";
import { splitMapGraphemes } from "../../../hosts/shared/mapGlyphs.mjs";
import {
  drawLegoCrowbarItem,
  drawLegoMinifig,
  drawLegoPlayer,
  drawLegoShovelItem,
  facingFromDelta,
  isHumanEntityKind,
  resolveMinifigAppearance,
  type PlayerFacing,
} from "./legoSprites";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MapState = any;

const WALK_ANIM_MS = 320;
const WALK_STRIDE_MS = 140;

let animRaf = 0;
let lastPlayerGrid: { x: number; y: number } | null = null;
let lastMoveAt = 0;
let lastFacing: PlayerFacing = "S";

function recommendedSet(state: MapState): Set<string> {
  return new Set(state.recommendedCells ?? []);
}

function findPlayerInLines(lines: string[]): { x: number; y: number } | null {
  for (let y = 0; y < lines.length; y += 1) {
    const cells = splitMapGraphemes(lines[y] ?? "");
    const x = cells.indexOf("@");
    if (x >= 0) return { x, y };
  }
  return null;
}

function renderSignature(lines: string[], state: MapState): string {
  const rec = state.recommendedCells ?? [];
  const ents = state.entityCells ?? [];
  const walkFrame = walkFrameForNow();
  return [
    lines.length,
    lines.join("\n"),
    rec.join(","),
    ents.map((c: { x: number; y: number; glyph: string }) => `${c.y},${c.x},${c.glyph}`).join(";"),
    state.policeChase ? "1" : "0",
    state.player?.x ?? "",
    state.player?.y ?? "",
    state.player?.facingX ?? "",
    state.player?.facingY ?? "",
    state.player?.activeTool ?? "",
    state.camera?.x ?? "",
    state.camera?.y ?? "",
    walkFrame,
  ].join("\0");
}

function playerFacing(state: MapState): PlayerFacing {
  const fx = state.player?.facingX ?? 0;
  const fy = state.player?.facingY ?? 1;
  if (fx === 0 && fy === 0) return lastFacing;
  return facingFromDelta(fx, fy);
}

function walkFrameForNow(): number {
  if (Date.now() - lastMoveAt > WALK_ANIM_MS) return 0;
  return Math.floor((Date.now() - lastMoveAt) / WALK_STRIDE_MS) % 2;
}

function notePlayerMotion(state: MapState, lines: string[]) {
  const pos = findPlayerInLines(lines);
  const gridX = pos?.x ?? (state.player?.x ?? 0) - (state.camera?.x ?? 0);
  const gridY = pos?.y ?? (state.player?.y ?? 0) - (state.camera?.y ?? 0);
  const facing = playerFacing(state);
  if (lastPlayerGrid && (lastPlayerGrid.x !== gridX || lastPlayerGrid.y !== gridY)) {
    lastMoveAt = Date.now();
  }
  lastPlayerGrid = { x: gridX, y: gridY };
  lastFacing = facing;
}

function scheduleWalkRepaint(container: HTMLElement, lines: string[], state: MapState) {
  if (Date.now() - lastMoveAt > WALK_ANIM_MS) return;
  if (animRaf) cancelAnimationFrame(animRaf);
  animRaf = requestAnimationFrame(() => {
    animRaf = 0;
    const canvas = container.querySelector<HTMLCanvasElement>("[data-iso-canvas]");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    paintIsometricMap(ctx, canvas, lines, state);
    container.dataset.isoSig = renderSignature(lines, state);
    scheduleWalkRepaint(container, lines, state);
  });
}

function drawScaledImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  screenX: number,
  screenY: number,
  tileWidth: number,
  opts?: { scaleMul?: number; crisp?: boolean; yBias?: number },
) {
  const scaleMul = opts?.scaleMul ?? 1;
  const effectiveWidth = tileWidth * scaleMul;
  const scale = effectiveWidth / img.naturalWidth;
  const drawW = effectiveWidth;
  const drawH = img.naturalHeight * scale;
  const yOff = tileDrawYOffset(drawH, tileWidth);
  const xOff = (tileWidth - drawW) / 2;
  const yBias = opts?.yBias ?? 0;
  ctx.save();
  if (opts?.crisp) ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, screenX + xOff, screenY - yOff + yBias, drawW, drawH);
  ctx.restore();
}

function drawItemGlow(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
) {
  ctx.save();
  ctx.fillStyle = "rgba(255, 210, 80, 0.45)";
  ctx.strokeStyle = "rgba(255, 230, 120, 0.95)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(screenX + tileWidth / 2, screenY + tileHeight * 0.05);
  ctx.lineTo(screenX + tileWidth * 0.92, screenY + tileHeight * 0.45);
  ctx.lineTo(screenX + tileWidth / 2, screenY + tileHeight * 0.85);
  ctx.lineTo(screenX + tileWidth * 0.08, screenY + tileHeight * 0.45);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}


function drawHumanMinifig(
  ctx: CanvasRenderingContext2D,
  sprite: { glyph: string; entityKind?: string; gender?: string; entityId?: string },
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
  opts: { walkFrame: number; facing: PlayerFacing; activeTool?: string },
) {
  if (sprite.glyph === "@") {
    drawLegoPlayer(
      ctx,
      screenX,
      screenY,
      tileWidth,
      tileHeight,
      opts.facing,
      opts.walkFrame,
      opts.activeTool,
    );
    return;
  }
  const appearance = resolveMinifigAppearance(
    sprite.entityKind,
    sprite.gender,
    sprite.glyph,
    sprite.entityId,
  );
  drawLegoMinifig(
    ctx,
    screenX,
    screenY,
    tileWidth,
    tileHeight,
    "S",
    0,
    appearance,
  );
}

function drawHighlight(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
) {
  ctx.save();
  ctx.fillStyle = "rgba(63, 185, 80, 0.35)";
  ctx.strokeStyle = "rgba(126, 231, 135, 0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(screenX + tileWidth / 2, screenY);
  ctx.lineTo(screenX + tileWidth, screenY + tileHeight / 2);
  ctx.lineTo(screenX + tileWidth / 2, screenY + tileHeight);
  ctx.lineTo(screenX, screenY + tileHeight / 2);
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
  tileWidth: number,
  tileHeight: number,
  police?: boolean,
) {
  ctx.save();
  ctx.font = `bold ${Math.max(11, tileWidth * 0.28)}px "Segoe UI", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (police) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(screenX + tileWidth * 0.2, screenY - tileHeight * 0.2, tileWidth * 0.6, tileHeight * 0.7);
    ctx.fillStyle = "#000";
  } else {
    ctx.fillStyle = "#f0883e";
  }
  ctx.fillText(glyph, screenX + tileWidth / 2, screenY + tileHeight * 0.35);
  ctx.restore();
}

function drawEmoji(
  ctx: CanvasRenderingContext2D,
  glyph: string,
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
) {
  ctx.save();
  ctx.font = `${Math.max(18, tileWidth * 0.55)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", emoji, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyph, screenX + tileWidth / 2, screenY + tileHeight * 0.2);
  ctx.restore();
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: CellSprite,
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
  recommended: Set<string>,
  x: number,
  y: number,
  opts: { walkFrame: number; facing: PlayerFacing; activeTool?: string },
) {
  const key = `${y},${x}`;
  const highlight = recommended.has(key);

  if (sprite.kind === "tile") {
    const file = isoTileKey(sprite.base, sprite.dir);
    const img = getIsoImage(file);
    if (img) drawScaledImage(ctx, img, screenX, screenY, tileWidth);
    return;
  }

  if (highlight) drawHighlight(ctx, screenX, screenY, tileWidth, tileHeight);

  if (sprite.kind === "item") {
    drawItemGlow(ctx, screenX, screenY, tileWidth, tileHeight);
    if (sprite.base === "prop" && sprite.itemTool === "shovel") {
      drawLegoShovelItem(ctx, screenX, screenY, tileWidth, tileHeight);
      return;
    }
    if (sprite.base === "prop" && sprite.itemTool === "crowbar") {
      drawLegoCrowbarItem(ctx, screenX, screenY, tileWidth, tileHeight);
      return;
    }
    const file = isoTileKey(sprite.base, sprite.dir);
    const img = getIsoImage(file);
    if (img) {
      drawScaledImage(ctx, img, screenX, screenY, tileWidth, { scaleMul: 0.92, crisp: true, yBias: -2 });
    } else {
      drawEmoji(ctx, sprite.glyph, screenX, screenY, tileWidth, tileHeight);
    }
    return;
  }

  if (sprite.kind === "entity") {
    if (isHumanEntityKind(sprite.entityKind) || sprite.glyph === "@") {
      drawHumanMinifig(ctx, sprite, screenX, screenY, tileWidth, tileHeight, opts);
      return;
    }
    drawEntityLabel(ctx, sprite.glyph, screenX, screenY, tileWidth, tileHeight, sprite.police);
    return;
  }

  if (sprite.kind === "emoji") {
    drawEmoji(ctx, sprite.glyph, screenX, screenY, tileWidth, tileHeight);
  }
}

type OverlayCell = {
  x: number;
  y: number;
  depth: number;
  sprite: CellSprite;
};

function paintIsometricMap(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  lines: string[],
  state: MapState,
) {
  const recommended = recommendedSet(state);
  const entityCells = state.entityCells ?? [];
  const rows = lines.length;
  const cssWidth = canvas.width / (window.devicePixelRatio || 1);
  const cssHeight = canvas.height / (window.devicePixelRatio || 1);

  const scale = playerFocusedScale(cssWidth, cssHeight);
  const tileWidth = TILE_WIDTH * scale;
  const tileHeight = TILE_HEIGHT * scale;

  const playerPos = findPlayerInLines(lines);
  const playerGridX =
    playerPos?.x ??
    (state.player?.x ?? 0) - (state.camera?.x ?? 0);
  const playerGridY =
    playerPos?.y ??
    (state.player?.y ?? 0) - (state.camera?.y ?? 0);
  const origin = playerCenteredOrigin(playerGridX, playerGridY, cssWidth, cssHeight, tileWidth, tileHeight);

  ctx.clearRect(0, 0, cssWidth, cssHeight);
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  const facing = playerFacing(state);
  const walkFrame = walkFrameForNow();
  const activeTool = state.player?.activeTool as string | undefined;
  const drawOpts = { walkFrame, facing, activeTool };

  const floor = getIsoImage(isoTileKey("slab", "E"));
  for (let y = 0; y < rows; y += 1) {
    const rowCols = splitMapGraphemes(lines[y] ?? "").length;
    for (let x = 0; x < rowCols; x += 1) {
      const { x: sx, y: sy } = gridToScreen(x, y, origin.x, origin.y, tileWidth, tileHeight);
      if (floor) drawScaledImage(ctx, floor, sx, sy, tileWidth);
    }
  }

  const overlays: OverlayCell[] = [];
  const overlayKeys = new Set<string>();
  for (let y = 0; y < rows; y += 1) {
    const rowCols = splitMapGraphemes(lines[y] ?? "").length;
    for (let x = 0; x < rowCols; x += 1) {
      const glyph = splitMapGraphemes(lines[y] ?? "")[x] ?? " ";
      const cellKey = `${y},${x}`;
      const sprite = resolveCellSprite(glyph, lines, x, y, {
        recommended: recommended.has(cellKey),
        policeChase: !!state.policeChase,
        entityCells,
      });
      if (sprite.kind === "tile" && (sprite.base === "floor" || sprite.base === "slab")) continue;
      const layer =
        sprite.kind === "entity" || sprite.kind === "emoji" || sprite.kind === "item" ? 0.5 : 0;
      overlays.push({ x, y, depth: x + y + layer, sprite });
      overlayKeys.add(cellKey);
    }
  }
  for (const ent of entityCells) {
    const key = `${ent.y},${ent.x}`;
    if (overlayKeys.has(key)) continue;
    const glyph = splitMapGraphemes(lines[ent.y] ?? "")[ent.x] ?? " ";
    const sprite = resolveCellSprite(glyph, lines, ent.x, ent.y, {
      recommended: recommended.has(key),
      policeChase: !!state.policeChase,
      entityCells,
    });
    if (sprite.kind === "tile" && sprite.base === "floor") continue;
    overlays.push({ x: ent.x, y: ent.y, depth: ent.x + ent.y + 0.5, sprite });
  }
  overlays.sort((a, b) => a.depth - b.depth || a.y - b.y || a.x - b.x);

  for (const cell of overlays) {
    const { x, y, sprite } = cell;
    const { x: sx, y: sy } = gridToScreen(x, y, origin.x, origin.y, tileWidth, tileHeight);
    drawSprite(ctx, sprite, sx, sy, tileWidth, tileHeight, recommended, x, y, drawOpts);
  }
}

function plannedCanvasSize(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const width = Math.max(Math.floor(rect.width), 320);
  const height = Math.max(Math.floor(rect.height), 240);
  const dpr = window.devicePixelRatio || 1;
  return {
    width,
    height,
    pixelWidth: Math.floor(width * dpr),
    pixelHeight: Math.floor(height * dpr),
    dpr,
  };
}

function resizeCanvasToContainer(
  canvas: HTMLCanvasElement,
  size: ReturnType<typeof plannedCanvasSize>,
) {
  canvas.style.width = `${size.width}px`;
  canvas.style.height = `${size.height}px`;
  // Assigning canvas.width clears the bitmap — skip when unchanged (mobile calls
  // patchIsometricGrid several times per frame; a no-op resize was wiping paint).
  if (canvas.width === size.pixelWidth && canvas.height === size.pixelHeight) {
    return;
  }
  canvas.width = size.pixelWidth;
  canvas.height = size.pixelHeight;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
  }
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

  notePlayerMotion(state, lines);

  const sig = renderSignature(lines, state);
  const size = plannedCanvasSize(container);
  const sizeKey = `${size.pixelWidth}x${size.pixelHeight}`;
  if (container.dataset.isoSig === sig && container.dataset.isoSized === sizeKey) {
    scheduleWalkRepaint(container, lines, state);
    return;
  }
  resizeCanvasToContainer(canvas, size);
  container.dataset.isoSig = sig;
  container.dataset.isoSized = sizeKey;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  paintIsometricMap(ctx, canvas, lines, state);
  scheduleWalkRepaint(container, lines, state);
}

export function clearIsoMapHost(container: HTMLElement) {
  container.classList.remove("iso-map-host");
  delete container.dataset.isoSig;
  delete container.dataset.isoSized;
}
