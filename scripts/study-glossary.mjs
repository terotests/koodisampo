/**
 * Lyhennehakemisto: opiskelu/lyhenteet.md → termit + automaattinen linkitys oppitunneissa.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
export const GLOSSARY_SOURCE = path.join(root, "opiskelu/lyhenteet.md");
export const GLOSSARY_DOC = "/docs/lyhenteet";

/** @typedef {{ term: string, anchor: string }} GlossaryTerm */
/** @typedef {{ term: string, anchor: string, body: string }} GlossaryEntry */

export const HEADING_RE = /^###\s+(.+?)\s+\{#([a-z0-9-]+)\}\s*$/;
/** @deprecated Legacy section heading; removed from glossary layout. */
export const PENDING_SECTION = "## Odottaa kuvausta";
export const PENDING_STUB = "*(Kuvaus puuttuu — täydennä käsin.)*";

/** @param {{ term: string }} a @param {{ term: string }} b */
export function compareGlossaryTerms(a, b) {
  return a.term.localeCompare(b.term, "fi", { sensitivity: "base", numeric: true });
}

/** @returns {GlossaryTerm[]} */
export function parseGlossaryTerms(markdown) {
  return parseGlossaryDocument(markdown).entries.map(({ term, anchor }) => ({ term, anchor }));
}

/**
 * @param {string} text
 * @returns {GlossaryEntry[]}
 */
