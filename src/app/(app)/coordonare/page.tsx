import Link from "next/link";
import { redirect } from "next/navigation";
import { Network, ArrowRight, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { ObjectivesSection } from "./ObjectivesSection";
import { AttendanceSection } from "./AttendanceSection";
import { RoomsSection } from "./RoomsSection";

const ROLE_LABELS: Record<string, string> = {
  org_admin: "Admin",
  leader: "Lider",
  volunteer: "Voluntar",
};

export default async function CoordonarePage() {
  const { memberships } = await getCurrentUser();
  const current = memberships[0];

  if (current.role !== "org_admin") redirect("/dashboard");

  const supabase = await createClient();
  const orgId = current.org_id;

  const [
    { data: objectives },
    { data: attendance },
    { data: rooms },
    { data: orgMemberships },
    { data: feedback },
  ] = await Promise.all([
    supabase.from("org_objectives").select("*").eq("org_id", orgId).order("created_at", { ascending: false }),
    supabase.from("attendance_records").select("*").eq("org_id", orgId).order("record_date", { ascending: false }).limit(30),
    supabase.from("org_rooms").select("*").eq("org_id", orgId).order("name"),
    supabase.from("memberships").select("id, role, department, user_id").eq("org_id", orgId).eq("status", "active"),
    supabase.from("feedback_items").select("*").eq("org_id", orgId).order("created_at", { ascending: false }).limit(10),
  ]);

  const memberIds = (orgMemberships ?? []).map((m) => m.user_id);
  const { data: profiles } = memberIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", memberIds)
    : { data: [] };

  const incidentCount = (feedback ?? []).filter((f) => f.category === "incident").length;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-foreground">Coordonare</h1>
        <p className="mt-1.5 font-medium text-muted-foreground">
          Vizibil pentru coordonator și pastor — statusul lucrării, obiective, prezență și echipă.
        </p>
      </div>

      <ObjectivesSection orgId={orgId} initialObjectives={objectives ?? []} />
      <AttendanceSection orgId={orgId} ageGroups={["2-3", "4-6", "7-9", "10-12"]} initialRecords={attendance ?? []} />
      <RoomsSection orgId={orgId} initialRooms={rooms ?? []} />

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Network size={16} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Echipă ({orgMemberships?.length ?? 0})
          </h2>
        </div>
        <div className="rounded-[20px] bg-card shadow-sm ring-1 ring-border/60 p-5">
          <div className="grid gap-2 sm:grid-cols-2">
            {(orgMemberships ?? []).map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-sm"
              >
                <span className="font-semibold text-foreground">
                  {profiles?.find((p) => p.id === m.user_id)?.full_name ?? "—"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {ROLE_LABELS[m.role]}
                  {m.department ? ` · ${m.department}` : ""}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/organigrama"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Vezi organigrama completă <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <MessageSquare size={16} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Feedback recent {incidentCount > 0 && `· ${incidentCount} incidente`}
          </h2>
        </div>
        <div className="rounded-[20px] bg-card shadow-sm ring-1 ring-border/60 p-5">
          {(feedback ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Niciun feedback încă.</p>
          ) : (
            <div className="space-y-2">
              {feedback?.map((f) => (
                <div key={f.id} className="rounded-xl bg-muted px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase ${f.category === "incident" ? "text-destructive" : "text-accent"}`}
                    >
                      {f.category ?? "general"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(f.created_at).toLocaleDateString("ro-RO")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{f.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
