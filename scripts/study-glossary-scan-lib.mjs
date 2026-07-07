/**
 * Jaettu logiikka lyhenne-skannaukseen (study-glossary-scan.mjs + testit).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  GLOSSARY_DOC,
  loadGlossaryTerms,
  splitProtectedSegments,
  termToAnchor,
} from "./study-glossary.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(__dirname, "..");
export const FILTER_PATH = path.join(__dirname, "data/glossary-filter.json");
export const SCAN_OUTPUT_DIR = path.join(root, ".tmp");
export const SCAN_JSON = path.join(SCAN_OUTPUT_DIR, "glossary-scan.json");
export const SCAN_MD = path.join(SCAN_OUTPUT_DIR, "glossary-scan.md");

/** @typedef {{ file: string, line: number, excerpt: string }} GlossaryRef */
/** @typedef {{ term: string, anchor: string, inGlossary: boolean, manualLinkCount: number, refs: GlossaryRef[], filtered?: boolean, filterReason?: string }} ScannedTerm */

/** Lyhenteet: GUC, CI/CD, CVE (CVE-korjaukset), CVE:t */
const ABBREV_RE = /\b([A-Z][A-Z0-9]*(?:\/[A-Z][A-Z0-9]*)+)\b|\b([A-Z]{2,}(?:\/[A-Z]{2,})?)\b/g;
const HYPHEN_PREFIX_RE = /\b([A-Z]{2,})(?=-[a-zäöå])/g;
const POSSESSIVE_RE = /\b([A-Z]{2,}):t\b/g;

const MANUAL_LINK_RE = /\[([^\]]+)\]\(\/docs\/lyhenteet#([a-z0-9-]+)\)/gi;

const DEFAULT_FILTER = {
  ignore: [
    "US", "MD", "EN", "EU", "DE", "FI", "SE", "NO", "DK",
    "AND", "OR", "NOT", "AS", "IN", "ON", "BY", "IS", "IF", "TO", "NO", "OF", "AT", "IT",
    "ALL", "ANY", "SET", "ADD", "END", "FOR", "KEY", "OUT", "TOP", "USE", "NEW", "OLD",
    "SELECT", "FROM", "WHERE", "JOIN", "UPDATE", "DELETE", "INSERT", "INTO", "VALUES",
    "ORDER", "GROUP", "HAVING", "LIMIT", "OFFSET", "DISTINCT", "UNION", "EXISTS", "BETWEEN",
    "LIKE", "CASE", "WHEN", "THEN", "ELSE", "CREATE", "DROP", "ALTER", "TABLE", "INDEX",
    "FULL", "OUTER", "INNER", "LEFT", "RIGHT", "CROSS", "WITH", "NULL", "TRUE", "FALSE",
    "BEGIN", "COMMIT", "ROLLBACK", "GRANT", "REVOKE", "CHECK", "DEFAULT", "PRIMARY",
    "FOREIGN", "REFERENCES", "CONSTRAINT", "VIEW", "TRIGGER", "FUNCTION", "RETURNING",
    "LATERAL", "WINDOW", "OVER", "PARTITION", "RANGE", "ROWS", "ONLY", "ASC", "DESC",
    "NATURAL", "USING", "INTERSECT", "EXCEPT", "MINUS", "FETCH", "FIRST", "NEXT",
    "ALLOWED", "ALWAYS", "DEFERRABLE", "INITIALLY", "DEFERRED", "IMMEDIATE", "LOCAL",
    "GLOBAL", "TEMP", "TEMPORARY", "UNLOGGED", "MATERIALIZED", "RECURSIVE", "CYCLE",
    "SEARCH", "DEPTH", "BREADTH", "ORDinality", "FILTER", "WITHIN", "WITHOUT", "MATCHED",
    "ES", "BB", "AA", "CC", "OK", "VS", "EG", "IE", "ET", "EX", "ID",
  ],
  ignorePatterns: [
    "^[A-Z]$",
    "^(.)\\1+$",
  ],
};

/** @returns {{ ignore: Set<string>, ignorePatterns: RegExp[] }} */
export function loadGlossaryFilter(filterPath = FILTER_PATH) {
  /** @type {{ ignore?: string[], ignorePatterns?: string[] }} */
  let extra = {};
  if (fs.existsSync(filterPath)) {
    extra = JSON.parse(fs.readFileSync(filterPath, "utf8"));
  }
  const ignore = new Set([
    ...(DEFAULT_FILTER.ignore || []),
    ...(extra.ignore || []),
  ].map((t) => String(t).toUpperCase()));
  const ignorePatterns = [
    ...(DEFAULT_FILTER.ignorePatterns || []),
    ...(extra.ignorePatterns || []),
  ].map((p) => new RegExp(p, "i"));
  return { ignore, ignorePatterns };
}

/** @param {string} term */
export function normalizeAbbrevTerm(term) {
  return String(term || "").trim().toUpperCase();
}

/** @param {string} term @param {{ ignore: Set<string>, ignorePatterns: RegExp[] }} filter */
export function shouldFilterTerm(term, filter) {
  const upper = normalizeAbbrevTerm(term);
  if (filter.ignore.has(upper)) return "ignore-list";
  if (upper.length > 12 && !upper.includes("/")) return "too-long";
  if (filter.ignorePatterns.some((re) => re.test(upper))) return "ignore-pattern";
  return null;
}

/** @param {string} line */
function extractAbbrevCandidates(line) {
  /** @type {string[]} */
  const found = [];
  for (const re of [ABBREV_RE, POSSESSIVE_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(line))) {
      found.push(m[1] || m[2]);
    }
  }
  const hyphen = [...line.matchAll(HYPHEN_PREFIX_RE)].map((m) => m[1]);
  found.push(...hyphen);
  return found;
}

