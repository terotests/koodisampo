type FruitPos = { x: number; y: number; glyph: string; amount: number };

type SparkParticle = {
  vx: number;
  vy: number;
  size: number;
  hue: number;
  spin: number;
  kind: "star" | "dot" | "ring";
  delay: number;
};

export type PopBurst = {
  x: number;
  y: number;
  glyph: string;
  amount: number;
  startedAt: number;
  particles: SparkParticle[];
};

type FlyLabel = {
  el: HTMLSpanElement;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  startedAt: number;
};

export function setSalaryHudRefreshHandler(handler: (() => void) | null): void {
  onSalaryHudRefresh = handler;
}

const FRUIT_SALARY_BONUS = 50;
const knownSalaryPickups = new Map<string, FruitPos>();
const pops: PopBurst[] = [];
const flyLabels: FlyLabel[] = [];
let onSalaryHudRefresh: (() => void) | null = null;

const POP_MS = 720;
const FLY_MS = 920;
const MAX_POPS = 8;

function salaryPickupBonus(
  ent: { rewardFruit?: boolean; salaryPickupBonus?: number },
): number {
  if (typeof ent.salaryPickupBonus === "number" && ent.salaryPickupBonus > 0) {
    return ent.salaryPickupBonus;
  }
  if (ent.rewardFruit) return FRUIT_SALARY_BONUS;
  return 0;
}

function createSparkParticles(): SparkParticle[] {
  const particles: SparkParticle[] = [];
  for (let i = 0; i < 22; i += 1) {
    const angle = (Math.PI * 2 * i) / 22 + (Math.random() - 0.5) * 0.55;
    const speed = 1.1 + Math.random() * 2.4;
    particles.push({
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.2,
      size: 2 + Math.random() * 4.5,
      hue: 38 + Math.random() * 42,
      spin: (Math.random() - 0.5) * 0.25,
      kind: i % 5 === 0 ? "ring" : i % 3 === 0 ? "star" : "dot",
      delay: Math.random() * 90,
    });
  }
  return particles;
}

