/** Mobile layout helpers — compact map viewport and touch controls. */

import { mapLineDisplayWidth, splitMapGraphemes } from "../../hosts/shared/mapGlyphs.mjs";

export const MOBILE_MAP_SIZE = 19;

/** Match CSS @media (max-width: …) in index.html */
export const MOBILE_BREAKPOINT_PX = 768;

let forceMobile: boolean | null = null;

/** Readable viewport width (DevTools device frame, not always === innerWidth). */
export function viewportWidth(): number {
  const vv = window.visualViewport;
  if (vv && vv.width > 0) {
    return Math.round(vv.width);
  }
  const docW = document.documentElement.clientWidth;
  if (docW > 0) {
    return docW;
  }
  return window.innerWidth;
}

export function initMobileLayoutOptions() {
  const mobileParam = new URLSearchParams(window.location.search).get("mobile");
  if (mobileParam === "1" || mobileParam === "true") {
    forceMobile = true;
  } else if (mobileParam === "0" || mobileParam === "false") {
    forceMobile = false;
  }
}

export function isMobileLayout(): boolean {
  if (forceMobile === true) {
    return true;
  }
  if (forceMobile === false) {
    return false;
  }
  if (viewportWidth() <= MOBILE_BREAKPOINT_PX) {
    return true;
  }
  if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches) {
    return true;
  }
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

export function cropMapLines(lines: string[], size = MOBILE_MAP_SIZE): string[] {
  if (!lines?.length) return lines;

  let py = -1;
  let px = -1;
  for (let y = 0; y < lines.length; y += 1) {
    const cells = splitMapGraphemes(lines[y]);
    const x = cells.indexOf("@");
    if (x >= 0) {
      py = y;
      px = x;
      break;
    }
  }
  if (py < 0) return lines;

  const half = Math.floor(size / 2);
  const out: string[] = [];
  for (let dy = -half; dy <= half; dy += 1) {
    const row = lines[py + dy];
    if (!row) {
      out.push(" ".repeat(size));
      continue;
    }
    const cells = splitMapGraphemes(row);
    let slice = "";
    for (let dx = 0; dx < size; dx += 1) {
      const ci = px - half + dx;
      slice += ci >= 0 && ci < cells.length ? cells[ci] : " ";
    }
    out.push(slice);
  }
  return out;
}

type HudState = {
  deaths?: number;
  karma?: number;
  time?: string;
  floorTitle?: string;
  policeChase?: boolean;
  status?: string;
  ambient?: string;
  actionLine?: string;
  hint?: string;
  floorRecommendation?: { total?: number; done?: number; complete?: boolean };
};

export function actionLineFromState(state: HudState): string {
  if (state.actionLine) return state.actionLine;
  const status = String(state.status ?? "").trim();
  const ambient = String(state.ambient ?? "").trim();
  return status || ambient;
}

export function renderHudStats(el: HTMLElement | null, state: HudState, esc: (s: unknown) => string) {
  if (!el) return;
  const time = state.time ? `<span class="hud-time">${esc(state.time)}</span>` : "";
  const floor = state.floorTitle ? `<span class="hud-floor">${esc(state.floorTitle)}</span>` : "";
  const police = state.policeChase ? `<span class="hud-warn">POLIISIT</span>` : "";
  el.innerHTML =
    `<span class="hud-item">☠ ${state.deaths ?? 0}</span>` +
    `<span class="hud-item karma">✨ ${state.karma ?? 0}</span>` +
    time +
    floor +
    police;
}

export function renderMessageBar(el: HTMLElement | null, state: HudState, esc: (s: unknown) => string) {
  if (!el) return;
  const parts: string[] = [];
  if (state.floorTitle) parts.push(state.floorTitle);
  if (state.time) parts.push(state.time);
  const fr = state.floorRecommendation;
  if (fr && fr.total > 0 && !fr.complete) {
    parts.push(`Suositukset: ${fr.done}/${fr.total}`);
  }
  const msg = parts.join(" · ");
  el.textContent = msg;
  el.hidden = !msg;
}

export function renderActionBar(el: HTMLElement | null, state: HudState) {
  if (!el) return;
  const msg = actionLineFromState(state);
  el.textContent = msg;
  el.hidden = !msg;
}

type ToolbarBtn = { key: string; label: string; cls?: string; action?: () => void };

export type ElevatorFloorBtn = {
  key: string;
  title: string;
  current?: boolean;
  hasElevator?: boolean;
};

export type MobileMapToolbarOptions = {
  onElevator?: boolean;
  floors?: ElevatorFloorBtn[];
  pickerCollapsed?: boolean;
  onExpandPicker?: () => void;
};

const ACTION_BUTTONS: ToolbarBtn[] = [
  { key: "e", label: "Käytä" },
  { key: "t", label: "Työkalu" },
  { key: "x", label: "Kaiva" },
  { key: "h", label: "Piiloudu" },
  { key: "i", label: "Invent." },
  { key: "b", label: "Opisk." },
  { key: "?", label: "Valikko" },
  { key: "reset", label: "↺", cls: "danger" },
];

