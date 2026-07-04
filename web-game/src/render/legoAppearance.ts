/** Lego minifig color palettes by role, profession topic, and gender. */

export type LegoPartColors = {
  fill: string;
  stroke: string;
  stud?: string;
  studStroke?: string;
};

export type LegoAppearance = {
  legs: LegoPartColors;
  torso: LegoPartColors;
  head: LegoPartColors;
  /** Female minifigs get a hair cap on the head. */
  hair?: boolean;
  /** Small accessory drawn on the torso or head. */
  accessory?: "badge" | "tie" | "headset";
};

export type EntityAppearanceInput = {
  gender?: string;
  roleKey?: string;
  topic?: string;
  kind?: string;
  id?: string;
  glyph?: string;
};

const MALE_TOPIC_PALETTES: LegoAppearance[] = [
  {
    legs: { fill: "#15803d", stroke: "#14532d" },
    torso: { fill: "#22c55e", stroke: "#15803d", stud: "#86efac", studStroke: "#15803d" },
    head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
  },
  {
    legs: { fill: "#1d4ed8", stroke: "#1e3a8a" },
    torso: { fill: "#3b82f6", stroke: "#1d4ed8", stud: "#93c5fd", studStroke: "#1d4ed8" },
    head: { fill: "#fcd34d", stroke: "#ca8a04", stud: "#fef08a", studStroke: "#ca8a04" },
  },
  {
    legs: { fill: "#7c2d12", stroke: "#431407" },
    torso: { fill: "#ea580c", stroke: "#9a3412", stud: "#fdba74", studStroke: "#9a3412" },
    head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
  },
  {
    legs: { fill: "#334155", stroke: "#0f172a" },
    torso: { fill: "#64748b", stroke: "#334155", stud: "#cbd5e1", studStroke: "#334155" },
    head: { fill: "#fcd34d", stroke: "#ca8a04", stud: "#fef08a", studStroke: "#ca8a04" },
  },
  {
    legs: { fill: "#6d28d9", stroke: "#4c1d95" },
    torso: { fill: "#8b5cf6", stroke: "#6d28d9", stud: "#c4b5fd", studStroke: "#6d28d9" },
    head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
  },
];

const FEMALE_TOPIC_PALETTES: LegoAppearance[] = [
  {
    legs: { fill: "#be185d", stroke: "#831843" },
    torso: { fill: "#ec4899", stroke: "#be185d", stud: "#fbcfe8", studStroke: "#be185d" },
    head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
    hair: true,
  },
  {
    legs: { fill: "#0e7490", stroke: "#164e63" },
    torso: { fill: "#06b6d4", stroke: "#0e7490", stud: "#a5f3fc", studStroke: "#0e7490" },
    head: { fill: "#fcd34d", stroke: "#ca8a04", stud: "#fef08a", studStroke: "#ca8a04" },
    hair: true,
  },
  {
    legs: { fill: "#a21caf", stroke: "#701a75" },
    torso: { fill: "#d946ef", stroke: "#a21caf", stud: "#f5d0fe", studStroke: "#a21caf" },
    head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
    hair: true,
  },
  {
    legs: { fill: "#047857", stroke: "#064e3b" },
    torso: { fill: "#10b981", stroke: "#047857", stud: "#6ee7b7", studStroke: "#047857" },
    head: { fill: "#fcd34d", stroke: "#ca8a04", stud: "#fef08a", studStroke: "#ca8a04" },
    hair: true,
  },
  {
    legs: { fill: "#b45309", stroke: "#78350f" },
    torso: { fill: "#f59e0b", stroke: "#b45309", stud: "#fcd34d", studStroke: "#b45309" },
    head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
    hair: true,
  },
];

