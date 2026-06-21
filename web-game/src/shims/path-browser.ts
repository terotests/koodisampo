export function resolve(...parts: string[]) {
  return parts.filter(Boolean).join("/");
}
export function dirname(p: string) {
  const i = p.lastIndexOf("/");
  return i >= 0 ? p.slice(0, i) : ".";
}
export function join(...parts: string[]) {
  return parts.filter(Boolean).join("/");
}
