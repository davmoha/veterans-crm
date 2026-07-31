import type { Express } from "express";

export function registerStorageProxy(_app: Express) {
  // Self-hosted builds do not require the Manus storage proxy.
}
