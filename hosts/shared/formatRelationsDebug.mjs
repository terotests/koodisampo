import { sessionMap } from "./sessionMap.mjs";
import {
  collectAllCastFromSession,
  kindLabel,
  roleMapChar,
} from "../terminal/staffRoster.mjs";
import {
  formatMoodTowardsPlayerLine,
  loadRelationMap,
  overlayLabel,
  relationStatLine,
} from "./npcRelationText.mjs";

function collectLiveNpcState(session) {
  const map = sessionMap(session);
  if (!map || typeof map.floorCount !== "function") return new Map();
  const savedFloor = map.currentFloor ?? 0;
  const out = new Map();
  for (let f = 0; f < map.floorCount(); f += 1) {
    map.currentFloor = f;
    const floorTitle = map.activeFloor()?.title ?? `Kerros ${f + 1}`;
    for (const e of map.activeFloor()?.entities ?? []) {
      if (!e?.id || e.kind === "item") continue;
      out.set(e.id, {
        name: e.name || e.id,
        kind: e.kind || "?",
        floor: f,
        floorTitle,
        mapChar: roleMapChar(e),
        overlayEmotion: e.overlayEmotion || "none",
        mainTask: e.mainTask || "",
        npcState: e.npcState || "",
      });
    }
  }
  map.currentFloor = savedFloor;
  return out;
}

function relationLine(rel) {
  return relationStatLine(rel);
}

/**
 * Human-readable NPC relation debug panel (dev only — not in player snapshot).
 */
export function formatRelationsDebugText(session, pendingNpcId = "") {
  let relations = [];
  try {
    relations = JSON.parse(session.simDebugRelationsJson()).relations ?? [];
  } catch {
    relations = [];
  }

  const live = collectLiveNpcState(session);
  const relationById = loadRelationMap(session);
  const lines = [
    "═══ Tunnetilat (DEBUG) ═══",
    "Kirjoita debug tai paina Enter / Esc sulkeaksesi.",
    "",
  ];

  const needs = session.playerNeeds;
  if (needs) {
    lines.push(`Pelaaja: ${needs.formatLine()}`);
    lines.push("");
  }

  const pendingId = pendingNpcId || session.pendingEntityId || "";
  if (pendingId) {
    const pendingLive = live.get(pendingId);
    const pendingRel = relationById.get(pendingId);
    lines.push("── Kohtaaminen nyt ──");
    if (pendingLive) {
      const overlay = overlayLabel(pendingLive.overlayEmotion) || "—";
      lines.push(
        `  ${pendingLive.name} [${pendingLive.mapChar}] — ${kindLabel(pendingLive.kind)} | overlay: ${overlay}`,
      );
      if (pendingLive.mainTask) lines.push(`  tehtävä: ${pendingLive.mainTask}`);
      if (pendingLive.npcState) lines.push(`  tila: ${pendingLive.npcState}`);
    } else {
      lines.push(`  ${pendingId}`);
    }
    if (pendingRel) {
      lines.push(`  ${relationLine(pendingRel)}`);
    } else {
      lines.push("  (ei tallennettua suhdetta — oletusarvot)");
    }
    lines.push("");
  }

  const ids = new Set([...live.keys(), ...relationById.keys()]);
  const sorted = [...ids].sort((a, b) => {
    const fa = live.get(a)?.floor ?? 99;
    const fb = live.get(b)?.floor ?? 99;
    if (fa !== fb) return fa - fb;
    const na = live.get(a)?.name || a;
    const nb = live.get(b)?.name || b;
    return na.localeCompare(nb, "fi");
  });

  if (!sorted.length) {
    lines.push("(Ei NPC-suhteita vielä.)");
    return lines.join("\n");
  }

  let lastFloor = -1;
  for (const id of sorted) {
    const npc = live.get(id);
    const rel = relationById.get(id);
    const floor = npc?.floor ?? -1;
    if (floor >= 0 && floor !== lastFloor) {
      lastFloor = floor;
      lines.push(`── ${npc?.floorTitle || `Kerros ${floor + 1}`} ──`);
    }
    const name = npc?.name || id;
    const mapCh = npc?.mapChar || "?";
    const kind = npc ? kindLabel(npc.kind) : "?";
    const overlay = npc
      ? (overlayLabel(npc.overlayEmotion) || "—")
      : "—";
    const task = npc?.mainTask ? ` · ${npc.mainTask}` : "";
    lines.push(`  [${mapCh}] ${name} — ${kind} (${id})`);
    lines.push(`    overlay: ${overlay}${task}`);
    if (rel) {
      lines.push(`    ${relationLine(rel)}`);
    } else {
      lines.push("    (ei suhdetietoja — ei vielä tavattu)");
    }
  }

  return lines.join("\n");
}