let controlsMounted = false;
let lastElevatorUiKey = "";
let mobileElevatorEl: HTMLElement | null = null;

function getMobileElevatorEl(): HTMLElement | null {
  if (!mobileElevatorEl) {
    mobileElevatorEl = document.getElementById("mobile-elevator");
  }
  return mobileElevatorEl;
}

function bindDelegatedClickOnce(root: HTMLElement, onKey: (key: string) => void, onReset: () => void) {
  if (root.dataset.keyDelegation === "1") return;
  root.dataset.keyDelegation = "1";
  root.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const btn = target.closest<HTMLElement>("[data-key]");
    if (!btn || !root.contains(btn)) return;
    const key = btn.dataset.key;
    if (!key) return;
    e.preventDefault();
    if (key === "reset") onReset();
    else onKey(key);
  });
}

function buildDpad(dpadEl: HTMLElement) {
  dpadEl.className = "mobile-dpad";
  dpadEl.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "dpad";
  const slots: (ToolbarBtn | null)[][] = [
    [null, { key: "w", label: "↑" }, null],
    [
      { key: "a", label: "←" },
      { key: "s", label: "↓" },
      { key: "d", label: "→" },
    ],
  ];
  for (const row of slots) {
    for (const spec of row) {
      if (!spec) {
        grid.appendChild(document.createElement("span"));
        continue;
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dpad-btn";
      btn.dataset.key = spec.key;
      btn.textContent = spec.label;
      grid.appendChild(btn);
    }
  }
  dpadEl.appendChild(grid);
}

function ensureActionRow(toolbarEl: HTMLElement) {
  let row = toolbarEl.querySelector<HTMLElement>("[data-action-row]");
  if (row) return row;
  row = document.createElement("div");
  row.className = "action-row";
  row.dataset.actionRow = "1";
  for (const spec of ACTION_BUTTONS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.key = spec.key;
    btn.textContent = spec.label;
    if (spec.cls) btn.className = spec.cls;
    row.appendChild(btn);
  }
  toolbarEl.appendChild(row);
  return row;
}

export function mountMobileControls(
  toolbarEl: HTMLElement,
  dpadEl: HTMLElement,
  onKey: (key: string) => void,
  onReset: () => void,
) {
  if (controlsMounted && toolbarEl.querySelector("[data-action-row]")) return;
  controlsMounted = true;
  lastElevatorUiKey = "";

  buildDpad(dpadEl);
  bindDelegatedClickOnce(dpadEl, onKey, onReset);

  toolbarEl.className = "toolbar toolbar-mobile";
  toolbarEl.innerHTML = "";
  ensureActionRow(toolbarEl);
  bindDelegatedClickOnce(toolbarEl, onKey, onReset);

  const elevEl = getMobileElevatorEl();
  if (elevEl) {
    bindDelegatedClickOnce(elevEl, onKey, onReset);
  }
}

export function setMobileDpadVisible(dpadEl: HTMLElement | null, visible: boolean) {
  if (!dpadEl) return;
  dpadEl.hidden = !visible;
}

export function setMobilePlayView(active: boolean) {
  const wrap = document.getElementById("map-wrap");
  if (!wrap) return;
  wrap.classList.toggle("map-play-view", active);
}

function renderElevatorSlot(slot: HTMLElement, elevator: MobileMapToolbarOptions, onExpand?: () => void) {
  slot.innerHTML = "";
  if (elevator.onElevator && elevator.pickerCollapsed) {
    const expandBtn = document.createElement("button");
    expandBtn.type = "button";
    expandBtn.className = "elevator-expand";
    expandBtn.textContent = "Hissi — vaihda kerros";
    expandBtn.addEventListener("click", (e) => {
      e.preventDefault();
      onExpand?.();
    });
    slot.appendChild(expandBtn);
    return;
  }
  if (elevator.onElevator && elevator.floors?.length && !elevator.pickerCollapsed) {
    const label = document.createElement("div");
    label.className = "elevator-label";
    label.textContent = "Hissi — valitse kerros";
    slot.appendChild(label);

    const elevGrid = document.createElement("div");
    elevGrid.className = "elevator-grid";
    const rowCount = Math.ceil(elevator.floors.length / 5);
    for (let row = 0; row < rowCount; row += 1) {
      const elevRow = document.createElement("div");
      elevRow.className = "elevator-row";
      const slice = elevator.floors.slice(row * 5, row * 5 + 5);
      for (const floor of slice) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "elevator-btn";
        btn.dataset.key = floor.key;
        if (floor.current) btn.classList.add("current");
        if (floor.hasElevator === false) btn.classList.add("disabled");
        btn.textContent = floor.key;
        btn.title = floor.title;
        elevRow.appendChild(btn);
      }
      elevGrid.appendChild(elevRow);
    }
    slot.appendChild(elevGrid);
  }
}

