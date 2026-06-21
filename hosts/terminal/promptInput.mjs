/**
 * Rivisyöte ja yksittäiset näppäimet — kaikki saman stdinHubin kautta.
 */

import { getStdinHub, isQuitKeyName } from "./stdinHub.mjs";

export { isQuitKeyName };

export const QUIT_KEY_NAMES = new Set(["ctrl-c", "ctrl-d", "ctrl-x", "esc", "q"]);

export function isQuitLine(line) {
  const s = String(line ?? "").trim().toLowerCase();
  return s === "q" || s === "quit" || s === "exit" || s === ":q";
}

/** Terminaali katkesi tai stdin suljettiin (EIO / terminate). */
export function isTerminalClosedKey(name) {
  return name === "disconnect" || name === "paused";
}

export const QUIT_HINT = "q / Esc / Ctrl+C / Ctrl+X = lopeta";

/**
 * @returns {Promise<{ type: "line", value: string } | { type: "quit", key: string }>}
 */
export function readLine(prompt) {
  const hub = getStdinHub();
  return hub.readLine(prompt).then((result) => {
    if (result.type === "quit") {
      process.stdout.write("\n");
      return result;
    }
    if (result.type === "line") {
      process.stdout.write("\n");
      return result;
    }
    return result;
  });
}

/**
 * @returns {Promise<{ type: "key", key: string } | { type: "quit", key: string }>}
 */
export function readKey(prompt) {
  return getStdinHub().readKeyPrompt(prompt);
}
