#!/usr/bin/env node
/**
 * Generoi oppituntien todo-lista kysymyspankin JSON-tiedostoista.
 * Edistyminen = onko opiskelu/lessons/{question-id}.md olemassa (git-työpuu).
 *
 * Käyttö:
 *   node scripts/study-lesson-todo.mjs
 *   npm run study:todo
 *
 * Tulostaa:
 *   opiskelu/lessons/TODO.json
 *   opiskelu/lessons/TODO.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";
import { DOMAIN_LABELS, CHAPTER_LABELS } from "../hosts/shared/studyLessonLinks.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const lessonsDir = path.join(root, "opiskelu/lessons");
const jsonOut = path.join(lessonsDir, "TODO.json");
const mdOut = path.join(lessonsDir, "TODO.md");

const DOMAIN_ORDER = [
  "cpp", "javascript", "postgres", "docker", "linux", "qt", "scrum",
  "git", "backend", "security", "robotframework", "rust",
];

const SKIP_MD = new Set(["README", "TODO", "BATCH-pg-config"]);

function listReadyLessonIds() {
  if (!fs.existsSync(lessonsDir)) return new Set();
  return new Set(
    fs.readdirSync(lessonsDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""))
      .filter((id) => !SKIP_MD.has(id)),
  );
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

function truncate(s, max = 72) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function buildTodoData(questions, readyIds) {
  const byDomain = new Map();

  for (const q of questions) {
    const domain = q.domain || "(none)";
    const chapter = q.chapter || "(none)";
    if (!byDomain.has(domain)) byDomain.set(domain, new Map());
    const chapters = byDomain.get(domain);
    if (!chapters.has(chapter)) chapters.set(chapter, []);
    chapters.get(chapter).push({
      id: q.id,
      difficulty: q.difficulty,
      prompt: q.prompt,
      ready: readyIds.has(q.id),
      lessonFile: `opiskelu/lessons/${q.id}.md`,
    });
  }

  const domains = sortDomains([...byDomain.keys()]).map((domainId) => {
    const chaptersMap = byDomain.get(domainId);
    const chapters = [...chaptersMap.keys()].sort().map((chapterId) => {
      const items = chaptersMap.get(chapterId).sort((a, b) => a.id.localeCompare(b.id));
      const ready = items.filter((x) => x.ready).length;
      return {
        id: chapterId,
        label: CHAPTER_LABELS[chapterId] || chapterId,
        ready,
        total: items.length,
        questions: items,
      };
    });
    const ready = chapters.reduce((n, c) => n + c.ready, 0);
    const total = chapters.reduce((n, c) => n + c.total, 0);
    return {
      id: domainId,
      label: DOMAIN_LABELS[domainId] || domainId,
      ready,
      total,
      chapters,
    };
  });

  const totalQuestions = questions.length;
  const readyLessons = questions.filter((q) => readyIds.has(q.id)).length;

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalQuestions,
      readyLessons,
      pendingLessons: totalQuestions - readyLessons,
      percent: totalQuestions
        ? Math.round((readyLessons / totalQuestions) * 1000) / 10
        : 0,
    },
    domains,
  };
}

function renderMarkdown(data) {
  const { summary, domains } = data;
  const lines = [
    "# Oppituntien todo (generoitu kysymyspankista)",
    "",
    `> Päivitä: \`npm run study:todo\` — lukee \`content/question-banks/*.json\`, merkitsee valmiiksi jos \`opiskelu/lessons/{id}.md\` on olemassa.`,
    "",
    `**${summary.readyLessons} / ${summary.totalQuestions}** valmis (**${summary.percent} %**).`,
    "",
    "## Domain-yhteenveto",
    "",
    "| Domain | Valmiit | Yhteensä | % |",
    "|--------|---------|----------|---|",
  ];

  for (const d of domains) {
    const pct = d.total ? Math.round((d.ready / d.total) * 1000) / 10 : 0;
    lines.push(`| ${d.label} | ${d.ready} | ${d.total} | ${pct} |`);
  }

  lines.push("", "## Kaikki aiheet", "");

  for (const d of domains) {
    lines.push(`### ${d.label} (${d.ready}/${d.total})`, "");
    for (const ch of d.chapters) {
      lines.push(`#### ${ch.label} \`${ch.id}\` (${ch.ready}/${ch.total})`, "");
      lines.push("| | diff | id | kysymys |");
      lines.push("|---|------|-----|---------|");
      for (const q of ch.questions) {
        const mark = q.ready ? "✅" : "⬜";
        lines.push(`| ${mark} | ${q.difficulty} | \`${q.id}\` | ${truncate(q.prompt)} |`);
      }
      lines.push("");
    }
  }

  lines.push(
    "## Komennot",
    "",
    "```bash",
    "npm run study:todo      # päivitä tämä lista",
    "npm run study:sync      # synkkaa Docusaurus-docs",
    "npm run study:progress  # tiivistelmä terminaaliin",
    "```",
    "",
  );

  return lines.join("\n");
}

function main() {
  fs.mkdirSync(lessonsDir, { recursive: true });
  const questions = listAllQuestions();
  const readyIds = listReadyLessonIds();
  const data = buildTodoData(questions, readyIds);

  fs.writeFileSync(jsonOut, `${JSON.stringify(data, null, 2)}\n`);
  fs.writeFileSync(mdOut, renderMarkdown(data));

  console.log(
    `study-lesson-todo: ${data.summary.readyLessons}/${data.summary.totalQuestions} ready → ${path.relative(root, jsonOut)}, ${path.relative(root, mdOut)}`,
  );
}

main();
