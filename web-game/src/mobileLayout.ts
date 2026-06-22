/** Mobile layout helpers — compact map viewport and touch controls. */

export const MOBILE_MAP_SIZE = 25;

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
  let msg = state.status || state.ambient || state.hint || "";
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

export function setMobileMapToolbar(
  toolbarEl: HTMLElement,
  onKey: (key: string) => void,
  onReset: () => void,
  elevator?: MobileMapToolbarOptions,
) {
  toolbarEl.className = "toolbar toolbar-mobile";
  const showElevatorPicker = Boolean(elevator?.onElevator && !elevator?.pickerCollapsed);
  if (showElevatorPicker) toolbarEl.classList.add("has-elevator");
  if (elevator?.onElevator && elevator.pickerCollapsed) {
    toolbarEl.classList.add("has-elevator-collapsed");
  }
  toolbarEl.innerHTML = "";
  document.documentElement.classList.toggle("elevator-open", showElevatorPicker);

  if (elevator?.onElevator && elevator.pickerCollapsed) {
    const expandBtn = document.createElement("button");
    expandBtn.type = "button";
    expandBtn.className = "elevator-expand";
    expandBtn.textContent = "Hissi — vaihda kerros";
    expandBtn.addEventListener("click", () => elevator.onExpandPicker?.());
    toolbarEl.appendChild(expandBtn);
  } else if (showElevatorPicker && elevator?.floors?.length) {
    const label = document.createElement("div");
    label.className = "elevator-label";
    label.textContent = "Hissi — valitse kerros";
    toolbarEl.appendChild(label);

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
        if (floor.current) btn.classList.add("current");
        if (floor.hasElevator === false) btn.classList.add("disabled");
        btn.textContent = floor.key;
        btn.title = floor.title;
        btn.addEventListener("click", () => onKey(floor.key));
        elevRow.appendChild(btn);
      }
      elevGrid.appendChild(elevRow);
    }
    toolbarEl.appendChild(elevGrid);
  } else {
    document.documentElement.classList.remove("elevator-open");
  }

  const dpad = document.createElement("div");
  dpad.className = "dpad";
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
        dpad.appendChild(document.createElement("span"));
        continue;
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dpad-btn";
      btn.textContent = spec.label;
      btn.addEventListener("click", () => onKey(spec.key));
      dpad.appendChild(btn);
    }
  }
  toolbarEl.appendChild(dpad);

  const actions = document.createElement("div");
  actions.className = "action-row";
  const actionBtns: ToolbarBtn[] = [
    { key: "e", label: "Käytä" },
    { key: "t", label: "Työkalu" },
    { key: "x", label: "Kaiva" },
    { key: "h", label: "Piiloudu" },
    { key: "i", label: "Invent." },
    { key: "b", label: "Opisk." },
    { key: "?", label: "Valikko" },
    { key: "reset", label: "↺", cls: "danger" },
  ];
  for (const spec of actionBtns) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = spec.label;
    if (spec.cls) btn.className = spec.cls;
    btn.addEventListener("click", () => {
      if (spec.key === "reset") onReset();
      else onKey(spec.key);
    });
    actions.appendChild(btn);
  }
  toolbarEl.appendChild(actions);
}

export function setMobileToolbar(
  toolbarEl: HTMLElement,
  buttons: ToolbarBtn[],
  onKey: (key: string) => void,
  onReset: () => void,
) {
  document.documentElement.classList.remove("elevator-open");
  toolbarEl.className = "toolbar toolbar-mobile toolbar-stack";
  toolbarEl.innerHTML = "";
  for (const spec of buttons) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = spec.label;
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
