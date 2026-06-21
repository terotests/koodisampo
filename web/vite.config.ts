import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site: set PAGES_BASE=/koodisampo/ in CI (trailing slash required).
const base = process.env.PAGES_BASE ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
  appType: 'spa',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3847',
        changeOrigin: true,
      },
    },
  },
});
