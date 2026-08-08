/** Pelaajan erikoisosaamisen valinnat (profiilin setup). */

export const PLAYER_SPECIALTY_OPTIONS = [
  { id: "cpp", label: "C++ guru" },
  { id: "docker", label: "Docker / kontit" },
  { id: "linux", label: "Linux / systemd" },
  { id: "qt", label: "Qt / C++ UI" },
  { id: "javascript", label: "JavaScript / TypeScript" },
  { id: "rust", label: "Rust" },
  { id: "postgres", label: "PostgreSQL" },
  { id: "scrum", label: "Scrum / tiimityö" },
  { id: "git", label: "Git / CI" },
  { id: "backend", label: "Backend / API" },
  { id: "security", label: "Turvallisuus" },
  { id: "robotframework", label: "Robot Framework" },
  { id: "space", label: "Avaruustekniikka / GNSS" },
];

export function specialtyLabel(id) {
  return PLAYER_SPECIALTY_OPTIONS.find((o) => o.id === id)?.label || id || "—";
}
