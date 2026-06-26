import assert from "node:assert/strict";
import { pickQuestion, listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";
import { emptyQuizHistory, recordQuizAnswer } from "../hosts/terminal/quizHistory.mjs";

/**
 * Randomness & coverage test:
 * Verifies that the question selection algorithm provides good variety
 * across many picks and doesn't get stuck or repeat excessively.
 */

const allQ = listAllQuestions();

// 1) Verify new question banks are loaded
assert(allQ.some((q) => q.domain === "robotframework"), "robot framework bank loaded");
assert(allQ.some((q) => q.chapter === "apt"), "apt chapter loaded");
assert(allQ.some((q) => q.id === "jenkins-pipeline-stages"), "jenkins questions loaded");
assert(allQ.some((q) => q.id === "git-cherry-pick-conflict"), "new git questions loaded");

const rfCount = allQ.filter((q) => q.domain === "robotframework").length;
assert(rfCount >= 10, `robot framework has enough questions (${rfCount})`);

const aptCount = allQ.filter((q) => q.chapter === "apt").length;
assert(aptCount >= 8, `apt chapter has enough questions (${aptCount})`);

const gitCount = allQ.filter((q) => q.domain === "git").length;
assert(gitCount >= 15, `git domain has enough questions (${gitCount})`);

// 2) Test randomness: pick 50 questions for a coworker — no excessive repeats
const coworker = { id: "coworker-2-42", kind: "coworker", topic: "git-workflow", char: "W", name: "Kalle" };
let history = emptyQuizHistory();
const pickedIds = [];

for (let i = 0; i < 50; i += 1) {
  const { question } = pickQuestion(coworker, 40 + i, history, { pickNonce: i, deaths: 0 });
  assert(question?.id, `pick ${i} returned a question`);
  pickedIds.push(question.id);
  history = recordQuizAnswer(history, coworker.id, question.id, i % 3 !== 0);
}

// Check variety: unique IDs should be significant portion
const uniqueIds = new Set(pickedIds);
assert(
  uniqueIds.size >= 15,
  `50 picks yielded ${uniqueIds.size} unique questions — expected at least 15 for variety`,
);

// 3) Test that different entity topics yield different domains
const topics = [
  { topic: "apt", expectedDomain: "linux" },
  { topic: "rf-basics", expectedDomain: "robotframework" },
  { topic: "git-ci", expectedDomain: "git" },
  { topic: "docker", expectedDomain: "docker" },
  { topic: "systemd", expectedDomain: "linux" },
];

for (const { topic, expectedDomain } of topics) {
  const entity = { id: `coworker-1-${topic}`, kind: "coworker", topic, char: "W", name: "Test" };
  const { question } = pickQuestion(entity, 50);
  assert(
    question.domain === expectedDomain || question.chapter === topic,
    `topic '${topic}' should bias toward '${expectedDomain}', got domain='${question.domain}' chapter='${question.chapter}'`,
  );
}

// 4) Test that Robot Framework questions are accessible via coworker with rf topic
const rfCoworker = { id: "coworker-rf-1", kind: "coworker", char: "W", name: "RF-pro", topic: "rf-basics" };
const rfPick = pickQuestion(rfCoworker, 60);
assert(
  rfPick.question.domain === "robotframework" || rfPick.question.chapter?.startsWith("rf-"),
  "coworker with rf-basics topic gets RF question",
);

// 5) Verify no question has duplicate ID across all banks
const allIds = allQ.map((q) => q.id);
const idSet = new Set(allIds);
assert(
  allIds.length === idSet.size,
  `Duplicate question IDs found: ${allIds.length} total vs ${idSet.size} unique`,
);

// 6) Shuffle diversity: pick from same entity many times with nonce variation
const freshCoworker = { id: "coworker-3-55", kind: "coworker", topic: "git-workflow", char: "W", name: "Anna" };
const nonceResults = new Set();
for (let nonce = 0; nonce < 30; nonce += 1) {
  const { question } = pickQuestion(freshCoworker, 50, emptyQuizHistory(), { pickNonce: nonce, deaths: 0 });
  nonceResults.add(question.id);
}
assert(
  nonceResults.size >= 5,
  `30 nonce-varied picks yielded only ${nonceResults.size} unique — expected at least 5`,
);

console.log("question_randomness.test.mjs OK");
console.log(`  Total questions: ${allQ.length}`);
console.log(`  Robot Framework: ${rfCount}`);
console.log(`  apt: ${aptCount}`);
console.log(`  git: ${gitCount}`);
console.log(`  50-pick variety: ${uniqueIds.size} unique out of 50`);
console.log(`  Nonce variety: ${nonceResults.size} unique out of 30`);
