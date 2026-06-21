/**
 * Raw stdin — delegoi stdinHubille (yksi kuuntelija).
 */

export { createKeyReader, getStdinHub } from "./stdinHub.mjs";

export function keyToMove(key) {
  const n = key?.name;
  if (!n) return null;
  if (n === "up" || n === "w") return { dx: 0, dy: -1 };
  if (n === "down" || n === "s") return { dx: 0, dy: 1 };
  if (n === "left" || n === "a") return { dx: -1, dy: 0 };
  if (n === "right" || n === "d") return { dx: 1, dy: 0 };
  return null;
}
