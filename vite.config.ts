import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, "src");

const srcAliases = fs
  .readdirSync(srcDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => {
    const name = e.name;
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return {
      find: new RegExp(`^@${escaped}/(.*)$`),
      replacement: path.join(srcDir, name, "$1"),
    };
  });

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: srcAliases,
  },
});
