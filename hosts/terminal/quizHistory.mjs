/** Kysymyshistoria — globaali + per-NPC; ei toista kysyttyjä turhaan. */

const RECENT_CAP = 32;

export function emptyQuizHistory() {
  return {
    byEntity: {},
    global: { asked: [], correct: [], recent: [] },
  };
}

function emptyGlobal() {
  return { asked: [], correct: [], recent: [] };
}

export function normalizeQuizHistory(raw) {
  if (!raw || typeof raw !== "object") return emptyQuizHistory();

  const byEntityIn = raw.byEntity && typeof raw.byEntity === "object" ? raw.byEntity : {};
  const byEntity = {};
  for (const [entityId, rec] of Object.entries(byEntityIn)) {
    if (!rec || typeof rec !== "object") continue;
    byEntity[entityId] = {
      asked: Array.isArray(rec.asked) ? [...rec.asked] : [],
      correct: Array.isArray(rec.correct) ? [...rec.correct] : [],
    };
  }

  const global = raw.global && typeof raw.global === "object" ? raw.global : {};
  const asked = Array.isArray(global.asked) ? [...global.asked] : [];
  const correct = Array.isArray(global.correct) ? [...global.correct] : [];
  const recent = Array.isArray(global.recent) ? [...global.recent] : [];

  // Migroi vanhat tallenteet (vain byEntity) globaaliin.
  for (const rec of Object.values(byEntity)) {
    for (const id of rec.asked) {
      if (!asked.includes(id)) asked.push(id);
    }
    for (const id of rec.correct) {
      if (!correct.includes(id)) correct.push(id);
    }
  }

  return {
    byEntity,
    global: {
      asked,
      correct,
      recent: recent.slice(-RECENT_CAP),
    },
  };
}

function touchEntity(history, entityId) {
  if (!history.byEntity[entityId]) {
    history.byEntity[entityId] = { asked: [], correct: [] };
  }
  return history.byEntity[entityId];
}

function pushUnique(list, id) {
  if (!id || list.includes(id)) return list;
  return [...list, id];
}

function pushRecent(recent, questionId) {
  const without = recent.filter((id) => id !== questionId);
  const next = [...without, questionId];
  if (next.length > RECENT_CAP) return next.slice(-RECENT_CAP);
  return next;
}

/** Merkitse kysymys näytetyksi heti kun quiz avataan. */
export function recordQuizShown(history, entityId, questionId) {
  const h = normalizeQuizHistory(history);
  if (!questionId) return h;

  if (entityId) {
    const rec = touchEntity(h, entityId);
    rec.asked = pushUnique(rec.asked, questionId);
  }

  h.global.asked = pushUnique(h.global.asked, questionId);
  h.global.recent = pushRecent(h.global.recent, questionId);
  return h;
}

export function recordQuizAnswer(history, entityId, questionId, correct) {
  let h = recordQuizShown(history, entityId, questionId);
  if (!questionId || !correct) return h;

  h.global.correct = pushUnique(h.global.correct, questionId);
  if (entityId) {
    const rec = touchEntity(h, entityId);
    rec.correct = pushUnique(rec.correct, questionId);
  }
  return h;
}

export function getMasteredQuestionIds(history, entityId) {
  const h = normalizeQuizHistory(history);
  const entityCorrect = h.byEntity[entityId]?.correct ?? [];
  const globalCorrect = h.global.correct ?? [];
  return [...new Set([...entityCorrect, ...globalCorrect])];
}

export function getAskedQuestionIds(history, entityId) {
  const h = normalizeQuizHistory(history);
  const entityAsked = h.byEntity[entityId]?.asked ?? [];
  const globalAsked = h.global.asked ?? [];
  return [...new Set([...entityAsked, ...globalAsked])];
}

export function getGlobalAskedQuestionIds(history) {
  return normalizeQuizHistory(history).global.asked ?? [];
}

export function getGlobalCorrectQuestionIds(history) {
  return normalizeQuizHistory(history).global.correct ?? [];
}

export function getRecentQuestionIds(history, limit = 15) {
  const recent = normalizeQuizHistory(history).global.recent ?? [];
  if (limit <= 0) return [];
  return recent.slice(-limit);
}
