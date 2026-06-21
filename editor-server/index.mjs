#!/usr/bin/env node
/**
 * Koodisampo Game Editor API
 * Käyttö: node editor-server/index.mjs
 */
import http from "node:http";
import { loadWorld, analyzeFloor, worldSummary } from "./services/world.mjs";
import { listQuestions, previewQuestionsForTopic, questionStats } from "./services/questions.mjs";
import {
  getActiveWorldRel,
  getActiveWorldAbs,
  listWorldFiles,
  switchActiveWorld,
  saveActiveWorld,
  saveWorldToFile,
  createNamedBackup,
  listBackups,
  restoreBackup,
  deleteBackup,
  DEFAULT_WORLD_REL,
} from "./services/storage.mjs";

const PORT = Number(process.env.KOODISAMPO_EDITOR_PORT ?? 3847);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...CORS });
  res.end(`${JSON.stringify(body)}\n`);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Virheellinen JSON"));
      }
    });
    req.on("error", reject);
  });
}

async function handle(req, res) {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    res.end();
    return;
  }

  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      json(res, 200, { ok: true, service: "koodisampo-editor" });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/world") {
      const world = loadWorld(getActiveWorldAbs());
      json(res, 200, {
        activeFile: getActiveWorldRel(),
        defaultFile: DEFAULT_WORLD_REL,
        ...worldSummary(world),
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/world/files") {
      json(res, 200, {
        activeFile: getActiveWorldRel(),
        files: listWorldFiles(),
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/world/backups") {
      json(res, 200, { backups: listBackups() });
      return;
    }

    const floorMatch = url.pathname.match(/^\/api\/world\/floors\/(\d+)\/analysis$/);
    if (req.method === "GET" && floorMatch) {
      const floorIndex = Number.parseInt(floorMatch[1], 10);
      const world = loadWorld(getActiveWorldAbs());
      json(res, 200, analyzeFloor(world, floorIndex));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/world/load") {
      const body = await readBody(req);
      const result = switchActiveWorld(body.path);
      json(res, 200, result);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/world/save") {
      const body = await readBody(req);
      const relPath = String(body.path || "").trim();
      if (!relPath) throw new Error("path vaaditaan");
      const overwrite = body.overwrite !== false;
      let saved;
      if (body.world) {
        saved = saveWorldToFile(relPath, body.world, { overwrite });
        if (relPath.split("\\").join("/") === getActiveWorldRel()) {
          switchActiveWorld(relPath);
        }
      } else {
        saved = saveActiveWorld(relPath, { overwrite });
      }
      json(res, 200, {
        ...saved,
        activeFile: getActiveWorldRel(),
        summary: worldSummary(loadWorld(getActiveWorldAbs())),
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/world/save-active") {
      const body = await readBody(req);
      const saved = saveActiveWorld(getActiveWorldRel(), { overwrite: body.overwrite !== false });
      json(res, 200, {
        ...saved,
        activeFile: getActiveWorldRel(),
        summary: worldSummary(loadWorld(getActiveWorldAbs())),
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/world/backups") {
      const body = await readBody(req);
      const backup = createNamedBackup(body.name, body.note);
      json(res, 201, backup);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/world/backups/restore") {
      const body = await readBody(req);
      const id = String(body.id || "").trim();
      if (!id) throw new Error("id vaaditaan");
      const result = restoreBackup(id, {
        saveToSource: !!body.saveToSource,
        saveActive: !!body.saveActive,
      });
      json(res, 200, result);
      return;
    }

    const deleteBackupMatch = url.pathname.match(/^\/api\/world\/backups\/([^/]+)$/);
    if (req.method === "DELETE" && deleteBackupMatch) {
      json(res, 200, deleteBackup(deleteBackupMatch[1]));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/questions/stats") {
      json(res, 200, questionStats());
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/questions") {
      const chapter = url.searchParams.get("chapter") ?? "";
      const domain = url.searchParams.get("domain") ?? "";
      const q = url.searchParams.get("q") ?? "";
      const limit = Number.parseInt(url.searchParams.get("limit") ?? "50", 10);
      json(res, 200, listQuestions({ chapter, domain, q, limit }));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/questions/preview") {
      const topic = url.searchParams.get("topic") ?? "";
      const limit = Number.parseInt(url.searchParams.get("limit") ?? "5", 10);
      json(res, 200, previewQuestionsForTopic(topic, limit));
      return;
    }

    json(res, 404, { error: "Not found", path: url.pathname });
  } catch (err) {
    console.error(err);
    json(res, 500, { error: err.message ?? String(err) });
  }
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error(err);
    json(res, 500, { error: "Internal error" });
  });
});

server.listen(PORT, () => {
  console.log(`Koodisampo editor API http://localhost:${PORT}`);
});
