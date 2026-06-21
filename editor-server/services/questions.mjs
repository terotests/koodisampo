import { listAllQuestions, pickQuestion } from "../../hosts/terminal/encounterQuestions.mjs";
import { emptyQuizHistory } from "../../hosts/terminal/quizHistory.mjs";

export function listQuestions({ chapter, domain, q, limit = 50 } = {}) {
  let items = listAllQuestions();
  if (chapter) {
    items = items.filter((item) => item.chapter === chapter);
  }
  if (domain) {
    items = items.filter((item) => item.domain === domain);
  }
  if (q) {
    const needle = q.toLowerCase();
    items = items.filter((item) =>
      item.prompt?.toLowerCase().includes(needle) ||
      item.id?.toLowerCase().includes(needle),
    );
  }
  const total = items.length;
  items = items.slice(0, limit);
  return {
    total,
    items: items.map((item) => ({
      id: item.id,
      chapter: item.chapter,
      domain: item.domain,
      difficulty: item.difficulty,
      audiences: item.audiences,
      prompt: item.prompt,
      featureId: item.featureId,
      sourceUrl: item.sourceUrl ?? "",
    })),
  };
}

export function previewQuestionsForTopic(topic, limit = 5) {
  if (!topic) return { topic, items: [] };
  const entity = { id: "preview", name: "Esikatselu", kind: "coworker", topic };
  const seen = new Set();
  const items = [];
  for (let i = 0; i < limit * 4 && items.length < limit; i += 1) {
    const { question } = pickQuestion(entity, 50, emptyQuizHistory(), { pickNonce: i + 1 });
    if (!question || seen.has(question.id)) continue;
    seen.add(question.id);
    items.push({
      id: question.id,
      chapter: question.chapter,
      prompt: question.prompt,
      difficulty: question.difficulty,
    });
  }
  return { topic, items };
}

export function questionStats() {
  const all = listAllQuestions();
  const byChapter = {};
  const byDomain = {};
  for (const q of all) {
    byChapter[q.chapter] = (byChapter[q.chapter] ?? 0) + 1;
    byDomain[q.domain] = (byDomain[q.domain] ?? 0) + 1;
  }
  return { total: all.length, byChapter, byDomain };
}
