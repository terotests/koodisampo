/**
 * Resolve Ranger compiler from npm package `ranger-compiler`.
 *
 * Optional local fallback (sibling ../agent/Ranger) only when:
 *   RANGER_USE_LOCAL=1
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function resolveNpmInstall() {
  const pkgPath = require.resolve("ranger-compiler/package.json");
  const root = path.dirname(pkgPath);
  const compiler = path.join(root, "dist/rgrc.js");
  if (!fs.existsSync(compiler)) {
    return null;
  }
  return {
    label: `npm:${require(pkgPath).version}`,
    compiler,
    langLib: [
      path.join(root, "dist/Lang.rgr"),
      path.join(root, "dist/lib"),
    ].join(path.delimiter),
    cwd: projectRoot,
  };
}

function resolveSiblingInstall() {
  const sibling = path.resolve(projectRoot, "../agent/Ranger");
  const compiler = path.join(sibling, "bin/output.js");
  if (!fs.existsSync(compiler)) {
    return null;
  }
  return {
    label: `local:${sibling}`,
    compiler,
    langLib: [
      path.join(sibling, "compiler/Lang.rgr"),
      path.join(sibling, "lib"),
    ].join(path.delimiter),
    cwd: sibling,
  };
}

/** @returns {{ label: string, compiler: string, langLib: string, cwd: string }} */
export function resolveRangerCompiler() {
  const useLocal = process.env.RANGER_USE_LOCAL === "1";
  const npm = resolveNpmInstall();
  if (!useLocal && npm) {
    return npm;
  }
  const local = resolveSiblingInstall();
  if (local) {
    return local;
  }
  if (npm) {
    return npm;
  }

  console.error("Ranger compiler not found.");
  console.error("");
  console.error("Install npm package:  npm install");
  console.error("Or local sibling:     RANGER_USE_LOCAL=1  (needs ../agent/Ranger)");
  console.error("");
  console.error("See AGENTS.md for details.");
  process.exit(1);
}

export { projectRoot };
