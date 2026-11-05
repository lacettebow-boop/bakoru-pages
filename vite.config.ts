import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// In dev, run `npm run dev` (Vite) and `npm run dev:worker` (Wrangler) side by side.
// Vite proxies /api to the local Worker so cookies and fetches behave like production.
export default defineConfig({
  plugins: [react()],
  root: ".",
  build: { outDir: "dist", emptyOutDir: true },
  server: {
    proxy: { "/api": "http://localhost:8787" },
  },
  test: {
    include: ["src/worker/**/*.test.ts"],
    environment: "node",
  },
});
