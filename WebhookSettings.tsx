import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Webhook, Copy, CheckCircle2, AlertCircle, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copy} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
      {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

const FIELD_MAP = [
  { wixField: "Form field: First Name", jsonKey: "firstName", notes: "Required. Constituent first name." },
  { wixField: "Form field: Last Name", jsonKey: "lastName", notes: "Required. Constituent last name." },
  { wixField: "Form field: Email", jsonKey: "email", notes: "Used for deduplication. Must be a valid email." },
  { wixField: "Form field: Phone", jsonKey: "phone", notes: "Any format accepted." },
  { wixField: "Form field: Street Address", jsonKey: "street1", notes: "Mailing address line 1." },
  { wixField: "Form field: Address Line 2", jsonKey: "street2", notes: "Apartment, suite, etc." },
  { wixField: "Form field: City", jsonKey: "city", notes: "" },
  { wixField: "Form field: State", jsonKey: "state", notes: "" },
  { wixField: "Form field: ZIP / Postal Code", jsonKey: "zip", notes: "" },
  { wixField: "Form field: Country", jsonKey: "country", notes: "" },
  { wixField: "Form field: Employer / Organization", jsonKey: "employerName", notes: "" },
  { wixField: "Form field: Job Title", jsonKey: "jobTitle", notes: "" },
  { wixField: "Form field: I am a… (checkbox)", jsonKey: "contactTypes", notes: "Comma-separated. Values: Volunteer, Board, Member, Donor" },
  { wixField: "Form field: Skills", jsonKey: "skills", notes: "Volunteer only. Comma-separated." },
  { wixField: "Form field: Emergency Contact Name", jsonKey: "emergencyContactName", notes: "Volunteer only." },
  { wixField: "Form field: Emergency Contact Phone", jsonKey: "emergencyContactPhone", notes: "Volunteer only." },
  { wixField: "Form field: Membership Type", jsonKey: "memberTier", notes: "Member only. Values: Student, Individual, Family, Corporate, VIP" },
  { wixField: "Form field: Board Role", jsonKey: "boardRole", notes: "Board only. Values: President, Vice President, Treasurer, Secretary, Member-at-Large" },
  { wixField: "Wix Submission ID (system field)", jsonKey: "submissionId", notes: "Auto-populated by Wix. Used for deduplication." },
  { wixField: "Form field: Email Opt-In", jsonKey: "optInEmail", notes: "true or false. Defaults to true." },
  { wixField: "Form field: SMS Opt-In", jsonKey: "optInSms", notes: "true or false. Defaults to false." },
];

const STATUS_COLORS: Record<string, string> = {
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  duplicate: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  error: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

export default function WebhookSettings() {
  const webhookUrl = `${window.location.origin}/api/webhook/wix`;
  const { data: logs, isLoading } = trpc.webhooks.logs.useQuery({ limit: 25 });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wix Integration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your Wix forms to this CRM using Wix Automations and the webhook URL below.
          </p>
        </div>

        {/* Webhook URL */}
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Webhook className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-semibold text-foreground">Your Webhook URL</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste this URL into Wix Automations → Send HTTP Request → URL field. Use method <strong>POST</strong>.
          </p>
          <div className="flex items-center gap-3 bg-background/60 border border-border/50 rounded-lg px-4 py-3">
            <code className="flex-1 text-sm font-mono text-teal-300 break-all">{webhookUrl}</code>
            <CopyButton text={webhookUrl} />
          </div>
        </div>

        {/* Setup Steps */}
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Setup Instructions</h2>
          <ol className="space-y-3">
            {[
              { n: "1", t: "In your Wix Dashboard, go to Automations → New Automation." },
              { n: "2", t: 'Set the Trigger to "Form submitted" and select your form.' },
              { n: "3", t: 'Add an Action: "Send HTTP Request". Set Method to POST.' },
              { n: "4", t: "Paste the webhook URL above into the URL field." },
              { n: "5", t: 'Set Body Format to "JSON". Add the field mappings from the table below.' },
              { n: "6", t: 'Optionally add the header: x-wix-webhook-secret with your secret value (set WIX_WEBHOOK_SECRET env variable to match).' },
              { n: "7", t: "Submit a test form. The new constituent will appear in the Constituents list within seconds." },
            ].map(({ n, t }) => (
              <li key={n} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">{n}</span>
                <p className="text-sm text-muted-foreground">{t}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Field Mapping Table */}
        <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="text-sm font-semibold text-foreground">JSON Field Mapping</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              In Wix Automations, build the JSON body using these key names. Map each Wix form field to its corresponding key.
            </p>
          </div>
          <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-4 px-5 py-2.5 bg-background/40 border-b border-border/50">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Wix Form Field</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">JSON Key</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Notes</span>
          </div>
          <div className="divide-y divide-border/30">
            {FIELD_MAP.map(row => (
              <div key={row.jsonKey} className="grid grid-cols-[1fr_1fr_1.5fr] gap-4 px-5 py-3">
                <p className="text-xs text-muted-foreground">{row.wixField}</p>
                <code className="text-xs font-mono text-teal-300">{row.jsonKey}</code>
                <p className="text-xs text-muted-foreground">{row.notes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Example Payload */}
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Example JSON Payload</h2>
            <CopyButton text={`{
  "submissionId": "wix-sub-abc123",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1 555 000 0001",
  "city": "Austin",
  "state": "TX",
  "contactTypes": "Volunteer,Member",
  "skills": "Event Planning,Fundraising",
  "memberTier": "Individual",
  "optInEmail": "true",
  "optInSms": "false"
}`} />
          </div>
          <pre className="text-xs font-mono text-teal-300 bg-background/60 border border-border/50 rounded-lg p-4 overflow-x-auto">{`{
  "submissionId": "wix-sub-abc123",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1 555 000 0001",
  "city": "Austin",
  "state": "TX",
  "contactTypes": "Volunteer,Member",
  "skills": "Event Planning,Fundraising",
  "memberTier": "Individual",
  "optInEmail": "true",
  "optInSms": "false"
}`}</pre>
        </div>

        {/* Webhook Logs */}
        <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="text-sm font-semibold text-foreground">Recent Webhook Logs</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Last 25 incoming Wix webhook events.</p>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">Loading logs…</div>
          ) : !logs?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm font-medium text-foreground">No webhook events yet</p>
              <p className="text-xs text-muted-foreground mt-1">Events will appear here once Wix starts sending submissions.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {logs.map(log => (
                <div key={log.id} className="flex items-start gap-4 px-5 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border flex-shrink-0 mt-0.5 ${STATUS_COLORS[log.status] || "bg-slate-700/60 text-slate-300 border-slate-600"}`}>
                    {log.status}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground">
                      {log.status === "success" && `New constituent created (ID: ${log.constituentId})`}
                      {log.status === "duplicate" && `Duplicate — updated existing constituent (ID: ${log.constituentId})`}
                      {log.status === "error" && `Error: ${log.errorMessage ?? "Unknown error"}`}
                    </p>
                    {log.submissionId && <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">Submission: {log.submissionId}</p>}
                  </div>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {new Date(log.receivedAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
