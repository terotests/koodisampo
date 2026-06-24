/** Mobile layout helpers — compact map viewport and touch controls. */

export const MOBILE_MAP_SIZE = 19;

export function isMobileLayout(): boolean {
  return window.matchMedia("(max-width: 768px)").matches;
}

export function cropMapLines(lines: string[], size = MOBILE_MAP_SIZE): string[] {
  if (!lines?.length) return lines;

  let py = -1;
  let px = -1;
  for (let y = 0; y < lines.length; y += 1) {
    const x = lines[y].indexOf("@");
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
    const start = px - half;
    let slice = "";
    for (let dx = 0; dx < size; dx += 1) {
      const ci = start + dx;
      slice += ci >= 0 && ci < row.length ? row[ci] : " ";
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
  hint?: string;
  floorRecommendation?: { total?: number; done?: number; complete?: boolean };
};

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
  let msg = state.status || state.ambient || "";
  if (!msg && !isMobileLayout()) {
    msg = state.hint || "";
  }
  const fr = state.floorRecommendation;
  if (fr && fr.total > 0 && !fr.complete) {
    const rec = `Suositukset: ${fr.done}/${fr.total}`;
    msg = msg ? `${msg} · ${rec}` : rec;
  }
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
  const elevatorSlot = document.createElement("div");
  elevatorSlot.className = "elevator-slot";
  elevatorSlot.dataset.elevatorSlot = "1";
  toolbarEl.appendChild(elevatorSlot);
  ensureActionRow(toolbarEl);
  bindDelegatedClickOnce(toolbarEl, onKey, onReset);
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

export function updateMobileMapToolbar(
  toolbarEl: HTMLElement,
  elevator?: MobileMapToolbarOptions,
  onExpandPicker?: () => void,
) {
  const showElevatorPicker = Boolean(elevator?.onElevator && !elevator?.pickerCollapsed);
  toolbarEl.classList.toggle("has-elevator", showElevatorPicker);
  toolbarEl.classList.toggle("has-elevator-collapsed", Boolean(elevator?.onElevator && elevator.pickerCollapsed));
  document.documentElement.classList.toggle("elevator-open", showElevatorPicker);

  const uiKey = `${elevator?.onElevator ? "1" : "0"}-${elevator?.pickerCollapsed ? "1" : "0"}-${showElevatorPicker ? elevator?.floors?.length : 0}`;
  if (uiKey === lastElevatorUiKey) return;
  lastElevatorUiKey = uiKey;

  const slot = toolbarEl.querySelector<HTMLElement>("[data-elevator-slot]");
  if (slot && elevator) {
    renderElevatorSlot(slot, elevator, onExpandPicker);
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

export function syncMobileClass() {
  document.documentElement.classList.toggle("mobile-layout", isMobileLayout());
}

export function syncMobileMapScale(lines: string[], anchor?: HTMLElement | null) {
  if (!isMobileLayout() || !lines?.length) {
    document.documentElement.style.removeProperty("--map-cols");
    document.documentElement.style.removeProperty("--map-rows");
    document.documentElement.style.removeProperty("--map-cell-px");
    return;
  }
  const cols = Math.max(...lines.map((line) => line.length), 1);
  const rows = lines.length;
  const viewportW = anchor?.clientWidth
    || document.getElementById("map-wrap")?.clientWidth
    || document.documentElement.clientWidth
    || window.innerWidth;
  const viewportH = window.innerHeight;
  const chromeH = 230;
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
