export type RenderThemeId =
  | "orange"
  | "emerald"
  | "ocean"
  | "violet"
  | "rose"
  | "slate";

const STORAGE_KEY = "koodisampo-render-theme";

export const RENDER_THEMES: { id: RenderThemeId; label: string; filter: string }[] = [
  { id: "orange", label: "Oranssi", filter: "none" },
  { id: "emerald", label: "Vihreä", filter: "hue-rotate(88deg) saturate(1.05)" },
  { id: "ocean", label: "Sininen", filter: "hue-rotate(168deg) saturate(1.08)" },
  { id: "violet", label: "Violetti", filter: "hue-rotate(238deg) saturate(1.05)" },
  { id: "rose", label: "Ruusu", filter: "hue-rotate(310deg) saturate(1.08)" },
  { id: "slate", label: "Harmaa", filter: "saturate(0.22) brightness(1.08)" },
];

export function readStoredRenderTheme(): RenderThemeId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (RENDER_THEMES.some((t) => t.id === raw)) return raw as RenderThemeId;
  } catch {
    /* ignore */
  }
  return "orange";
}

export function renderThemeFilter(id: RenderThemeId = readStoredRenderTheme()): string {
  return RENDER_THEMES.find((t) => t.id === id)?.filter ?? "none";
}

export function shouldTintIsoAsset(key: string): boolean {
  return !key.startsWith("Characters__");
}

export function applyRenderTheme(id: RenderThemeId): void {
  document.documentElement.dataset.renderTheme = id;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
  document.querySelectorAll<HTMLElement>(".iso-map-host").forEach((el) => {
    delete el.dataset.isoSig;
    delete el.dataset.isoSized;
  });
  document.dispatchEvent(new CustomEvent("koodisampo-render-theme-change"));
}

export function initRenderTheme(): void {
  applyRenderTheme(readStoredRenderTheme());
}

export function mountRenderThemePicker(root: ParentNode = document): void {
  const select = root.querySelector<HTMLSelectElement>("#render-theme-select");
  if (!select) return;

  select.innerHTML = RENDER_THEMES.map(
    (t) => `<option value="${t.id}">${t.label}</option>`,
  ).join("");
  select.value = readStoredRenderTheme();

  select.addEventListener("change", () => {
    const next = select.value as RenderThemeId;
    if (RENDER_THEMES.some((t) => t.id === next)) applyRenderTheme(next);
  });
}
