import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  emptyStudyBacklog,
  markWantMoreStudy,
  recordWrongAnswer,
  questionMetaFromQuiz,
  studyBacklogCounts,
  formatStudyList,
  normalizeStudyBacklog,
} from "../hosts/terminal/studyBacklog.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runStudyBacklogTests() {
  const quiz = {
    entity: { id: "coworker-0-1", name: "Tiina Mäkinen" },
    question: {
      id: "safety-rule-of-zero",
      prompt: "Mitä Rule of Zero tarkoittaa?",
      domain: "cpp",
      chapter: "safety",
      featureId: "cpp:rule-of-zero",
      correctFeedback: "Lyhyt selitys.",
      wrongFeedback: "Väärin.",
    },
  };

  let backlog = emptyStudyBacklog();
  const meta = questionMetaFromQuiz(quiz, true, "Lyhyt selitys.");
  backlog = markWantMoreStudy(backlog, meta);
  assert(backlog.wantMore.length === 1, "wantMore entry");
  assert(backlog.wantMore[0].questionId === "safety-rule-of-zero", "question id saved");
  assert(backlog.wantMore[0].prompt.includes("Rule of Zero"), "prompt saved");

  backlog = markWantMoreStudy(backlog, meta);
  assert(backlog.wantMore.length === 1, "dedupe wantMore");

  backlog = recordWrongAnswer(backlog, questionMetaFromQuiz(quiz, false, "Väärin."));
  assert(backlog.wrongAnswers.length === 1, "wrong answer saved");
  assert(studyBacklogCounts(backlog).total === 2, "counts total");

  const list = formatStudyList(backlog);
  assert(list.includes("Kysy AI:lta"), "list section wantMore");
  assert(list.includes("Väärin vastatut"), "list section wrong");

  const norm = normalizeStudyBacklog({ wantMore: [{ questionId: "x", prompt: "p" }] });
  assert(norm.wantMore[0].questionId === "x", "normalize");

  return true;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runStudyBacklogTests();
  console.log("study_backlog tests OK");
}
