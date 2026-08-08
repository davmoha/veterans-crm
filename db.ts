import { eq, like, or, sql, and, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { randomUUID } from "node:crypto";
import { InsertUser, users, constituents, volunteerProfiles, volunteerShifts, boardProfiles, membershipProfiles, invites } from "./drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt, lastSignedIn: users.lastSignedIn }).from(users).orderBy(users.createdAt);
}

export async function updateUserRole(userId: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

export async function deleteUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(users).where(eq(users.id, userId));
}

// ─── Constituents ─────────────────────────────────────────────────────────────
export async function getConstituents(search?: string) {
  const db = await getDb();
  if (!db) return [];
  if (search) {
    return db.select().from(constituents).where(
      or(
        like(constituents.firstName, `%${search}%`),
        like(constituents.lastName, `%${search}%`),
        like(constituents.primaryEmail, `%${search}%`),
        like(constituents.primaryPhone, `%${search}%`)
      )
    ).orderBy(constituents.lastName).limit(200);
  }
  return db.select().from(constituents).orderBy(constituents.lastName).limit(200);
}

export async function getConstituentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(constituents).where(eq(constituents.id, id)).limit(1);
  return result[0] ?? undefined;
}

export async function getConstituentByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(constituents).where(eq(constituents.primaryEmail, email)).limit(1);
  return result[0] ?? undefined;
}

