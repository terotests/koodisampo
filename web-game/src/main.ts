import { createBrowserGame } from "./boot";
import { mountGameUI } from "./ui";

async function start() {
  const mapEl = document.getElementById("map");
  if (!mapEl) throw new Error("UI root missing");
  try {
    const game = await createBrowserGame();
    mountGameUI(game);
  } catch (err) {
    mapEl.textContent = err instanceof Error ? err.message : "Pelin lataus epäonnistui";
  }
}

void start();
