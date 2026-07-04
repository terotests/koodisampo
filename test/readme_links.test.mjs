import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const MARKDOWN_FILES = [
  "README.md",
  "AGENTS.md",
  "opiskelu/lessons/README.md",
  "opiskelu/opiskelu-opas.md",
  "study/docs/intro.md",
];

function stripCode(md) {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "");
}

function extractMarkdownLinks(md) {
  return [...stripCode(md).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1].trim());
}

function isExternal(url) {
  return /^https?:\/\//i.test(url) || url.startsWith("mailto:");
}

function resolveRepoTarget(fromFile, url) {
  const [filePart] = url.split("#");
  if (!filePart || isExternal(filePart) || filePart.startsWith("/")) return null;
  return path.resolve(path.dirname(fromFile), filePart);
}

for (const rel of MARKDOWN_FILES) {
  const file = path.join(root, rel);
  assert.ok(fs.existsSync(file), `missing markdown file: ${rel}`);
  const md = fs.readFileSync(file, "utf8");

  for (const url of extractMarkdownLinks(md)) {
    if (isExternal(url) || url.startsWith("#") || url.startsWith("/")) continue;
    const target = resolveRepoTarget(file, url);
    assert.ok(target, `${rel}: could not resolve ${url}`);
    assert.ok(
      fs.existsSync(target),
      `${rel}: broken repo link ${url} → ${path.relative(root, target)}`,
    );
  }
}

const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
assert.match(
  readme,
  /terotests\.github\.io\/koodisampo\/opiskelu\/docs\/intro\//,
  "README should link study site via /docs/intro/",
);
assert.doesNotMatch(
  readme,
  /\]\(topics\/[^)]+\)/,
  "README must not use slug-relative study topic links",
);

console.log("readme_links tests OK");
