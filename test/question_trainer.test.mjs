import assert from "node:assert/strict";
import {
  filterTrainQuestions,
  pickNextTrainQuestion,
} from "../hosts/shared/questionTrainerCore.mjs";
import { lessonUrl, STUDY_SITE_ORIGIN, STUDY_SITE_PATH } from "../hosts/shared/studyLessonLinks.mjs";

const sample = [
  { id: "a-cpp", domain: "cpp", bankId: "cpp-best-practices", prompt: "cpp?", choices: [] },
  { id: "b-git", domain: "git", bankId: "git-ci", prompt: "git?", choices: [] },
  { id: "c-kids", domain: "kids", bankId: "kids-easy", prompt: "kids?", choices: [] },
];

const cppOnly = filterTrainQuestions(sample, "cpp", false, false);
assert.equal(cppOnly.length, 1);
assert.equal(cppOnly[0].id, "a-cpp");

const allTopics = filterTrainQuestions(sample, "cpp", false, true);
assert.equal(allTopics.length, 2);
assert.ok(allTopics.every((q) => q.bankId !== "kids-easy"));

const kids = filterTrainQuestions(sample, "cpp", true, false);
assert.equal(kids.length, 1);
assert.equal(kids[0].id, "c-kids");

const unknownSpecialty = filterTrainQuestions(sample, "nope", false, false);
assert.equal(unknownSpecialty.length, 2, "unknown specialty falls back to all non-kids");

const picked = pickNextTrainQuestion(cppOnly, [], () => 0);
assert.equal(picked?.id, "a-cpp");
assert.equal(pickNextTrainQuestion([], []), null);

const q = { id: "prod-git-force-with-lease", domain: "git", chapter: "git-workflow" };
const url = lessonUrl(q, { origin: STUDY_SITE_ORIGIN });
assert.equal(
  url,
  `${STUDY_SITE_ORIGIN}${STUDY_SITE_PATH}/docs/topics/git/#prod-git-force-with-lease`,
);

console.log("question_trainer.test.mjs OK");
