import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: process.env.PAGES_BASE ?? "/koodisampo/",
  resolve: {
    alias: {
      "node:fs": path.resolve(rootDir, "src/shims/empty-fs.ts"),
      "node:path": path.resolve(rootDir, "src/shims/path-browser.ts"),
      "node:url": path.resolve(rootDir, "src/shims/url-browser.ts"),
      "node:os": path.resolve(rootDir, "src/shims/empty-os.ts"),
      "koodisampo-runtime": path.resolve(rootDir, "public/vendor/koodisampo.cjs"),
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
});
