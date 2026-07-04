#!/usr/bin/env node
/** Download Kenney CC0 isometric prototype tiles for web-game rendering. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "content/tiles/iso");
const baseUrl = "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_prototypePack_2.3";

const tileFiles = [
  "Isometric/floor_E.png",
  "Isometric/floor_N.png",
  "Isometric/floor_S.png",
  "Isometric/floor_W.png",
  "Isometric/wall_E.png",
  "Isometric/wall_N.png",
  "Isometric/wall_S.png",
  "Isometric/wall_W.png",
  "Isometric/wallCorner_E.png",
  "Isometric/wallCorner_N.png",
  "Isometric/wallCorner_S.png",
  "Isometric/wallCorner_W.png",
  "Isometric/wallHalf_E.png",
  "Isometric/wallHalf_N.png",
  "Isometric/wallHalf_S.png",
  "Isometric/wallHalf_W.png",
  "Isometric/doorOpen_E.png",
  "Isometric/doorOpen_N.png",
  "Isometric/doorOpen_S.png",
  "Isometric/doorOpen_W.png",
  "Isometric/doorClosed_E.png",
  "Isometric/doorClosed_N.png",
  "Isometric/doorClosed_S.png",
  "Isometric/doorClosed_W.png",
  "Isometric/window_E.png",
  "Isometric/window_N.png",
  "Isometric/window_S.png",
  "Isometric/window_W.png",
  "Isometric/slab_E.png",
  "Isometric/slab_N.png",
  "Isometric/slab_S.png",
  "Isometric/slab_W.png",
  "Isometric/block_E.png",
  "Isometric/block_N.png",
  "Isometric/block_S.png",
  "Isometric/block_W.png",
  "Isometric/crate_E.png",
  "Isometric/crate_N.png",
  "Isometric/crate_S.png",
  "Isometric/crate_W.png",
  "Isometric/stairs_E.png",
  "Isometric/stairs_N.png",
  "Isometric/stairs_S.png",
  "Isometric/stairs_W.png",
  "Isometric/doorwayCenter_E.png",
  "Isometric/doorwayCenter_N.png",
  "Isometric/doorwayCenter_S.png",
  "Isometric/doorwayCenter_W.png",
  "Isometric/switchFloorOn_E.png",
  "Isometric/switchFloorOn_N.png",
  "Isometric/switchFloorOn_S.png",
  "Isometric/switchFloorOn_W.png",
];

const characterFiles = [];
for (let skin = 0; skin < 8; skin += 1) {
  characterFiles.push(`Characters/Human/Human_${skin}_Idle0.png`);
}

async function download(relPath) {
  const dest = path.join(outDir, relPath.replace(/\//g, "__"));
  if (fs.existsSync(dest)) return dest;
  const url = `${baseUrl}/${relPath}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return dest;
}

fs.mkdirSync(outDir, { recursive: true });
const license = [
  "Kenney Isometric Prototype Tiles (CC0 1.0)",
  "https://kenney.nl/assets",
  "Downloaded via ETdoFresh/kenney.nl mirror for Koodisampo web rendering.",
].join("\n");
fs.writeFileSync(path.join(outDir, "LICENSE.txt"), `${license}\n`);

const all = [...tileFiles, ...characterFiles];
let ok = 0;
for (const rel of all) {
  await download(rel);
  ok += 1;
  process.stdout.write(`\r${ok}/${all.length}`);
}
console.log(`\nFetched ${ok} isometric assets → ${outDir}`);
