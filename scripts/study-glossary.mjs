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

const HEADING_RE = /^###\s+(.+?)\s+\{#([a-z0-9-]+)\}\s*$/;

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

/** @returns {{ text: string, protected: boolean }[]} */
function splitProtectedSegments(text) {
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

function findNextSpecial(text, from) {
  const candidates = [
    text.indexOf("```", from),
    text.indexOf("`", from),
    text.indexOf("[", from),
  ].filter((n) => n >= 0);
  return candidates.length ? Math.min(...candidates) : text.length;
}

export function syncGlossaryDoc() {
  const dest = path.join(root, "study/docs/lyhenteet.md");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(GLOSSARY_SOURCE, dest);
}
