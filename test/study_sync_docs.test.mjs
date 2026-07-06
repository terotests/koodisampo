import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { listAllQuestions } from "../hosts/terminal/encounterQuestions.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const sync = spawnSync("node", ["scripts/study-sync-docs.mjs"], {
  cwd: root,
  encoding: "utf8",
});
assert.equal(sync.status, 0, sync.stderr || sync.stdout);

const intro = fs.readFileSync(path.join(root, "study/docs/intro.md"), "utf8");
assert.match(intro, /\]\(\/docs\/topics\/postgres\)/, "intro links use /docs/topics/");
assert.doesNotMatch(intro, /\]\(\/docs\/progress\)/, "intro must not link to removed progress page");
assert.match(intro, /\]\(\/docs\/lyhenteet\)/, "intro links to glossary");

const lyhenteet = fs.readFileSync(path.join(root, "study/docs/lyhenteet.md"), "utf8");
assert.match(lyhenteet, /### GUC \{#guc\}/, "glossary page synced from opiskelu/lyhenteet.md");

const topicsDir = path.join(root, "study/docs/topics");
const postgres = fs.readFileSync(path.join(topicsDir, "postgres.md"), "utf8");
assert.match(postgres, /\[OOM\]\(\/docs\/lyhenteet#oom\)/, "manual lessons link OOM to glossary");

function withoutFencedCode(md) {
  return md.replace(/```[\s\S]*?```/g, "");
}

for (const q of listAllQuestions()) {
  if (!q.sourceUrl) continue;
  assert.match(
    q.sourceUrl,
    /^https?:\/\//i,
    `${q.id}: sourceUrl must be absolute http(s) URL, got ${q.sourceUrl}`,
  );
}

for (const file of fs.readdirSync(topicsDir)) {
  const md = withoutFencedCode(fs.readFileSync(path.join(topicsDir, file), "utf8"));
  const badLinks = [...md.matchAll(/\[[^\]]+\]\(([^)#][^)]*)\)/g)]
    .map((m) => m[1])
    .filter((url) => !/^https?:\/\//i.test(url) && !url.startsWith("/docs/"));
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

const indexHtml = fs.readFileSync(path.join(root, "study/build/index.html"), "utf8");
assert.match(indexHtml, /location\.replace\("docs\/intro\/"\)/, "study index.html must static-redirect to docs/intro/");
assert.doesNotMatch(indexHtml, /Page Not Found/, "study index.html must not be Docusaurus 404 shell");

console.log("study_sync_docs tests OK");