function salaryHudTarget(): { x: number; y: number } | null {
  const el =
    document.querySelector<HTMLElement>("#hud-stats .hud-item.salary") ??
    document.querySelector<HTMLElement>(".stats .salary");
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function pulseSalaryHud(): void {
  const el =
    document.querySelector<HTMLElement>("#hud-stats .hud-item.salary") ??
    document.querySelector<HTMLElement>(".stats .salary");
  if (!el) {
    onSalaryHudRefresh?.();
    return;
  }
  el.classList.remove("salary-reward-pulse");
  void el.offsetWidth;
  el.classList.add("salary-reward-pulse");
  window.setTimeout(() => el.classList.remove("salary-reward-pulse"), 520);
  onSalaryHudRefresh?.();
}

export function spawnSalaryFlyLabel(
  viewportX: number,
  viewportY: number,
  amount = FRUIT_SALARY_BONUS,
): void {
  const target = salaryHudTarget();
  if (!target) return;

  const el = document.createElement("span");
  el.className = "reward-fly-label";
  el.textContent = `+${amount} €`;
  el.style.left = `${viewportX}px`;
  el.style.top = `${viewportY}px`;
  document.body.appendChild(el);

  flyLabels.push({
    el,
    startX: viewportX,
    startY: viewportY,
    targetX: target.x,
    targetY: target.y,
    startedAt: performance.now(),
  });
}

function pruneFlyLabels(now = performance.now()): void {
  while (flyLabels.length > 0) {
    const label = flyLabels[0];
    const t = (now - label.startedAt) / FLY_MS;
    if (t < 1) break;
    label.el.remove();
    flyLabels.shift();
  }
}

export function updateRewardFruitFlyLabels(now = performance.now()): boolean {
  pruneFlyLabels(now);
  let active = false;

  for (const label of flyLabels) {
    const t = Math.min(1, (now - label.startedAt) / FLY_MS);
    active = true;
    const ease = 1 - (1 - t) ** 3;
    const arc = Math.sin(t * Math.PI) * -42;
    const x = label.startX + (label.targetX - label.startX) * ease;
    const y = label.startY + (label.targetY - label.startY) * ease + arc;
    const scale = t < 0.18 ? 0.75 + t * 2.8 : 1.25 - t * 0.45;
    const alpha = t > 0.82 ? 1 - (t - 0.82) / 0.18 : 1;

    label.el.style.left = `${x}px`;
    label.el.style.top = `${y}px`;
    label.el.style.transform = `translate(-50%, -50%) scale(${scale})`;
    label.el.style.opacity = String(Math.max(0, alpha));

    if (t >= 1) {
      label.el.remove();
    }
  }

  if (flyLabels.length > 0 && flyLabels.every((l) => now - l.startedAt >= FLY_MS)) {
    pulseSalaryHud();
    flyLabels.length = 0;
    active = false;
  }

  return active;
}

export function noteRewardFruits(
  entityCells: Array<{ id?: string; rewardFruit?: boolean; salaryPickupBonus?: number; x: number; y: number; glyph?: string }> | undefined,
): PopBurst[] {
  const created: PopBurst[] = [];
  const current = new Map<string, FruitPos>();
  for (const ent of entityCells ?? []) {
    const bonus = salaryPickupBonus(ent);
    if (!ent.id || bonus <= 0) continue;
    current.set(ent.id, { x: ent.x, y: ent.y, glyph: ent.glyph ?? "🍎", amount: bonus });
  }
  for (const [id, pos] of knownSalaryPickups) {
    if (current.has(id)) continue;
    const pop: PopBurst = {
      x: pos.x,
      y: pos.y,
      glyph: pos.glyph,
      amount: pos.amount,
      startedAt: performance.now(),
      particles: createSparkParticles(),
    };
    pops.push(pop);
    created.push(pop);
    while (pops.length > MAX_POPS) pops.shift();
  }
  knownSalaryPickups.clear();
  for (const [id, pos] of current) {
    knownSalaryPickups.set(id, pos);
  }
  if (created.length > 0) {
    onSalaryHudRefresh?.();
  }
  return created;
}

function pruneRewardFruitPops(now = performance.now()): void {
  while (pops.length > 0 && now - pops[0].startedAt > POP_MS) {
    pops.shift();
  }
}

export function activeRewardFruitPops(now = performance.now()): PopBurst[] {
  pruneRewardFruitPops(now);
  return pops;
}

export function hasActiveRewardFruitEffects(now = performance.now()): boolean {
  pruneRewardFruitPops(now);
  pruneFlyLabels(now);
  return pops.length > 0 || flyLabels.length > 0;
}

export function rewardFruitOpacity(
  ent: { rewardFruit?: boolean; fruitExpireMinute?: number },
  clockMinutes: number,
): number {
  if (!ent.rewardFruit) return 1;
  const expire = ent.fruitExpireMinute ?? 0;
  if (expire <= 0) return 1;
  const remaining = expire - clockMinutes;
  if (remaining <= 0) return 0.12;
  if (remaining <= 5) return Math.max(0.2, remaining / 5);
  return 1;
}

function drawOutlinedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fill: string,
  stroke: string,
  fontSize: number,
  alpha: number,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `900 ${fontSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = Math.max(3, fontSize * 0.16);
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawStarParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  hue: number,
  alpha: number,
  rotation: number,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = `hsla(${hue}, 95%, 78%, 1)`;
  ctx.beginPath();
  for (let i = 0; i < 4; i += 1) {
    const a = (Math.PI / 2) * i;
    ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size * 0.35);
    ctx.lineTo(Math.cos(a + Math.PI / 4) * size * 0.25, Math.sin(a + Math.PI / 4) * size * 0.12);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPopParticles(
  ctx: CanvasRenderingContext2D,
  pop: PopBurst,
  centerX: number,
  centerY: number,
  tileWidth: number,
  now: number,
): void {
  const elapsed = now - pop.startedAt;
  for (const p of pop.particles) {
    const life = elapsed - p.delay;
    if (life <= 0 || life > 520) continue;
    const t = life / 520;
    const alpha = (1 - t) * (1 - t);
    const px = centerX + p.vx * life * 0.11;
    const py = centerY + p.vy * life * 0.11 + t * t * tileWidth * 0.08;

    if (p.kind === "star") {
      drawStarParticle(ctx, px, py, p.size, p.hue, alpha, life * p.spin);
      continue;
    }
    if (p.kind === "ring") {
      ctx.save();
      ctx.globalAlpha = alpha * 0.85;
      ctx.strokeStyle = `hsla(${p.hue}, 100%, 82%, 1)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px, py, p.size + t * 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      continue;
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `hsla(${p.hue}, 100%, 88%, 1)`;
    ctx.beginPath();
    ctx.arc(px, py, p.size * (1 - t * 0.35), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function drawRewardFruitPop(
  ctx: CanvasRenderingContext2D,
  pop: PopBurst,
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
  now = performance.now(),
): void {
  const t = Math.min(1, (now - pop.startedAt) / POP_MS);
  const centerX = screenX + tileWidth / 2;
  const centerY = screenY + tileHeight * 0.22;
  const scale = 1 + t * 0.65;
  const alpha = 1 - t * t;

  ctx.save();
  ctx.globalAlpha = (1 - t) * 0.55;
  ctx.fillStyle = "rgba(255, 230, 120, 0.55)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = 2;
  const flashR = tileWidth * (0.18 + t * 0.42);
  ctx.beginPath();
  ctx.arc(centerX, centerY, flashR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  drawPopParticles(ctx, pop, centerX, centerY, tileWidth, now);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `${Math.max(18, tileWidth * 0.55 * scale)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", emoji, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(pop.glyph, centerX, centerY - t * tileHeight * 0.28);
  ctx.restore();

  if (t < 0.42) {
    const labelT = t / 0.42;
    const labelAlpha = 1 - labelT * 0.35;
    const labelSize = Math.max(16, tileWidth * (0.34 + labelT * 0.12));
    drawOutlinedText(
      ctx,
      `+${pop.amount} €`,
      centerX,
      centerY - tileHeight * 0.42 - labelT * tileHeight * 0.08,
      "#3fb950",
      "#ffffff",
      labelSize,
      labelAlpha,
    );
  }
}
