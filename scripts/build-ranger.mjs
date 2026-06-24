#!/usr/bin/env node
/**
 * Build Koodisampo Ranger lib → generated/es6/koodisampo.cjs
 *
 * Compiler resolution order:
 * 1. npm devDependency `ranger-compiler` (cloud CI, normal clone)
 * 2. sibling checkout ../agent/Ranger (local monorepo layout)
 */
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const entryAbs = path.join(projectRoot, "lib/game/KoodisampoLib.rgr");
const outDir = path.join(projectRoot, "generated/es6");

function resolveRangerInstall() {
  try {
    const pkgPath = require.resolve("ranger-compiler/package.json");
    const root = path.dirname(pkgPath);
    const compiler = path.join(root, "dist/rgrc.js");
    if (fs.existsSync(compiler)) {
      return {
        label: `npm:${require(pkgPath).version}`,
        compiler,
        langLib: [
          path.join(root, "dist/Lang.rgr"),
          path.join(root, "dist/lib"),
        ].join(path.delimiter),
        cwd: projectRoot,
        source: path.relative(projectRoot, entryAbs).split(path.sep).join("/"),
        outDirRel: path.relative(projectRoot, outDir).split(path.sep).join("/"),
      };
    }
  } catch {
    // fall through to sibling checkout
  }

  const sibling = path.resolve(projectRoot, "../agent/Ranger");
  const localCompiler = path.join(sibling, "bin/output.js");
  if (fs.existsSync(localCompiler)) {
    return {
      label: `local:${sibling}`,
      compiler: localCompiler,
      langLib: [
        path.join(sibling, "compiler/Lang.rgr"),
        path.join(sibling, "lib"),
      ].join(path.delimiter),
      cwd: sibling,
      source: path.relative(sibling, entryAbs).split(path.sep).join("/"),
      outDirRel: path.relative(sibling, outDir).split(path.sep).join("/"),
    };
  }

  console.error("Ranger compiler not found.");
  console.error("");
  console.error("Cloud / CI:  npm install   (installs devDependency ranger-compiler)");
  console.error("Local dev:   cd ../agent/Ranger && npm run compile");
  console.error("");
  console.error("See AGENTS.md for details.");
  process.exit(1);
}

const install = resolveRangerInstall();
fs.mkdirSync(outDir, { recursive: true });

const env = {
  ...process.env,
  RANGER_LIB: install.langLib,
};

const cmd = [
  "node",
  JSON.stringify(install.compiler),
  "-es6",
  "-nodemodule",
  install.source,
  `-d=./${install.outDirRel}`,
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
