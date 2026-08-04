/**
 * Pure helpers for standalone question drill (no GameSession).
 */

export function filterTrainQuestions(all, specialty, kidsMode, allTopics) {
  const list = Array.isArray(all) ? all : [];
  if (kidsMode) {
    return list.filter((q) => q.bankId === "kids-easy");
  }
  const nonKids = list.filter((q) => q.bankId !== "kids-easy");
  if (allTopics || !specialty) return nonKids;
  const focused = nonKids.filter((q) => q.domain === specialty);
  return focused.length > 0 ? focused : nonKids;
}

export function pickNextTrainQuestion(pool, recentIds, random = Math.random) {
  if (!Array.isArray(pool) || pool.length === 0) return null;
  const recentWindow = Math.min(12, Math.max(3, Math.floor(pool.length / 3)));
  const recent = new Set((recentIds || []).slice(-recentWindow));
  let candidates = pool.filter((q) => !recent.has(q.id));
  if (candidates.length === 0) candidates = pool;
  const idx = Math.floor(random() * candidates.length);
  return candidates[idx] ?? null;
}
