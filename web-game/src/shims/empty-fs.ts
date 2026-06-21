export function readFileSync() {
  throw new Error("filesystem not available in browser build");
}
export function writeFileSync() {
  throw new Error("filesystem not available in browser build");
}
export function readdirSync() {
  throw new Error("filesystem not available in browser build");
}
export function mkdirSync() {}
