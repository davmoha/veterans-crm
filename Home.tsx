import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Users, Heart, Shield, Star, BookOpen, TrendingUp, Clock, ArrowRight } from "lucide-react";
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
            Nonprofit CRM — constituent records and field reference guide.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Constituents" value={isLoading ? "—" : (stats?.total ?? 0)} color="bg-teal-500/15 text-teal-400" />
          <StatCard icon={Heart} label="Volunteers" value={isLoading ? "—" : (stats?.volunteers ?? 0)} color="bg-emerald-500/15 text-emerald-400" />
          <StatCard icon={Shield} label="Board Members" value={isLoading ? "—" : (stats?.board ?? 0)} color="bg-violet-500/15 text-violet-400" />
          <StatCard icon={Star} label="Members" value={isLoading ? "—" : (stats?.members ?? 0)} color="bg-amber-500/15 text-amber-400" />
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      </div>
    </DashboardLayout>
  );
}
