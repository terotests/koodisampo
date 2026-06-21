export const homedir = () => "/";
export function join(...parts: string[]) {
  return parts.filter(Boolean).join("/");
}
