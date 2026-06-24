#!/usr/bin/env node
/**
 * Build Koodisampo Ranger lib → generated/es6/koodisampo.cjs
 * Uses npm `ranger-compiler` (dist/rgrc.js) by default.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { projectRoot, resolveRangerCompiler } from "./resolve-ranger-compiler.mjs";

const entryAbs = path.join(projectRoot, "lib/game/KoodisampoLib.rgr");
const outDir = path.join(projectRoot, "generated/es6");

const install = resolveRangerCompiler();
fs.mkdirSync(outDir, { recursive: true });

const source = install.cwd === projectRoot
  ? path.relative(projectRoot, entryAbs).split(path.sep).join("/")
  : path.relative(install.cwd, entryAbs).split(path.sep).join("/");
const outDirRel = path.relative(install.cwd, outDir).split(path.sep).join("/");

const env = {
  ...process.env,
  RANGER_LIB: install.langLib,
};

const cmd = [
  "node",
  JSON.stringify(install.compiler),
  "-es6",
  "-nodemodule",
  source,
  `-d=./${outDirRel}`,
  "-o=koodisampo.cjs",
].join(" ");

console.log(`Compiling Koodisampo (Ranger via ${install.label})...`);
console.log(cmd);
const output = execSync(cmd, { cwd: install.cwd, env, encoding: "utf-8" });
if (
  output.includes("[FAIL] Compilation FAILED") ||
  output.includes("Undefined variable")
) {
  console.error(output);
  process.exit(1);
}
console.log(output);
console.log("OK →", path.join(outDir, "koodisampo.cjs"));