export function clearMobileElevator() {
  const elevEl = getMobileElevatorEl();
  if (elevEl) {
    elevEl.hidden = true;
    elevEl.innerHTML = "";
  }
  document.documentElement.classList.remove("elevator-open");
  lastElevatorUiKey = "";
}

export function updateMobileMapToolbar(
  _toolbarEl: HTMLElement,
  elevator?: MobileMapToolbarOptions,
  onExpandPicker?: () => void,
) {
  const elevEl = getMobileElevatorEl();
  if (!elevEl) return;

  const onElevator = Boolean(elevator?.onElevator);
  const showElevatorPicker = Boolean(onElevator && !elevator?.pickerCollapsed);
  elevEl.hidden = !onElevator;
  document.documentElement.classList.toggle("elevator-open", showElevatorPicker);

  const uiKey = `${onElevator ? "1" : "0"}-${elevator?.pickerCollapsed ? "1" : "0"}-${showElevatorPicker ? elevator?.floors?.length : 0}`;
  if (uiKey === lastElevatorUiKey) return;
  lastElevatorUiKey = uiKey;

  if (elevator) {
    renderElevatorSlot(elevEl, elevator, onExpandPicker);
  } else {
    elevEl.innerHTML = "";
  }
}

export function setMobileToolbar(
  toolbarEl: HTMLElement,
  buttons: ToolbarBtn[],
  onKey: (key: string) => void,
  onReset: () => void,
) {
  controlsMounted = false;
  lastElevatorUiKey = "";
  document.documentElement.classList.remove("elevator-open");
  toolbarEl.className = "toolbar toolbar-mobile toolbar-stack";
  toolbarEl.innerHTML = "";
  for (const spec of buttons) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = spec.label;
    btn.dataset.key = spec.key;
    if (spec.cls) btn.className = spec.cls;
    btn.addEventListener("click", () => {
      if (spec.action) {
        spec.action();
        return;
      }
      if (spec.key === "reset") onReset();
      else onKey(spec.key);
    });
    toolbarEl.appendChild(btn);
  }
}

export function resetMobileControlsMount() {
  controlsMounted = false;
  lastElevatorUiKey = "";
}

export function syncMobileClass() {
  document.documentElement.classList.toggle("mobile-layout", isMobileLayout());
}

export function watchViewportLayout(onChange: () => void): () => void {
  const handler = () => {
    syncMobileClass();
    onChange();
  };
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`);
  mql.addEventListener("change", handler);
  window.addEventListener("resize", handler);
  window.addEventListener("orientationchange", handler);
  window.visualViewport?.addEventListener("resize", handler);
  return () => {
    mql.removeEventListener("change", handler);
    window.removeEventListener("resize", handler);
    window.removeEventListener("orientationchange", handler);
    window.visualViewport?.removeEventListener("resize", handler);
  };
}

export function syncMobileMapScale(lines: string[], anchor?: HTMLElement | null) {
  if (!isMobileLayout() || !lines?.length) {
    document.documentElement.style.removeProperty("--map-cols");
    document.documentElement.style.removeProperty("--map-rows");
    document.documentElement.style.removeProperty("--map-cell-px");
    return;
  }
  const cols = Math.max(...lines.map((line) => mapLineDisplayWidth(line)), 1);
  const rows = lines.length;
  const viewportW = anchor?.clientWidth
    || document.getElementById("map-wrap")?.clientWidth
    || viewportWidth();
  const viewportH = window.innerHeight;
  const messageBar = document.getElementById("message-bar");
  const messageBarH = messageBar && !messageBar.hidden ? messageBar.offsetHeight : 0;
  const actionBar = document.getElementById("action-bar");
  const actionBarH = actionBar && !actionBar.hidden ? actionBar.offsetHeight : 0;
  const elevEl = getMobileElevatorEl();
  const elevatorH = elevEl && !elevEl.hidden ? elevEl.offsetHeight : 0;
  const chromeH = 230 + messageBarH + actionBarH + elevatorH;
  const byWidth = viewportW / cols;
  const byHeight = Math.max((viewportH - chromeH) / rows / 1.05, 8);
  const cellPx = Math.min(byWidth, byHeight);
  document.documentElement.style.setProperty("--map-cols", String(cols));
  document.documentElement.style.setProperty("--map-rows", String(rows));
  document.documentElement.style.setProperty("--map-cell-px", `${cellPx}px`);
}

export function setMobileToolbarVisible(toolbarEl: HTMLElement | null, visible: boolean) {
  if (!toolbarEl) return;
  toolbarEl.hidden = !visible;
  document.documentElement.classList.toggle("mobile-toolbar-hidden", !visible);
}

export function setMobileTextChoiceMode(active: boolean) {
  document.documentElement.classList.toggle("mobile-text-choices", active);
}
