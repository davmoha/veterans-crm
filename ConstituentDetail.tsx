import DashboardLayout from "@/components/DashboardLayout";
import { EditableField } from "@/components/EditableField";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, User, Heart, Shield, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const TYPE_COLORS: Record<string, string> = {
  Volunteer: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Board: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Member: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Donor: "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function ConstituentDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const id = parseInt(params.id ?? "0");

  const { data: constituent, isLoading, refetch: refetchConstituent } = trpc.constituents.byId.useQuery({ id }, { enabled: !!id });
  const { data: volunteerProfile, refetch: refetchVolunteer } = trpc.volunteer.profile.useQuery({ constituentId: id }, { enabled: !!id });
  const { data: totalHours } = trpc.volunteer.totalHours.useQuery({ constituentId: id }, { enabled: !!id });
  const { data: boardProfile, refetch: refetchBoard } = trpc.board.profile.useQuery({ constituentId: id }, { enabled: !!id });
  const { data: memberProfile, refetch: refetchMember } = trpc.membership.profile.useQuery({ constituentId: id }, { enabled: !!id });

  const updateConstituent = trpc.constituents.update.useMutation({
    onSuccess: () => { refetchConstituent(); toast.success("Constituent updated"); },
    onError: (err) => toast.error(err.message),
  });

  const updateVolunteer = trpc.volunteer.upsertProfile.useMutation({
    onSuccess: () => { refetchVolunteer(); toast.success("Volunteer profile updated"); },
    onError: (err) => toast.error(err.message),
  });

  const updateBoard = trpc.board.upsertProfile.useMutation({
    onSuccess: () => { refetchBoard(); toast.success("Board profile updated"); },
    onError: (err) => toast.error(err.message),
  });

  const updateMembership = trpc.membership.upsertProfile.useMutation({
    onSuccess: () => { refetchMember(); toast.success("Membership profile updated"); },
    onError: (err) => toast.error(err.message),
  });

  const contactTypes = (constituent?.contactTypes as string[]) ?? [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">Loading…</div>
      </DashboardLayout>
    );
  }

  if (!constituent) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-sm text-muted-foreground">Constituent not found.</p>
          <button onClick={() => setLocation("/constituents")} className="mt-3 text-xs text-primary underline">Back to list</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back + header */}
        <div>
          <button onClick={() => setLocation("/constituents")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Constituents
          </button>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{constituent.firstName} {constituent.lastName}</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {contactTypes.map(t => (
                  <span key={t} className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${TYPE_COLORS[t] || "bg-slate-700/60 text-slate-300 border-slate-600"}`}>{t}</span>
                ))}
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${constituent.source !== "manual" ? "bg-slate-600/40 text-slate-300 border-slate-500/40" : "bg-slate-700/40 text-slate-400 border-slate-600/40"}`}>
                  {constituent.source !== "manual" ? "Import" : "Manual Entry"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-4">
            <TabsTrigger value="profile"><User className="w-3.5 h-3.5 mr-1.5" />Profile</TabsTrigger>
            {contactTypes.includes("Volunteer") && <TabsTrigger value="volunteer"><Heart className="w-3.5 h-3.5 mr-1.5" />Volunteer</TabsTrigger>}
            {contactTypes.includes("Board") && <TabsTrigger value="board"><Shield className="w-3.5 h-3.5 mr-1.5" />Board</TabsTrigger>}
            {contactTypes.includes("Member") && <TabsTrigger value="member"><Star className="w-3.5 h-3.5 mr-1.5" />Membership</TabsTrigger>}
          </TabsList>

          {/* Core Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Section title="Contact Types">
              <EditableField
                label="Contact Types"
                value={contactTypes.join(", ")}
                onSave={(val) => updateConstituent.mutateAsync({
                  id,
                  contactTypes: String(val).split(",").map(s => s.trim()).filter(Boolean),
                })}
                placeholder="e.g., Volunteer, Board, Member"
              />
            </Section>

            <Section title="Name & Contact">
              <EditableField
                label="First Name"
                value={constituent.firstName}
                onSave={(val) => updateConstituent.mutateAsync({ id, firstName: String(val) })}
                required
              />
              <EditableField
                label="Last Name"
                value={constituent.lastName}
                onSave={(val) => updateConstituent.mutateAsync({ id, lastName: String(val) })}
                required
              />
              <EditableField
                label="Primary Email"
                value={constituent.primaryEmail}
                onSave={(val) => updateConstituent.mutateAsync({ id, primaryEmail: String(val) })}
                type="email"
              />
              <EditableField
                label="Primary Phone"
                value={constituent.primaryPhone}
                onSave={(val) => updateConstituent.mutateAsync({ id, primaryPhone: String(val) })}
                type="phone"
              />
            </Section>

            <Section title="Mailing Address">
                <EditableField label="Street 1" value={constituent.addressStreet1} onSave={(val) => updateConstituent.mutateAsync({ id, addressStreet1: String(val) })} />
                <EditableField label="Street 2" value={constituent.addressStreet2} onSave={(val) => updateConstituent.mutateAsync({ id, addressStreet2: String(val) })} />
                <EditableField label="City" value={constituent.addressCity} onSave={(val) => updateConstituent.mutateAsync({ id, addressCity: String(val) })} />
                <EditableField label="State" value={constituent.addressState} onSave={(val) => updateConstituent.mutateAsync({ id, addressState: String(val) })} />
                <EditableField label="ZIP" value={constituent.addressZip} onSave={(val) => updateConstituent.mutateAsync({ id, addressZip: String(val) })} />
                <EditableField label="Country" value={constituent.addressCountry} onSave={(val) => updateConstituent.mutateAsync({ id, addressCountry: String(val) })} />
              </Section>

            <Section title="Household / Organization">
              <EditableField label="Household ID" value={constituent.householdId} onSave={(val) => updateConstituent.mutateAsync({ id, householdId: String(val) })} />
              <EditableField label="Employer" value={constituent.employerName} onSave={(val) => updateConstituent.mutateAsync({ id, employerName: String(val) })} />
              <EditableField label="Job Title" value={constituent.jobTitle} onSave={(val) => updateConstituent.mutateAsync({ id, jobTitle: String(val) })} />
            </Section>

            <Section title="Communication Preferences">
              <EditableField
                label="Email Opt-In"
                value={constituent.optInEmail}
                onSave={(val) => updateConstituent.mutateAsync({ id, optInEmail: Boolean(val) })}
                type="checkbox"
                placeholder="Allow email communications"
              />
              <EditableField
                label="SMS Opt-In"
                value={constituent.optInSms}
                onSave={(val) => updateConstituent.mutateAsync({ id, optInSms: Boolean(val) })}
                type="checkbox"
                placeholder="Allow SMS communications"
              />
              <EditableField
                label="Physical Mail Opt-In"
                value={constituent.optInPhysicalMail}
                onSave={(val) => updateConstituent.mutateAsync({ id, optInPhysicalMail: Boolean(val) })}
                type="checkbox"
                placeholder="Allow physical mail"
              />
            </Section>

            <Section title="Notes">
              <EditableField
                label="Contact Notes"
                value={constituent.contactNotes}
                onSave={(val) => updateConstituent.mutateAsync({ id, contactNotes: String(val) })}
                type="textarea"
                placeholder="Add any notes about this constituent…"
              />
            </Section>
          </TabsContent>

          {/* Volunteer Tab */}
          {contactTypes.includes("Volunteer") && (
            <TabsContent value="volunteer" className="space-y-4">
              <Section title="Volunteer Profile">
                <EditableField
                  label="Skills"
                  value={volunteerProfile?.skills ? (volunteerProfile.skills as string[]).join(", ") : ""}
                  onSave={(val) => updateVolunteer.mutateAsync({
                    constituentId: id,
                    skills: String(val).split(",").map(s => s.trim()).filter(Boolean),
                  })}
                  placeholder="e.g., Event Planning, Fundraising"
                />
                <EditableField
                  label="Emergency Contact Name"
                  value={volunteerProfile?.emergencyContactName}
                  onSave={(val) => updateVolunteer.mutateAsync({ constituentId: id, emergencyContactName: String(val) })}
                />
                <EditableField
                  label="Emergency Contact Phone"
                  value={volunteerProfile?.emergencyContactPhone}
                  onSave={(val) => updateVolunteer.mutateAsync({ constituentId: id, emergencyContactPhone: String(val) })}
                  type="phone"
                />
                <EditableField
                  label="Background Check Status"
                  value={volunteerProfile?.backgroundCheckStatus}
                  onSave={(val) => updateVolunteer.mutateAsync({ constituentId: id, backgroundCheckStatus: String(val) as any })}
                  type="select"
                  options={[
                    { label: "Not Started", value: "Not Started" },
                    { label: "Pending", value: "Pending" },
                    { label: "Passed", value: "Passed" },
                    { label: "Failed", value: "Failed" },
                    { label: "Expired", value: "Expired" },
                  ]}
                />
                <EditableField
                  label="Background Check Expiration"
                  value={volunteerProfile?.backgroundCheckExpiration}
                  onSave={(val) => updateVolunteer.mutateAsync({ constituentId: id, backgroundCheckExpiration: String(val) })}
                  type="text"
                  placeholder="YYYY-MM-DD"
                />
                <EditableField
                  label="Preferred Locations"
                  value={volunteerProfile?.preferredLocations ? (volunteerProfile.preferredLocations as string[]).join(", ") : ""}
                  onSave={(val) => updateVolunteer.mutateAsync({
                    constituentId: id,
                    preferredLocations: String(val).split(",").map(s => s.trim()).filter(Boolean),
                  })}
                  placeholder="e.g., Downtown, Midtown"
                />
              </Section>
              <div className="rounded-xl border border-border/50 bg-card p-5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Total Hours Worked</p>
                <p className="text-3xl font-bold text-primary">{totalHours ?? "0"} <span className="text-sm font-normal text-muted-foreground">hours</span></p>
                <p className="text-xs text-muted-foreground mt-1">Roll-up sum of all completed volunteer shifts.</p>
              </div>
            </TabsContent>
          )}

          {/* Board Tab */}
          {contactTypes.includes("Board") && (
            <TabsContent value="board" className="space-y-4">
              <Section title="Board Governance">
                <EditableField
                  label="Board Role"
                  value={boardProfile?.boardRole}
                  onSave={(val) => updateBoard.mutateAsync({ constituentId: id, boardRole: String(val) as any })}
                  type="select"
                  options={[
                    { label: "President", value: "President" },
                    { label: "Vice President", value: "Vice President" },
                    { label: "Treasurer", value: "Treasurer" },
                    { label: "Secretary", value: "Secretary" },
                    { label: "Member-at-Large", value: "Member-at-Large" },
                    { label: "Chair", value: "Chair" },
                    { label: "Vice Chair", value: "Vice Chair" },
                  ]}
                />
                <EditableField
                  label="Committees"
                  value={boardProfile?.committees ? (boardProfile.committees as string[]).join(", ") : ""}
                  onSave={(val) => updateBoard.mutateAsync({
                    constituentId: id,
                    committees: String(val).split(",").map(s => s.trim()).filter(Boolean),
                  })}
                  placeholder="e.g., Finance, Governance"
                />
                <EditableField
                  label="Term Start Date"
                  value={boardProfile?.termStartDate}
                  onSave={(val) => updateBoard.mutateAsync({ constituentId: id, termStartDate: String(val) })}
                  type="text"
                  placeholder="YYYY-MM-DD"
                />
                <EditableField
                  label="Term End Date"
                  value={boardProfile?.termEndDate}
                  onSave={(val) => updateBoard.mutateAsync({ constituentId: id, termEndDate: String(val) })}
                  type="text"
                  placeholder="YYYY-MM-DD"
                />
                <EditableField
                  label="Term Number"
                  value={boardProfile?.termNumber}
                  onSave={(val) => updateBoard.mutateAsync({ constituentId: id, termNumber: Number(val) })}
                  type="number"
                />
                <EditableField
                  label="Personal Giving Target"
                  value={boardProfile?.personalGivingTarget}
                  onSave={(val) => updateBoard.mutateAsync({ constituentId: id, personalGivingTarget: String(val) })}
                  type="text"
                  placeholder="e.g., 50000"
                />
              </Section>
            </TabsContent>
          )}

          {/* Membership Tab */}
          {contactTypes.includes("Member") && (
            <TabsContent value="member" className="space-y-4">
              <Section title="Membership">
                <EditableField
                  label="Member ID"
                  value={memberProfile?.uniqueMemberId}
                  onSave={() => Promise.resolve()}
                  disabled
                />
                <EditableField
                  label="Member Tier"
                  value={memberProfile?.memberTier}
                  onSave={(val) => updateMembership.mutateAsync({ constituentId: id, memberTier: String(val) as any })}
                  type="select"
                  options={[
                    { label: "Student", value: "Student" },
                    { label: "Individual", value: "Individual" },
                    { label: "Family", value: "Family" },
                    { label: "Corporate", value: "Corporate" },
                    { label: "VIP", value: "VIP" },
                  ]}
                />
                <EditableField
                  label="Join Date"
                  value={memberProfile?.joinDate}
                  onSave={(val) => updateMembership.mutateAsync({ constituentId: id, joinDate: String(val) })}
                  type="text"
                  placeholder="YYYY-MM-DD"
                />
                <EditableField
                  label="Last Renewal Date"
                  value={memberProfile?.lastRenewalDate}
                  onSave={(val) => updateMembership.mutateAsync({ constituentId: id, lastRenewalDate: String(val) })}
                  type="text"
                  placeholder="YYYY-MM-DD"
                />
                <EditableField
                  label="Membership Expiration Date"
                  value={memberProfile?.membershipExpirationDate}
                  onSave={(val) => updateMembership.mutateAsync({ constituentId: id, membershipExpirationDate: String(val) })}
                  type="text"
                  placeholder="YYYY-MM-DD"
                />
                <EditableField
                  label="Annual Dues Amount"
                  value={memberProfile?.annualDuesAmount}
                  onSave={(val) => updateMembership.mutateAsync({ constituentId: id, annualDuesAmount: String(val) })}
                  type="text"
                  placeholder="e.g., 100.00"
                />
              </Section>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
