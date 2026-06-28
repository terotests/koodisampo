/**
 * Hissivalitsin toolbar-DOM — web-game desktop-näkymä.
 * Ei verkkokutsuja: kutsu onKey / onExpand suoraan pelikontrollerista.
 */

/**
 * @param {HTMLElement} hostEl
 * @param {{
 *   onElevator?: boolean,
 *   elevatorPickerCollapsed?: boolean,
 *   elevatorFloors?: Array<{ key: string, title?: string, current?: boolean, hasElevator?: boolean }>,
 * }} state
 * @param {{ onKey: (key: string) => void, onExpand: () => void }} actions
 * @returns {boolean}
 */
export function mountElevatorToolbar(hostEl, state, { onKey, onExpand }) {
  if (!hostEl || !state?.onElevator) {
    return false;
  }

  const panel = document.createElement("div");
  panel.className = "elevator-panel";

  if (state.elevatorPickerCollapsed) {
    const expandBtn = document.createElement("button");
    expandBtn.type = "button";
    expandBtn.className = "elevator-expand";
    expandBtn.textContent = "Hissi — vaihda kerros";
    expandBtn.addEventListener("click", (e) => {
      e.preventDefault();
      onExpand();
    });
    panel.appendChild(expandBtn);
    hostEl.appendChild(panel);
    return true;
  }

  const floors = state.elevatorFloors ?? [];
  if (!floors.length) {
    return false;
  }

  const label = document.createElement("div");
  label.className = "elevator-label";
  label.textContent = "Hissi — valitse kerros (1–9 / 0)";
  panel.appendChild(label);

  const grid = document.createElement("div");
  grid.className = "elevator-grid";
  const rowCount = Math.ceil(floors.length / 5);
  for (let row = 0; row < rowCount; row += 1) {
    const rowEl = document.createElement("div");
    rowEl.className = "elevator-row";
    const slice = floors.slice(row * 5, row * 5 + 5);
    for (const floor of slice) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "elevator-btn";
      btn.dataset.key = floor.key;
      btn.textContent = floor.key;
      if (floor.title) btn.title = floor.title;
      if (floor.current) btn.classList.add("current");
      if (floor.hasElevator === false) btn.classList.add("disabled");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        onKey(floor.key);
      });
      rowEl.appendChild(btn);
    }
    grid.appendChild(rowEl);
  }
  panel.appendChild(grid);
  hostEl.appendChild(panel);
  return true;
}
