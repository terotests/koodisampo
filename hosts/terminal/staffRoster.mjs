import { sessionMap } from "../shared/sessionMap.mjs";
import { personMapChar } from "./personStatus.mjs";
import {
  formatMoodTowardsPlayerLine,
  loadRelationMap,
  overlayLabel,
} from "../shared/npcRelationText.mjs";

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Etunimi näyttönimestä ("Kollega Pekka" → "Pekka"). */
export function parseDisplayFirstName(displayName) {
  const s = String(displayName || "").trim();
  if (!s) return "";
  const kollega = s.match(/^Kollega\s+(\S+)/i);
  if (kollega) return kollega[1];
  const parts = s.split(/\s+/);
  if (parts.length >= 2 && /^(Senior|VP|Toimitus)/i.test(parts[0])) {
    return parts[parts.length - 1];
  }
  return parts[0];
}

/** Keneltä-kysymys: Pekka → Pekalta, Maija → Maijalta, Jarmo → Jarmolta. */
const ABLATIVE_FORMS = {
  Anna: "Annalta",
  Mikko: "Mikolta",
  Laura: "Lauralta",
  Jussi: "Jussilta",
  Sari: "Sarilta",
  Petri: "Petriltä",
  Emilia: "Emilialta",
  Antti: "Antilta",
  Hanna: "Hannalta",
  Olli: "Ollilta",
  Tiina: "Tiinalta",
  Markus: "Markukselta",
  Riikka: "Riikalta",
  Ville: "Villette",
  Nina: "Ninalta",
  Kari: "Karilta",
  Pekka: "Pekalta",
  Maija: "Maijalta",
  Jarmo: "Jarmolta",
};

export function finnishAblative(firstName) {
  const n = String(firstName || "").trim();
  if (!n) return "joltain";
  if (ABLATIVE_FORMS[n]) return ABLATIVE_FORMS[n];
  const front = /[äöy]/i.test(n);
  const last = n.slice(-1).toLowerCase();
  if (last === "o") return `${n.slice(0, -1)}olta`;
  if (last === "i") return `${n.slice(0, -1)}${front ? "iltä" : "ilta"}`;
  if (/a$/i.test(n)) return `${n.slice(0, -1)}${front ? "ältä" : "alta"}`;
  return `${n}${front ? "ltä" : "lta"}`;
}

const FALLBACK_COWORKERS = ["Jarmo", "Maija", "Pekka", "Laura", "Mikko"];

/** Roolityypit (entity.kind) — dokumentaatio + debug-lista. */
export const CAST_KIND_LABELS = {
  coworker: "työkaveri",
  guru: "guru / mentori",
  role: "rooli (henkilöstö / NPC)",
  security: "turvallisuus",
  police: "poliisi",
  hostile: "vihamielinen / johto",
  pet: "lemmikki",
};

export const CAST_KIND_MAP_CHAR = {
  coworker: "t",
  guru: "g",
  role: "?", // riippuu aliroolista
  security: "u",
  police: "P",
  hostile: "?",
  pet: "d",
};

export const CAST_KIND_HELP = [
  { kind: "coworker", label: "Työkaveri", mapChar: "t/T → P…", note: "Tuntematon t/T (sukupuoli), tuttu etukirjain" },
  { kind: "guru", label: "Guru", mapChar: "g", note: "C++-intro ja tarkistuskysymykset" },
  { kind: "role", label: "Rooli", mapChar: "v/s/k/T/p", note: "Esim. vastaanotto v, sihteeri s, talkkari k, CEO T" },
  { kind: "security", label: "Turvallisuus", mapChar: "u", note: "Audit-kysymykset" },
  { kind: "police", label: "Poliisi", mapChar: "P", note: "Takaa-ajo (spawn)" },
  { kind: "hostile", label: "Vihamielinen", mapChar: "M/o/O", note: "CTO, orkki, VP" },
  { kind: "pet", label: "Lemmikki", mapChar: "d", note: "Esim. toimistokoira" },
];

/** Karttamerkki roolin mukaan (ei esineille). */
export function roleMapChar(entity, personRegistry = null) {
  if (personRegistry) return personMapChar(personRegistry, entity);
  if (!entity?.id) return "?";
  if (entity.kind === "item") return entity.char || "?";
  if (entity.kind === "coworker") return "t";
  if (entity.kind === "guru") return "g";
  if (entity.kind === "pet") return entity.char || "d";
  if (entity.kind === "security") return "u";
  if (entity.kind === "police" || entity.kind === "hostile") return entity.char || "?";
  if (entity.kind === "role") {
    if (entity.id === "receptionist") return "v";
    if (entity.char === "C") return "T";
    if (entity.char === "S") return "s";
    if (entity.char === "P") return "p";
    if (entity.char === "u") return "k";
    return entity.char || "?";
  }
  return entity.char || "?";
}

function collectEntitiesFromSession(session, filterFn) {
  const map = sessionMap(session);
  if (!map || typeof map.floorCount !== "function") return [];
  const savedFloor = map.currentFloor ?? 0;
  const out = [];
  for (let f = 0; f < map.floorCount(); f += 1) {
    map.currentFloor = f;
    const floorTitle = map.activeFloor()?.title ?? `Kerros ${f + 1}`;
    const ents = map.activeFloor()?.entities ?? [];
    for (const e of ents) {
      if (!filterFn(e)) continue;
      out.push({
        id: e.id,
        char: e.char,
        name: e.name,
        kind: e.kind || "role",
        floor: f,
        floorTitle,
        firstName: parseDisplayFirstName(e.name),
        topic: e.topic || "",
        storyId: e.storyId || "",
        overlayEmotion: e.overlayEmotion || "none",
      });
    }
  }
  map.currentFloor = savedFloor;
  return out;
}