export function parseGlossaryEntryBlocks(text) {
  const lines = text.split("\n");
  /** @type {GlossaryEntry[]} */
  const entries = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(HEADING_RE);
    if (!m) {
      i += 1;
      continue;
    }
    const term = m[1].trim();
    const anchor = m[2];
    i += 1;
    const bodyLines = [];
    while (i < lines.length) {
      if (lines[i].match(HEADING_RE) || lines[i].match(/^## /)) break;
      bodyLines.push(lines[i]);
      i += 1;
    }
    while (bodyLines.length && bodyLines[bodyLines.length - 1] === "") bodyLines.pop();
    entries.push({ term, anchor, body: bodyLines.join("\n").trim() });
  }
  return entries;
}

/** @param {GlossaryEntry[]} entries */
function dedupeGlossaryEntries(entries) {
  /** @type {Map<string, GlossaryEntry>} */
  const byTerm = new Map();
  for (const entry of entries) {
    byTerm.set(entry.term.toUpperCase(), entry);
  }
  return [...byTerm.values()];
}

/**
 * @param {string} markdown
 * @returns {{ frontmatter: string, intro: string, entries: GlossaryEntry[] }}
 */
export function parseGlossaryDocument(markdown) {
  let rest = markdown;
  let frontmatter = "";
  if (rest.startsWith("---")) {
    const end = rest.indexOf("---", 3);
    if (end >= 0) {
      frontmatter = rest.slice(0, end + 3);
      rest = rest.slice(end + 3).replace(/^\n+/, "");
    }
  }

  const pendingIdx = rest.indexOf(PENDING_SECTION);
  let intro;
  let entrySource;

  if (pendingIdx >= 0) {
    const firstSection = rest.search(/^## /m);
    intro = (firstSection >= 0 ? rest.slice(0, firstSection) : rest.slice(0, pendingIdx)).trimEnd();
    entrySource = rest.slice(pendingIdx + PENDING_SECTION.length);
  } else {
    const firstEntry = rest.search(/^### /m);
    intro = (firstEntry >= 0 ? rest.slice(0, firstEntry) : rest).trimEnd();
    entrySource = rest;
  }

  return {
    frontmatter,
    intro,
    entries: dedupeGlossaryEntries(parseGlossaryEntryBlocks(entrySource)),
  };
}

/**
 * @param {{ frontmatter?: string, intro: string, entries: GlossaryEntry[] }} doc
 * @returns {string}
 */
export function formatGlossaryDocument({ frontmatter = "", intro, entries }) {
  const sorted = [...entries].sort(compareGlossaryTerms);
  /** @type {string[]} */
  const parts = [];
  if (frontmatter) {
    parts.push(frontmatter, "");
  }
  parts.push(intro.trimEnd(), "");
  for (const entry of sorted) {
    parts.push(`### ${entry.term} {#${entry.anchor}}`, "");
    if (entry.body) parts.push(entry.body, "");
  }
  return `${parts.join("\n").trimEnd()}\n`;
}

/** @param {string} markdown */
export function sortGlossaryMarkdown(markdown) {
  return formatGlossaryDocument(parseGlossaryDocument(markdown));
}

/** @returns {GlossaryTerm[]} */
export function loadGlossaryTerms() {
  const md = fs.readFileSync(GLOSSARY_SOURCE, "utf8");
  return parseGlossaryTerms(md);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Finnish and other extended letters count as word chars — avoids e.g. PID matching inside "pidä". */
const EXT_WORD_CHAR = String.raw`[A-Za-z0-9_\u00C0-\u024F]`;

/** @param {string} term */
function glossaryLinkPattern(term) {
  if (term === "C++") {
    return String.raw`(?<!\[)\b(?:C\/C\+\+|C\+\+(?:\d{2})?)(?![+0-9A-Za-z])`;
  }
  const escaped = escapeRegExp(term);
  return `(?<!\\[)(?<!${EXT_WORD_CHAR})${escaped}(?!${EXT_WORD_CHAR})(?!\\])`;
}

/**
 * Linkitä lyhenteet hakemistoon (ensimmäinen esiintymä per termi).
 * Ohittaa koodilohkot, inline-koodin ja olemassa olevat markdown-linkit.
 * @param {string} text
 * @param {GlossaryTerm[]} terms
 */
export function linkGlossaryTerms(text, terms = loadGlossaryTerms()) {
  const linked = new Set();
  const segments = splitProtectedSegments(text);

  return segments
    .map((seg) => {
      if (seg.protected) return seg.text;
      let out = seg.text;
      for (const { term, anchor } of terms) {
        if (linked.has(term)) continue;
        const re = new RegExp(glossaryLinkPattern(term), "i");
        if (!re.test(out)) continue;
        out = out.replace(re, `[${term}](${GLOSSARY_DOC}#${anchor})`);
        linked.add(term);
      }
      return out;
    })
    .join("");
}

/** @param {string} term */
export function termToAnchor(term) {
  const trimmed = term.trim();
  if (trimmed === "C++") return "cpp";
  return trimmed
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** @returns {{ text: string, protected: boolean }[]} */
export function splitProtectedSegments(text) {
  /** @type {{ text: string, protected: boolean }[]} */
  const segments = [];
  let i = 0;
  while (i < text.length) {
    if (text.startsWith("```", i)) {
      const end = text.indexOf("```", i + 3);
      const close = end < 0 ? text.length : end + 3;
      segments.push({ text: text.slice(i, close), protected: true });
      i = close;
      continue;
    }
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      const close = end < 0 ? text.length : end + 1;
      segments.push({ text: text.slice(i, close), protected: true });
      i = close;
      continue;
    }
    if (text[i] === "[") {
      const closeBracket = text.indexOf("]", i + 1);
      if (closeBracket >= 0 && text[closeBracket + 1] === "(") {
        const closeParen = text.indexOf(")", closeBracket + 2);
        if (closeParen >= 0) {
          segments.push({ text: text.slice(i, closeParen + 1), protected: true });
          i = closeParen + 1;
          continue;
        }
      }
    }
    if (text.startsWith("http://", i) || text.startsWith("https://", i)) {
      const end = findUrlEnd(text, i);
      segments.push({ text: text.slice(i, end), protected: true });
      i = end;
      continue;
    }
    const nextSpecial = findNextSpecial(text, i);
    if (nextSpecial > i) {
      segments.push({ text: text.slice(i, nextSpecial), protected: false });
      i = nextSpecial;
    } else {
      segments.push({ text: text[i], protected: false });
      i += 1;
    }
  }
  return segments;
}

function findUrlEnd(text, from) {
  let i = from;
  while (i < text.length && !/\s|[)\]}>,]/.test(text[i])) i += 1;
  return i;
}

function findNextSpecial(text, from) {
  const candidates = [
    text.indexOf("```", from),
    text.indexOf("`", from),
    text.indexOf("[", from),
    text.indexOf("http://", from),
    text.indexOf("https://", from),
  ].filter((n) => n >= 0);
  return candidates.length ? Math.min(...candidates) : text.length;
}

/**
 * Lisää puuttuvat ###-otsikot lyhennehakemistoon; olemassa olevia kuvauksia ei muokata.
 * @param {string} markdown
 * @param {{ term: string, anchor?: string }[]} terms
 * @returns {{ markdown: string, added: string[] }}
 */
export function appendMissingGlossaryEntries(markdown, terms) {
  const doc = parseGlossaryDocument(markdown);
  const existing = new Set(doc.entries.map((t) => t.term.toUpperCase()));
  const toAdd = terms.filter((t) => !existing.has(t.term.toUpperCase()));
  if (!toAdd.length) return { markdown, added: [] };

  for (const t of toAdd) {
    doc.entries.push({
      term: t.term,
      anchor: t.anchor || termToAnchor(t.term),
      body: PENDING_STUB,
    });
  }

  return { markdown: formatGlossaryDocument(doc), added: toAdd.map((t) => t.term) };
}

export function syncGlossaryDoc() {
  const dest = path.join(root, "study/docs/lyhenteet.md");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(GLOSSARY_SOURCE, dest);
}
