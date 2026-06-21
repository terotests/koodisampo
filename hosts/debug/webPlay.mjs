#!/usr/bin/env node
/**
 * Web-debug-näkymä — pelaa selaimessa, näe tila JSONina, ei stdin-ongelmia.
 * npm run play:web
 */
import http from "node:http";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import * as gameHost from "../terminal/gameHost.mjs";
import { castListEnabledForWeb } from "../terminal/debugFlags.mjs";
import { loadPlayerSave, savePlayerSave } from "../terminal/playerSave.mjs";
import { createWebGameController } from "../shared/webGameController.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");
const storiesDir = resolve(projectRoot, "content/stories");
const require = createRequire(import.meta.url);
const { StoryCatalog } = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));
const storyCatalog = new StoryCatalog();

const PORT = Number(process.env.KOODISAMPO_DEBUG_PORT ?? 3947);
const HTML = readFileSync(resolve(__dirname, "index.html"), "utf8");
const mapJson = readFileSync(
  resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
  "utf8",
);

const game = createWebGameController({
  mapJson,
  storyCatalog,
  gameHost,
  loadSave: () => loadPlayerSave(),
  persistSave: (karma, deaths, quizHistory, studyBacklog, progress) => {
    savePlayerSave(karma, deaths, quizHistory, studyBacklog, progress);
  },
  loadStoryJson: (summary) => {
    if (!summary?.id || !summary.filename) return null;
    try {
      return readFileSync(resolve(storiesDir, summary.filename), "utf8");
    } catch {
      return null;
    }
  },
  castListEnabled: castListEnabledForWeb,
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(HTML);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/state") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(game.snapshot()));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/reset") {
    game.reset(true);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(game.snapshot()));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/key") {
    let body = "";
    for await (const chunk of req) body += chunk;
    let payload = {};
    try {
      payload = JSON.parse(body);
    } catch {
      res.writeHead(400);
      res.end('{"error":"bad json"}');
      return;
    }
    if (payload.answer !== undefined && game.session.screen === "story") {
      game.handleStoryCode(String(payload.answer));
    } else {
      game.handleKey(String(payload.key ?? "").toLowerCase());
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(game.snapshot()));
    return;
  }

  res.writeHead(404);
  res.end("not found");
});

server.listen(PORT, () => {
  console.log(`Koodisampo debug UI  http://localhost:${PORT}`);
  console.log("Näppäimet: WASD / nuolinäppäimet | kohtaaminen: 1-4 a j i p h | Enter=jatka");
});

process.on("SIGINT", () => {
  game.stop();
  process.exit(0);
});
