import type { Express, Request, Response } from "express";
import { COOKIE_NAME } from "./shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { encodeSession, type SessionUser } from "./context";
import { upsertUser } from "./db";

function buildLocalUser(): SessionUser {
  return {
    id: 1,
    openId: ENV.ownerOpenId,
    name: ENV.ownerName,
    email: ENV.ownerEmail,
    role: "admin"
  };
}

export function registerOAuthRoutes(app: Express) {
  app.get("/auth/login", async (req: Request, res: Response) => {
    const user = buildLocalUser();

    try {
      await upsertUser({
        openId: user.openId,
        name: user.name,
        email: user.email,
        role: user.role,
        loginMethod: "local"
      });
    } catch (error) {
      console.warn("[Auth] Failed to persist local admin session", error);
    }

    res.cookie(COOKIE_NAME, encodeSession(user), getSessionCookieOptions(req));
    res.redirect("/");
  });

  app.get("/auth/logout", (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(req), maxAge: -1 });
    res.redirect("/");
  });
}
