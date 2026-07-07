import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listAllQuestions } from "../terminal/encounterQuestions.mjs";
import { lessonSolutionMarkdown } from "./lessonSolutionCore.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultLessonsDir = path.resolve(__dirname, "../../opiskelu/lessons");

export {
  stripFrontmatter,
  extractMarkdownSection,
  buildStubSolutionMarkdown,
  lessonSolutionMarkdown,
} from "./lessonSolutionCore.mjs";

export function createLessonFileReader(lessonsDir = defaultLessonsDir) {
  return (questionId) => {
    const file = path.join(lessonsDir, `${questionId}.md`);
    if (!fs.existsSync(file)) return null;
    return fs.readFileSync(file, "utf8");
  };
}

export function buildLessonSolutionsIndex(questions = listAllQuestions(), readLessonFile = createLessonFileReader()) {
  /** @type {Record<string, { markdown: string, source: 'lesson' | 'stub' }>} */
  const out = {};
  for (const q of questions) {
    if (!q?.id) continue;
    out[q.id] = lessonSolutionMarkdown(q, readLessonFile);
  }
  return out;
}
