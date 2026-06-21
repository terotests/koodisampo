#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runTerminalApp } from "./terminalApp.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const worldPath = resolve(__dirname, "../../content/worlds/corporate-hq-intro.json");
const mapJson = readFileSync(worldPath, "utf8");

runTerminalApp(mapJson).catch((err) => {
  if (err?.code === "EIO" || err?.code === "EPIPE" || err?.code === "EBADF") {
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
