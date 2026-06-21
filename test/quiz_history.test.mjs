import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pickQuestion } from "../hosts/terminal/encounterQuestions.mjs";
import {
  emptyQuizHistory,
  recordQuizAnswer,
  recordQuizShown,
  normalizeQuizHistory,
} from "../hosts/terminal/quizHistory.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runQuizHistoryTests() {
  const coworker = {
    id: "coworker-0-1",
    name: "Tiina",
    kind: "coworker",
    topic: "safety",
    x: 1,
    y: 2,
  };
  const otherCoworker = { ...coworker, id: "coworker-0-99", x: 9, y: 9 };

  let hist = recordQuizAnswer(emptyQuizHistory(), coworker.id, "safety-rule-of-zero", true);
  const pick1 = pickQuestion(otherCoworker, 40, hist);
  assert(pick1.question.id !== "safety-rule-of-zero", "global correct excludes across NPCs");

  hist = recordQuizShown(emptyQuizHistory(), coworker.id, "tools-auto");
  const pick2 = pickQuestion(otherCoworker, 40, hist);
  assert(pick2.question.id !== "tools-auto", "global asked excludes even when wrong/not finished");

  hist = recordQuizShown(hist, coworker.id, "safety-rule-of-zero");
  hist = recordQuizShown(hist, otherCoworker.id, "tools-auto");
  const pick3 = pickQuestion(coworker, 40, hist);
  assert(pick3.question.id !== "tools-auto", "recent/global asked blocks back-to-back");

  const migrated = normalizeQuizHistory({
    byEntity: {
      "coworker-0-1": { asked: ["avahi-mdns"], correct: ["avahi-mdns"] },
    },
  });
  assert(migrated.global.asked.includes("avahi-mdns"), "migrates entity asked to global");
  assert(migrated.global.correct.includes("avahi-mdns"), "migrates entity correct to global");

  return true;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runQuizHistoryTests();
  console.log("quiz_history tests OK");
}
