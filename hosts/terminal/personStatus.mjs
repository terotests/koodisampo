import { sessionMap } from "../shared/sessionMap.mjs";

function parseDisplayFirstName(displayName) {
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

const FEMALE_FIRST_NAMES = new Set([
  "Anna", "Emilia", "Hanna", "Laura", "Maija", "Nina", "Riikka", "Sari", "Tiina",
]);

const MALE_FIRST_NAMES = new Set([
  "Antti", "Jarmo", "Jussi", "Kari", "Markus", "Mikko", "Olli", "Pekka", "Petri", "Ville",
]);

export function emptyPersonRegistry() {
  return { byId: {} };
}

export function normalizePersonRegistry(raw) {
  const registry = emptyPersonRegistry();
  if (!raw || typeof raw !== "object") return registry;
  const byId = raw.byId;
  if (!byId || typeof byId !== "object") return registry;
  for (const [id, rec] of Object.entries(byId)) {
    if (!id || !rec || typeof rec !== "object") continue;
    registry.byId[id] = {
      firstName: String(rec.firstName || ""),
      gender: rec.gender === "F" ? "F" : "M",
      karma: Number(rec.karma) || 0,
      met: !!rec.met,
      encounters: Math.max(0, Number(rec.encounters) || 0),
      recommended: !!rec.recommended,
    };
  }
  return registry;
}

export function inferGender(firstName, entity = null) {
  const fromEntity = entity?.gender;
  if (fromEntity === "F" || fromEntity === "female") return "F";
  if (fromEntity === "M" || fromEntity === "male") return "M";
  const n = String(firstName || "").trim();
  if (!n) return "M";
  if (FEMALE_FIRST_NAMES.has(n)) return "F";
  if (MALE_FIRST_NAMES.has(n)) return "M";
  const last = n.slice(-1).toLowerCase();
  if (last === "a" || last === "i") return "F";
  return "M";
}

export function isImportantPerson(entity) {
  if (!entity?.id) return false;
  if (entity.id === "receptionist") return true;
  if (entity.kind === "guru") return true;
  if (entity.kind === "security") return true;
  if (entity.kind === "hostile" || entity.kind === "police") return true;
  if (entity.char === "C" || entity.id.startsWith("ceo-")) return true;
  if (entity.kind === "role") {
    if (entity.char === "S" || entity.char === "P" || entity.char === "u") return true;
    if (entity.id === "receptionist") return true;
  }
  return false;
}

export function importantMapChar(entity) {
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

function ensurePerson(registry, entity) {
  if (!entity?.id) return null;
  if (!registry.byId[entity.id]) {
    const firstName = parseDisplayFirstName(entity.name);
    registry.byId[entity.id] = {
      firstName,
      gender: inferGender(firstName, entity),
      karma: 0,
      met: false,
      encounters: 0,
      recommended: false,
    };
  } else if (!registry.byId[entity.id].firstName) {
    registry.byId[entity.id].firstName = parseDisplayFirstName(entity.name);
  }
  return registry.byId[entity.id];
}

export function getPersonRecord(registry, entityId) {
  return registry?.byId?.[entityId] ?? null;
}

export function isPersonFamiliar(registry, entityId) {
  const rec = getPersonRecord(registry, entityId);
  if (!rec?.met) return false;
  return rec.karma > 0 || rec.encounters >= 2;
}

export function hasPersonRecommendation(registry, entityId) {
  const rec = getPersonRecord(registry, entityId);
  return !!rec && rec.karma > 0;
}

function syncRecommended(rec) {
  rec.recommended = rec.karma > 0;
}

export function recordPersonEncounter(registry, entity, { correct = null, tone = "talk" } = {}) {
  if (!entity?.id) return registry;
  const rec = ensurePerson(registry, entity);
  rec.met = true;
  rec.encounters += 1;
  if (correct === true) rec.karma += 3;
  else if (correct === false) rec.karma -= 1;
  else if (tone === "joke") rec.karma += 1;
  else if (tone === "meh") rec.karma -= 1;
  else if (tone === "talk") rec.karma += 1;
  else if (tone === "leave" || tone === "meet") {
    /* met only */
  }
  syncRecommended(rec);
  return registry;
}

export function personMapChar(registry, entity) {
  if (!entity?.id) return "?";
  if (entity.kind === "item" || entity.kind === "pet") return entity.char || "?";
  if (isImportantPerson(entity)) return importantMapChar(entity);
  const rec = ensurePerson(registry, entity);
  if (isPersonFamiliar(registry, entity.id)) {
    const letter = (rec.firstName || parseDisplayFirstName(entity.name) || "?").charAt(0).toUpperCase();
    return letter || "?";
  }
  return rec.gender === "F" ? "t" : "T";
}

export function countsForFloorRecommendation(entity) {
  if (!entity?.id) return false;
  if (entity.kind === "item" || entity.kind === "pet") return false;
  if (entity.isAgent && entity.kind === "police") return false;
  return (
    entity.kind === "coworker"
    || entity.kind === "guru"
    || entity.kind === "security"
    || entity.kind === "role"
    || entity.kind === "hostile"
  );
}

export function collectFloorRecommendationStaff(session, floorIndex) {
  const map = sessionMap(session);
  if (!map || typeof map.floorCount !== "function") return [];
  const savedFloor = map.currentFloor ?? 0;
  map.currentFloor = floorIndex;
  const ents = map.activeFloor()?.entities ?? [];
  const staff = ents.filter((e) => countsForFloorRecommendation(e) && !e.offDuty);
  map.currentFloor = savedFloor;
  return staff;
}

export function getFloorRecommendationStatus(session, registry, floorIndex) {
  const staff = collectFloorRecommendationStaff(session, floorIndex);
  const missing = [];
  let done = 0;
  for (const ent of staff) {
    if (hasPersonRecommendation(registry, ent.id)) {
      done += 1;
    } else {
      missing.push({
        id: ent.id,
        name: ent.name,
        firstName: parseDisplayFirstName(ent.name),
      });
    }
  }
  return {
    floor: floorIndex,
    total: staff.length,
    done,
    complete: missing.length === 0,
    missing,
  };
}

export function elevatorKeyToFloorIndex(key) {
  if (key === "0") return 9;
  const n = Number(key);
  if (Number.isInteger(n) && n >= 1 && n <= 9) return n - 1;
  return -1;
}

export function checkFloorRecommendationAccess(session, registry, targetFloor) {
  const map = sessionMap(session);
  if (!map) return { ok: true };
  const current = map.currentFloor ?? 0;
  if (targetFloor <= current) return { ok: true };

  for (let f = current; f < targetFloor; f += 1) {
    const status = getFloorRecommendationStatus(session, registry, f);
    if (!status.complete) {
      const floorTitle = getFloorTitle(session, f);
      const names = status.missing
        .slice(0, 4)
        .map((m) => m.firstName || m.name)
        .join(", ");
      const more = status.missing.length > 4 ? ` +${status.missing.length - 4}` : "";
      return {
        ok: false,
        floor: f,
        floorTitle,
        missing: status.missing,
        message:
          `Kerros ${f + 1} (${floorTitle}): tarvitset suosituksen kaikilta (${status.done}/${status.total}). `
          + `Puuttuu: ${names}${more}. Keskustele ja vastaa kysymyksiin positiivisesti.`,
      };
    }
  }
  return { ok: true };
}

function getFloorTitle(session, floorIndex) {
  const map = sessionMap(session);
  if (!map?.floors?.[floorIndex]) return `Kerros ${floorIndex + 1}`;
  return map.floors[floorIndex].title || `Kerros ${floorIndex + 1}`;
}

export function applyMapPersonDisplay(lines, map, registry, camera = null) {
  if (!lines?.length || !map || !registry) return lines;
  const camX = camera?.x ?? map.cameraX ?? 0;
  const camY = camera?.y ?? map.cameraY ?? 0;
  const ents = map.activeFloor()?.entities ?? [];
  const out = [...lines];
  for (const ent of ents) {
    if (!ent?.id || ent.offDuty) continue;
    if (ent.kind === "item") continue;
    const dx = ent.x - camX;
    const dy = ent.y - camY;
    if (dy < 0 || dy >= out.length || dx < 0) continue;
    const line = out[dy];
    if (dx >= line.length) continue;
    const ch = personMapChar(registry, ent);
    out[dy] = line.slice(0, dx) + ch + line.slice(dx + 1);
  }
  return out;
}

export function formatPersonStatusLine(registry, entity) {
  const rec = getPersonRecord(registry, entity?.id);
  if (!rec) return "tuntematon";
  const fam = isPersonFamiliar(registry, entity.id) ? "tuttu" : "tuntematon";
  const recTxt = rec.karma > 0 ? "suositus ok" : rec.karma < 0 ? "huono vaikutelma" : "ei suositusta";
  return `${fam}, karma ${rec.karma}, ${recTxt}`;
}
