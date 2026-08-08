/**
 * Language / standard version tags on quiz questions (e.g. C++17, ES2020, Qt 6).
 * Optional metadata — omit when the topic is version-agnostic.
 */

/** @param {unknown} raw */
export function normalizeVersions(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = new Set();
  for (const item of raw) {
    const v = String(item ?? "").trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

/**
 * Prefer question.versions; fall back to bank.defaultVersions.
 * @param {Record<string, unknown> | null | undefined} question
 * @param {Record<string, unknown> | null | undefined} bank
 */
export function resolveQuestionVersions(question, bank = null) {
  const fromQ = normalizeVersions(question?.versions);
  if (fromQ.length) return fromQ;
  return normalizeVersions(bank?.defaultVersions);
}

/** @param {unknown} versions */
export function formatVersionTags(versions) {
  return normalizeVersions(versions).join(" · ");
}

/**
 * @param {unknown} versions
 * @param {{ prefix?: string }} [opts]
 */
export function versionTagsLine(versions, opts = {}) {
  const label = formatVersionTags(versions);
  if (!label) return "";
  const prefix = opts.prefix ?? "Versio";
  return `${prefix}: ${label}`;
}

/**
 * Compact meta fragment for study headers, e.g. " · C++17 · ES2020".
 * @param {unknown} versions
 */
export function versionTagsMetaSuffix(versions) {
  const label = formatVersionTags(versions);
  return label ? ` · ${label}` : "";
}
