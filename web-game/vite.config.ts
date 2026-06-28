import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = path.resolve(rootDir, "..");
const basePath = process.env.PAGES_BASE ?? "/koodisampo/";

const rangerCjs = path.join(repoRoot, "generated/es6/koodisampo.cjs");

function clearViteDeps() {
  const viteCache = path.join(rootDir, "node_modules/.vite");
  if (fs.existsSync(viteCache)) {
    fs.rmSync(viteCache, { recursive: true, force: true });
  }
}

/** Ranger-buildin jälkeen pakota Vite lukemaan tuore CJS (applyPlayerProfile ym.). */
function rangerRuntimeWatchPlugin(): Plugin {
  return {
    name: "koodisampo-ranger-runtime-watch",
    apply: "serve",
    configureServer(server) {
      if (!fs.existsSync(rangerCjs)) return;
      server.watcher.add(rangerCjs);
      server.watcher.on("change", (file) => {
        if (path.resolve(file) !== path.resolve(rangerCjs)) return;
        clearViteDeps();
      });
    },
  };
}

/** Dev only: serve content/worlds suoraan reposta (editor-sync ilman public-kopiota). */
function devContentFromSourcePlugin(): Plugin {
  return {
    name: "koodisampo-dev-content",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = req.url?.split("?")[0] ?? "";
        const worldsPrefix = `${basePath}content/worlds/`;
        if (!raw.startsWith(worldsPrefix)) {
          next();
          return;
        }
        const name = raw.slice(worldsPrefix.length);
        if (!name || name.includes("..") || name.includes("/")) {
          next();
          return;
        }
        const file = path.join(repoRoot, "content/worlds", name);
        if (!fs.existsSync(file)) {
          next();
          return;
        }
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        fs.createReadStream(file).pipe(res);
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [devContentFromSourcePlugin(), rangerRuntimeWatchPlugin()],
  resolve: {
    alias: {
      "node:fs": path.resolve(rootDir, "src/shims/empty-fs.ts"),
      "node:path": path.resolve(rootDir, "src/shims/path-browser.ts"),
      "node:url": path.resolve(rootDir, "src/shims/url-browser.ts"),
      "node:os": path.resolve(rootDir, "src/shims/empty-os.ts"),
      "koodisampo-runtime": path.resolve(rootDir, "src/koodisampo-runtime.ts"),
      [path.resolve(rootDir, "../hosts/terminal/gameHost.mjs")]: path.resolve(
        rootDir,
        "src/gameHost.ts",
      ),
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ["koodisampo-runtime"],
  },
});
