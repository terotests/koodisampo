const HIGHLIGHT_MS = 380;
const RETURN_MS = 2600;

type SparkParticle = {
  vx: number;
  vy: number;
  size: number;
  hue: number;
  kind: "star" | "dot" | "ring";
  delay: number;
};

let activeToken = 0;
let revealTimer = 0;
let returnTimer = 0;

function clearQuizChoiceTimers(): void {
  window.clearTimeout(revealTimer);
  window.clearTimeout(returnTimer);
  revealTimer = 0;
  returnTimer = 0;
}

function createSparkParticles(correct: boolean): SparkParticle[] {
  const particles: SparkParticle[] = [];
  const baseHue = correct ? 48 : 0;
  for (let i = 0; i < 18; i += 1) {
    const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.5;
    const speed = 1.2 + Math.random() * 2.2;
    particles.push({
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.1,
      size: 2 + Math.random() * 4,
      hue: baseHue + Math.random() * (correct ? 36 : 18),
      kind: i % 4 === 0 ? "ring" : i % 3 === 0 ? "star" : "dot",
      delay: Math.random() * 80,
    });
  }
  return particles;
}

function spawnQuizFlyLabel(viewportX: number, viewportY: number, correct: boolean): void {
  const amount = correct ? 10 : -5;
  const el = document.createElement("span");
  el.className = correct ? "quiz-fly-label quiz-fly-label-ok" : "quiz-fly-label quiz-fly-label-bad";
  el.textContent = `${amount > 0 ? "+" : ""}${amount} €`;
  el.style.left = `${viewportX}px`;
  el.style.top = `${viewportY}px`;
  document.body.appendChild(el);
  window.requestAnimationFrame(() => {
    el.classList.add("quiz-fly-label-active");
  });
  window.setTimeout(() => el.remove(), 920);
}

function spawnChoiceParticleBurst(anchor: HTMLElement, correct: boolean): void {
  const rect = anchor.getBoundingClientRect();
  const cx = rect.left + rect.width * 0.12;
  const cy = rect.top + rect.height * 0.5;
  const layer = document.createElement("div");
  layer.className = "quiz-choice-particles";
  layer.style.left = `${cx}px`;
  layer.style.top = `${cy}px`;
  document.body.appendChild(layer);

  const particles = createSparkParticles(correct);
  for (const p of particles) {
    const dot = document.createElement("span");
    dot.className = `quiz-choice-particle quiz-choice-particle-${p.kind}`;
    dot.style.setProperty("--vx", `${p.vx * 28}px`);
    dot.style.setProperty("--vy", `${p.vy * 28}px`);
    dot.style.setProperty("--size", `${p.size}px`);
    dot.style.setProperty("--hue", `${p.hue}`);
    dot.style.animationDelay = `${p.delay}ms`;
    layer.appendChild(dot);
  }
  window.setTimeout(() => layer.remove(), 760);
}

export function getQuizFeedbackHighlightMs(): number {
  return HIGHLIGHT_MS;
}

export function getQuizFeedbackReturnMs(): number {
  return RETURN_MS;
}

export function scheduleQuizChoiceFeedback(
  mapEl: HTMLElement | null,
  selectedKey: string,
  correct: boolean,
  onReveal: () => void,
  onComplete: () => void,
): number {
  clearQuizChoiceTimers();
  const token = ++activeToken;

  revealTimer = window.setTimeout(() => {
    if (token !== activeToken) return;
    const row = mapEl?.querySelector<HTMLElement>(`[data-key="${selectedKey}"]`);
    if (row) {
      const rect = row.getBoundingClientRect();
      spawnChoiceParticleBurst(row, correct);
      spawnQuizFlyLabel(rect.left + rect.width * 0.12, rect.top + rect.height * 0.42, correct);
    }
    onReveal();
  }, HIGHLIGHT_MS);

  returnTimer = window.setTimeout(() => {
    if (token !== activeToken) return;
    onComplete();
  }, RETURN_MS);

  return token;
}

export function cancelQuizChoiceFeedback(): void {
  activeToken += 1;
  clearQuizChoiceTimers();
}
