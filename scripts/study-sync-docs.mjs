#!/usr/bin/env node
/**
 * Synkronoi kysymyspankki → Docusaurus-docs (yksi scrollattava sivu per domain).
 * Käyttö: node scripts/study-sync-docs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";
import { DOMAIN_LABELS, CHAPTER_LABELS } from "../hosts/shared/studyLessonLinks.mjs";
import { linkGlossaryTerms, syncGlossaryDoc } from "./study-glossary.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const docsRoot = path.join(root, "study/docs/topics");
const lessonsDir = path.join(root, "opiskelu/lessons");

const DOMAIN_ORDER = [
  "cpp", "javascript", "postgres", "docker", "linux", "qt", "scrum",
  "git", "backend", "security", "robotframework", "rust", "space",
];

/** Ei julkaista opiskelusivustolle toistaiseksi (esim. lapsimoodin kysymykset). */
const EXCLUDED_DOC_DOMAINS = new Set(["kids"]);

function resolveSourceUrl(q) {
  const url = String(q.sourceUrl || "").trim();
  if (/^https?:\/\//i.test(url)) return url;
  const feature = String(q.featureId || "").trim();
  if (/^https?:\/\//i.test(feature)) return feature;
  return null;
}

function escapeMdProseSegment(s) {
  return String(s || "")
    .replace(/</g, "&lt;")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}");
}

/** MDX-turva prose-osille; inline-koodi (`...`) jätetään koskematta. */
function escapeMdProse(s) {
  return String(s || "")
    .split(/(`[^`]*`)/g)
    .map((part) =>
      part.startsWith("`") && part.endsWith("`") ? part : escapeMdProseSegment(part),
    )
    .join("");
}

function readManualLesson(questionId) {
  const file = path.join(lessonsDir, `${questionId}.md`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8").trim();
}

function stripFrontmatter(md) {
  if (!md.startsWith("---")) return md;
  const end = md.indexOf("---", 3);
  if (end < 0) return md;
  return md.slice(end + 3).trim();
}

function stripLeadingTitle(md) {
  return md.replace(/^#\s+.+\n+/, "").trim();
}

/** Oppitunnin ##-osiot → pieni aliotsikko (ei TOC:ssa, alle kysymyksen ###). */
function demoteLessonSectionHeadings(md) {
  return md.replace(/^## (.+)$/gm, '<p class="lesson-section-heading">$1</p>');
}

function buildStubSection(q) {
  const correct = (q.choices || []).find((c) => c.correct);
  const lines = [
    `*Vaikeus ${q.difficulty} · kysymys \`${q.id}\`*`,
    "",
    "**Oikea vastaus:**",
    "",
    correct?.text ? escapeMdProse(correct.text) : "(ei valintaa)",
    "",
  ];
  if (q.correctFeedback) {
    lines.push(escapeMdProse(q.correctFeedback), "");
  }
  if (q.sourceUrl) {
    const sourceUrl = resolveSourceUrl(q);
    if (sourceUrl) lines.push(`[Lue lisää](${sourceUrl})`, "");
  }
  lines.push(
    "> **Luonnos** — kirjoita täysi oppitunti tiedostoon",
    `> \`opiskelu/lessons/${q.id}.md\` ja aja \`npm run study:sync\`.`,
  );
  return lines.join("\n");
}

function buildManualSection(q, body) {
  let content = stripFrontmatter(body);
  content = stripLeadingTitle(content);
  content = demoteLessonSectionHeadings(content);
  content = linkGlossaryTerms(content);
  const lines = [
    `*Vaikeus ${q.difficulty} · kysymys \`${q.id}\`*`,
    "",
    content,
  ];
  if (q.sourceUrl && !content.includes(q.sourceUrl)) {
    const sourceUrl = resolveSourceUrl(q);
    if (sourceUrl && !content.includes(sourceUrl)) {
      lines.push("", `[Lue lisää](${sourceUrl})`);
    }
  }
  return lines.join("\n");
}

function buildDomainPage(domain, domainQuestions, readyIds, sidebarPosition) {
  const label = DOMAIN_LABELS[domain] || domain;
  const chapters = [...new Set(domainQuestions.map((q) => q.chapter))].sort();

  const lines = [
    "---",
    `title: ${label}`,
    `sidebar_label: ${label}`,
    `slug: /topics/${domain}`,
    `sidebar_position: ${sidebarPosition}`,
    "toc_min_heading_level: 2",
    "toc_max_heading_level: 3",
    "---",
    "",
    `# ${label}`,
    "",
    `${domainQuestions.length} kysymystä · ${chapters.length} aihealuetta. Scrollaa tai käytä oikean reunan sisällysluetteloa.`,
    "",
    "## Sisällys",
    "",
  ];

  for (const chapter of chapters) {
    const chapterLabel = CHAPTER_LABELS[chapter] || chapter;
    lines.push(`- [${chapterLabel}](#${chapter})`);
  }
  lines.push("");

  for (const chapter of chapters) {
    const chapterLabel = CHAPTER_LABELS[chapter] || chapter;
    const chapterQs = domainQuestions
      .filter((q) => q.chapter === chapter)
      .sort((a, b) => a.id.localeCompare(b.id));

    lines.push(`## ${chapterLabel} {#${chapter}}`, "");

    for (const q of chapterQs) {
      const manual = readManualLesson(q.id);
      if (manual) readyIds.add(q.id);
      const section = manual ? buildManualSection(q, manual) : buildStubSection(q);
      lines.push(`### ${escapeMdProse(q.prompt)} {#${q.id}}`, "", section, "", "---", "");
    }
  }

  return lines.join("\n");
}

function sortDomains(domains) {
  return [...domains].sort((a, b) => {
    const ai = DOMAIN_ORDER.indexOf(a);
    const bi = DOMAIN_ORDER.indexOf(b);
    if (ai >= 0 && bi >= 0) return ai - bi;
    if (ai >= 0) return -1;
    if (bi >= 0) return 1;
    return a.localeCompare(b);
  });
}

function main() {
  const questions = listAllQuestions().filter((q) => !EXCLUDED_DOC_DOMAINS.has(q.domain));
  if (fs.existsSync(docsRoot)) {
    fs.rmSync(docsRoot, { recursive: true, force: true });
  }
  fs.mkdirSync(docsRoot, { recursive: true });

  const domains = sortDomains([...new Set(questions.map((q) => q.domain))]);
  const readyIds = new Set();

  domains.forEach((domain, index) => {
    const domainQuestions = questions.filter((q) => q.domain === domain);
    const doc = buildDomainPage(domain, domainQuestions, readyIds, index + 1);
    fs.writeFileSync(path.join(docsRoot, `${domain}.md`), doc);
  });

  syncGlossaryDoc();

  const manifest = {
    generatedAt: new Date().toISOString(),
    layout: "flat-domain-scroll",
    totalQuestions: questions.length,
    readyLessons: readyIds.size,
    domains: domains.map((d) => ({
      id: d,
      label: DOMAIN_LABELS[d] || d,
      slug: `/docs/topics/${d}/`,
      questionCount: questions.filter((q) => q.domain === d).length,
    })),
  };
  fs.mkdirSync(path.join(root, "content"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "content/study-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  console.log(`study-sync: ${questions.length} questions → ${domains.length} domain pages, ${readyIds.size} ready lessons`);
}

main();
