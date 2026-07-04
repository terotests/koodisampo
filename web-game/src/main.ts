import { createBrowserGame } from "./boot";
import { initTheme, mountThemePicker } from "./theme";
import { initRenderTheme, mountRenderThemePicker } from "./renderTheme";
import { mountGameUI } from "./ui";

initTheme();
initRenderTheme();
mountThemePicker();
mountRenderThemePicker();

async function start() {
  const mapEl = document.getElementById("map");
  if (!mapEl) throw new Error("UI root missing");
  try {
    const game = await createBrowserGame();
    mapEl.textContent = "";
    mountGameUI(game);
  } catch (err) {
    mapEl.textContent = err instanceof Error ? err.message : "Pelin lataus epäonnistui";
  }
}

void start();