/** @param {string} text @param {number} max */
function excerptAround(text, max = 72) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

/** @returns {Generator<{ lineNum: number, text: string }>} */
export function* iterScannableLines(text) {
  const lines = text.split("\n");
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const segments = splitProtectedSegments(line);
    const prose = segments.filter((s) => !s.protected).map((s) => s.text).join("");
    if (prose.trim()) yield { lineNum: i + 1, text: prose };
  }
}

/** @param {string} text @param {string} relPath */
export function scanTextForAbbreviations(text, relPath) {
  /** @type {Map<string, GlossaryRef[]>} */
  const refs = new Map();

  for (const { lineNum, text: line } of iterScannableLines(text)) {
    for (const raw of extractAbbrevCandidates(line)) {
      const term = normalizeAbbrevTerm(raw);
      if (!refs.has(term)) refs.set(term, []);
      const list = refs.get(term);
      if (list.some((r) => r.file === relPath && r.line === lineNum)) continue;
      list.push({ file: relPath, line: lineNum, excerpt: excerptAround(line) });
    }
  }

  return refs;
}

/** @param {string} text */
export function countManualGlossaryLinks(text) {
  return [...text.matchAll(MANUAL_LINK_RE)].length;
}

/** @param {string} relPath @param {string} absPath */
export function scanMarkdownFile(relPath, absPath) {
  const text = fs.readFileSync(absPath, "utf8");
  const refs = scanTextForAbbreviations(text, relPath);
  const manualLinkCount = countManualGlossaryLinks(text);
  return { refs, manualLinkCount };
}

/** @param {string} relPath @param {string} absPath */
export function scanQuestionBankFile(relPath, absPath) {
  /** @type {Map<string, GlossaryRef[]>} */
  const refs = new Map();
  let manualLinkCount = 0;
  const bank = JSON.parse(fs.readFileSync(absPath, "utf8"));
  const questions = bank.questions || [];

  for (const q of questions) {
    const chunks = [
      q.prompt,
      q.correctFeedback,
      q.incorrectFeedback,
      ...(q.choices || []).map((c) => c.text),
    ].filter(Boolean);

    for (const chunk of chunks) {
      manualLinkCount += countManualGlossaryLinks(chunk);
      for (const { lineNum, text } of iterScannableLines(String(chunk))) {
        for (const raw of extractAbbrevCandidates(text)) {
          const term = normalizeAbbrevTerm(raw);
          if (!refs.has(term)) refs.set(term, []);
          refs.get(term).push({
            file: relPath,
            line: lineNum,
            excerpt: excerptAround(text),
          });
        }
      }
    }
  }

  return { refs, manualLinkCount };
}

/** @param {{ lessons?: boolean, questionBanks?: boolean }} [opts] */
export function collectScanSources(opts = {}) {
  const includeLessons = opts.lessons !== false;
  const includeBanks = opts.questionBanks !== false;
  /** @type {{ rel: string, abs: string, kind: "markdown" | "question-bank" }[]} */
  const sources = [];

  if (includeLessons) {
    const lessonsDir = path.join(root, "opiskelu/lessons");
    if (fs.existsSync(lessonsDir)) {
      for (const name of fs.readdirSync(lessonsDir)) {
        if (!name.endsWith(".md")) continue;
        if (name === "TODO.md" || name === "README.md") continue;
        sources.push({
          rel: `opiskelu/lessons/${name}`,
          abs: path.join(lessonsDir, name),
          kind: "markdown",
        });
      }
    }
  }

  if (includeBanks) {
    const banksDir = path.join(root, "content/question-banks");
    if (fs.existsSync(banksDir)) {
      for (const name of fs.readdirSync(banksDir)) {
        if (!name.endsWith(".json")) continue;
        sources.push({
          rel: `content/question-banks/${name}`,
          abs: path.join(banksDir, name),
          kind: "question-bank",
        });
      }
    }
  }

  return sources;
}

