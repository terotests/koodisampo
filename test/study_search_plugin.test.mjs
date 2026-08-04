import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(resolve(root, "study/package.json"), "utf8"));
const config = readFileSync(resolve(root, "study/docusaurus.config.ts"), "utf8");
const i18n = resolve(root, "study/i18n/fi/code.json");

assert.ok(
  pkg.dependencies?.["@easyops-cn/docusaurus-search-local"],
  "study depends on @easyops-cn/docusaurus-search-local",
);
assert.match(config, /@easyops-cn\/docusaurus-search-local/, "docusaurus config registers local search theme");
assert.match(config, /hashed:\s*"filename"/, "hashed filename avoids trailingSlash JSON redirect issues");
assert.match(config, /language:\s*\[["']fi["'],\s*["']en["']\]/, "indexes Finnish + English");
assert.match(config, /searchBarPosition:\s*["']right["']/, "search bar on navbar right");
assert.ok(existsSync(i18n), "Finnish search UI translations exist");

const messages = JSON.parse(readFileSync(i18n, "utf8"));
assert.equal(messages["theme.SearchBar.label"]?.message, "Haku");

console.log("study_search_plugin.test.mjs OK");
