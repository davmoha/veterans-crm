// CRM Data Dictionary — Nonprofit CRM Field Reference Guide
// Design: Dark Intelligence — teal accent, charcoal surfaces, DM Sans + IBM Plex Mono

export type DataType =
  | "Text"
  | "Email"
  | "Phone"
  | "Date"
  | "Date/Time (System)"
  | "Currency"
  | "Formula (Text)"
  | "Formula (Currency)"
  | "Roll-up Summary"
  | "Picklist"
  | "Multi-select Picklist"
  | "Multi-select Picklist (or Matrix)"
  | "Checkbox"
  | "Address (Compound Field)"
  | "Lookup Relationship"
  | "Auto-Number"
  | "Rich Text"
  | "Number"
  | "Related List (or Lookup)";

export interface Field {
  id: string;
  name: string;
  dataType: DataType;
  functionality: string;
  validation: string;
  required?: boolean;
  readOnly?: boolean;
  automationTrigger?: string;
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  fields: Field[];
}

export const DATA_TYPE_COLORS: Record<string, string> = {
  Text: "bg-slate-700/60 text-slate-300 border-slate-600",
  Email: "bg-blue-900/60 text-blue-300 border-blue-700",
  Phone: "bg-cyan-900/60 text-cyan-300 border-cyan-700",
  Date: "bg-indigo-900/60 text-indigo-300 border-indigo-700",
  "Date/Time (System)": "bg-indigo-900/60 text-indigo-300 border-indigo-700",
  Currency: "bg-green-900/60 text-green-300 border-green-700",
  "Formula (Text)": "bg-amber-900/60 text-amber-300 border-amber-700",
  "Formula (Currency)": "bg-amber-900/60 text-amber-300 border-amber-700",
  "Roll-up Summary": "bg-teal-900/60 text-teal-300 border-teal-700",
  Picklist: "bg-violet-900/60 text-violet-300 border-violet-700",
  "Multi-select Picklist": "bg-purple-900/60 text-purple-300 border-purple-700",
  "Multi-select Picklist (or Matrix)":
    "bg-purple-900/60 text-purple-300 border-purple-700",
  Checkbox: "bg-rose-900/60 text-rose-300 border-rose-700",
  "Address (Compound Field)": "bg-orange-900/60 text-orange-300 border-orange-700",
  "Lookup Relationship": "bg-sky-900/60 text-sky-300 border-sky-700",
  "Auto-Number": "bg-lime-900/60 text-lime-300 border-lime-700",
  "Rich Text": "bg-pink-900/60 text-pink-300 border-pink-700",
  Number: "bg-yellow-900/60 text-yellow-300 border-yellow-700",
  "Related List (or Lookup)": "bg-sky-900/60 text-sky-300 border-sky-700",
};

