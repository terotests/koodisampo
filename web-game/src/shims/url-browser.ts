export function fileURLToPath(url: string | URL) {
  const s = String(url);
  if (s.startsWith("file://")) return s.slice(7);
  return s;
}
