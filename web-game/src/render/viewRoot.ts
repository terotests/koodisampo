import { ensureChild, patchInnerHtml } from "./domPatch";

const SCROLL_ROOT_SEL = "[data-scroll-root]";
const MAP_SHELL_SEL = "[data-map-shell]";
const MAP_HEADER_SEL = "[data-map-header]";
const MAP_GRID_SEL = "[data-map-grid]";
const MAP_HINT_SEL = "[data-map-hint]";

export function ensureScrollRoot(mapEl: HTMLElement): HTMLElement {
  mapEl.classList.add("encounter-view");
  return ensureChild(mapEl, SCROLL_ROOT_SEL, () => {
    const root = document.createElement("div");
    root.className = "map-scroll";
    root.dataset.scrollRoot = "1";
    return root;
  });
}

export function setScrollContent(mapEl: HTMLElement, html: string) {
  const root = ensureScrollRoot(mapEl);
  patchInnerHtml(root, html);
}

export function ensureMapShell(mapEl: HTMLElement): {
  header: HTMLElement;
  grid: HTMLPreElement;
  hint: HTMLElement;
} {
  mapEl.classList.remove("encounter-view");
  const shell = ensureChild(mapEl, MAP_SHELL_SEL, () => {
    const wrap = document.createElement("div");
    wrap.dataset.mapShell = "1";

    const header = document.createElement("div");
    header.dataset.mapHeader = "1";
    wrap.appendChild(header);

    const grid = document.createElement("pre");
    grid.className = "map-grid";
    grid.dataset.mapGrid = "1";
    wrap.appendChild(grid);

    const hint = document.createElement("div");
    hint.className = "hint";
    hint.dataset.mapHint = "1";
    hint.style.marginTop = "12px";
    wrap.appendChild(hint);

    return wrap;
  });

  return {
    header: ensureChild(shell, MAP_HEADER_SEL, () => {
      const el = document.createElement("div");
      el.dataset.mapHeader = "1";
      return el;
    }),
    grid: ensureChild(shell, MAP_GRID_SEL, () => {
      const el = document.createElement("pre");
      el.className = "map-grid";
      el.dataset.mapGrid = "1";
      return el;
    }) as HTMLPreElement,
    hint: ensureChild(shell, MAP_HINT_SEL, () => {
      const el = document.createElement("div");
      el.className = "hint";
      el.dataset.mapHint = "1";
      el.style.marginTop = "12px";
      return el;
    }),
  };
}

export function clearMapView(mapEl: HTMLElement) {
  mapEl.classList.remove("encounter-view");
  mapEl.innerHTML = "";
}
