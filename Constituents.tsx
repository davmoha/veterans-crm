import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Search, Plus, Users, X, Mail, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const TYPE_COLORS: Record<string, string> = {
  Volunteer: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Board: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Member: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Donor: "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${TYPE_COLORS[type] || "bg-slate-700/60 text-slate-300 border-slate-600"}`}>
      {type}
    </span>
  );
}

function AddConstituentDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState({
    firstName: "", lastName: "", primaryEmail: "", primaryPhone: "",
    contactTypes: [] as string[], contactNotes: "",
    employerName: "", jobTitle: "",
    optInEmail: true, optInSms: false, optInPhysicalMail: true,
  });

  const createMutation = trpc.constituents.create.useMutation({
    onSuccess: () => {
      utils.constituents.list.invalidate();
      utils.constituents.stats.invalidate();
      toast.success("Constituent created successfully.");
      onClose();
      setForm({ firstName: "", lastName: "", primaryEmail: "", primaryPhone: "", contactTypes: [], contactNotes: "", employerName: "", jobTitle: "", optInEmail: true, optInSms: false, optInPhysicalMail: true });
    },
    onError: (e) => toast.error("Failed to create constituent: " + e.message),
  });

  const toggleType = (t: string) => {
    setForm(f => ({
      ...f,
      contactTypes: f.contactTypes.includes(t) ? f.contactTypes.filter(x => x !== t) : [...f.contactTypes, t],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Constituent</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">First Name *</label>
              <Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="mt-1" placeholder="Jane" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Last Name *</label>
              <Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="mt-1" placeholder="Smith" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input value={form.primaryEmail} onChange={e => setForm(f => ({ ...f, primaryEmail: e.target.value }))} className="mt-1" placeholder="jane@example.com" type="email" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Phone</label>
              <Input value={form.primaryPhone} onChange={e => setForm(f => ({ ...f, primaryPhone: e.target.value }))} className="mt-1" placeholder="+1 555 000 0000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Employer</label>
              <Input value={form.employerName} onChange={e => setForm(f => ({ ...f, employerName: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Job Title</label>
              <Input value={form.jobTitle} onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Contact Types</label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["Volunteer", "Board", "Member", "Donor"].map(t => (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${form.contactTypes.includes(t) ? TYPE_COLORS[t] : "border-border/50 text-muted-foreground hover:border-primary/40"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => createMutation.mutate(form)}
            disabled={!form.firstName || !form.lastName || createMutation.isPending}
          >
            {createMutation.isPending ? "Creating…" : "Create Constituent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Constituents() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    state: "",
    zip: "",
    areaCode: "",
    contactType: "",
    optInEmail: null as boolean | null,
  });

  const { data: constituents, isLoading } = trpc.constituents.list.useQuery(
    { search: search || undefined },
    { refetchInterval: false }
  );

  // Extract area code from phone (first 3 digits)
  const extractAreaCode = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    return digits.substring(0, 3);
  };

  // State name to abbreviation mapping
  const stateMap: Record<string, string> = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
    'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
    'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
    'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
    'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
    'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
    'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
    'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
  };

  const normalizeState = (state: string): string => {
    const lower = state.toLowerCase().trim();
    return stateMap[lower] || state.toUpperCase();
  };

  // Apply filters
  const filtered = useMemo(() => {
    if (!constituents) return [];
    return constituents.filter(c => {
      if (filters.state) {
        const normalizedFilter = normalizeState(filters.state);
        const normalizedState = normalizeState(c.addressState || '');
        if (normalizedFilter !== normalizedState) return false;
      }
      if (filters.zip && !c.addressZip?.includes(filters.zip)) return false;
      if (filters.areaCode && c.primaryPhone) {
        const areaCode = extractAreaCode(c.primaryPhone);
        if (areaCode !== filters.areaCode) return false;
      } else if (filters.areaCode) {
        return false;
      }
      if (filters.contactType && !(c.contactTypes as string[])?.includes(filters.contactType)) return false;
      if (filters.optInEmail !== null && c.optInEmail !== filters.optInEmail) return false;
      return true;
    });
  }, [constituents, filters]);

  const toggleSelect = (id: number) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelected(newSet);
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(c => c.id)));
    }
  };

  const sendEmail = () => {
    const selectedContacts = filtered.filter(c => selected.has(c.id));
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact");
      return;
    }

    const emails = selectedContacts
      .filter(c => c.primaryEmail)
      .map(c => c.primaryEmail)
      .join(",");

    if (!emails) {
      toast.error("No email addresses found for selected contacts");
      return;
    }

    // Create mailto link and open in default email client
    const mailtoLink = `mailto:${emails}`;
    window.location.href = mailtoLink;
    toast.success(`Opening email with ${selectedContacts.length} recipient(s)`);
  };

  const hasFilters = filters.state || filters.zip || filters.areaCode || filters.contactType || filters.optInEmail !== null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Constituents</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isLoading ? "Loading…" : `${filtered.length} of ${constituents?.length ?? 0} records`}
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Constituent
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone…"
              className="pl-9"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            Advanced Filters {hasFilters && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Active</span>}
          </button>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-lg border border-border/50 bg-card/50">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase">State</label>
                <Input
                  value={filters.state}
                  onChange={e => setFilters(f => ({ ...f, state: e.target.value }))}
                  placeholder="e.g., FL or Florida"
                  className="mt-1 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase">ZIP Code</label>
                <Input
                  value={filters.zip}
                  onChange={e => setFilters(f => ({ ...f, zip: e.target.value }))}
                  placeholder="e.g., 78701"
                  className="mt-1 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase">Area Code</label>
                <Input
                  value={filters.areaCode}
                  onChange={e => setFilters(f => ({ ...f, areaCode: e.target.value }))}
                  placeholder="e.g., 813"
                  className="mt-1 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase">Contact Type</label>
                <select
                  value={filters.contactType}
                  onChange={e => setFilters(f => ({ ...f, contactType: e.target.value }))}
                  className="mt-1 w-full px-2 py-1.5 rounded-md border border-border bg-background text-sm text-foreground"
                >
                  <option value="">All</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Board">Board</option>
                  <option value="Member">Member</option>
                  <option value="Donor">Donor</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase">Email Opt-In</label>
                <select
                  value={filters.optInEmail === null ? "" : filters.optInEmail ? "yes" : "no"}
                  onChange={e => setFilters(f => ({ ...f, optInEmail: e.target.value === "" ? null : e.target.value === "yes" }))}
                  className="mt-1 w-full px-2 py-1.5 rounded-md border border-border bg-background text-sm text-foreground"
                >
                  <option value="">All</option>
                  <option value="yes">Opted In</option>
                  <option value="no">Opted Out</option>
                </select>
              </div>
              {hasFilters && (
                <button
                  onClick={() => setFilters({ state: "", zip: "", areaCode: "", contactType: "", optInEmail: null })}
                  className="col-span-2 md:col-span-5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Selection & Mass Email Toolbar */}
        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selected.size === filtered.length && filtered.length > 0}
                onCheckedChange={() => toggleSelectAll()}
              />
              <span className="text-sm font-medium text-foreground">
                {selected.size} selected {selected.size === filtered.length && filtered.length > 0 ? "(all)" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelected(new Set())}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={sendEmail}
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
          <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2.5 bg-background/40 border-b border-border/50">
            <div className="flex items-center">
              <Checkbox
                checked={filtered.length > 0 && selected.size === filtered.length}
                onCheckedChange={() => toggleSelectAll()}
              />
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Name</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Contact</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Types</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Source</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Loading constituents…</div>
          ) : !filtered.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-foreground">No constituents found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {search || hasFilters ? "Try adjusting your search or filters." : "Add one manually to get started."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filtered.map(c => (
                <div
                  key={c.id}
                  className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-3 items-center hover:bg-accent/30 transition-colors"
                >
                  <Checkbox
                    checked={selected.has(c.id)}
                    onCheckedChange={() => toggleSelect(c.id)}
                  />
                  <button
                    onClick={() => setLocation(`/constituents/${c.id}`)}
                    className="text-left hover:text-primary transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground">{c.firstName} {c.lastName}</p>
                    {c.jobTitle && <p className="text-xs text-muted-foreground mt-0.5">{c.jobTitle}</p>}
                  </button>
                  <div>
                    {c.primaryEmail && <p className="text-xs text-muted-foreground">{c.primaryEmail}</p>}
                    {c.primaryPhone && <p className="text-xs text-muted-foreground">{c.primaryPhone}</p>}
                    {c.addressCity && <p className="text-xs text-muted-foreground">{c.addressCity}, {c.addressState} {c.addressZip}</p>}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {((c.contactTypes as string[]) || []).map(t => <TypeBadge key={t} type={t} />)}
                  </div>
                  <div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded border bg-slate-700/40 text-slate-400 border-slate-600/40">
                      {c.source === "wix_webhook" ? "Import" : "Manual"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddConstituentDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </DashboardLayout>
  );
}
