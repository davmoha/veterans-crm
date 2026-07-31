import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const root = path.resolve(__dirname);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@/components/ui": path.resolve(root, "ui"),
      "@/components": root,
      "@/pages": root,
      "@/lib": root,
      "@/hooks": path.resolve(root, "hooks"),
      "@/contexts": path.resolve(root, "contexts"),
      "@/_core": path.resolve(root, "_core"),
      "@shared": path.resolve(root, "shared"),
      "@/const": path.resolve(root, "const.ts")
    }
  },
  build: {
    outDir: "dist/public",
    emptyOutDir: true
  },
  server: {
    port: 3000
  }
});
