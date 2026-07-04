import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

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

console.log("study_sync_docs tests OK");
