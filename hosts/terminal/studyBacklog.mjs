/** Opiskelujono — väärät vastaukset + käyttäjän merkinnät "Kysy AI:lta". */

export function emptyStudyBacklog() {
  return { wantMore: [], wrongAnswers: [] };
}

function normalizeEntry(raw, defaults = {}) {
  if (!raw || typeof raw !== "object") return null;
  const questionId = String(raw.questionId || "");
  if (!questionId) return null;
  return {
    questionId,
    prompt: String(raw.prompt || ""),
    domain: String(raw.domain || ""),
    chapter: String(raw.chapter || ""),
    featureId: String(raw.featureId || ""),
    entityName: String(raw.entityName || ""),
    at: typeof raw.at === "number" ? raw.at : Date.now(),
    correct: raw.correct === true,
    teaching: String(raw.teaching || ""),
    ...defaults,
  };
}

export function normalizeStudyBacklog(raw) {
  if (!raw || typeof raw !== "object") return emptyStudyBacklog();
  const wantMore = [];
  const wrongAnswers = [];
  if (Array.isArray(raw.wantMore)) {
    for (const item of raw.wantMore) {
      const e = normalizeEntry(item);
      if (e) wantMore.push(e);
    }
  }
  if (Array.isArray(raw.wrongAnswers)) {
    for (const item of raw.wrongAnswers) {
      const e = normalizeEntry(item);
      if (e) wrongAnswers.push(e);
    }
  }
  return { wantMore, wrongAnswers };
}

export function questionMetaFromQuiz(quiz, correct, teaching = "") {
  const q = quiz?.question ?? {};
  const entity = quiz?.entity ?? {};
  return {
    questionId: q.id || "",
    prompt: q.prompt || "",
    domain: q.domain || "",
    chapter: q.chapter || "",
    featureId: q.featureId || "",
    entityName: entity.name || entity.id || "",
    correct: correct === true,
    teaching: teaching || q.correctFeedback || q.wrongFeedback || "",
    at: Date.now(),
  };
}

function upsertByQuestionId(list, entry) {
  const idx = list.findIndex((x) => x.questionId === entry.questionId);
  if (idx >= 0) {
    const next = [...list];
    next[idx] = { ...next[idx], ...entry, at: Date.now() };
    return next;
  }
  return [...list, entry];
}

export function recordWrongAnswer(backlog, meta) {
  const b = normalizeStudyBacklog(backlog);
  if (!meta?.questionId) return b;
  return {
    ...b,
    wrongAnswers: upsertByQuestionId(b.wrongAnswers, { ...meta, correct: false, at: Date.now() }),
  };
}

export function markWantMoreStudy(backlog, meta) {
  const b = normalizeStudyBacklog(backlog);
  if (!meta?.questionId) return b;
  return {
    ...b,
    wantMore: upsertByQuestionId(b.wantMore, { ...meta, at: Date.now() }),
  };
}

export function studyBacklogCounts(backlog) {
  const b = normalizeStudyBacklog(backlog);
  return {
    wantMore: b.wantMore.length,
    wrongAnswers: b.wrongAnswers.length,
    total: b.wantMore.length + b.wrongAnswers.length,
  };
}

function formatWhen(ts) {
  try {
    return new Date(ts).toISOString().slice(0, 10);
  } catch {
    return "?";
  }
}

function formatEntryLine(entry, i) {
  const tag = [entry.domain, entry.chapter].filter(Boolean).join("/") || "yleinen";
  const who = entry.entityName ? ` (${entry.entityName})` : "";
  return `  [${i + 1}] ${entry.prompt}${who}\n      ${tag} — ${formatWhen(entry.at)}`;
}

/** Terminaali/web-teksti opiskelulistasta. */
export function formatStudyList(backlog) {
  const b = normalizeStudyBacklog(backlog);
  const lines = [
    "═══ OPISKELULISTA ═══",
    "",
  ];

  lines.push(`── Kysy AI:lta (${b.wantMore.length}) ──`);
  if (b.wantMore.length === 0) {
    lines.push("  (tyhjä — merkitse [m] kysymyksen palautteen jälkeen)");
  } else {
    b.wantMore.forEach((e, i) => lines.push(formatEntryLine(e, i)));
  }

  lines.push("");
  lines.push(`── Väärin vastatut (${b.wrongAnswers.length}) ──`);
  if (b.wrongAnswers.length === 0) {
    lines.push("  (ei vielä väärää vastausta tallennettuna)");
  } else {
    b.wrongAnswers.forEach((e, i) => lines.push(formatEntryLine(e, i)));
  }

  lines.push("");
  lines.push("b / Enter / m = takaisin kartalle");
  return lines.join("\n");
}
