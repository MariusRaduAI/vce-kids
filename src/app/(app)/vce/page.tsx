import { redirect } from "next/navigation";
import { Users, BarChart3, CheckSquare, Target, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { MentorSelect } from "./MentorSelect";

export default async function VcePage() {
  const { profile } = await getCurrentUser();
  if (!profile?.is_platform_admin) redirect("/dashboard");

  const supabase = await createClient();

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const [
    { data: orgs },
    { data: allMemberships },
    { data: checks },
    { data: statuses },
    { data: attendance },
    { data: objectives },
  ] = await Promise.all([
    supabase.from("organizations").select("*").order("name"),
    supabase.from("memberships").select("org_id").eq("status", "active"),
    supabase.from("org_readiness_checks").select("id"),
    supabase.from("org_readiness_status").select("org_id, is_complete").eq("is_complete", true),
    supabase
      .from("attendance_records")
      .select("org_id, member_count, non_member_count, record_date")
      .gte("record_date", threeMonthsAgo.toISOString().slice(0, 10)),
    supabase.from("org_objectives").select("org_id, status"),
  ]);

  const totalChecks = checks?.length ?? 0;
  const orgList = orgs ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <Globe size={20} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">VCE — toată rețeaua</h1>
          <p className="font-medium text-muted-foreground">
            Status pe fiecare lucrare de copii din rețea — {orgList.length} biserici.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orgList.map((org) => {
          const peopleCount = (allMemberships ?? []).filter((m) => m.org_id === org.id).length;
          const doneChecks = (statuses ?? []).filter((s) => s.org_id === org.id).length;
          const orgAttendance = (attendance ?? []).filter((a) => a.org_id === org.id);
          const attendanceTotal = orgAttendance.reduce(
            (sum, a) => sum + a.member_count + a.non_member_count,
            0
          );
          const orgObjectives = (objectives ?? []).filter((o) => o.org_id === org.id);
          const achievedCount = orgObjectives.filter((o) => o.status === "achieved").length;

          return (
            <div key={org.id} className="rounded-[24px] bg-card shadow-sm ring-1 ring-border/60 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-foreground">{org.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {org.city}
                    {org.country ? `, ${org.country}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Mentor:</span>
                  <MentorSelect
                    orgId={org.id}
                    currentMentorId={org.mentor_org_id}
                    options={orgList.map((o) => ({ id: o.id, name: o.name }))}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-muted px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <Users size={13} /> Oameni
                  </div>
                  <p className="mt-1 text-xl font-extrabold text-foreground">{peopleCount}</p>
                </div>
                <div className="rounded-2xl bg-muted px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <BarChart3 size={13} /> Copii (3 luni)
                  </div>
                  <p className="mt-1 text-xl font-extrabold text-foreground">{attendanceTotal}</p>
                </div>
                <div className="rounded-2xl bg-muted px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <CheckSquare size={13} /> Checklist VCE
                  </div>
                  <p className="mt-1 text-xl font-extrabold text-foreground">
                    {doneChecks}/{totalChecks}
                  </p>
                </div>
                <div className="rounded-2xl bg-muted px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <Target size={13} /> Obiective atinse
                  </div>
                  <p className="mt-1 text-xl font-extrabold text-foreground">
                    {achievedCount}/{orgObjectives.length}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs font-medium text-muted-foreground">
                Curriculum: {org.curriculum_name ?? "nesetat"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
