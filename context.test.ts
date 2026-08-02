import { describe, expect, it } from "vitest";
import { COOKIE_NAME } from "./shared/const";
import { createContext, encodeSession, type SessionUser } from "./context";

describe("context session helpers", () => {
  it("decodes a stored session user from the cookie header", () => {
    const user: SessionUser = {
      id: 7,
      openId: "owner-123",
      name: "Owner",
      email: "owner@example.com",
      role: "admin"
    };

    const ctx = createContext({
      req: {
        headers: {
          cookie: `${COOKIE_NAME}=${encodeSession(user)}`
        }
      } as any,
      res: {} as any
    });

    expect(ctx.user).toEqual(user);
  });

  it("returns a null user when no session cookie exists", () => {
    const ctx = createContext({
      req: { headers: {} } as any,
      res: {} as any
    });

    expect(ctx.user).toBeNull();
  });
});
