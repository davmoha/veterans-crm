import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useCallback } from "react";
import { modules, totalFields, DATA_TYPE_COLORS, type Field, type Module } from "@/lib/crmData";
import {
  Users, Heart, Shield, Star, Search, ChevronDown, ChevronRight,
  Database, AlertCircle, CheckCircle2, Zap, BookOpen, X
} from "lucide-react";
import { Input } from "@/components/ui/input";

const MODULE_ICONS: Record<string, React.ElementType> = { Users, Heart, Shield, Star };

const MODULE_ACCENT: Record<string, string> = {
  "core-profile": "from-teal-500/10 to-transparent border-teal-500/20 text-teal-400",
  "volunteer-management": "from-teal-500/8 to-transparent border-teal-500/15 text-teal-400",
  "board-governance": "from-teal-500/8 to-transparent border-teal-500/15 text-teal-400",
  "membership-management": "from-teal-500/8 to-transparent border-teal-500/15 text-teal-400",
};

const MODULE_ICON_BG: Record<string, string> = {
  "core-profile": "bg-teal-500/15 text-teal-400",
  "volunteer-management": "bg-teal-500/10 text-teal-300",
  "board-governance": "bg-teal-500/10 text-teal-300",
  "membership-management": "bg-teal-500/10 text-teal-300",
};

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) => regex.test(part) ? <mark key={i}>{part}</mark> : part);
}

function DataTypeBadge({ type }: { type: string }) {
  const colorClass = DATA_TYPE_COLORS[type] || "bg-slate-700/60 text-slate-300 border-slate-600";
  const shortType = type.replace(" (System)", "").replace(" (Compound Field)", "").replace(" (or Matrix)", "");
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border font-mono whitespace-nowrap ${colorClass}`}>
      {shortType}
    </span>
  );
}

function FieldRow({ field, searchQuery }: { field: Field; searchQuery: string }) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (searchQuery.trim()) setExpanded(true);
    else setExpanded(false);
  }, [searchQuery]);

  return (
    <div className={`cursor-pointer ${expanded ? "bg-accent/10" : ""}`} onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="mt-0.5 flex-shrink-0 text-muted-foreground">
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-medium text-foreground">{highlightText(field.name, searchQuery)}</span>
            {field.required && <span className="text-[9px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded uppercase tracking-wide">Required</span>}
            {field.readOnly && <span className="text-[9px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 rounded uppercase tracking-wide">Read-Only</span>}
          </div>
          {!expanded && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{field.functionality}</p>}
        </div>
        <div className="flex-shrink-0"><DataTypeBadge type={field.dataType} /></div>
      </div>
      {expanded && (
        <div className="px-9 pb-4 space-y-3">
          <div className="rounded-md bg-background/60 border border-border/50 p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <BookOpen className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">Functionality</span>
            </div>
            <p className="text-xs text-foreground/85 leading-relaxed">{highlightText(field.functionality, searchQuery)}</p>
          </div>
          <div className="rounded-md bg-background/60 border border-border/50 p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">Validation Rules</span>
            </div>
            <p className="text-xs text-foreground/85 leading-relaxed">{highlightText(field.validation, searchQuery)}</p>
          </div>
          {field.automationTrigger && (
            <div className="rounded-md bg-amber-500/5 border border-amber-500/20 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">Automation Trigger</span>
              </div>
              <p className="text-xs text-amber-200/80 leading-relaxed">{highlightText(field.automationTrigger, searchQuery)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ModuleSection({ module, searchQuery }: { module: Module; searchQuery: string }) {
  const Icon = MODULE_ICONS[module.icon] || Database;
  const accentClass = MODULE_ACCENT[module.id] || "";
  const iconBgClass = MODULE_ICON_BG[module.id] || "";

  const filteredFields = searchQuery.trim()
    ? module.fields.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.functionality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.validation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.dataType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : module.fields;

  if (searchQuery.trim() && filteredFields.length === 0) return null;

  return (
    <section id={module.id} className="mb-8">
      <div className={`rounded-t-xl border-x border-t ${accentClass} bg-gradient-to-r p-4`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-md p-2 ${iconBgClass} flex-shrink-0`}><Icon className="w-4 h-4" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-foreground tracking-tight">{module.title}</h2>
              <span className="text-[10px] text-muted-foreground font-medium bg-background/30 px-1.5 py-0.5 rounded border border-border/40 uppercase tracking-wide">{module.subtitle}</span>
              <span className="ml-auto text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                {filteredFields.length}{searchQuery ? `/${module.fields.length}` : ""} fields
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{module.description}</p>
          </div>
        </div>
      </div>
      <div className="rounded-b-xl border border-border/60 overflow-hidden bg-card">
        <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2.5 bg-background/40 border-b border-border/50">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Field Name / Description</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Data Type</span>
        </div>
        <div className="divide-y divide-border/30">
          {filteredFields.map(field => <FieldRow key={field.id} field={field} searchQuery={searchQuery} />)}
        </div>
      </div>
    </section>
  );
}

export default function FieldReference() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredModules = modules.filter(m => {
    if (!searchQuery.trim()) return true;
    return m.fields.some(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.functionality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.validation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.dataType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalMatchingFields = filteredModules.reduce((acc, m) => {
    return acc + m.fields.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.functionality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.validation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.dataType.toLowerCase().includes(searchQuery.toLowerCase())
    ).length;
  }, 0);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">
                {totalFields} Fields · 4 Modules · One Source of Truth
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Field Reference Guide</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Technical blueprint for nonprofit CRM implementation. Click any row to expand.</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span><span className="text-foreground font-semibold">{totalFields}</span> fields</span>
            <span className="w-px h-3 bg-border" />
            <span><span className="text-foreground font-semibold">3</span> formula fields</span>
            <span className="w-px h-3 bg-border" />
            <span><span className="text-foreground font-semibold">5</span> auto-triggers</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search fields, data types, validation rules…"
            className="pl-9"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {searchQuery.trim() && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Search className="w-3.5 h-3.5 text-primary" />
            <span>Showing <span className="text-foreground font-semibold">{totalMatchingFields}</span> field{totalMatchingFields !== 1 ? "s" : ""} matching <span className="text-primary font-medium">"{searchQuery}"</span></span>
            <button onClick={() => setSearchQuery("")} className="ml-auto text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">Clear</button>
          </div>
        )}

        {/* Modules */}
        {filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <AlertCircle className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-base font-medium text-foreground">No fields found</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different search term or <button onClick={() => setSearchQuery("")} className="text-primary underline underline-offset-2">clear the search</button></p>
          </div>
        ) : (
          filteredModules.map(module => <ModuleSection key={module.id} module={module} searchQuery={searchQuery} />)
        )}
      </div>
    </DashboardLayout>
  );
}
