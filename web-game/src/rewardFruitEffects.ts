type FruitPos = { x: number; y: number; glyph: string };

type PopBurst = {
  x: number;
  y: number;
  glyph: string;
  startedAt: number;
};

const knownFruits = new Map<string, FruitPos>();
const pops: PopBurst[] = [];

const POP_MS = 480;

export function noteRewardFruits(
  entityCells: Array<{ id?: string; rewardFruit?: boolean; x: number; y: number; glyph?: string }> | undefined,
): void {
  const current = new Map<string, FruitPos>();
  for (const ent of entityCells ?? []) {
    if (!ent.rewardFruit || !ent.id) continue;
    current.set(ent.id, { x: ent.x, y: ent.y, glyph: ent.glyph ?? "🍎" });
  }
  for (const [id, pos] of knownFruits) {
    if (current.has(id)) continue;
    pops.push({ x: pos.x, y: pos.y, glyph: pos.glyph, startedAt: performance.now() });
  }
  knownFruits.clear();
  for (const [id, pos] of current) {
    knownFruits.set(id, pos);
  }
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
  const scale = 1 + t * 0.55;
  const alpha = 1 - t;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `${Math.max(18, tileWidth * 0.55 * scale)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", emoji, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(pop.glyph, screenX + tileWidth / 2, screenY + tileHeight * 0.2 - t * tileHeight * 0.25);
  ctx.restore();
}
