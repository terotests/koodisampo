/**
 * Lyhennehakemiston rikastus: kuvaukset (käsin) + takaisinlinkit oppitunteihin.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";
import {
  GLOSSARY_SOURCE,
  PENDING_STUB,
  formatGlossaryDocument,
  parseGlossaryDocument,
  termToAnchor,
} from "./study-glossary.mjs";
import { SCAN_JSON } from "./study-glossary-scan-lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(__dirname, "..");
export const DESCRIPTIONS_DIR = path.join(__dirname, "data/glossary-descriptions");
export const DESCRIPTIONS_INDEX = path.join(DESCRIPTIONS_DIR, "index.json");

/** @typedef {{ description: string, skip?: boolean, section?: string }} GlossaryDescriptionEntry */

let questionDomainCache = null;

/** @returns {Map<string, string>} */
export function loadQuestionDomainMap() {
  if (questionDomainCache) return questionDomainCache;
  questionDomainCache = new Map(
    listAllQuestions().map((q) => [q.id, q.domain || "general"]),
  );
  return questionDomainCache;
}

/** @param {string} questionId @param {Map<string, string>} domainMap */
export function docLinkForQuestion(questionId, domainMap = loadQuestionDomainMap()) {
  const domain = domainMap.get(questionId) || guessDomainFromQuestionId(questionId);
  return `/docs/topics/${domain}#${questionId}`;
}

/** @param {string} questionId */
export function guessDomainFromQuestionId(questionId) {
  const m = questionId.match(/^[a-z0-9]+-([a-z]+)-/);
  if (m) return m[1];
  if (/^(apt-|systemd-|journalctl|avahi|nmcli|ss-|resolv)/.test(questionId)) return "linux";
  if (/^docker|^compose/.test(questionId)) return "docker";
  if (/^(sqd-|exp-pg|b\d+-pg)/.test(questionId)) return "postgres";
  if (/^(b\d+-js|exp-js)/.test(questionId)) return "javascript";
  if (/^(b\d+-qt|exp-qt)/.test(questionId)) return "qt";
  if (/^b\d+-cpp/.test(questionId)) return "cpp";
  if (/^b\d+-scrum/.test(questionId)) return "scrum";
  return "general";
}

