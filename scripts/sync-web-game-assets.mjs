#!/usr/bin/env node
/** Copy runtime assets into web-game/public for static hosting. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const out = path.join(root, "web-game/public/content");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    if (fs.statSync(from).isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

const rangerSrc = path.join(root, "generated/es6/koodisampo.cjs");
const rangerDest = path.join(root, "web-game/public/vendor/koodisampo.cjs");
if (!fs.existsSync(rangerSrc)) {
  console.error("Missing Ranger build:", rangerSrc);
  console.error("Run: npm run build:ranger");
  process.exit(1);
}
fs.mkdirSync(path.dirname(rangerDest), { recursive: true });
fs.copyFileSync(rangerSrc, rangerDest);

copyDir(path.join(root, "content/stories"), path.join(out, "stories"));
copyDir(path.join(root, "content/question-banks"), path.join(out, "question-banks"));
fs.mkdirSync(path.join(out, "dialogues"), { recursive: true });
fs.copyFileSync(
  path.join(root, "content/dialogues/pack.json"),
  path.join(out, "dialogues/pack.json"),
);
copyDir(path.join(root, "content/npc-behaviors"), path.join(out, "npc-behaviors"));
fs.mkdirSync(path.join(out, "worlds"), { recursive: true });
fs.copyFileSync(
  path.join(root, "content/worlds/corporate-hq-intro.json"),
  path.join(out, "worlds/corporate-hq-intro.json"),
);

console.log("Synced web-game assets → web-game/public/");
