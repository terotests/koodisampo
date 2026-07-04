import { createBrowserGame } from "./boot";
import { initTheme, mountThemePicker } from "./theme";
import { mountGameUI } from "./ui";

initTheme();
mountThemePicker();

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