/** @param {{ file: string, questionId?: string }[]} refs */
export function collectLessonIds(refs) {
  /** @type {string[]} */
  const ids = [];
  const seen = new Set();
  for (const ref of refs) {
    let id = ref.questionId;
    if (!id) {
      const m = ref.file.match(/opiskelu\/lessons\/(.+)\.md$/);
      id = m?.[1];
    }
    if (!id || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

/** @param {string[]} lessonIds @param {number} [maxLinks] */
export function formatBackLinks(lessonIds, maxLinks = 12) {
  if (!lessonIds.length) return "";
  const domainMap = loadQuestionDomainMap();
  const links = lessonIds.slice(0, maxLinks).map((id) => {
    const href = docLinkForQuestion(id, domainMap);
    return `[\`${id}\`](${href})`;
  });
  let line = `**Oppitunnit:** ${links.join(", ")}`;
  if (lessonIds.length > maxLinks) line += ` (+${lessonIds.length - maxLinks} muuta)`;
  return line;
}

/**
 * @param {string} term
 * @param {string} description
 * @param {string[]} lessonIds
 */
export function formatGlossaryEntryBody(term, description, lessonIds) {
  const parts = [description.trim()];
  const back = formatBackLinks(lessonIds);
  if (back) parts.push("", back);
  return `${parts.join("\n")}\n`;
}

/** @returns {Record<string, GlossaryDescriptionEntry>} */
export function loadAllDescriptions() {
  /** @type {Record<string, GlossaryDescriptionEntry>} */
  const merged = {};
  if (!fs.existsSync(DESCRIPTIONS_DIR)) return merged;

  const files = fs.existsSync(DESCRIPTIONS_INDEX)
    ? JSON.parse(fs.readFileSync(DESCRIPTIONS_INDEX, "utf8")).files || []
    : fs.readdirSync(DESCRIPTIONS_DIR).filter((f) => f.endsWith(".json") && f !== "index.json");

  for (const file of files) {
    const abs = path.join(DESCRIPTIONS_DIR, file);
    if (!fs.existsSync(abs)) continue;
    const data = JSON.parse(fs.readFileSync(abs, "utf8"));
    for (const [term, entry] of Object.entries(data)) {
      if (term.startsWith("_")) continue;
      merged[term.toUpperCase()] = { ...entry, _term: term };
    }
  }
  return merged;
}

/** @param {string} markdown @param {Record<string, GlossaryDescriptionEntry>} descriptions @param {import('./study-glossary-scan-lib.mjs').ScannedTerm[]} scanned */
export function applyGlossaryEnrichment(markdown, descriptions, scanned) {
  const scannedMap = new Map(scanned.map((t) => [t.term.toUpperCase(), t]));
  const doc = parseGlossaryDocument(markdown);
  const existing = new Map(doc.entries.map((e) => [e.term.toUpperCase(), e]));
  /** @type {string[]} */
  const added = [];
  /** @type {string[]} */
  const updated = [];
  /** @type {string[]} */
  const skipped = [];

  for (const [upper, entry] of Object.entries(descriptions)) {
    const term = entry._term || upper;
    if (entry.skip) {
      skipped.push(term);
      continue;
    }
    if (!entry.description?.trim()) continue;

    const scan = scannedMap.get(upper);
    const lessonIds = collectLessonIds(scan?.refs || []);
    const body = formatGlossaryEntryBody(term, entry.description, lessonIds).trimEnd();
    const anchor = termToAnchor(term);
    const current = existing.get(upper);

    if (current) {
      const wasPlaceholder = current.body.includes(PENDING_STUB);
      current.term = term;
      current.anchor = anchor;
      current.body = body;
      if (wasPlaceholder) updated.push(term);
      continue;
    }

    doc.entries.push({ term, anchor, body });
    existing.set(upper, doc.entries[doc.entries.length - 1]);
    added.push(term);
  }

  return { markdown: formatGlossaryDocument(doc), added, updated, skipped };
}

/** @param {boolean} [dryRun] */
export function applyDescriptionsFromFiles(dryRun = false) {
  if (!fs.existsSync(SCAN_JSON)) {
    throw new Error(`Scan missing: ${SCAN_JSON}. Run npm run study:glossary:scan first.`);
  }
  const report = JSON.parse(fs.readFileSync(SCAN_JSON, "utf8"));
  const descriptions = loadAllDescriptions();
  const markdown = fs.readFileSync(GLOSSARY_SOURCE, "utf8");
  const result = applyGlossaryEnrichment(markdown, descriptions, report.missing);

  if (!dryRun && (result.added.length || result.updated.length)) {
    fs.writeFileSync(GLOSSARY_SOURCE, result.markdown);
  }

  return result;
}

/** Vie puuttuvat termit + konteksti subagentti-erille. */
export function exportDescriptionBatches(batchCount = 5) {
  if (!fs.existsSync(SCAN_JSON)) throw new Error("Run scan first");
  const report = JSON.parse(fs.readFileSync(SCAN_JSON, "utf8"));
  const descriptions = loadAllDescriptions();
  const pending = report.missing.filter((t) => {
    const d = descriptions[t.term.toUpperCase()];
    return !d?.description?.trim();
  });

  const batchSize = Math.ceil(pending.length / batchCount);
  fs.mkdirSync(DESCRIPTIONS_DIR, { recursive: true });

  /** @type {string[]} */
  const files = [];
  for (let i = 0; i < batchCount; i++) {
    const slice = pending.slice(i * batchSize, (i + 1) * batchSize);
    if (!slice.length) continue;
    const payload = {};
    for (const t of slice) {
      payload[t.term] = {
        description: "",
        skip: false,
        context: t.refs.slice(0, 3).map((r) => ({
          file: r.file,
          questionId: r.questionId || r.file.match(/lessons\/(.+)\.md$/)?.[1],
          excerpt: r.excerpt,
        })),
      };
    }
    const name = `batch-${String(i + 1).padStart(2, "0")}.json`;
    fs.writeFileSync(path.join(DESCRIPTIONS_DIR, name), `${JSON.stringify(payload, null, 2)}\n`);
    files.push(name);
  }

  fs.writeFileSync(DESCRIPTIONS_INDEX, `${JSON.stringify({ files }, null, 2)}\n`);
  return { pending: pending.length, files };
}
