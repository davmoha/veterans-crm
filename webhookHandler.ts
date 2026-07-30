import type { Express, Request, Response } from "express";
import {
  getConstituentByEmail, getConstituentByWixId, createConstituent,
  updateConstituent, upsertVolunteerProfile, upsertMembershipProfile,
  upsertBoardProfile, logWebhook,
} from "./db";

/**
 * Wix Webhook Payload — the keys below match what you configure in
 * Wix Automations → Send HTTP Request → Customize Structure.
 *
 * Map each Wix form field to these exact key names when setting up
 * the automation in your Wix dashboard.
 */
interface WixPayload {
  // Core Constituent Profile
  submissionId?: string;       // Wix form submission ID (for deduplication)
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  employerName?: string;
  jobTitle?: string;
  contactTypes?: string;       // comma-separated: "Volunteer,Member"
  optInEmail?: string;         // "true" or "false"
  optInSms?: string;
  optInPhysicalMail?: string;

  // Volunteer fields
  skills?: string;             // comma-separated
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  preferredLocations?: string; // comma-separated

  // Membership fields
  memberTier?: string;         // "Student" | "Individual" | "Family" | "Corporate" | "VIP"
  annualDuesAmount?: string;

  // Board fields
  boardRole?: string;
  committees?: string;         // comma-separated
}

function parseBool(val?: string, defaultVal = true): boolean {
  if (val === undefined || val === null) return defaultVal;
  return val.toLowerCase() !== "false" && val !== "0";
}

function parseList(val?: string): string[] {
  if (!val) return [];
  return val.split(",").map(s => s.trim()).filter(Boolean);
}

export function registerWebhookRoutes(app: Express) {
  /**
   * POST /api/webhook/wix
   *
   * Receives form submissions from Wix Automations.
   * Validates the shared secret, deduplicates by email or submissionId,
   * then creates or updates the constituent record and any module sub-records.
   */
  app.post("/api/webhook/wix", async (req: Request, res: Response) => {
    // 1. Validate shared secret
    const secret = process.env.WIX_WEBHOOK_SECRET;
    if (secret) {
      const incoming = req.headers["x-wix-webhook-secret"] as string | undefined;
      if (incoming !== secret) {
        console.warn("[Webhook] Invalid secret from", req.ip);
        return res.status(401).json({ error: "Unauthorized" });
      }
    }

    const payload: WixPayload = req.body ?? {};
    const submissionId = payload.submissionId;

    try {
      // 2. Deduplication — check by submissionId first, then by email
      let existingConstituent = submissionId
        ? await getConstituentByWixId(submissionId)
        : undefined;

      if (!existingConstituent && payload.email) {
        existingConstituent = await getConstituentByEmail(payload.email);
      }

      if (existingConstituent) {
        // Duplicate — update the record and log
        await updateConstituent(existingConstituent.id, {
          firstName: payload.firstName || existingConstituent.firstName,
          lastName: payload.lastName || existingConstituent.lastName,
          primaryPhone: payload.phone || existingConstituent.primaryPhone || undefined,
          employerName: payload.employerName || existingConstituent.employerName || undefined,
          jobTitle: payload.jobTitle || existingConstituent.jobTitle || undefined,
        });
        await logWebhook({ source: "wix", submissionId, rawPayload: payload, status: "duplicate", constituentId: existingConstituent.id });
        return res.status(200).json({ status: "updated", constituentId: existingConstituent.id });
      }

      // 3. Create new constituent
      const contactTypes = parseList(payload.contactTypes);
      await createConstituent({
        firstName: payload.firstName ?? "Unknown",
        lastName: payload.lastName ?? "Unknown",
        primaryEmail: payload.email,
        primaryPhone: payload.phone,
        addressStreet1: payload.street1,
        addressStreet2: payload.street2,
        addressCity: payload.city,
        addressState: payload.state,
        addressZip: payload.zip,
        addressCountry: payload.country,
        employerName: payload.employerName,
        jobTitle: payload.jobTitle,
        contactTypes,
        optInEmail: parseBool(payload.optInEmail, true),
        optInSms: parseBool(payload.optInSms, false),
        optInPhysicalMail: parseBool(payload.optInPhysicalMail, true),
        source: "wix_webhook",
        wixSubmissionId: submissionId,
      });

      // Fetch the newly created record to get its ID
      let newConstituent = payload.email
        ? await getConstituentByEmail(payload.email)
        : undefined;

      if (!newConstituent && submissionId) {
        newConstituent = await getConstituentByWixId(submissionId);
      }

      if (!newConstituent) {
        throw new Error("Failed to retrieve newly created constituent");
      }

      const cid = newConstituent.id;

      // 4. Create module sub-records based on contactTypes
      if (contactTypes.includes("Volunteer")) {
        await upsertVolunteerProfile(cid, {
          skills: parseList(payload.skills),
          emergencyContactName: payload.emergencyContactName,
          emergencyContactPhone: payload.emergencyContactPhone,
          preferredLocations: parseList(payload.preferredLocations),
        });
      }

      if (contactTypes.includes("Member")) {
        const tierMap: Record<string, "Student" | "Individual" | "Family" | "Corporate" | "VIP"> = {
          student: "Student", individual: "Individual", family: "Family",
          corporate: "Corporate", vip: "VIP",
        };
        const tier = payload.memberTier
          ? (tierMap[payload.memberTier.toLowerCase()] ?? "Individual")
          : "Individual";
        await upsertMembershipProfile(cid, {
          memberTier: tier,
          annualDuesAmount: payload.annualDuesAmount,
        });
      }

      if (contactTypes.includes("Board")) {
        const roleMap: Record<string, "President" | "Vice President" | "Treasurer" | "Secretary" | "Member-at-Large" | "Chair" | "Vice Chair"> = {
          president: "President", "vice president": "Vice President", treasurer: "Treasurer",
          secretary: "Secretary", "member-at-large": "Member-at-Large", chair: "Chair", "vice chair": "Vice Chair",
        };
        const role = payload.boardRole
          ? (roleMap[payload.boardRole.toLowerCase()] ?? "Member-at-Large")
          : "Member-at-Large";
        await upsertBoardProfile(cid, {
          boardRole: role,
          committees: parseList(payload.committees),
          termNumber: 1,
        });
      }

      await logWebhook({ source: "wix", submissionId, rawPayload: payload, status: "success", constituentId: cid });
      return res.status(200).json({ status: "created", constituentId: cid });

    } catch (err: any) {
      console.error("[Webhook] Error processing Wix submission:", err);
      await logWebhook({ source: "wix", submissionId, rawPayload: payload, status: "error", errorMessage: err?.message });
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}
