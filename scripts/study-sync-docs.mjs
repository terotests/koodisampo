#!/usr/bin/env node
/**
 * Synkronoi kysymyspankki → Docusaurus-docs + edistymisraportti.
 * Käyttö: node scripts/study-sync-docs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";
import {
  DOMAIN_LABELS,
  CHAPTER_LABELS,
  lessonRefForQuestion,
  lessonDocPath,
} from "../hosts/shared/studyLessonLinks.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const docsRoot = path.join(root, "study/docs/topics");
const lessonsDir = path.join(root, "opiskelu/lessons");
const progressPath = path.join(root, "study/docs/progress.md");

function slugify(name) {
  return String(name).replace(/[^a-zA-Z0-9._-]+/g, "-");
}

function yamlEscape(s) {
  return String(s).replace(/"/g, '\\"');
}

/** Estää MDX/JSX-tulkinnan automaattisissa oppitunneissa. */
function escapeMdProse(s) {
  return String(s || "")
    .replace(/</g, "&lt;")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}");
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

function buildStubLesson(q, ref) {
  const correct = (q.choices || []).find((c) => c.correct);
  const wrong = (q.choices || []).filter((c) => !c.correct);
  const lines = [
    "---",
    `id: ${q.id}`,
    `title: "${yamlEscape(q.prompt)}"`,
    `sidebar_label: "${yamlEscape(q.id)}"`,
    `slug: /topics/${ref}`,
    `domain: ${q.domain}`,
    `chapter: ${q.chapter}`,
    `difficulty: ${q.difficulty}`,
    `questionId: ${q.id}`,
    "status: stub",
    "---",
    "",
    `# ${escapeMdProse(q.prompt)}`,
    "",
    `*Aihe: ${q.domain} / ${q.chapter} · vaikeus ${q.difficulty} · kysymys \`${q.id}\`*`,
    "",
    "## Kysymys",
    "",
    escapeMdProse(q.prompt),
    "",
    "## Oikea vastaus",
    "",
    correct?.text ? `**${escapeMdProse(correct.text)}**` : "(ei valintaa)",
    "",
    q.correctFeedback ? escapeMdProse(q.correctFeedback) : "",
    "",
  ];
  if (wrong.length) {
    lines.push("## Miksi muut eivät kelpaa?", "");
    for (const w of wrong) {
      lines.push(`- ${escapeMdProse(w.text)}`);
    }
    lines.push("");
  }
  if (q.sourceUrl) {
    lines.push("## Lue lisää", "", `- [${q.sourceUrl}](${q.sourceUrl})`, "");
  }
  if (q.sourceRef) {
    lines.push(`Lähdeviite: \`${q.sourceRef}\``, "");
  }
  lines.push(
    "> **Luonnos** — automaattinen runko. Kirjoita täysi oppitunti tiedostoon",
    `> \`opiskelu/lessons/${q.id}.md\` ja aja \`npm run study:sync\`.`,
  );
  return lines.join("\n");
}

function buildManualLessonDoc(q, ref, body) {
  const content = stripFrontmatter(body);
  const lines = [
    "---",
    `id: ${q.id}`,
    `title: "${yamlEscape(q.prompt)}"`,
    `sidebar_label: "${yamlEscape(q.id)}"`,
    `slug: /topics/${ref}`,
    `domain: ${q.domain}`,
    `chapter: ${q.chapter}`,
    `difficulty: ${q.difficulty}`,
    `questionId: ${q.id}`,
    "status: ready",
    "---",
    "",
    `*Aihe: ${q.domain} / ${q.chapter} · vaikeus ${q.difficulty} · kysymys \`${q.id}\`*`,
    "",
    content,
  ];
  if (q.sourceUrl && !content.includes(q.sourceUrl)) {
    lines.push("", "## Lue lisää", "", `- [${q.sourceUrl}](${q.sourceUrl})`);
  }
  return lines.join("\n");
}

