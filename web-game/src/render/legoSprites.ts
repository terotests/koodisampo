/** Canvas-drawn Lego-style minifig, tools, and item props for the isometric map. */

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

/** Blocky Lego minifig with direction and walk stride. */
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
  const cx = screenX + tileWidth / 2;
  const footY = screenY + tileHeight * 0.72;
  const u = tileWidth / 64;
  const stride = walkFrame === 1 ? 2 * u : 0;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const legW = 7 * u;
  const legH = 10 * u;
  const legGap = 1.5 * u;
  ctx.fillStyle = "#2563eb";
  ctx.strokeStyle = "#1e3a8a";
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
  ctx.fillStyle = "#f59e0b";
  ctx.strokeStyle = "#b45309";
  roundRect(ctx, cx - torsoW / 2, torsoY, torsoW, torsoH, 2 * u);
  ctx.fill();
  ctx.stroke();
  drawStud(ctx, cx, torsoY + 3 * u, 2 * u);
  ctx.fillStyle = "#fcd34d";
  ctx.strokeStyle = "#ca8a04";
  ctx.fill();
  ctx.stroke();

  const headR = 6.5 * u;
  const headCy = torsoY - headR + 3 * u;
  ctx.fillStyle = "#fbbf24";
  ctx.strokeStyle = "#d97706";
  ctx.beginPath();
  ctx.arc(cx, headCy, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  drawStud(ctx, cx, headCy - headR * 0.55, 2.2 * u);
  ctx.fillStyle = "#fde68a";
  ctx.strokeStyle = "#ca8a04";
  ctx.fill();
  ctx.stroke();

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

  if (activeTool === "shovel" || activeTool === "crowbar") {
    drawHandTool(ctx, cx, torsoY + torsoH * 0.35, u, facing, activeTool);
  }

  ctx.restore();
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

/** Ground pickup: crowbar / pry bar (() — user-facing "pora" in some contexts */
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
