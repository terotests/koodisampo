#!/usr/bin/env node
/**
 * Build Koodisampo Ranger lib → generated/es6/koodisampo.js
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const rangerRoot = path.resolve(projectRoot, "../agent/Ranger");
const compiler = path.join(rangerRoot, "bin/output.js");
const entryAbs = path.join(projectRoot, "lib/game/KoodisampoLib.rgr");
const outDir = path.join(projectRoot, "generated/es6");
const outDirRel = path.relative(rangerRoot, outDir).split(path.sep).join("/");
const sourceRel = path.relative(rangerRoot, entryAbs).split(path.sep).join("/");

if (!fs.existsSync(compiler)) {
  console.error("Ranger compiler missing:", compiler);
  console.error("Build Ranger first: cd ../agent/Ranger && npm run build");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const env = {
  ...process.env,
  RANGER_LIB: [
    path.join(rangerRoot, "compiler", "Lang.rgr"),
    path.join(rangerRoot, "lib"),
  ].join(";"),
};

const cmd = [
  "node",
  JSON.stringify(compiler),
  "-es6",
  "-nodemodule",
  sourceRel,
  `-d=./${outDirRel}`,
  "-o=koodisampo.cjs",
].join(" ");

console.log("Compiling Koodisampo (Ranger)...");
console.log(cmd);
const output = execSync(cmd, { cwd: rangerRoot, env, encoding: "utf-8" });
if (
  output.includes("[FAIL] Compilation FAILED") ||
  output.includes("Undefined variable")
) {
  console.error(output);
  process.exit(1);
}
console.log(output);
console.log("OK →", path.join(outDir, "koodisampo.cjs"));
