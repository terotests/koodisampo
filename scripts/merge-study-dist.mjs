#!/usr/bin/env node
/** Kopioi Docusaurus-build web-game/dist/opiskelu/ GitHub Pages -julkaisuun. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const studyBuild = path.join(root, "study/build");
const dest = path.join(root, "web-game/dist/opiskelu");

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dst, name);
    if (fs.statSync(from).isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

if (!fs.existsSync(studyBuild)) {
  console.error("Missing study build:", studyBuild);
  console.error("Run: npm run build:study");
  process.exit(1);
}

if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
copyDir(studyBuild, dest);
console.log("Merged study site → web-game/dist/opiskelu/");