export async function createConstituent(data: {
  firstName: string; lastName: string; primaryEmail?: string; primaryPhone?: string;
  addressStreet1?: string; addressStreet2?: string; addressCity?: string; addressState?: string;
  addressZip?: string; addressCountry?: string; householdId?: string; employerName?: string;
  jobTitle?: string; contactTypes?: string[]; contactNotes?: string; optInEmail?: boolean;
  optInSms?: boolean; optInPhysicalMail?: boolean; source?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(constituents).values({
    firstName: data.firstName, lastName: data.lastName,
    primaryEmail: data.primaryEmail ?? null, primaryPhone: data.primaryPhone ?? null,
    addressStreet1: data.addressStreet1 ?? null, addressStreet2: data.addressStreet2 ?? null,
    addressCity: data.addressCity ?? null, addressState: data.addressState ?? null,
    addressZip: data.addressZip ?? null, addressCountry: data.addressCountry ?? null,
    householdId: data.householdId ?? null, employerName: data.employerName ?? null,
    jobTitle: data.jobTitle ?? null, contactTypes: data.contactTypes ?? [],
    contactNotes: data.contactNotes ?? null,
    optInEmail: data.optInEmail ?? true, optInSms: data.optInSms ?? false,
    optInPhysicalMail: data.optInPhysicalMail ?? true,
    source: data.source ?? "manual",
  });
}

export async function updateConstituent(id: number, data: Partial<{
  firstName: string; lastName: string; primaryEmail: string; primaryPhone: string;
  addressStreet1: string; addressStreet2: string; addressCity: string; addressState: string;
  addressZip: string; addressCountry: string; householdId: string; employerName: string;
  jobTitle: string; contactTypes: string[]; contactNotes: string; optInEmail: boolean;
  optInSms: boolean; optInPhysicalMail: boolean;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(constituents).set(data).where(eq(constituents.id, id));
}

export async function getConstituentStats() {
  const db = await getDb();
  if (!db) return { total: 0, volunteers: 0, board: 0, members: 0 };
  const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(constituents);
  const [volResult] = await db.select({ count: sql<number>`count(*)` }).from(volunteerProfiles);
  const [boardResult] = await db.select({ count: sql<number>`count(*)` }).from(boardProfiles);
  const [memResult] = await db.select({ count: sql<number>`count(*)` }).from(membershipProfiles);
  return {
    total: Number(totalResult?.count ?? 0),
    volunteers: Number(volResult?.count ?? 0),
    board: Number(boardResult?.count ?? 0),
    members: Number(memResult?.count ?? 0),
  };
}

// ─── Volunteer ────────────────────────────────────────────────────────────────
export async function getVolunteerProfile(constituentId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(volunteerProfiles).where(eq(volunteerProfiles.constituentId, constituentId)).limit(1);
  return result[0] ?? null;
}

export async function upsertVolunteerProfile(constituentId: number, data: Partial<{
  skills: string[]; emergencyContactName: string; emergencyContactPhone: string;
  backgroundCheckStatus: "Not Started" | "Pending" | "Passed" | "Failed" | "Expired";
  backgroundCheckExpiration: string; preferredLocations: string[];
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getVolunteerProfile(constituentId);
  if (existing) {
    await db.update(volunteerProfiles).set(data).where(eq(volunteerProfiles.constituentId, constituentId));
  } else {
    await db.insert(volunteerProfiles).values({ constituentId, ...data });
  }
}

export async function getTotalHoursWorked(constituentId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ total: sql<number>`COALESCE(SUM(hoursWorked), 0)` })
    .from(volunteerShifts)
    .where(and(eq(volunteerShifts.constituentId, constituentId), eq(volunteerShifts.status, "Completed")));
  return Number(result[0]?.total ?? 0);
}

export async function getVolunteerShifts(constituentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(volunteerShifts).where(eq(volunteerShifts.constituentId, constituentId)).orderBy(volunteerShifts.shiftDate);
}

export async function addVolunteerShift(data: {
  constituentId: number; shiftDate: string; hoursWorked: string;
  location?: string; description?: string; status?: "Scheduled" | "Completed" | "Cancelled";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(volunteerShifts).values({
    constituentId: data.constituentId, shiftDate: data.shiftDate,
    hoursWorked: data.hoursWorked, location: data.location ?? null,
    description: data.description ?? null, status: data.status ?? "Scheduled",
  });
}

// ─── Board ────────────────────────────────────────────────────────────────────
export async function getBoardProfile(constituentId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(boardProfiles).where(eq(boardProfiles.constituentId, constituentId)).limit(1);
  return result[0] ?? null;
}

export async function upsertBoardProfile(constituentId: number, data: Partial<{
  boardRole: "President" | "Vice President" | "Treasurer" | "Secretary" | "Member-at-Large" | "Chair" | "Vice Chair";
  committees: string[]; termStartDate: string; termEndDate: string;
  termNumber: number; personalGivingTarget: string;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getBoardProfile(constituentId);
  if (existing) {
    await db.update(boardProfiles).set(data).where(eq(boardProfiles.constituentId, constituentId));
  } else {
    await db.insert(boardProfiles).values({ constituentId, ...data });
  }
}

// ─── Membership ───────────────────────────────────────────────────────────────
export async function getMembershipProfile(constituentId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(membershipProfiles).where(eq(membershipProfiles.constituentId, constituentId)).limit(1);
  return result[0] ?? null;
}

export async function upsertMembershipProfile(constituentId: number, data: Partial<{
  memberTier: "Student" | "Individual" | "Family" | "Corporate" | "VIP";
  joinDate: string; lastRenewalDate: string; membershipExpirationDate: string; annualDuesAmount: string;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getMembershipProfile(constituentId);
  if (existing) {
    await db.update(membershipProfiles).set(data).where(eq(membershipProfiles.constituentId, constituentId));
  } else {
    const memberId = `MEM-${String(constituentId).padStart(6, "0")}`;
    await db.insert(membershipProfiles).values({ constituentId, uniqueMemberId: memberId, ...data });
  }
}

// ─── Invites ──────────────────────────────────────────────────────────────────
export async function createInvite(email: string, role: "user" | "admin" = "user") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await db.insert(invites).values({ email, token, role, expiresAt });
  return token;
}

export async function getInviteByToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(invites).where(eq(invites.token, token)).limit(1);
  return result[0] ?? null;
}

export async function getPendingInvites() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(invites).where(isNull(invites.usedAt)).orderBy(invites.createdAt);
}

export async function redeemInvite(token: string, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(invites).set({ usedAt: new Date(), usedBy: userId }).where(eq(invites.token, token));
}

export async function deleteInvite(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(invites).where(eq(invites.id, id));
}
