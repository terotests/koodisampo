import assert from "node:assert/strict";
import {
  lessonRefForQuestion,
  lessonUrl,
  lessonDocPathForQuestion,
  lessonLinkLine,
} from "../hosts/shared/studyLessonLinks.mjs";

const q = {
  id: "tools-auto",
  domain: "cpp",
  chapter: "tools",
  prompt: "Mitä auto tekee?",
};

assert.equal(lessonRefForQuestion(q), "cpp/tools/tools-auto");
assert.equal(lessonDocPathForQuestion(q), "/docs/topics/cpp/#tools-auto");
assert.equal(
  lessonUrl(q, { origin: "https://example.com" }),
  "https://example.com/koodisampo/opiskelu/docs/topics/cpp/#tools-auto",
);
assert.equal(
  lessonRefForQuestion({ ...q, lessonRef: "custom/path/id" }),
  "custom/path/id",
);
assert.equal(
  lessonDocPathForQuestion({ ...q, lessonRef: "postgres/pg-indexes/foo" }),
  "/docs/topics/postgres/#tools-auto",
);
assert(lessonLinkLine(q).includes("#tools-auto"), "lesson link mentions anchor");

console.log("study_lesson_links tests OK");
