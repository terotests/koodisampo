#!/usr/bin/env node
/** Poista Vite-prebundle jotta uusi generated/es6/koodisampo.cjs latautuu devissä. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const viteCache = path.join(root, "web-game/node_modules/.vite");

if (fs.existsSync(viteCache)) {
  fs.rmSync(viteCache, { recursive: true, force: true });
}
