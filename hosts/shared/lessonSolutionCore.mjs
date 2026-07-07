export function stripFrontmatter(md) {
  if (!md.startsWith("---")) return md;
  const end = md.indexOf("---", 3);
  if (end < 0) return md;
  return md.slice(end + 3).trim();
}

/** Poimii ##-osion sisällön seuraavaan ##-otsikkoon asti. */
export function extractMarkdownSection(md, heading) {
  const normalized = String(heading || "").trim().toLowerCase();
  const lines = String(md || "").split("\n");
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^##\s+(.+?)\s*$/);
    if (!match) continue;
    if (match[1].trim().toLowerCase() === normalized) {
      start = i + 1;
      break;
    }
  }
  if (start < 0) return "";

  const out = [];
  for (let i = start; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i])) break;
    out.push(lines[i]);
  }
  return out.join("\n").trim();
}

export function buildStubSolutionMarkdown(question) {
  const correct = (question?.choices || []).find((c) => c.correct);
  const parts = [];
  if (correct?.text) parts.push(correct.text);
  if (question?.studyNotes) {
    parts.push("", question.studyNotes);
  } else if (question?.correctFeedback) {
    parts.push("", question.correctFeedback);
  }
  return parts.join("\n").trim();
}

/**
 * @param {Record<string, unknown>} question
 * @param {(questionId: string) => (string | null | undefined)} [readLessonFile]
 */
export function lessonSolutionMarkdown(question, readLessonFile) {
  const id = String(question?.id || "").trim();
  if (id && typeof readLessonFile === "function") {
    const raw = readLessonFile(id);
    if (raw) {
      const body = stripFrontmatter(raw);
      const section = extractMarkdownSection(body, "Ratkaisu");
      if (section) {
        return { markdown: section, source: "lesson" };
      }
    }
  }
  return {
    markdown: buildStubSolutionMarkdown(question),
    source: "stub",
  };
}

export function getAiStudySolution(question) {
  const choices = question?.choices ?? [];
  const correctIdx = choices.findIndex((c) => c.correct);
  if (correctIdx < 0) {
    return {
      choiceN: 0,
      choiceText: "",
    };
  }
  return {
    choiceN: correctIdx + 1,
    choiceText: choices[correctIdx]?.text ?? "",
  };
}

export function resolveAiStudySolution(question, lessonLookup) {
  const choice = getAiStudySolution(question);
  const lesson = lessonLookup?.(question?.id)
    ?? lessonSolutionMarkdown(question, null);
  return {
    ...choice,
    markdown: lesson.markdown,
    source: lesson.source,
  };
}
