import { z } from "zod";
import { COOKIE_NAME } from "./shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getConstituents, getConstituentById, createConstituent, updateConstituent,
  getConstituentStats, getVolunteerProfile, upsertVolunteerProfile,
  getTotalHoursWorked, getVolunteerShifts, addVolunteerShift,
  getBoardProfile, upsertBoardProfile, getMembershipProfile, upsertMembershipProfile,
  getAllUsers, updateUserRole, deleteUser,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  constituents: router({
    list: protectedProcedure
      .input(z.object({ search: z.string().optional() }).optional())
      .query(({ input }) => getConstituents(input?.search)),
    byId: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getConstituentById(input.id)),
    stats: protectedProcedure.query(() => getConstituentStats()),
    create: protectedProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        primaryEmail: z.string().optional(),
        primaryPhone: z.string().optional(),
        addressStreet1: z.string().optional(),
        addressStreet2: z.string().optional(),
        addressCity: z.string().optional(),
        addressState: z.string().optional(),
        addressZip: z.string().optional(),
        addressCountry: z.string().optional(),
        householdId: z.string().optional(),
        employerName: z.string().optional(),
        jobTitle: z.string().optional(),
        contactTypes: z.array(z.string()).optional(),
        contactNotes: z.string().optional(),
        optInEmail: z.boolean().optional(),
        optInSms: z.boolean().optional(),
        optInPhysicalMail: z.boolean().optional(),
      }))
      .mutation(({ input }) => createConstituent(input)),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        primaryEmail: z.string().optional(),
        primaryPhone: z.string().optional(),
        addressStreet1: z.string().optional(),
        addressStreet2: z.string().optional(),
        addressCity: z.string().optional(),
        addressState: z.string().optional(),
        addressZip: z.string().optional(),
        addressCountry: z.string().optional(),
        householdId: z.string().optional(),
        employerName: z.string().optional(),
        jobTitle: z.string().optional(),
        contactTypes: z.array(z.string()).optional(),
        contactNotes: z.string().optional(),
        optInEmail: z.boolean().optional(),
        optInSms: z.boolean().optional(),
        optInPhysicalMail: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateConstituent(id, data);
      }),
  }),
  volunteer: router({
    profile: protectedProcedure.input(z.object({ constituentId: z.number() })).query(({ input }) => getVolunteerProfile(input.constituentId)),
    totalHours: protectedProcedure.input(z.object({ constituentId: z.number() })).query(({ input }) => getTotalHoursWorked(input.constituentId)),
    shifts: protectedProcedure.input(z.object({ constituentId: z.number() })).query(({ input }) => getVolunteerShifts(input.constituentId)),
    upsertProfile: protectedProcedure
      .input(z.object({
        constituentId: z.number(),
        skills: z.array(z.string()).optional(),
        emergencyContactName: z.string().optional(),
        emergencyContactPhone: z.string().optional(),
        backgroundCheckStatus: z.enum(["Not Started", "Pending", "Passed", "Failed", "Expired"]).optional(),
        backgroundCheckExpiration: z.string().optional(),
        preferredLocations: z.array(z.string()).optional(),
      }))
      .mutation(({ input }) => {
        const { constituentId, ...data } = input;
        return upsertVolunteerProfile(constituentId, data);
      }),
    addShift: protectedProcedure
      .input(z.object({ constituentId: z.number(), shiftDate: z.string(), hoursWorked: z.string(), location: z.string().optional(), description: z.string().optional(), status: z.enum(["Scheduled", "Completed", "Cancelled"]).optional() }))
      .mutation(({ input }) => addVolunteerShift(input)),
  }),
  board: router({
    profile: protectedProcedure.input(z.object({ constituentId: z.number() })).query(({ input }) => getBoardProfile(input.constituentId)),
    upsertProfile: protectedProcedure
      .input(z.object({
        constituentId: z.number(),
        boardRole: z.enum(["President", "Vice President", "Treasurer", "Secretary", "Member-at-Large", "Chair", "Vice Chair"]).optional(),
        committees: z.array(z.string()).optional(),
        termStartDate: z.string().optional(),
        termEndDate: z.string().optional(),
        termNumber: z.number().optional(),
        personalGivingTarget: z.string().optional(),
      }))
      .mutation(({ input }) => {
        const { constituentId, ...data } = input;
        return upsertBoardProfile(constituentId, data);
      }),
  }),
  membership: router({
    profile: protectedProcedure.input(z.object({ constituentId: z.number() })).query(({ input }) => getMembershipProfile(input.constituentId)),
    upsertProfile: protectedProcedure
      .input(z.object({
        constituentId: z.number(),
        memberTier: z.enum(["Student", "Individual", "Family", "Corporate", "VIP"]).optional(),
        joinDate: z.string().optional(),
        lastRenewalDate: z.string().optional(),
        membershipExpirationDate: z.string().optional(),
        annualDuesAmount: z.string().optional(),
      }))
      .mutation(({ input }) => {
        const { constituentId, ...data } = input;
        return upsertMembershipProfile(constituentId, data);
      }),
  }),
  users: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized: Admin access required");
      return getAllUsers();
    }),
    updateRole: protectedProcedure
      .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized: Admin access required");
        if (input.userId === ctx.user.id && input.role === "user") throw new Error("Cannot demote yourself from admin");
        return updateUserRole(input.userId, input.role);
      }),
    delete: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized: Admin access required");
        if (input.userId === ctx.user.id) throw new Error("Cannot delete yourself");
        return deleteUser(input.userId);
      }),
  }),
  invites: router({
    create: protectedProcedure
      .input(z.object({ email: z.string().email(), role: z.enum(["user", "admin"]).default("user") }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        const { createInvite } = await import("./db");
        const token = await createInvite(input.email, input.role);
        return { token, email: input.email, inviteUrl: `${process.env.VITE_OAUTH_PORTAL_URL || "http://localhost:3000"}/invite/${token}` };
      }),
    pending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized");
      const { getPendingInvites } = await import("./db");
      return getPendingInvites();
    }),
    delete: protectedProcedure
      .input(z.object({ inviteId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        const { deleteInvite } = await import("./db");
        return deleteInvite(input.inviteId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
