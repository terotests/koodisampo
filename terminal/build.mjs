#!/usr/bin/env node
/**
 * Koodisampo Terminal — käännä Ranger-sovellus selaimelle.
 *
 *   node terminal/build.mjs            (tai: npm run build:terminal)
 *
 * Kääntää `KoodisampoTerminal.rgr`:n (sovellus + koko EVG-moottori) ES6:ksi
 * ja kääri sen selaimen IIFE:ksi tiedostoon `web/koodisampo-terminal.js`.
 * Kopioi lisäksi WebGL-maalarin ja tekstinmittaajan `web/vendor/`-kansioon.
 *
 * Kaikki tuotokset commitoidaan: GitHub Pages -build ei käännä Rangeria.
 *
 * EVG ei ole npm-paketissa `ranger-compiler`, joten tarvitaan Ranger-repon
 * checkout: RANGER_DIR, tai ../Ranger / ../agent/Ranger koodisampon vieressä.
 * Kääntäjänä käytetään saman checkoutin `dist/rgrc.js`:ää.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const WEB = path.join(HERE, "web");

function findRanger() {
  const tries = [
    process.env.RANGER_DIR,
    path.resolve(REPO, "../Ranger"),
    path.resolve(REPO, "../agent/Ranger"),
  ].filter(Boolean);
  for (const dir of tries) {
    if (fs.existsSync(path.join(dir, "dist/rgrc.js")) && fs.existsSync(path.join(dir, "lib/evg/EVGLayout.rgr"))) {
      return path.resolve(dir);
    }
  }
  console.error("Ranger-checkoutia ei löytynyt (EVG tarvitaan). Kokeiltiin:\n  " + tries.join("\n  "));
  console.error("Aseta RANGER_DIR=/polku/Ranger");
  process.exit(1);
}

const RANGER = findRanger();
const STAGE = path.join(HERE, ".stage");
fs.rmSync(STAGE, { recursive: true, force: true });
fs.mkdirSync(STAGE, { recursive: true });

// Lähde kopioidaan väliaikaiskansioon oman ranger.json:n kanssa, jotta
// `pkg:evg/…` osoittaa siihen checkoutiin, joka tällä koneella on.
fs.copyFileSync(path.join(HERE, "KoodisampoTerminal.rgr"), path.join(STAGE, "KoodisampoTerminal.rgr"));
fs.writeFileSync(
  path.join(STAGE, "ranger.json"),
  JSON.stringify(
    { name: "koodisampo-terminal", version: "0.1.0", license: "MIT", dependencies: { evg: { path: path.join(RANGER, "lib/evg") } } },
    null,
    2,
  ),
);

let log = "";
try {
  log = execFileSync(
    process.execPath,
    ["dist/rgrc.js", "-es6", path.join(STAGE, "KoodisampoTerminal.rgr"), `-d=${STAGE}`, "-o=raw.js", "-nodecli"],
    { cwd: RANGER, env: { ...process.env, RANGER_LIB: "./compiler/Lang.rgr:./lib/stdops.rgr" }, encoding: "utf8" },
  );
} catch (e) {
  log = String(e.stdout || "") + String(e.stderr || "");
}
const rawPath = path.join(STAGE, "raw.js");
if (log.includes("Compilation FAILED") || !fs.existsSync(rawPath)) {
  process.stderr.write(log + "\n");
  process.exit(1);
}

const bundle = fs.readFileSync(rawPath, "utf8").replace(/^#![^\n]*\n/, "");
const scoped =
  "// GENERATED from terminal/KoodisampoTerminal.rgr by terminal/build.mjs — do not edit.\n" +
  "// Contains the EVG layout engine (Ranger lib/evg, MIT).\n" +
  "(function () {\n" +
  bundle +
  "\n;globalThis.KoodisampoTerminal = KoodisampoTerminal;" +
  "\n;globalThis.KoodisampoTerminalModule = { EVGHostTextMeasurer: EVGHostTextMeasurer, EVGDefaultMeasurer: EVGDefaultMeasurer };" +
  "\n})();\n";

// Ladataan kuten selain lataa: ilman Noden `require`a.
{
  const ctx = vm.createContext({ console });
  vm.runInContext(scoped, ctx);
  if (typeof ctx.KoodisampoTerminal !== "function" || typeof ctx.KoodisampoTerminalModule.EVGHostTextMeasurer !== "function") {
    throw new Error("koodisampo-terminal.js: selaimen exportit puuttuvat");
  }
}

fs.mkdirSync(path.join(WEB, "vendor"), { recursive: true });
fs.writeFileSync(path.join(WEB, "koodisampo-terminal.js"), scoped);
for (const f of ["evg-webgl.js", "evg-measure.js"]) {
  fs.copyFileSync(path.join(RANGER, "lib/evg/gl", f), path.join(WEB, "vendor", f));
}
fs.rmSync(STAGE, { recursive: true, force: true });
console.log("Wrote terminal/web/koodisampo-terminal.js (" + Math.round(scoped.length / 1024) + " KiB) using " + RANGER);