/** @param {{ lessons?: boolean, questionBanks?: boolean }} [opts] */
export function runGlossaryScan(opts = {}) {
  const glossaryTerms = loadGlossaryTerms();
  const glossarySet = new Set(glossaryTerms.map((t) => t.term.toUpperCase()));
  const filter = loadGlossaryFilter();

  /** @type {Map<string, { refs: GlossaryRef[], manualLinkCount: number }>} */
  const aggregate = new Map();

  for (const source of collectScanSources(opts)) {
    const { refs, manualLinkCount } = source.kind === "markdown"
      ? scanMarkdownFile(source.rel, source.abs)
      : scanQuestionBankFile(source.rel, source.abs);

    for (const [term, termRefs] of refs) {
      if (!aggregate.has(term)) aggregate.set(term, { refs: [], manualLinkCount: 0 });
      const entry = aggregate.get(term);
      entry.refs.push(...termRefs);
      entry.manualLinkCount += manualLinkCount;
    }
  }

  /** @type {ScannedTerm[]} */
  const terms = [];
  /** @type {{ term: string, reason: string }[]} */
  const filteredOut = [];

  for (const [term, { refs, manualLinkCount }] of [...aggregate.entries()].sort((a, b) => {
    if (b[1].refs.length !== a[1].refs.length) return b[1].refs.length - a[1].refs.length;
    return a[0].localeCompare(b[0]);
  })) {
    const filterReason = shouldFilterTerm(term, filter);
    const canonical = glossaryTerms.find((t) => t.term.toUpperCase() === term);
    const item = {
      term: canonical?.term || term,
      anchor: canonical?.anchor || termToAnchor(term),
      inGlossary: glossarySet.has(term),
      manualLinkCount,
      refs: dedupeRefs(refs),
      filtered: Boolean(filterReason),
      filterReason: filterReason || undefined,
    };
    if (filterReason) filteredOut.push({ term, reason: filterReason });
    else terms.push(item);
  }

  const missing = terms.filter((t) => !t.inGlossary);

  return {
    generatedAt: new Date().toISOString(),
    filterPath: path.relative(root, FILTER_PATH),
    outputJson: path.relative(root, SCAN_JSON),
    glossaryTermCount: glossaryTerms.length,
    sourceCount: collectScanSources(opts).length,
    totalCandidates: aggregate.size,
    filteredCount: filteredOut.length,
    missingCount: missing.length,
    terms,
    missing,
    filteredOut,
  };
}

/** @param {GlossaryRef[]} refs */
function dedupeRefs(refs) {
  const seen = new Set();
  /** @type {GlossaryRef[]} */
  const out = [];
  for (const r of refs) {
    const key = `${r.file}:${r.line}:${r.excerpt}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

/** @param {ReturnType<typeof runGlossaryScan>} report */
export function renderScanMarkdown(report) {
  const lines = [
    "# Lyhenne-skannaus (generoitu)",
    "",
    `> Päivitä: \`npm run study:glossary:scan\` — suodattimet: \`${report.filterPath}\``,
    "",
    `- Hakemistossa: **${report.glossaryTermCount}** termiä`,
    `- Lähteitä: **${report.sourceCount}**`,
    `- Kandidaatteja (raakaa): **${report.totalCandidates}** · suodatettu pois: **${report.filteredCount}**`,
    `- Puuttuu hakemistosta: **${report.missingCount}**`,
    "",
    "## Puuttuvat lyhenteet (suodatettu lista)",
    "",
    "| Termi | Viitteitä | Esimerkkilähde |",
    "|-------|-----------|----------------|",
  ];

  for (const t of report.missing) {
    const first = t.refs[0];
    const src = first ? `\`${first.file}:${first.line}\`` : "—";
    lines.push(`| ${t.term} | ${t.refs.length} | ${src} |`);
  }

  lines.push("", "## Kaikki löydetyt (ei suodatinta)", "");

  for (const t of report.terms) {
    const status = t.inGlossary ? "hakemistossa" : "**puuttuu**";
    lines.push(`### ${t.term} — ${status}`, "");
    lines.push(`Viitteitä: ${t.refs.length}`, "");
    for (const r of t.refs.slice(0, 5)) {
      lines.push(`- \`${r.file}:${r.line}\` — ${r.excerpt}`);
    }
    if (t.refs.length > 5) lines.push(`- … +${t.refs.length - 5} muuta`);
    lines.push("");
  }

  if (report.filteredOut.length) {
    lines.push("## Suodatettu pois (otteenä)", "");
    for (const f of report.filteredOut.slice(0, 40)) {
      lines.push(`- \`${f.term}\` (${f.reason})`);
    }
    if (report.filteredOut.length > 40) {
      lines.push(`- … +${report.filteredOut.length - 40} muuta`);
    }
    lines.push("");
  }

  lines.push(
    "## Komennot",
    "",
    "```bash",
    "npm run study:glossary:scan    # kerää kandidaatit → .tmp/glossary-scan.json",
    "npm run study:glossary:update  # lisää puuttuvat otsikot (ei ylikirjoita kuvauksia)",
    "npm run study:sync             # linkitä oppitunneissa",
    "```",
    "",
  );

  return lines.join("\n");
}

export { GLOSSARY_DOC, MANUAL_LINK_RE };
