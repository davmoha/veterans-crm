import fs from "node:fs/promises";
import path from "node:path";
import type { Express } from "express";
import express from "express";
import type { Server } from "node:http";

const runtimeDir = path.resolve(__dirname);
const projectRoot = path.basename(runtimeDir) === "dist" ? path.resolve(runtimeDir, "..") : runtimeDir;

export async function setupVite(app: Express, server: Server) {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom"
  });
  const template = await fs.readFile(path.resolve(projectRoot, "index.html"), "utf8");

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const html = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });

  return server;
}

export function serveStatic(app: Express) {
  const clientDir = path.basename(runtimeDir) === "dist" ? path.resolve(runtimeDir, "public") : path.resolve(projectRoot, "dist/public");
  const indexHtmlPromise = fs.readFile(path.join(clientDir, "index.html"), "utf8");

  app.use(express.static(clientDir));
  app.get("*", async (_req, res, next) => {
    try {
      res.type("html").send(await indexHtmlPromise);
    } catch (error) {
      next(error);
    }
  });
}
