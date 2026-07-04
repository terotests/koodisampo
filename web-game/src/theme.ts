export type ThemeId = "slate-light" | "slate" | "slate-dark";

const STORAGE_KEY = "koodisampo-theme";

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: "slate-light", label: "Vaalea siniharmaa" },
  { id: "slate", label: "Keskisiniharmaa" },
  { id: "slate-dark", label: "Tumma siniharmaa" },
];

export function readStoredTheme(): ThemeId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "slate-light" || raw === "slate" || raw === "slate-dark") return raw;
  } catch {
    /* ignore */
  }
  return "slate";
}

export function applyTheme(id: ThemeId): void {
  document.documentElement.dataset.theme = id;
  document.querySelectorAll<HTMLElement>(".iso-map-host").forEach((el) => {
    delete el.dataset.isoSig;
    delete el.dataset.isoSized;
  });
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
  document.dispatchEvent(new CustomEvent("koodisampo-theme-change"));
}

export function themeBackgroundColor(): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
  return value || "#121a26";
}

export function initTheme(): void {
  applyTheme(readStoredTheme());
}

export function mountThemePicker(root: ParentNode = document): void {
  const select = root.querySelector<HTMLSelectElement>("#theme-select");
  if (!select) return;

  select.innerHTML = THEMES.map(
    (t) => `<option value="${t.id}">${t.label}</option>`,
  ).join("");
  select.value = readStoredTheme();

  select.addEventListener("change", () => {
    const next = select.value as ThemeId;
    if (THEMES.some((t) => t.id === next)) applyTheme(next);
  });
}
