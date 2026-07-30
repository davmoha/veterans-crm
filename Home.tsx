import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Users, Heart, Shield, Star, Webhook, BookOpen, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 flex items-center gap-4">
      <div className={`rounded-lg p-2.5 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading } = trpc.constituents.stats.useQuery();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Nonprofit CRM — constituent records, Wix integration, and field reference guide.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Constituents" value={isLoading ? "—" : (stats?.total ?? 0)} color="bg-teal-500/15 text-teal-400" />
          <StatCard icon={Heart} label="Volunteers" value={isLoading ? "—" : (stats?.volunteers ?? 0)} color="bg-emerald-500/15 text-emerald-400" />
          <StatCard icon={Shield} label="Board Members" value={isLoading ? "—" : (stats?.board ?? 0)} color="bg-violet-500/15 text-violet-400" />
          <StatCard icon={Star} label="Members" value={isLoading ? "—" : (stats?.members ?? 0)} color="bg-amber-500/15 text-amber-400" />
        </div>

        {/* Wix integration callout */}
        {stats && stats.wixImports > 0 && (
          <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 flex items-center gap-3">
            <Webhook className="w-5 h-5 text-teal-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                <span className="text-teal-400 font-bold">{stats.wixImports}</span> constituent{stats.wixImports !== 1 ? "s" : ""} imported via Wix
              </p>
              <p className="text-xs text-muted-foreground">Wix form submissions are flowing in automatically.</p>
            </div>
            <button onClick={() => setLocation("/webhook-settings")} className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1">
              View logs <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setLocation("/constituents")}
              className="rounded-xl border border-border/50 bg-card p-5 text-left hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <Users className="w-6 h-6 text-primary mb-3" />
              <p className="text-sm font-semibold text-foreground">Manage Constituents</p>
              <p className="text-xs text-muted-foreground mt-1">View, add, and edit volunteer, board, and member records.</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </button>
            <button
              onClick={() => setLocation("/webhook-settings")}
              className="rounded-xl border border-border/50 bg-card p-5 text-left hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <Webhook className="w-6 h-6 text-primary mb-3" />
              <p className="text-sm font-semibold text-foreground">Wix Integration</p>
              <p className="text-xs text-muted-foreground mt-1">Configure the webhook URL, view logs, and map Wix form fields.</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </button>
            <button
              onClick={() => setLocation("/field-reference")}
              className="rounded-xl border border-border/50 bg-card p-5 text-left hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <BookOpen className="w-6 h-6 text-primary mb-3" />
              <p className="text-sm font-semibold text-foreground">Field Reference</p>
              <p className="text-xs text-muted-foreground mt-1">Browse all 35 fields across 4 modules with full configuration specs.</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>

        {/* Getting started */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Getting Started with Wix Integration</h2>
          <ol className="space-y-3">
            {[
              { step: "1", text: "Go to Wix Dashboard → Automations → New Automation." },
              { step: "2", text: 'Set the trigger to "Form submitted" on your chosen form.' },
              { step: "3", text: 'Add an action: "Send HTTP Request" → Method: POST.' },
              { step: "4", text: "Paste your webhook URL from the Wix Integration page into the URL field." },
              { step: "5", text: "Map your form fields to the expected JSON keys shown in the Field Mapping guide." },
              { step: "6", text: "Submit a test form — the constituent will appear in the Constituents list immediately." },
            ].map(({ step, text }) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">{step}</span>
                <p className="text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
}
