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

export const HEADING_RE = /^###\s+(.+?)\s+\{#([a-z0-9-]+)\}\s*$/;
export const PENDING_SECTION = "## Odottaa kuvausta";
export const PENDING_STUB = "*(Kuvaus puuttuu — täydennä käsin.)*";

/** @returns {GlossaryTerm[]} */
export function parseGlossaryTerms(markdown) {
  const terms = [];
  for (const line of markdown.split("\n")) {
    const m = line.match(HEADING_RE);
    if (!m) continue;
    terms.push({ term: m[1].trim(), anchor: m[2] });
  }
  return terms;
}

/** @returns {GlossaryTerm[]} */
export function loadGlossaryTerms() {
  const md = fs.readFileSync(GLOSSARY_SOURCE, "utf8");
  return parseGlossaryTerms(md);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
        const re = new RegExp(`(?<!\\[)\\b${escapeRegExp(term)}\\b(?!\\])`, "i");
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
  return term
    .trim()
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
  const existing = new Set(parseGlossaryTerms(markdown).map((t) => t.term.toUpperCase()));
  const toAdd = terms.filter((t) => !existing.has(t.term.toUpperCase()));
  if (!toAdd.length) return { markdown, added: [] };

  let out = markdown.replace(/\s+$/, "");
  if (!out.includes(PENDING_SECTION)) {
    out += `\n\n${PENDING_SECTION}\n`;
  }

  const blocks = toAdd.map((t) => {
    const anchor = t.anchor || termToAnchor(t.term);
    return `\n### ${t.term} {#${anchor}}\n\n${PENDING_STUB}\n`;
  });
  out += blocks.join("");
  out += "\n";
  return { markdown: out, added: toAdd.map((t) => t.term) };
}

export function syncGlossaryDoc() {
  const dest = path.join(root, "study/docs/lyhenteet.md");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(GLOSSARY_SOURCE, dest);
}
