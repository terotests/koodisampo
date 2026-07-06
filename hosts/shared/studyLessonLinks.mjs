/**
 * Jaettu oppituntilinkitys — peli viittaa materiaaliin, ei toisin päin.
 */

export const STUDY_SITE_PATH = "/koodisampo/opiskelu";

/** Oletuspolku GitHub Pages -julkaisuun. */
export const STUDY_SITE_ORIGIN = "https://terotests.github.io";

export const DOMAIN_LABELS = {
  cpp: "C++",
  docker: "Docker",
  linux: "Linux",
  scrum: "Scrum",
  qt: "Qt",
  javascript: "JavaScript",
  postgres: "PostgreSQL",
  git: "Git",
  backend: "Backend",
  security: "Turvallisuus",
  robotframework: "Robot Framework",
};

export const CHAPTER_LABELS = {
  tools: "C++ työkalut",
  style: "C++ tyyli",
  safety: "C++ turvallisuus",
  maintainability: "ylläpidettävyys",
  performance: "suorituskyky",
  portability: "siirrettävyys",
  threadability: "säikeistys",
  correctness: "oikeellisuus",
  "scrum-dod": "Definition of Done",
  "scrum-dor": "Definition of Ready",
  "scrum-estimation": "estimointi",
  "scrum-sprint": "sprintti",
  "scrum-team": "tiimi",
  systemd: "systemd",
  journald: "journald",
  "linux-network": "verkko",
  "linux-dbus": "D-Bus",
  "linux-arp": "ARP",
  "linux-tcp-udp": "TCP/UDP",
  avahi: "Avahi/mDNS",
  apt: "apt/dpkg",
  docker: "Docker",
  "docker-network": "Docker-verkot",
  "docker-volumes": "Docker-volumet",
  "qt-widgets": "Qt-widgetit",
  "qt-signals": "signaalit/slotit",
  "qt-threading": "Qt-säikeet",
  "qt-models": "Qt-mallit",
  "qt-opengl": "Qt OpenGL",
  "qt-shaders": "Qt-shaders",
  "qt-quick": "Qt Quick / QML",
  "js-async": "JavaScript async",
  "js-types": "JavaScript-tyypit",
  "js-modules": "JS-moduulit",
  "js-runtime": "JS-runtime",
  "pg-indexes": "PostgreSQL-indeksit",
  "pg-explain": "EXPLAIN/suunnitelmat",
  "pg-vacuum": "VACUUM/autovacuum",
  "pg-config": "PostgreSQL-konfig",
  "pg-query-design": "SQL-kyselysuunnittelu",
  "pg-cte-window": "CTE ja ikkunafunktiot",
  "pg-joins": "JOIN-kuviot",
  "pg-json": "JSON/JSONB-kyselyt",
  "pg-sql-security": "SQL-turvallisuus",
  "cpp-production": "C++ tuotanto",
  "docker-production": "Docker tuotanto",
  "js-typescript": "TypeScript",
  "git-workflow": "Git-työnkulku",
  "git-ci": "CI/CD",
  "backend-data": "backend-data",
  "backend-api": "backend-API",
  "ops-incident": "incident-hallinta",
  "web-security": "web-turvallisuus",
  "rf-basics": "Robot Framework",
  "rf-web": "RF web-testaus",
  "rf-execution": "RF suoritus/CI",
  "rf-advanced": "RF-laajennukset",
};

/** Repo/dokumentaatioviite: domain/chapter/id */
export function lessonRefForQuestion(question) {
  if (question?.lessonRef) return question.lessonRef.replace(/^\/+|\/+$/g, "");
  const domain = question?.domain || "general";
  const chapter = question?.chapter || "general";
  const id = question?.id || "";
  return `${domain}/${chapter}/${id}`;
}

export function lessonDomainForQuestion(question) {
  if (question?.lessonRef) {
    const head = question.lessonRef.replace(/^\/+|\/+$/g, "").split("/")[0];
    if (head) return head;
  }
  return question?.domain || "general";
}

/** Docusaurus-polku domain-sivulle + ankkuri kysymykseen. */
export function lessonDocPathForQuestion(question) {
  const domain = lessonDomainForQuestion(question);
  const id = question?.id || "";
  return `/docs/topics/${domain}/#${id}`;
}

export function lessonUrl(question, options = {}) {
  const basePath = options.basePath ?? STUDY_SITE_PATH;
  const origin = options.origin ?? "";
  const docPath = lessonDocPathForQuestion(question);
  const full = `${basePath.replace(/\/$/, "")}${docPath}`;
  return origin ? `${origin.replace(/\/$/, "")}${full}` : full;
}

export function lessonLinkLine(question, options = {}) {
  const url = lessonUrl(question, options);
  return `Lue oppitunti: ${url}`;
}

/** Opiskelulistan merkintä → kysymys-objekti oppituntilinkkiä varten. */
export function questionFromBacklogEntry(entry) {
  return {
    id: entry?.questionId || "",
    domain: entry?.domain || "",
    chapter: entry?.chapter || "",
  };
}

export function lessonUrlForBacklogEntry(entry, options = {}) {
  if (!entry?.questionId) return "";
  return lessonUrl(questionFromBacklogEntry(entry), options);
}