export function collectCoworkersFromSession(session) {
  return collectEntitiesFromSession(session, (e) => e.kind === "coworker").map((e) => ({
    ...e,
  }));
}

/** Henkilöstö (työkaverit + guru + roolit) — suppea lista. */
export function collectStaffFromSession(session) {
  return collectEntitiesFromSession(
    session,
    (e) => e.kind === "coworker" || e.kind === "guru" || e.kind === "role" || e.kind === "security",
  );
}

/** Kaikki hahmot kartalla (DEBUG) — ei esineitä. */
export function collectAllCastFromSession(session) {
  return collectEntitiesFromSession(session, (e) => e.kind !== "item");
}

export function kindLabel(kind) {
  return CAST_KIND_LABELS[kind] || kind || "?";
}

export function formatCastRosterText(cast, { includeLegend = true, session = null } = {}) {
  const withMoods = Boolean(session);
  const lines = [
    withMoods ? "═══ Hahmot ja tunnetilat ═══" : "═══ Hahmolista (DEBUG) ═══",
    withMoods ? "Sinua kohtaan — tunne ja suhdeluvut." : "Poistuu lopullisesta versiosta.",
    "",
  ];
  const relationById = withMoods ? loadRelationMap(session) : null;
  if (includeLegend) {
    lines.push("── Karttamerkit (roolin alkukirjain) ──");
    for (const row of CAST_KIND_HELP) {
      lines.push(`  ${row.mapChar} = ${row.label} — ${row.note}`);
    }
    lines.push("");
    lines.push("Täydet nimet alla. (Debug-valikko — ei tuotannossa.)");
    lines.push("");
  }
  if (!cast?.length) {
    lines.push("(Ei hahmoja kartalla.)");
    return lines.join("\n");
  }
  let lastFloor = -1;
  for (const e of cast) {
    if (e.floor !== lastFloor) {
      lastFloor = e.floor;
      lines.push(`── ${e.floorTitle} ──`);
    }
    const topic = e.topic ? `, aihe: ${e.topic}` : "";
    const story = e.storyId ? `, tarina: ${e.storyId}` : "";
    const mapCh = roleMapChar(e);
    lines.push(
      `  [${mapCh}] ${e.name} — ${kindLabel(e.kind)} (${e.id}${topic}${story})`,
    );
    if (withMoods) {
      const rel = relationById?.get(e.id);
      if (rel) {
        lines.push(`    ${formatMoodTowardsPlayerLine(rel, e.overlayEmotion)}`);
      } else {
        const overlay = overlayLabel(e.overlayEmotion);
        lines.push(
          overlay
            ? `    sinua kohtaan: ${overlay} (ei tallennettua suhdetta)`
            : "    sinua kohtaan: — (ei vielä tavattu)",
        );
      }
    }
  }
  return lines.join("\n");
}

export function formatStaffRosterLines(staff) {
  return formatCastRosterText(staff, { includeLegend: false }).split("\n");
}

export function pickAlternateCoworker(entity, coworkers) {
  const pool = coworkers.filter((c) => c.id !== entity.id);
  if (pool.length > 0) {
    return pool[hashString(`${entity.id}:alt`) % pool.length];
  }
  const self = parseDisplayFirstName(entity.name);
  const names = FALLBACK_COWORKERS.filter((n) => n !== self);
  const pick = names[hashString(entity.id) % names.length] || "Jarmo";
  return { id: `fallback-${pick}`, name: pick, firstName: pick };
}

export function alternateAblative(entity, session) {
  const alt = pickAlternateCoworker(entity, collectCoworkersFromSession(session));
  return finnishAblative(alt.firstName || parseDisplayFirstName(alt.name));
}

export function buildAskColleagueLine(entity, session) {
  const ablative = alternateAblative(entity, session);
  return `Oletko kysynyt ${ablative}?`;
}

export function buildAskColleagueReply(entity, session) {
  const name = entity.name || "Kollega";
  const ablative = alternateAblative(entity, session);
  const templates = [
    `${name}: "Hmm… en ole. Käyn kysymässä ${ablative}."`,
    `${name}: "Hyvä pointti — ${ablative} tietää varmaan paremmin."`,
    `${name}: "Oikeassa olet. Kysyn ${ablative} ennen kuin teen mitään."`,
    `${name}: "En oo varma — ${ablative} hoitaa tän aiheen yleensä."`,
  ];
  const idx = hashString(`${entity.id}:ask-colleague`) % templates.length;
  return templates[idx];
}

export function buildCoworkerWrongReaction(entity, session) {
  const name = entity.name || "Kollega";
  const ablative = alternateAblative(entity, session);
  const templates = [
    `Hmm… kiitos, ehkä kysyn vielä ${ablative}.`,
    `Selvä… kai. Käyn vielä varmistamassa ${ablative}.`,
    `Ahaa. ${ablative} varmaan tietää paremmin — käyn kysymässä.`,
    `Kiitos(?). En oo ihan varma — kysynpä ${ablative}.`,
  ];
  const idx = hashString(`${entity.id}:wrong-social`) % templates.length;
  return `${name}: "${templates[idx]}"`;
}
