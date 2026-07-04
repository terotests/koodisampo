/** Canvas-drawn Lego-style minifig, tools, and item props for the isometric map. */

import {
  DEFAULT_PLAYER_APPEARANCE,
  type LegoAppearance,
  type LegoPartColors,
} from "./legoAppearance";

export type PlayerFacing = "N" | "S" | "E" | "W";

export function facingFromDelta(fx: number, fy: number): PlayerFacing {
  if (Math.abs(fx) >= Math.abs(fy)) {
    return fx < 0 ? "W" : "E";
  }
  return fy < 0 ? "N" : "S";
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function drawStud(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function fillPart(ctx: CanvasRenderingContext2D, colors: LegoPartColors) {
  ctx.fillStyle = colors.fill;
  ctx.strokeStyle = colors.stroke;
}

function drawHairCap(
  ctx: CanvasRenderingContext2D,
  cx: number,
  headCy: number,
  headR: number,
  u: number,
) {
  ctx.fillStyle = "#422006";
  ctx.strokeStyle = "#292524";
  ctx.lineWidth = Math.max(1, u * 0.5);
  ctx.beginPath();
  ctx.arc(cx, headCy - headR * 0.15, headR * 1.05, Math.PI * 1.05, Math.PI * 1.95);
  ctx.lineTo(cx + headR * 0.85, headCy + headR * 0.35);
  ctx.quadraticCurveTo(cx, headCy + headR * 0.55, cx - headR * 0.85, headCy + headR * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawAccessory(
  ctx: CanvasRenderingContext2D,
  cx: number,
  torsoY: number,
  torsoH: number,
  headCy: number,
  headR: number,
  u: number,
  accessory: NonNullable<LegoAppearance["accessory"]>,
) {
  ctx.save();
  ctx.lineWidth = Math.max(1, u * 0.55);
  if (accessory === "tie") {
    ctx.fillStyle = "#dc2626";
    ctx.strokeStyle = "#991b1b";
    ctx.beginPath();
    ctx.moveTo(cx, torsoY + 2 * u);
    ctx.lineTo(cx - 2 * u, torsoY + 5 * u);
    ctx.lineTo(cx, torsoY + torsoH - 1 * u);
    ctx.lineTo(cx + 2 * u, torsoY + 5 * u);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (accessory === "badge") {
    ctx.fillStyle = "#fbbf24";
    ctx.strokeStyle = "#92400e";
    roundRect(ctx, cx - 3 * u, torsoY + 4 * u, 6 * u, 5 * u, 1 * u);
    ctx.fill();
    ctx.stroke();
  } else if (accessory === "headset") {
    ctx.strokeStyle = "#334155";
    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.arc(cx, headCy, headR * 1.05, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    roundRect(ctx, cx - headR * 1.15, headCy - 1 * u, 3 * u, 4 * u, 0.8 * u);
    ctx.fill();
    ctx.stroke();
    roundRect(ctx, cx + headR * 1.15 - 3 * u, headCy - 1 * u, 3 * u, 4 * u, 0.8 * u);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

/** Blocky Lego minifig with direction, walk stride, and optional color palette. */
export function drawLegoMinifig(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
  facing: PlayerFacing,
  walkFrame: number,
  appearance: LegoAppearance = DEFAULT_PLAYER_APPEARANCE,
  activeTool?: string,
) {
  const cx = screenX + tileWidth / 2;
  const footY = screenY + tileHeight * 0.72;
  const u = tileWidth / 64;
  const stride = walkFrame === 1 ? 2 * u : 0;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const legW = 7 * u;
  const legH = 10 * u;
  const legGap = 1.5 * u;
  fillPart(ctx, appearance.legs);
  ctx.lineWidth = Math.max(1, u * 0.6);
  if (facing === "E" || facing === "W") {
    const dir = facing === "E" ? 1 : -1;
    roundRect(ctx, cx - legW / 2 + dir * stride, footY - legH, legW, legH, 1.5 * u);
    ctx.fill();
    ctx.stroke();
    roundRect(ctx, cx - legW / 2 - dir * stride * 0.4, footY - legH * 0.45, legW * 0.85, legH * 0.55, 1.2 * u);
    ctx.fill();
    ctx.stroke();
  } else {
    roundRect(ctx, cx - legW - legGap / 2 - stride, footY - legH, legW, legH, 1.5 * u);
    ctx.fill();
    ctx.stroke();
    roundRect(ctx, cx + legGap / 2 + stride, footY - legH, legW, legH, 1.5 * u);
    ctx.fill();
    ctx.stroke();
  }

  const torsoW = facing === "E" || facing === "W" ? 14 * u : 18 * u;
  const torsoH = 12 * u;
  const torsoY = footY - legH - torsoH + 2 * u;
  fillPart(ctx, appearance.torso);
  roundRect(ctx, cx - torsoW / 2, torsoY, torsoW, torsoH, 2 * u);
  ctx.fill();
  ctx.stroke();
  drawStud(ctx, cx, torsoY + 3 * u, 2 * u);
  ctx.fillStyle = appearance.torso.stud ?? appearance.torso.fill;
  ctx.strokeStyle = appearance.torso.studStroke ?? appearance.torso.stroke;
  ctx.fill();
  ctx.stroke();

  const headR = 6.5 * u;
  const headCy = torsoY - headR + 3 * u;
  fillPart(ctx, appearance.head);
  ctx.beginPath();
  ctx.arc(cx, headCy, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (appearance.hair) {
    drawHairCap(ctx, cx, headCy, headR, u);
  } else {
    drawStud(ctx, cx, headCy - headR * 0.55, 2.2 * u);
    ctx.fillStyle = appearance.head.stud ?? appearance.head.fill;
    ctx.strokeStyle = appearance.head.studStroke ?? appearance.head.stroke;
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = "#1f2937";
  if (facing === "N") {
    ctx.fillRect(cx - 4 * u, headCy - 1 * u, 8 * u, 2 * u);
  } else if (facing === "S") {
    ctx.beginPath();
    ctx.arc(cx - 2.5 * u, headCy - 0.5 * u, 1.2 * u, 0, Math.PI * 2);
    ctx.arc(cx + 2.5 * u, headCy - 0.5 * u, 1.2 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - 3 * u, headCy + 2 * u, 6 * u, 1.5 * u);
  } else {
    const eyeX = facing === "E" ? cx + 1.5 * u : cx - 1.5 * u;
    ctx.beginPath();
    ctx.arc(eyeX, headCy - 0.5 * u, 1.4 * u, 0, Math.PI * 2);
    ctx.fill();
  }

  if (appearance.accessory) {
    drawAccessory(ctx, cx, torsoY, torsoH, headCy, headR, u, appearance.accessory);
  }

  if (activeTool === "shovel" || activeTool === "crowbar") {
    drawHandTool(ctx, cx, torsoY + torsoH * 0.35, u, facing, activeTool);
  }

  ctx.restore();
}

/** Local player — same minifig with default palette. */
export function drawLegoPlayer(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
  facing: PlayerFacing,
  walkFrame: number,
  activeTool?: string,
) {
  drawLegoMinifig(
    ctx,
    screenX,
    screenY,
    tileWidth,
    tileHeight,
    facing,
    walkFrame,
    DEFAULT_PLAYER_APPEARANCE,
    activeTool,
  );
}

function drawHandTool(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  u: number,
  facing: PlayerFacing,
  tool: "shovel" | "crowbar",
) {
  ctx.save();
  ctx.lineWidth = Math.max(1.2, u * 0.7);
  ctx.lineCap = "round";
  if (tool === "shovel") {
    ctx.strokeStyle = "#78350f";
    ctx.fillStyle = "#94a3b8";
    const angle = facing === "W" ? Math.PI * 0.85 : facing === "E" ? Math.PI * 0.15 : Math.PI * 0.55;
    const len = 16 * u;
    const hx = cx + Math.cos(angle) * len;
    const hy = cy + Math.sin(angle) * len;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(hx, hy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + Math.cos(angle + 0.5) * 5 * u, hy + Math.sin(angle + 0.5) * 5 * u);
    ctx.lineTo(hx + Math.cos(angle - 0.4) * 4 * u, hy + Math.sin(angle - 0.4) * 4 * u);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.strokeStyle = "#64748b";
    ctx.fillStyle = "#475569";
    const angle = facing === "W" ? Math.PI * 0.75 : facing === "E" ? Math.PI * 0.25 : Math.PI * 0.45;
    const len = 18 * u;
    const tipX = cx + Math.cos(angle) * len;
    const tipY = cy + Math.sin(angle) * len;
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(angle) * 4 * u, cy - Math.sin(angle) * 4 * u);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX + Math.cos(angle + 1.2) * 6 * u, tipY + Math.sin(angle + 1.2) * 6 * u);
    ctx.lineTo(tipX + Math.cos(angle + 0.3) * 3 * u, tipY + Math.sin(angle + 0.3) * 3 * u);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

/** Reception minifig behind a small Lego desk counter. */
export function drawLegoReception(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
  appearance: LegoAppearance,
) {
  const cx = screenX + tileWidth / 2;
  const u = tileWidth / 64;
  const deskY = screenY + tileHeight * 0.58;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#78716c";
  ctx.strokeStyle = "#44403c";
  ctx.lineWidth = Math.max(1, u * 0.6);
  roundRect(ctx, cx - 16 * u, deskY, 32 * u, 8 * u, 1.5 * u);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#d6d3d1";
  roundRect(ctx, cx - 14 * u, deskY - 3 * u, 28 * u, 4 * u, 1 * u);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#0ea5e9";
  ctx.strokeStyle = "#0369a1";
  roundRect(ctx, cx - 4 * u, deskY - 8 * u, 8 * u, 5 * u, 1 * u);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  drawLegoMinifig(ctx, screenX, screenY - tileHeight * 0.06, tileWidth, tileHeight, "S", 0, appearance);
}

/** Blocky office dog (toimistokoira). */
export function drawLegoDog(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
) {
  const cx = screenX + tileWidth / 2;
  const cy = screenY + tileHeight * 0.52;
  const u = tileWidth / 64;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.lineWidth = Math.max(1, u * 0.6);

  ctx.fillStyle = "#8b6914";
  ctx.strokeStyle = "#5c4a0e";
  roundRect(ctx, cx - 10 * u, cy - 2 * u, 18 * u, 10 * u, 2 * u);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx + 10 * u, cy - 1 * u, 5 * u, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1f2937";
  ctx.beginPath();
  ctx.arc(cx + 12 * u, cy - 2 * u, 1.2 * u, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#a16207";
  ctx.strokeStyle = "#713f12";
  roundRect(ctx, cx - 8 * u, cy + 6 * u, 4 * u, 6 * u, 1 * u);
  ctx.fill();
  ctx.stroke();
  roundRect(ctx, cx + 2 * u, cy + 6 * u, 4 * u, 6 * u, 1 * u);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#422006";
  ctx.beginPath();
  ctx.moveTo(cx + 6 * u, cy - 4 * u);
  ctx.lineTo(cx + 4 * u, cy - 10 * u);
  ctx.lineTo(cx + 8 * u, cy - 5 * u);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx + 2 * u, cy + 2 * u, 3 * u, 0, Math.PI * 2);
  ctx.fillStyle = "#92400e";
  ctx.fill();
  ctx.strokeStyle = "#713f12";
  ctx.stroke();

  ctx.restore();
}

/** Lego-style monitor / telkkari (Työasema). */
export function drawLegoTv(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
) {
  const cx = screenX + tileWidth / 2;
  const cy = screenY + tileHeight * 0.38;
  const u = tileWidth / 64;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.lineWidth = Math.max(1, u * 0.6);

  ctx.fillStyle = "#334155";
  ctx.strokeStyle = "#0f172a";
  roundRect(ctx, cx - 14 * u, cy - 10 * u, 28 * u, 18 * u, 2 * u);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#38bdf8";
  ctx.strokeStyle = "#0284c7";
  roundRect(ctx, cx - 11 * u, cy - 7 * u, 22 * u, 13 * u, 1.5 * u);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.strokeStyle = "#334155";
  roundRect(ctx, cx - 5 * u, cy + 8 * u, 10 * u, 4 * u, 1 * u);
  ctx.fill();
  ctx.stroke();
  roundRect(ctx, cx - 8 * u, cy + 12 * u, 16 * u, 3 * u, 1 * u);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(cx - 6 * u, cy - 4 * u, 4 * u, 3 * u);
  ctx.fillRect(cx + 1 * u, cy - 2 * u, 5 * u, 2 * u);

  ctx.restore();
}

/** Ground pickup: shovel (/) */
export function drawLegoShovelItem(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
) {
  const cx = screenX + tileWidth / 2;
  const cy = screenY + tileHeight * 0.42;
  const u = tileWidth / 64;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.lineWidth = Math.max(1.5, u);
  ctx.lineCap = "round";
  ctx.strokeStyle = "#92400e";
  ctx.fillStyle = "#cbd5e1";
  ctx.beginPath();
  ctx.moveTo(cx - 8 * u, cy + 6 * u);
  ctx.lineTo(cx + 10 * u, cy - 10 * u);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 10 * u, cy - 10 * u);
  ctx.lineTo(cx + 16 * u, cy - 6 * u);
  ctx.lineTo(cx + 12 * u, cy - 14 * u);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#78350f";
  roundRect(ctx, cx - 11 * u, cy + 4 * u, 6 * u, 10 * u, 1 * u);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** Ground pickup: crowbar / pry bar (() */
export function drawLegoCrowbarItem(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
) {
  const cx = screenX + tileWidth / 2;
  const cy = screenY + tileHeight * 0.44;
  const u = tileWidth / 64;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.lineWidth = Math.max(2, u * 1.1);
  ctx.lineCap = "round";
  ctx.strokeStyle = "#475569";
  ctx.fillStyle = "#334155";
  ctx.beginPath();
  ctx.moveTo(cx - 12 * u, cy + 8 * u);
  ctx.lineTo(cx + 14 * u, cy - 12 * u);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 14 * u, cy - 12 * u);
  ctx.arc(cx + 10 * u, cy - 8 * u, 5 * u, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 12 * u, cy + 8 * u);
  ctx.lineTo(cx - 16 * u, cy + 4 * u);
  ctx.lineTo(cx - 10 * u, cy + 12 * u);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