export const modules: Module[] = [
  {
    id: "core-profile",
    title: "Core Constituent Profile",
    subtitle: "Applies to all individuals",
    description:
      "The foundational data structure for every individual interacting with the organization, ensuring unified contact management across all constituent types.",
    icon: "Users",
    color: "teal",
    fields: [
      {
        id: "first-name",
        name: "First Name",
        dataType: "Text",
        functionality:
          "Captures the constituent's given name. Used in salutations, email templates, and record display names.",
        validation:
          "Required field. Maximum 50 characters. Must not contain numbers or special characters.",
        required: true,
      },
      {
        id: "last-name",
        name: "Last Name",
        dataType: "Text",
        functionality:
          "Captures the constituent's family name/surname. Combined with First Name for full-name display and sorting.",
        validation:
          "Required field. Maximum 80 characters. Used in standard duplicate-matching rules alongside Primary Email.",
        required: true,
      },
      {
        id: "primary-email",
        name: "Primary Email",
        dataType: "Email",
        functionality:
          "Main email address for all communications. Serves as the unique identifier for deduplication and login if a constituent portal is enabled.",
        validation:
          "Must follow standard email format (name@domain.com). Checked against existing records to prevent duplicates. Triggers duplicate alert if match found.",
      },
      {
        id: "primary-phone",
        name: "Primary Phone",
        dataType: "Phone",
        functionality:
          "Main contact number. Used in SMS workflows and staff outreach. Formatted for click-to-call integrations.",
        validation:
          "Must be formatted as a valid phone number based on localization (e.g., (XXX) XXX-XXXX for US). Strips non-numeric characters on save.",
      },
      {
        id: "mailing-address",
        name: "Mailing Address",
        dataType: "Address (Compound Field)",
        functionality:
          "Stores physical address components: Street Line 1, Street Line 2, City, State/Province, Zip/Postal Code, Country. Used for direct mail campaigns and event invitations.",
        validation:
          "Zip/Postal Code must match the selected Country format. Country defaults to organization's home country.",
      },
      {
        id: "account-household-id",
        name: "Account / Household ID",
        dataType: "Lookup Relationship",
        functionality:
          "Links the individual to a Household or Organization Account record. Enables aggregation of family-level giving totals, household communications, and corporate membership tracking.",
        validation:
          "Must link to an existing Account record. Cannot be a self-referential link. Lookup search restricted to Account object.",
      },
      {
        id: "employer-name",
        name: "Employer Name",
        dataType: "Text",
        functionality:
          "Name of the company where the constituent is employed. Used for corporate matching gift programs and employer-based segmentation.",
        validation:
          "Optional. Maximum 150 characters. Can be promoted to a Lookup relationship to an Organization Account if B2B tracking is required.",
      },
      {
        id: "job-title",
        name: "Job Title",
        dataType: "Text",
        functionality:
          "Professional title at the listed employer. Used in board bios, event programs, and donor acknowledgment letters.",
        validation: "Optional. Maximum 100 characters.",
      },
      {
        id: "contact-type",
        name: "Contact Type",
        dataType: "Multi-select Picklist",
        functionality:
          "Categorizes the constituent's active relationship(s) with the nonprofit. Drives conditional field visibility — selecting 'Volunteer' reveals the Volunteer Management section; 'Board' reveals the Board Governance section; 'Member' reveals the Membership section.",
        validation:
          "Values: Volunteer, Board, Member, Donor. A constituent can hold multiple types simultaneously. At least one value required.",
        required: true,
      },
      {
        id: "contact-notes",
        name: "Contact Notes",
        dataType: "Rich Text",
        functionality:
          "Free-form area for staff to log qualitative interactions, context, or special instructions. Supports inline formatting for readability.",
        validation:
          "No strict character limit. Supports bold, italic, hyperlinks, and bulleted lists. Not searchable via standard field search — use a separate Activity/Log object for structured interaction history.",
      },
      {
        id: "creation-date",
        name: "Creation Date",
        dataType: "Date/Time (System)",
        functionality:
          "Automatically stamps the exact date and time the record was created in the CRM. Used for cohort analysis, onboarding workflows, and audit trails.",
        validation:
          "Read-only system field. Cannot be manually edited or overridden. Stored in UTC; displayed in user's local timezone.",
        readOnly: true,
      },
      {
        id: "opt-in-email",
        name: "Opt-In Email",
        dataType: "Checkbox",
        functionality:
          "Indicates the constituent's consent to receive mass email communications (newsletters, appeals, event invitations). Checked status is required for inclusion in email marketing lists and automated email workflows.",
        validation:
          "Default: Unchecked (opt-in model; adjust to checked for opt-out regions). Must be True before any bulk email automation can execute for this record.",
        automationTrigger:
          "Triggers inclusion in or exclusion from email marketing segments on save.",
      },
      {
        id: "opt-in-sms",
        name: "Opt-In SMS",
        dataType: "Checkbox",
        functionality:
          "Indicates consent to receive text message communications. Required for TCPA compliance in the US. Gating condition for all automated SMS workflows.",
        validation:
          "Default: Unchecked. Required to be True before any SMS automation workflow can execute. Unchecking immediately suppresses the record from all active SMS queues.",
        automationTrigger:
          "Suppresses or activates record in SMS automation queues on change.",
      },
      {
        id: "opt-in-physical-mail",
        name: "Opt-In Physical Mail",
        dataType: "Checkbox",
        functionality:
          "Indicates consent to receive direct mail pieces (annual reports, solicitation letters, event invitations). Used to filter mailing lists for print runs.",
        validation:
          "Default: Checked (opt-out model standard for direct mail). Unchecking suppresses the record from direct mail list exports.",
      },
    ],
  },
  {
    id: "volunteer-management",
    title: "Volunteer Management",
    subtitle: "Module 2",
    description:
      "Tracks volunteer skills, availability, compliance status, and cumulative impact. Links directly to the Core Constituent Profile via the Contact Type field.",
    icon: "Heart",
    color: "emerald",
    fields: [
      {
        id: "skills-interests",
        name: "Skills & Interests",
        dataType: "Multi-select Picklist",
        functionality:
          "Captures the specific areas where the volunteer can contribute. Used to match volunteers to appropriate opportunities via filtered list views and automated assignment workflows.",
        validation:
          "Values: Event Support, Tutoring/Mentoring, Graphic Design, Data Entry, Translation, Medical/Clinical, Legal Aid, Construction/Facilities, Administrative, Fundraising. Extensible picklist — new values require admin approval.",
      },
      {
        id: "availability",
        name: "Availability",
        dataType: "Multi-select Picklist (or Matrix)",
        functionality:
          "Indicates the volunteer's preferred time windows for scheduling. Used in shift scheduling tools to filter eligible volunteers by time slot.",
        validation:
          "Values: Weekday Mornings (8am–12pm), Weekday Afternoons (12pm–5pm), Weekday Evenings (5pm–9pm), Saturday, Sunday. At least one value required for active volunteers.",
        required: true,
      },
      {
        id: "emergency-contact-name",
        name: "Emergency Contact Name",
        dataType: "Text",
        functionality:
          "Full name of the person to be contacted in the event of a medical or safety emergency during a volunteer shift. Required for on-site volunteer roles.",
        validation:
          "Required if Contact Type includes 'Volunteer'. Maximum 100 characters. Triggers a record completeness warning if blank on a Volunteer record.",
        required: true,
      },
      {
        id: "emergency-contact-phone",
        name: "Emergency Contact Phone",
        dataType: "Phone",
        functionality:
          "Direct phone number for the emergency contact. Must be a different number from the volunteer's own Primary Phone.",
        validation:
          "Required if Emergency Contact Name is populated. Must follow valid phone formatting. System validation prevents entry of the same value as Primary Phone.",
        required: true,
      },
      {
        id: "background-check-status",
        name: "Background Check Status",
        dataType: "Picklist",
        functionality:
          "Tracks the current clearance state of the volunteer for roles requiring background screening (e.g., working with minors, handling finances). Drives conditional access to sensitive volunteer opportunity types.",
        validation:
          "Values: Pending (default), Passed, Failed. Changing to 'Passed' requires Background Check Expiration Date to be populated. 'Failed' status locks the volunteer from assignment to restricted roles.",
      },
      {
        id: "background-check-expiration",
        name: "Background Check Expiration Date",
        dataType: "Date",
        functionality:
          "The date the current background check clearance expires. After this date, the Background Check Status automatically reverts to 'Pending' via a scheduled workflow.",
        validation:
          "Required if Background Check Status = 'Passed'. Must be a future date. Cannot be more than 3 years from today (standard background check validity window).",
        automationTrigger:
          "Triggers automated email alert to volunteer and volunteer coordinator 30 days prior to expiration. Status auto-reverts to Pending on expiration date.",
      },
      {
        id: "total-hours-worked",
        name: "Total Hours Worked",
        dataType: "Roll-up Summary",
        functionality:
          "Calculates the cumulative total of all volunteer hours logged across the constituent's entire history with the organization. Aggregates the 'Hours Completed' (Number) field on all child 'Volunteer Shift' records where Shift Status = 'Completed'. Used for recognition milestones, annual impact reports, and volunteer appreciation tiers.",
        validation:
          "Read-only. Automatically recalculated whenever a linked Volunteer Shift record is created, updated, or deleted. Filter condition: Shift Status = 'Completed' only. Displays with 1 decimal place (e.g., 47.5 hours).",
        readOnly: true,
      },
      {
        id: "preferred-volunteer-locations",
        name: "Preferred Volunteer Locations",
        dataType: "Multi-select Picklist",
        functionality:
          "Indicates the physical sites or geographic areas where the volunteer prefers to serve. Used to filter volunteer pools when scheduling location-specific events or programs.",
        validation:
          "Values map to organizational facilities or regions (e.g., Downtown Center, Northside Clinic, Eastside School, Remote/Virtual). Picklist values must be maintained in sync with the Locations master list.",
      },
    ],
  },
  {
    id: "board-governance",
    title: "Board of Directors Governance",
    subtitle: "Module 3",
    description:
      "Manages board leadership roles, committee assignments, term tracking, and fiduciary responsibilities including Give-or-Get financial stewardship.",
    icon: "Shield",
    color: "violet",
    fields: [
      {
        id: "board-role-title",
        name: "Board Role / Title",
        dataType: "Picklist",
        functionality:
          "Designates the specific leadership position held on the board. Drives role-based permissions in board portals and determines signature authority in document workflows.",
        validation:
          "Values: President, Vice President, Treasurer, Secretary, Member-at-Large. Uniqueness rule: Only one active record may hold 'President' at any time — system validation blocks a second 'President' assignment.",
        required: true,
      },
      {
        id: "committee-assignment",
        name: "Committee Assignment",
        dataType: "Multi-select Picklist",
        functionality:
          "Tracks sub-committee memberships for the board member. Used to generate committee rosters, route meeting minutes, and filter board members for committee-specific communications.",
        validation:
          "Values: Finance, Governance, Fundraising, Marketing & Communications, Executive, Program & Impact, Audit. A board member may serve on multiple committees simultaneously.",
      },
      {
        id: "term-start-date",
        name: "Current Term Start Date",
        dataType: "Date",
        functionality:
          "The official start date of the board member's current term as recorded in board minutes. Used to calculate term length and trigger onboarding workflows.",
        validation:
          "Required if Contact Type includes 'Board'. Must be on or before today's date. Cannot be after Current Term End Date.",
        required: true,
      },
      {
        id: "term-end-date",
        name: "Current Term End Date",
        dataType: "Date",
        functionality:
          "The scheduled end date of the current board term. Used to generate term expiration reports and trigger board renewal workflows.",
        validation:
          "Must be strictly greater than Current Term Start Date. Triggers a governance review workflow and email notification to the Board Chair 90 days before expiration.",
        automationTrigger:
          "Triggers board renewal workflow and Chair notification 90 days prior to expiration.",
      },
      {
        id: "term-number",
        name: "Term Number",
        dataType: "Number",
        functionality:
          "Tracks which consecutive term the board member is currently serving. Enables programmatic enforcement of organizational term limits (e.g., maximum 3 consecutive terms). Incremented manually or via workflow upon each new term start.",
        validation:
          "Integer only (no decimals). Minimum value: 1. Maximum value configurable per bylaws (e.g., 3). System warning fires if Term Number would exceed the configured maximum.",
        required: true,
      },
      {
        id: "personal-giving-target",
        name: "Personal Giving Target",
        dataType: "Currency",
        functionality:
          "The annual financial 'Give-or-Get' goal agreed upon by the board member and the organization for the current fiscal year. Represents the minimum combined personal giving and fundraising solicitation target.",
        validation:
          "Supports two decimal places. Required for all active Board Members. Must be greater than $0. Reset to null at the start of each new fiscal year and re-entered during the annual board planning cycle.",
        required: true,
      },
      {
        id: "give-or-get-progress",
        name: "Give-or-Get Progress",
        dataType: "Formula (Currency)",
        functionality:
          "Dynamically tracks the board member's cumulative progress toward their Personal Giving Target for the current fiscal year. Formula aggregates two data streams: (1) direct personal donations — Roll-up SUM of 'Amount' on all Opportunity records linked to this Contact where Stage = 'Closed Won' AND Close Date falls within the current fiscal year; (2) soft credits and solicited gifts — Roll-up SUM of 'Amount' on all Soft Credit records linked to this Contact for the current fiscal year. Final formula: [Personal Donations Roll-up] + [Soft Credits Roll-up]. A companion percentage field can be derived as: Give-or-Get Progress / Personal Giving Target × 100.",
        validation:
          "Read-only formula field. Recalculates automatically when linked Opportunity or Soft Credit records change. Displays as currency with two decimal places. Returns $0.00 if no linked records exist.",
        readOnly: true,
      },
    ],
  },
  {
    id: "membership-management",
    title: "Membership Management",
    subtitle: "Module 4",
    description:
      "Handles the complete lifecycle of formal memberships — from initial join through renewals, tier management, dues tracking, and automated status calculation.",
    icon: "Star",
    color: "amber",
    fields: [
      {
        id: "member-tier",
        name: "Member Tier",
        dataType: "Picklist",
        functionality:
          "Defines the level of membership and the associated benefit package. Drives the default Annual Dues Amount via a workflow or formula lookup. Controls access to tier-specific events, communications, and member portal features.",
        validation:
          "Values: Student, Individual, Family, Corporate, VIP. Required field. Changing the tier triggers a workflow to update the Annual Dues Amount to the standard rate for the new tier (with manual override available).",
        required: true,
      },
      {
        id: "membership-status",
        name: "Membership Status",
        dataType: "Formula (Text)",
        functionality:
          "Dynamically calculates the constituent's current membership standing based on the Membership Expiration Date relative to today. Four-state logic: (1) Active — Expiration Date >= TODAY(); (2) Grace Period — Expiration Date >= TODAY() - 30 days (within 30-day grace window post-expiration); (3) Lapsed — Expiration Date < TODAY() - 30 days; (4) Pending — Expiration Date is blank (new record awaiting first payment). Formula: IF(ISBLANK(Membership_Expiration_Date__c), 'Pending', IF(Membership_Expiration_Date__c >= TODAY(), 'Active', IF(Membership_Expiration_Date__c >= TODAY() - 30, 'Grace Period', 'Lapsed')))",
        validation:
          "Read-only formula field. Recalculates daily via scheduled batch job and immediately upon any change to Membership Expiration Date. Used as a filter in all membership list views and reports.",
        readOnly: true,
      },
      {
        id: "join-date",
        name: "Join Date",
        dataType: "Date",
        functionality:
          "The original date the constituent first became a member of the organization. This is a static, historical field — it never updates upon renewal. Used to calculate membership tenure, anniversary recognition, and cohort analysis.",
        validation:
          "Required. Set once upon first membership record creation. Read-only after initial save (protected from overwrite). Must be on or before today's date.",
        required: true,
        readOnly: true,
      },
      {
        id: "last-renewal-date",
        name: "Last Renewal Date",
        dataType: "Date",
        functionality:
          "The date the most recent membership payment was successfully processed. Updated automatically via workflow each time a membership dues Opportunity is marked 'Closed Won'. Used to calculate the next Membership Expiration Date.",
        validation:
          "Automatically updated via workflow trigger — not manually editable by standard users. Must be on or before today's date. Workflow: On Opportunity Stage = 'Closed Won' AND Opportunity Type = 'Membership Dues', set Last Renewal Date = Opportunity Close Date.",
        automationTrigger:
          "Auto-updated by workflow when a membership dues Opportunity is marked Closed Won.",
      },
      {
        id: "membership-expiration-date",
        name: "Membership Expiration Date",
        dataType: "Date",
        functionality:
          "The date on which the current membership privileges expire. Calculated automatically via workflow as Last Renewal Date + 365 days (for annual memberships) or set to the organization's fixed fiscal year-end date. Drives the Membership Status formula and all renewal reminder automations.",
        validation:
          "Automatically calculated via workflow on update to Last Renewal Date. Manual override allowed for admin users only (e.g., prorated memberships, complimentary extensions). Triggers automated renewal reminder emails at 60, 30, and 5 days prior to expiration.",
        automationTrigger:
          "Triggers renewal reminder emails at 60, 30, and 5 days prior to expiration date.",
      },
      {
        id: "unique-member-id",
        name: "Unique Member ID",
        dataType: "Auto-Number",
        functionality:
          "A system-generated, sequential, unique identifier assigned to each membership record upon creation. Used on physical membership cards, member portals, and event check-in systems for fast lookup.",
        validation:
          "Read-only. Format: MEM-{000001} (six-digit zero-padded sequential number, e.g., MEM-000001, MEM-000002). Generated automatically upon record creation. Cannot be edited, deleted, or reassigned.",
        readOnly: true,
      },
      {
        id: "annual-dues-amount",
        name: "Annual Dues Amount",
        dataType: "Currency",
        functionality:
          "The financial contribution required for the constituent's selected Member Tier in the current membership period. Auto-populated via workflow based on the Member Tier standard rate table, but allows manual override for discounts, prorations, or scholarship rates.",
        validation:
          "Supports two decimal places. Must be greater than or equal to $0 (allows $0 for complimentary memberships). Auto-populated on Member Tier selection; manual override requires a justification note in Contact Notes.",
      },
      {
        id: "payment-history-link",
        name: "Payment History Link",
        dataType: "Related List (or Lookup)",
        functionality:
          "Connects the constituent's membership record to their full transactional history. Implemented as a Related List displaying all linked Opportunity or Transaction records where Type = 'Membership Dues'. Enables staff to view payment dates, amounts, methods, and statuses without leaving the constituent record.",
        validation:
          "One-to-many relationship: one Contact to many Transaction/Opportunity records. Related list is filtered to show only records where Opportunity Type = 'Membership Dues' or Transaction Category = 'Dues'. No direct editing from this field — users must navigate to the individual transaction record.",
      },
    ],
  },
];

export const totalFields = modules.reduce((acc, m) => acc + m.fields.length, 0);
