import assert from "node:assert/strict";
import { lessonRefForQuestion, lessonUrl, lessonLinkLine } from "../hosts/shared/studyLessonLinks.mjs";

const q = {
  id: "tools-auto",
  domain: "cpp",
  chapter: "tools",
  prompt: "Mitä auto tekee?",
};

assert.equal(lessonRefForQuestion(q), "cpp/tools/tools-auto");
assert.equal(
  lessonUrl(q, { origin: "https://example.com" }),
  "https://example.com/koodisampo/opiskelu/docs/topics/cpp/tools/tools-auto/",
);
assert.equal(
  lessonRefForQuestion({ ...q, lessonRef: "custom/path" }),
  "custom/path",
);
assert(lessonLinkLine(q).includes("tools-auto"), "lesson link mentions path");

console.log("study_lesson_links tests OK");