function writeCategoryJson(dir, label, position) {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "_category_.json");
  const payload = {
    label,
    position,
    link: { type: "generated-index", description: label },
  };
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`);
}

function clearGeneratedDocs() {
  if (fs.existsSync(docsRoot)) {
    fs.rmSync(docsRoot, { recursive: true, force: true });
  }
  fs.mkdirSync(docsRoot, { recursive: true });
}

function normalizePrompt(s) {
  return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function buildProgressMarkdown(questions, readyIds) {
  const byDomain = {};
  const byChapter = {};
  for (const q of questions) {
    byDomain[q.domain] = byDomain[q.domain] || { total: 0, ready: 0 };
    byDomain[q.domain].total += 1;
    if (readyIds.has(q.id)) byDomain[q.domain].ready += 1;

    const ch = q.chapter || "(none)";
    byChapter[ch] = byChapter[ch] || { total: 0, ready: 0, domain: q.domain };
    byChapter[ch].total += 1;
    if (readyIds.has(q.id)) byChapter[ch].ready += 1;
  }

  const total = questions.length;
  const ready = readyIds.size;
  const pct = total ? Math.round((ready / total) * 1000) / 10 : 0;

  const lines = [
    "---",
    "sidebar_position: 2",
    "slug: /progress",
    "title: Dokumentaation edistyminen",
    "---",
    "",
    "# Dokumentaation edistyminen",
    "",
    `**${ready} / ${total}** oppituntia kirjoitettu (**${pct} %**).`,
    "",
    "Valmis = tiedosto `opiskelu/lessons/{kysymys-id}.md` olemassa.",
    "",
    "## Domain",
    "",
    "| Domain | Valmiit | Yhteensä | % |",
    "|--------|---------|----------|---|",
  ];

  for (const [domain, stats] of Object.entries(byDomain).sort()) {
    const label = DOMAIN_LABELS[domain] || domain;
    const p = stats.total ? Math.round((stats.ready / stats.total) * 1000) / 10 : 0;
    lines.push(`| ${label} (${domain}) | ${stats.ready} | ${stats.total} | ${p} |`);
  }

  lines.push("", "## Luku (chapter)", "", "| Luku | Domain | Valmiit | Yhteensä | % |", "|------|--------|---------|----------|---|");

  for (const [chapter, stats] of Object.entries(byChapter).sort()) {
    const label = CHAPTER_LABELS[chapter] || chapter;
    const p = stats.total ? Math.round((stats.ready / stats.total) * 1000) / 10 : 0;
    lines.push(`| ${label} | ${stats.domain} | ${stats.ready} | ${stats.total} | ${p} |`);
  }

  lines.push(
    "",
    "## Komennot",
    "",
    "```bash",
    "npm run study:sync      # päivitä docs kysymyspankista",
    "npm run study:progress  # tiivistelmä terminaaliin",
    "npm run study:import    # tuo oppitunnit.md → opiskelu/lessons/",
    "```",
  );

  return lines.join("\n");
}

function main() {
  const questions = listAllQuestions();
  clearGeneratedDocs();

  const domains = [...new Set(questions.map((q) => q.domain))].sort();
  const readyIds = new Set();

  let domainPos = 1;
  for (const domain of domains) {
    const domainDir = path.join(docsRoot, domain);
    writeCategoryJson(domainDir, DOMAIN_LABELS[domain] || domain, domainPos);
    domainPos += 1;

    const chapters = [...new Set(
      questions.filter((q) => q.domain === domain).map((q) => q.chapter),
    )].sort();

    let chapterPos = 1;
    for (const chapter of chapters) {
      const chapterDir = path.join(domainDir, chapter);
      writeCategoryJson(chapterDir, CHAPTER_LABELS[chapter] || chapter, chapterPos);
      chapterPos += 1;

      const chapterQs = questions
        .filter((q) => q.domain === domain && q.chapter === chapter)
        .sort((a, b) => a.id.localeCompare(b.id));

      for (const q of chapterQs) {
        const ref = lessonRefForQuestion(q);
        const manual = readManualLesson(q.id);
        const doc = manual
          ? buildManualLessonDoc(q, ref, manual)
          : buildStubLesson(q, ref);
        if (manual) readyIds.add(q.id);
        const outFile = path.join(chapterDir, `${slugify(q.id)}.md`);
        fs.writeFileSync(outFile, doc);
      }
    }
  }

  fs.writeFileSync(progressPath, buildProgressMarkdown(questions, readyIds));

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalQuestions: questions.length,
    readyLessons: readyIds.size,
    domains: domains.map((d) => ({
      id: d,
      label: DOMAIN_LABELS[d] || d,
      chapters: [...new Set(questions.filter((q) => q.domain === d).map((q) => q.chapter))].sort(),
    })),
  };
  fs.mkdirSync(path.join(root, "content"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "content/study-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  console.log(`study-sync: ${questions.length} questions → ${readyIds.size} ready lessons`);
  console.log(`  docs: study/docs/topics/`);
  console.log(`  progress: study/docs/progress.md`);
}

main();