const ROLE_APPEARANCE: Record<string, LegoAppearance> = {
  reception: {
    legs: { fill: "#1e293b", stroke: "#0f172a" },
    torso: { fill: "#e2e8f0", stroke: "#64748b", stud: "#f8fafc", studStroke: "#64748b" },
    head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
    hair: true,
    accessory: "headset",
  },
  janitor: {
    legs: { fill: "#365314", stroke: "#1a2e05" },
    torso: { fill: "#84cc16", stroke: "#365314", stud: "#bef264", studStroke: "#365314" },
    head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
  },
  ceo: {
    legs: { fill: "#171717", stroke: "#0a0a0a" },
    torso: { fill: "#fafafa", stroke: "#525252", stud: "#e5e5e5", studStroke: "#525252" },
    head: { fill: "#fcd34d", stroke: "#ca8a04", stud: "#fef08a", studStroke: "#ca8a04" },
    accessory: "tie",
  },
  guru: {
    legs: { fill: "#581c87", stroke: "#3b0764" },
    torso: { fill: "#a855f7", stroke: "#7e22ce", stud: "#e9d5ff", studStroke: "#7e22ce" },
    head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
  },
  security: {
    legs: { fill: "#1e3a8a", stroke: "#172554" },
    torso: { fill: "#1d4ed8", stroke: "#1e3a8a", stud: "#60a5fa", studStroke: "#1e3a8a" },
    head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
    accessory: "badge",
  },
  police: {
    legs: { fill: "#1e3a8a", stroke: "#172554" },
    torso: { fill: "#2563eb", stroke: "#1e40af", stud: "#93c5fd", studStroke: "#1e40af" },
    head: { fill: "#fcd34d", stroke: "#ca8a04", stud: "#fef08a", studStroke: "#ca8a04" },
    accessory: "badge",
  },
  hostile: {
    legs: { fill: "#7f1d1d", stroke: "#450a0a" },
    torso: { fill: "#dc2626", stroke: "#991b1b", stud: "#fca5a5", studStroke: "#991b1b" },
    head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
  },
  staff: {
    legs: { fill: "#475569", stroke: "#1e293b" },
    torso: { fill: "#94a3b8", stroke: "#475569", stud: "#e2e8f0", studStroke: "#475569" },
    head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
  },
};

export const DEFAULT_PLAYER_APPEARANCE: LegoAppearance = {
  legs: { fill: "#2563eb", stroke: "#1e3a8a" },
  torso: { fill: "#f59e0b", stroke: "#b45309", stud: "#fcd34d", studStroke: "#ca8a04" },
  head: { fill: "#fbbf24", stroke: "#d97706", stud: "#fde68a", studStroke: "#ca8a04" },
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function appearanceRoleKey(input: EntityAppearanceInput): string {
  const id = input.id ?? "";
  if (id === "receptionist") return "reception";
  if (id === "office-dog") return "dog";
  if (input.kind === "pet") return "dog";
  if (input.kind === "guru") return "guru";
  if (input.kind === "security") return "security";
  if (input.kind === "police") return "police";
  if (input.kind === "hostile") return "hostile";
  if (id === "janitor") return "janitor";
  if (input.glyph === "C" || id.startsWith("ceo-")) return "ceo";
  if (input.kind === "role") return "staff";
  if (input.kind === "coworker" && input.topic) return `topic:${input.topic}`;
  if (input.kind === "coworker") return "coworker";
  return "default";
}

export type LegoEntityKind = "minifig" | "dog" | "tv" | "reception";

export function resolveLegoEntityKind(input: EntityAppearanceInput): LegoEntityKind {
  const roleKey = input.roleKey ?? appearanceRoleKey(input);
  if (roleKey === "dog") return "dog";
  if (input.glyph === "🖥️" || input.glyph === "📺") return "tv";
  if (roleKey === "reception") return "reception";
  return "minifig";
}

export function resolveLegoAppearance(input: EntityAppearanceInput): LegoAppearance {
  const roleKey = input.roleKey ?? appearanceRoleKey(input);
  const fixed = ROLE_APPEARANCE[roleKey];
  if (fixed) {
    const gender = input.gender === "F" ? "F" : "M";
    if (gender === "F" && !fixed.hair && roleKey !== "ceo" && roleKey !== "janitor") {
      return { ...fixed, hair: true };
    }
    return fixed;
  }

  const gender = input.gender === "F" ? "F" : "M";
  const palettes = gender === "F" ? FEMALE_TOPIC_PALETTES : MALE_TOPIC_PALETTES;
  const seed = input.topic || input.id || input.glyph || "coworker";
  return palettes[hashString(seed) % palettes.length]!;
}
