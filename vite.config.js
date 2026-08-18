import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = dirname(fileURLToPath(import.meta.url));

const rawBase = process.env.VITE_BASE_PATH || "/share";
const base =
  rawBase === "/" ? "/" : `/${String(rawBase).replace(/^\/|\/$/g, "")}/`;

/**
 * GitHub Pages has no SPA rewrite engine. Missing paths return a custom
 * 404.html from this project's published root, and the browser URL is kept.
 * Copying the built index.html onto 404.html makes /share/text/ABC123 load
 * the same SPA entry as /share, so React Router can read the original path.
 * Groww (or any other project Pages site) needs the same copy in its own dist.
 */
function githubPagesSpaFallback() {
  return {
    name: "github-pages-spa-fallback",
    closeBundle() {
      const dist = resolve(__dirname, "dist");
      const index = resolve(dist, "index.html");
      if (!existsSync(index)) return;
      copyFileSync(index, resolve(dist, "404.html"));
      writeFileSync(resolve(dist, ".nojekyll"), "");
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), githubPagesSpaFallback()],
});
