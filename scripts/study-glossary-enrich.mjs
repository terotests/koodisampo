/**
 * Lyhennehakemiston rikastus: kuvaukset (käsin) + takaisinlinkit oppitunteihin.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";
import {
  GLOSSARY_SOURCE,
  HEADING_RE,
  PENDING_SECTION,
  PENDING_STUB,
  parseGlossaryTerms,
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
  let out = markdown;
  /** @type {string[]} */
  const added = [];
  /** @type {string[]} */
  const updated = [];
  /** @type {string[]} */
  const skipped = [];

  const existing = new Set(parseGlossaryTerms(out).map((t) => t.term.toUpperCase()));

  for (const [upper, entry] of Object.entries(descriptions)) {
    const term = entry._term || upper;
    if (entry.skip) {
      skipped.push(term);
      continue;
    }
    if (!entry.description?.trim()) continue;

    const scan = scannedMap.get(upper);
    const lessonIds = collectLessonIds(scan?.refs || []);
    const body = formatGlossaryEntryBody(term, entry.description, lessonIds);
    const anchor = termToAnchor(term);
    const block = `### ${term} {#${anchor}}\n\n${body}`;

    if (existing.has(upper)) {
      const replaced = replaceExistingEntry(out, term, anchor, body);
      if (replaced.changed) {
        out = replaced.markdown;
        if (replaced.wasPlaceholder) updated.push(term);
      }
      continue;
    }

    out = appendToPendingSection(out, block);
    existing.add(upper);
    added.push(term);
  }

  return { markdown: out, added, updated, skipped };
}

/** @param {string} markdown @param {string} term @param {string} anchor @param {string} body */
function replaceExistingEntry(markdown, term, anchor, body) {
  const lines = markdown.split("\n");
  /** @type {string[]} */
  const out = [];
  let i = 0;
  let changed = false;
  let wasPlaceholder = false;

  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(HEADING_RE);
    if (m && m[1].trim().toUpperCase() === term.toUpperCase()) {
      out.push(`### ${term} {#${anchor}}`, "", ...body.trimEnd().split("\n"), "");
      i += 1;
      while (i < lines.length) {
        const next = lines[i];
        if (next.match(HEADING_RE) || next.match(/^## /)) break;
        if (lines[i].includes(PENDING_STUB)) wasPlaceholder = true;
        i += 1;
      }
      changed = true;
      continue;
    }
    out.push(line);
    i += 1;
  }

  return { markdown: out.join("\n"), changed, wasPlaceholder };
}

/** @param {string} markdown @param {string} block */
function appendToPendingSection(markdown, block) {
  let out = markdown.replace(/\s+$/, "");
  if (!out.includes(PENDING_SECTION)) out += `\n\n${PENDING_SECTION}\n`;
  return `${out.trimEnd()}\n\n${block.trimEnd()}\n`;
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
