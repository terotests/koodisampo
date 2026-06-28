export const RESET = "\x1b[0m";
export const BOLD = "\x1b[1m";
export const DIM = "\x1b[2m";

export const FG = {
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  brightGreen: "\x1b[92m",
  yellow: "\x1b[33m",
  brightYellow: "\x1b[93m",
  magenta: "\x1b[35m",
  gray: "\x1b[90m",
  white: "\x1b[97m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

export const BG = {
  black: "\x1b[40m",
  red: "\x1b[41m",
  green: "\x1b[42m",
};

const TILE_COLOR = {
  "~": FG.cyan,
  ",": FG.green,
  ".": FG.green,
  T: FG.brightGreen,
  "^": FG.gray,
  "#": FG.gray,
  "|": FG.blue,
  "=": FG.gray,
  "%": FG.yellow,
  L: FG.red,
  "+": FG.yellow,
  "(": FG.magenta,
  "/": FG.white,
  k: FG.brightYellow,
  u: FG.cyan,
  d: FG.yellow,
  C: FG.red + BOLD,
  "!": FG.red + BOLD,
  J: FG.red,
  K: FG.yellow,
  "@": FG.brightYellow + BOLD,
  G: FG.yellow + BOLD,
  "?": FG.magenta,
  S: FG.white,
  P: FG.blue,
  O: FG.red,
  M: FG.red + BOLD,
  C: FG.red + BOLD,
  $: FG.brightGreen,
  o: FG.red,
  A: FG.green,
};

import { formatMapLineTerminal } from "../shared/mapGlyphs.mjs";

export function colorize(ch) {
  const style = TILE_COLOR[ch];
  if (!style) return ch;
  return `${style}${ch}${RESET}`;
}

export function colorizeMapLine(line) {
  return formatMapLineTerminal(line, (glyph) => colorize(glyph));
}

export function colorizePolice(ch) {
  return `${BG.black}${FG.white}${BOLD}${ch}${RESET}`;
}

export function colorizeRecommended(ch) {
  return `${BG.green}${FG.brightGreen}${BOLD}${ch}${RESET}`;
}

export function styled(text, ...styles) {
  return `${styles.join("")}${text}${RESET}`;
}
