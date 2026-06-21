/**
 * Terminaalipiirto ilman täyttä ruudun tyhjennystä — vähemmän välkkymistä.
 */

import { RESET } from "./ansi.mjs";

const HOME = "\x1b[H";
const CLEAR_SCREEN = "\x1b[2J";
const CLEAR_FROM_CURSOR = "\x1b[0J";
const ALT_SCREEN_ON = "\x1b[?1049h";
const ALT_SCREEN_OFF = "\x1b[?1049l";
const HIDE_CURSOR = "\x1b[?25l";
const SHOW_CURSOR = "\x1b[?25h";

let altActive = false;

export function enterGameScreen() {
  if (!process.stdout.isTTY || altActive) return;
  process.stdout.write(ALT_SCREEN_ON + HIDE_CURSOR);
  altActive = true;
}

export function leaveGameScreen() {
  if (!altActive) return;
  process.stdout.write(SHOW_CURSOR + ALT_SCREEN_OFF + RESET);
  altActive = false;
}

/** Tyhjennä koko näyttö (näkymän vaihto). */
export function clearScreen() {
  if (!process.stdout.isTTY) return;
  process.stdout.write(`${CLEAR_SCREEN}${HOME}`);
}

/** Piirrä koko ruutu yhdellä kirjoituksella. */
export function drawFrame(content) {
  const text = String(content ?? "");
  process.stdout.write(`${HOME}${text}${CLEAR_FROM_CURSOR}`);
}

/** Piirrä ruutu täydellä tyhjennyksellä — kohtaaminen, tarina, valikko. */
export function drawFrameClear(content) {
  const text = String(content ?? "");
  process.stdout.write(`${CLEAR_SCREEN}${HOME}${text}${CLEAR_FROM_CURSOR}`);
}

export function drawLines(lines) {
  drawFrame(lines.join("\n"));
}

export function drawLinesClear(lines) {
  drawFrameClear(lines.join("\n"));
}
