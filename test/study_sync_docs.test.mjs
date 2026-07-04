import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const progressPath = path.join(root, "study/docs/progress.md");

const sync = spawnSync("node", ["scripts/study-sync-docs.mjs"], {
  cwd: root,
  encoding: "utf8",
});
assert.equal(sync.status, 0, sync.stderr || sync.stdout);

const progress = fs.readFileSync(progressPath, "utf8");
assert.match(progress, /\]\(\/docs\/topics\/security\)/, "progress links use /docs/topics/");
assert.doesNotMatch(progress, /\]\(topics\/security\)/, "progress must not use slug-relative topic links");

const intro = fs.readFileSync(path.join(root, "study/docs/intro.md"), "utf8");
assert.match(intro, /\]\(\/docs\/topics\/postgres\)/, "intro links use /docs/topics/");
assert.match(intro, /\]\(\/docs\/progress\)/, "intro progress link uses /docs/progress");

for (const q of listAllQuestions()) {
  if (!q.sourceUrl) continue;
  assert.match(
    q.sourceUrl,
    /^https?:\/\//i,
    `${q.id}: sourceUrl must be absolute http(s) URL, got ${q.sourceUrl}`,
  );
}

const topicsDir = path.join(root, "study/docs/topics");
for (const file of fs.readdirSync(topicsDir)) {
  const md = fs.readFileSync(path.join(topicsDir, file), "utf8");
  const badLinks = [...md.matchAll(/\[[^\]]+\]\(([^)#][^)]*)\)/g)]
    .map((m) => m[1])
    .filter((url) => !/^https?:\/\//i.test(url));
  assert.equal(badLinks.length, 0, `${file} has non-http markdown links: ${badLinks.join(", ")}`);
}

const build = spawnSync("npm", ["run", "build:study"], {
  cwd: root,
  encoding: "utf8",
  env: { ...process.env, FORCE_COLOR: "0" },
});
const buildOut = `${build.stdout}\n${build.stderr}`;
assert.equal(build.status, 0, buildOut);
assert.doesNotMatch(buildOut, /Broken link on source page path/, "study build must not emit broken doc links");

console.log("study_sync_docs tests OK");
