/** NPC–pelaaja-suhteiden tekstimuotoilu (hahmolista, debug-paneeli). */

export const OVERLAY_LABELS = {
  none: "—",
  angry: "vihainen",
  in_love: "rakastunut",
  jealous: "mustasukkainen",
  panicked: "paniikissa",
};

export function overlayLabel(overlayEmotion) {
  if (!overlayEmotion || overlayEmotion === "none") return "";
  return OVERLAY_LABELS[overlayEmotion] || overlayEmotion;
}

export function loadRelationMap(session) {
  try {
    const relations = JSON.parse(session.simDebugRelationsJson()).relations ?? [];
    return new Map(relations.map((r) => [r.npcId, r]));
  } catch {
    return new Map();
  }
}

export function relationStatLine(rel) {
  return [
    `viha ${rel.anger}`,
    `kunnioitus ${rel.respect}`,
    `ystävyys ${rel.friendliness}`,
    `rakkaus ${rel.love}`,
    `mustasukkaisuus ${rel.jealousy}`,
    `pelko ${rel.fear}`,
    `epäily ${rel.suspicion}`,
    `stressi ${rel.stress}`,
    `paniikki ${rel.panic}`,
    `häpeä ${rel.embarrassment}`,
  ].join(" · ");
}

/** Lyhyt tunnekuvaus pelaajaa kohtaan (ei pelkkää numeroa). */
export function summarizeMoodTowardsPlayer(rel, overlayEmotion = "none") {
  const traits = [];
  const overlay = overlayLabel(overlayEmotion);
  if (overlay) traits.push(overlay);
  if (rel.anger >= 60) traits.push("vihainen");
  if (rel.love >= 70) traits.push("rakastunut");
  if (rel.jealousy >= 60) traits.push("mustasukkainen");
  if (rel.panic >= 50) traits.push("paniikissa");
  if (rel.fear >= 60) traits.push("pelokas");
  if (rel.suspicion >= 60) traits.push("epäilevä");
  if (rel.friendliness >= 70) traits.push("ystävällinen");
  else if (rel.friendliness <= 30) traits.push("etäinen");
  if (rel.respect >= 70) traits.push("kunnioittava");
  else if (rel.respect <= 30) traits.push("halveksiva");
  const unique = [...new Set(traits)];
  return unique.length ? unique.join(", ") : "neutraali";
}

export function formatMoodTowardsPlayerLine(rel, overlayEmotion = "none") {
  const summary = summarizeMoodTowardsPlayer(rel, overlayEmotion);
  return `sinua kohtaan: ${summary} (${relationStatLine(rel)})`;
}
