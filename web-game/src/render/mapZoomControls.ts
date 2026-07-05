import {
  adjustMapZoom,
  canZoomMapIn,
  canZoomMapOut,
  MAP_ZOOM_STEP,
} from "../mapZoom";

const CONTROLS_SEL = "[data-map-zoom-controls]";

function syncButtons(root: HTMLElement) {
  const zoomIn = root.querySelector<HTMLButtonElement>("[data-map-zoom-in]");
  const zoomOut = root.querySelector<HTMLButtonElement>("[data-map-zoom-out]");
  if (zoomIn) zoomIn.disabled = !canZoomMapIn();
  if (zoomOut) zoomOut.disabled = !canZoomMapOut();
}

export function mountMapZoomControls(container: HTMLElement): void {
  let root = container.querySelector<HTMLElement>(CONTROLS_SEL);
  if (!root) {
    root = document.createElement("div");
    root.className = "map-zoom-controls";
    root.dataset.mapZoomControls = "1";
    root.setAttribute("aria-label", "Kartan zoomaus");

    const zoomIn = document.createElement("button");
    zoomIn.type = "button";
    zoomIn.className = "map-zoom-btn";
    zoomIn.dataset.mapZoomIn = "1";
    zoomIn.textContent = "+";
    zoomIn.title = "Lähennä";
    zoomIn.setAttribute("aria-label", "Lähennä karttaa");
    zoomIn.addEventListener("click", (e) => {
      e.stopPropagation();
      adjustMapZoom(MAP_ZOOM_STEP);
    });

    const zoomOut = document.createElement("button");
    zoomOut.type = "button";
    zoomOut.className = "map-zoom-btn";
    zoomOut.dataset.mapZoomOut = "1";
    zoomOut.textContent = "−";
    zoomOut.title = "Loitonna";
    zoomOut.setAttribute("aria-label", "Loitonna karttaa");
    zoomOut.addEventListener("click", (e) => {
      e.stopPropagation();
      adjustMapZoom(-MAP_ZOOM_STEP);
    });

    root.append(zoomIn, zoomOut);
    container.appendChild(root);
  }
  syncButtons(root);
}

export function syncMapZoomControls(container: HTMLElement): void {
  const root = container.querySelector<HTMLElement>(CONTROLS_SEL);
  if (root) syncButtons(root);
}
