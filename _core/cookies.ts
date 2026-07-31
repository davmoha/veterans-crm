import type { Request } from "express";

export function getSessionCookieOptions(_req?: Request) {
  const isSecure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isSecure,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}
