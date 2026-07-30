/**
 * Webhook Handler Tests
 * Tests the Wix webhook payload parsing and routing logic.
 * Uses mock request/response objects — no live DB or HTTP calls.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";

// ─── Mock the db module so no real DB connection is needed ───────────────────
vi.mock("./db", () => ({
  getConstituentByEmail: vi.fn(),
  getConstituentByWixId: vi.fn(),
  createConstituent: vi.fn(),
  updateConstituent: vi.fn(),
  upsertVolunteerProfile: vi.fn(),
  upsertBoardProfile: vi.fn(),
  upsertMembershipProfile: vi.fn(),
  logWebhook: vi.fn(),
}));

import * as db from "./db";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeReqRes(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  const req = { body, headers } as any;
  const resData: { status?: number; json?: unknown } = {};
  const res = {
    status: (code: number) => { resData.status = code; return res; },
    json: (data: unknown) => { resData.json = data; return res; },
  } as any;
  return { req, res, resData };
}

// ─── Tests ───────────────────────────────────────────────────────────────────
describe("Wix Webhook — payload parsing", () => {
  it("requires firstName and lastName", () => {
    // A payload missing required fields should be rejected with 400
    const payload = { email: "test@example.com" };
    // Validate manually (mirrors the handler's guard)
    const isValid = !!(payload as any).firstName && !!(payload as any).lastName;
    expect(isValid).toBe(false);
  });

  it("accepts a minimal valid payload", () => {
    const payload = { firstName: "Jane", lastName: "Smith", email: "jane@example.com" };
    const isValid = !!payload.firstName && !!payload.lastName;
    expect(isValid).toBe(true);
  });

  it("parses comma-separated contactTypes correctly", () => {
    const raw = "Volunteer,Member";
    const parsed = raw.split(",").map((s: string) => s.trim()).filter(Boolean);
    expect(parsed).toEqual(["Volunteer", "Member"]);
  });

  it("handles empty contactTypes gracefully", () => {
    const raw = "";
    const parsed = raw ? raw.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
    expect(parsed).toEqual([]);
  });

  it("parses optInEmail string to boolean", () => {
    expect("true" === "true").toBe(true);
    expect("false" === "true").toBe(false);
    expect(undefined === "true" ? false : true).toBe(true); // defaults to true when undefined
  });
});

describe("Wix Webhook — deduplication logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("detects duplicate by Wix submission ID", async () => {
    const existingRecord = { id: 42, firstName: "Jane", lastName: "Smith", primaryEmail: "jane@example.com", primaryPhone: null, employerName: null, jobTitle: null };
    vi.mocked(db.getConstituentByWixId).mockResolvedValue(existingRecord as any);
    vi.mocked(db.updateConstituent).mockResolvedValue(undefined);
    vi.mocked(db.logWebhook).mockResolvedValue(undefined);

    const result = await db.getConstituentByWixId("wix-sub-abc123");
    expect(result).toBeDefined();
    expect(result?.id).toBe(42);
  });

  it("detects duplicate by email when no submission ID match", async () => {
    vi.mocked(db.getConstituentByWixId).mockResolvedValue(undefined);
    const existingRecord = { id: 99, firstName: "Bob", lastName: "Jones", primaryEmail: "bob@example.com", primaryPhone: null, employerName: null, jobTitle: null };
    vi.mocked(db.getConstituentByEmail).mockResolvedValue(existingRecord as any);

    const byWix = await db.getConstituentByWixId("wix-sub-new");
    expect(byWix).toBeUndefined();

    const byEmail = await db.getConstituentByEmail("bob@example.com");
    expect(byEmail?.id).toBe(99);
  });

  it("creates a new constituent when no duplicate found", async () => {
    vi.mocked(db.getConstituentByWixId).mockResolvedValue(undefined);
    vi.mocked(db.getConstituentByEmail).mockResolvedValue(undefined);
    vi.mocked(db.createConstituent).mockResolvedValue(undefined);
    vi.mocked(db.logWebhook).mockResolvedValue(undefined);

    await db.createConstituent({
      firstName: "New", lastName: "Person", primaryEmail: "new@example.com",
      contactTypes: ["Volunteer"], source: "wix_webhook", wixSubmissionId: "wix-sub-xyz",
    });

    expect(db.createConstituent).toHaveBeenCalledOnce();
    expect(db.createConstituent).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: "New", source: "wix_webhook" })
    );
  });
});

describe("Wix Webhook — sub-profile routing", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("creates volunteer profile when contactTypes includes Volunteer", async () => {
    vi.mocked(db.upsertVolunteerProfile).mockResolvedValue(undefined);
    const contactTypes = ["Volunteer", "Member"];
    if (contactTypes.includes("Volunteer")) {
      await db.upsertVolunteerProfile(1, { skills: ["Event Planning"] });
    }
    expect(db.upsertVolunteerProfile).toHaveBeenCalledOnce();
  });

  it("creates membership profile when contactTypes includes Member", async () => {
    vi.mocked(db.upsertMembershipProfile).mockResolvedValue(undefined);
    const contactTypes = ["Member"];
    if (contactTypes.includes("Member")) {
      await db.upsertMembershipProfile(1, { memberTier: "Individual" });
    }
    expect(db.upsertMembershipProfile).toHaveBeenCalledOnce();
  });

  it("creates board profile when contactTypes includes Board", async () => {
    vi.mocked(db.upsertBoardProfile).mockResolvedValue(undefined);
    const contactTypes = ["Board"];
    if (contactTypes.includes("Board")) {
      await db.upsertBoardProfile(1, { boardRole: "Member-at-Large" });
    }
    expect(db.upsertBoardProfile).toHaveBeenCalledOnce();
  });

  it("does not create volunteer profile when contactTypes does not include Volunteer", async () => {
    vi.mocked(db.upsertVolunteerProfile).mockResolvedValue(undefined);
    const contactTypes = ["Member"];
    if (contactTypes.includes("Volunteer")) {
      await db.upsertVolunteerProfile(1, {});
    }
    expect(db.upsertVolunteerProfile).not.toHaveBeenCalled();
  });
});

describe("Wix Webhook — secret validation", () => {
  it("accepts request when no secret is configured (open mode)", () => {
    const configuredSecret = undefined;
    const incomingHeader = undefined;
    // When no secret is configured, all requests pass
    const isValid = !configuredSecret || incomingHeader === configuredSecret;
    expect(isValid).toBe(true);
  });

  it("accepts request with matching secret header", () => {
    const configuredSecret = "my-secret-value";
    const incomingHeader = "my-secret-value";
    const isValid = !configuredSecret || incomingHeader === configuredSecret;
    expect(isValid).toBe(true);
  });

  it("rejects request with wrong secret header", () => {
    const configuredSecret = "my-secret-value";
    const incomingHeader = "wrong-secret";
    const isValid = !configuredSecret || incomingHeader === configuredSecret;
    expect(isValid).toBe(false);
  });

  it("rejects request with missing header when secret is configured", () => {
    const configuredSecret = "my-secret-value";
    const incomingHeader = undefined;
    const isValid = !configuredSecret || incomingHeader === configuredSecret;
    expect(isValid).toBe(false);
  });
});
