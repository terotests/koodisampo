// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MapState = any;

export type ColorizeLine = (line: string, state: MapState, row?: number) => string;

function rowSignature(line: string, state: MapState, row: number): string {
  const rec = state.recommendedCells ?? [];
  let flags = "";
  for (const cell of rec) {
    if (typeof cell === "string" && cell.startsWith(`${row},`)) {
      flags += cell;
    }
  }
  return `${line}\0${flags}\0${state.policeChase ? "1" : "0"}`;
}

/** Päivitä vain muuttuneet karttarivit — ei koko innerHTML-uudelleenpiirtoa. */
export function patchMapGrid(
  pre: HTMLPreElement,
  lines: string[],
  state: MapState,
  colorizeLine: ColorizeLine,
) {
  let rowContainer = pre.querySelector<HTMLElement>("[data-map-rows]");
  if (!rowContainer) {
    pre.textContent = "";
    rowContainer = document.createElement("span");
    rowContainer.className = "map-rows";
    rowContainer.dataset.mapRows = "1";
    pre.appendChild(rowContainer);
  }
  rowContainer.style.display = "inline-block";
  rowContainer.style.textAlign = "left";
  rowContainer.style.verticalAlign = "top";

  const existing = rowContainer.querySelectorAll<HTMLElement>("[data-map-row]");
  for (let y = 0; y < lines.length; y += 1) {
    const line = lines[y] ?? "";
    const sig = rowSignature(line, state, y);
    let row = existing[y];
    if (!row) {
      row = document.createElement("span");
      row.dataset.mapRow = String(y);
      row.style.display = "block";
      row.style.whiteSpace = "pre";
      rowContainer.appendChild(row);
    }
    if (row.dataset.sig !== sig) {
      row.innerHTML = colorizeLine(line, state, y);
      row.dataset.sig = sig;
    }
  }
  for (let y = lines.length; y < existing.length; y += 1) {
    existing[y]?.remove();
  }
}
