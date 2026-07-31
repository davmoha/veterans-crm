import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { parse } from "cookie";
import { COOKIE_NAME } from "./shared/const";

export type SessionUser = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
};

export type Context = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: SessionUser | null;
};

function readSession(cookieHeader?: string): SessionUser | null {
  if (!cookieHeader) return null;
  const cookieValue = parse(cookieHeader)[COOKIE_NAME];
  if (!cookieValue) return null;

  try {
    return JSON.parse(Buffer.from(cookieValue, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

export function encodeSession(user: SessionUser) {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

export function createContext({ req, res }: CreateExpressContextOptions): Context {
  return {
    req,
    res,
    user: readSession(req.headers.cookie)
  };
}
