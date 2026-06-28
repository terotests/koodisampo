import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { EDITOR_API_PORT, EDITOR_UI_PORT } from "./ports.mjs";

export default defineConfig({
  plugins: [react()],
  appType: "spa",
  server: {
    port: EDITOR_UI_PORT,
    strictPort: true,
    proxy: {
      "/api": {
        target: `http://localhost:${EDITOR_API_PORT}`,
        changeOrigin: true,
      },
    },
  },
});
