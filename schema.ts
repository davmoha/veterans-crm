import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  date,
  decimal,
  json,
} from "drizzle-orm/mysql-core";

// ─── Users (admin auth) ───────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Invites (for onboarding new users) ───────────────────────────────────────
export const invites = mysqlTable("invites", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  usedBy: int("usedBy"),
});

export type Invite = typeof invites.$inferSelect;
export type InsertInvite = typeof invites.$inferInsert;

// ─── MODULE 1: Core Constituent Profile ──────────────────────────────────────
export const constituents = mysqlTable("constituents", {
  id: int("id").autoincrement().primaryKey(),

  // Name & Contact
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  primaryEmail: varchar("primaryEmail", { length: 320 }),
  primaryPhone: varchar("primaryPhone", { length: 30 }),

  // Mailing Address (compound)
  addressStreet1: varchar("addressStreet1", { length: 200 }),
  addressStreet2: varchar("addressStreet2", { length: 200 }),
  addressCity: varchar("addressCity", { length: 100 }),
  addressState: varchar("addressState", { length: 100 }),
  addressZip: varchar("addressZip", { length: 20 }),
  addressCountry: varchar("addressCountry", { length: 100 }),

  // Household/Organization Link
  householdId: varchar("householdId", { length: 64 }),
  employerName: varchar("employerName", { length: 200 }),
  jobTitle: varchar("jobTitle", { length: 200 }),

  // System Auditing
  contactTypes: json("contactTypes").$type<string[]>(),
  contactNotes: text("contactNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),

  // Communication Preferences
  optInEmail: boolean("optInEmail").default(true).notNull(),
  optInSms: boolean("optInSms").default(false).notNull(),
  optInPhysicalMail: boolean("optInPhysicalMail").default(true).notNull(),

  // Source tracking
  source: varchar("source", { length: 50 }).default("manual"),
});

export type Constituent = typeof constituents.$inferSelect;
export type InsertConstituent = typeof constituents.$inferInsert;

// ─── MODULE 2: Volunteer Management ──────────────────────────────────────────
export const volunteerProfiles = mysqlTable("volunteerProfiles", {
  id: int("id").autoincrement().primaryKey(),
  constituentId: int("constituentId").notNull(),

  skills: json("skills").$type<string[]>(),
  availability: json("availability").$type<Record<string, string[]>>(),
  emergencyContactName: varchar("emergencyContactName", { length: 200 }),
  emergencyContactPhone: varchar("emergencyContactPhone", { length: 30 }),

  backgroundCheckStatus: mysqlEnum("backgroundCheckStatus", [
    "Not Started",
    "Pending",
    "Passed",
    "Failed",
    "Expired",
  ]).default("Not Started"),
  backgroundCheckExpiration: varchar("backgroundCheckExpiration", { length: 20 }),

  preferredLocations: json("preferredLocations").$type<string[]>(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VolunteerProfile = typeof volunteerProfiles.$inferSelect;
export type InsertVolunteerProfile = typeof volunteerProfiles.$inferInsert;

// Volunteer Shifts (child records for roll-up of Total Hours Worked)
export const volunteerShifts = mysqlTable("volunteerShifts", {
  id: int("id").autoincrement().primaryKey(),
  constituentId: int("constituentId").notNull(),
  shiftDate: varchar("shiftDate", { length: 20 }).notNull(),
  hoursWorked: decimal("hoursWorked", { precision: 5, scale: 2 }).notNull(),
  location: varchar("location", { length: 200 }),
  description: text("description"),
  status: mysqlEnum("status", ["Scheduled", "Completed", "Cancelled"]).default("Scheduled"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VolunteerShift = typeof volunteerShifts.$inferSelect;
export type InsertVolunteerShift = typeof volunteerShifts.$inferInsert;

// ─── MODULE 3: Board of Directors Governance ─────────────────────────────────
export const boardProfiles = mysqlTable("boardProfiles", {
  id: int("id").autoincrement().primaryKey(),
  constituentId: int("constituentId").notNull(),

  boardRole: mysqlEnum("boardRole", [
    "President",
    "Vice President",
    "Treasurer",
    "Secretary",
    "Member-at-Large",
    "Chair",
    "Vice Chair",
  ]),
  committees: json("committees").$type<string[]>(),

  termStartDate: varchar("termStartDate", { length: 20 }),
  termEndDate: varchar("termEndDate", { length: 20 }),
  termNumber: int("termNumber").default(1),

  personalGivingTarget: decimal("personalGivingTarget", { precision: 12, scale: 2 }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BoardProfile = typeof boardProfiles.$inferSelect;
export type InsertBoardProfile = typeof boardProfiles.$inferInsert;

// ─── MODULE 4: Membership Management ─────────────────────────────────────────
export const membershipProfiles = mysqlTable("membershipProfiles", {
  id: int("id").autoincrement().primaryKey(),
  constituentId: int("constituentId").notNull(),

  memberTier: mysqlEnum("memberTier", [
    "Student",
    "Individual",
    "Family",
    "Corporate",
    "VIP",
  ]),

  joinDate: varchar("joinDate", { length: 20 }),
  lastRenewalDate: varchar("lastRenewalDate", { length: 20 }),
  membershipExpirationDate: varchar("membershipExpirationDate", { length: 20 }),

  uniqueMemberId: varchar("uniqueMemberId", { length: 20 }).unique(),
  annualDuesAmount: decimal("annualDuesAmount", { precision: 10, scale: 2 }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MembershipProfile = typeof membershipProfiles.$inferSelect;
export type InsertMembershipProfile = typeof membershipProfiles.$inferInsert;

