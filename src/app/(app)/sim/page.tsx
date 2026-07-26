import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { SimManager } from "./SimManager";

export default async function SimPage() {
  const supabase = await createClient();
  const { memberships } = await getCurrentUser();
  const current = memberships[0];
  const orgId = current.org_id;

  const { data: sessions } = await supabase
    .from("sim_sessions")
    .select("*")
    .eq("org_id", orgId)
    .order("service_date", { ascending: false });

  const sessionIds = (sessions ?? []).map((s) => s.id);
  const { data: slots } = sessionIds.length
    ? await supabase.from("sim_slots").select("*").in("sim_session_id", sessionIds)
    : { data: [] };

  const { data: orgMemberships } = await supabase
    .from("memberships")
    .select("id, user_id")
    .eq("org_id", orgId)
    .eq("status", "active");

  const memberIds = (orgMemberships ?? []).map((m) => m.user_id);
  const { data: profiles } = memberIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", memberIds)
    : { data: [] };

  const memberOptions = (orgMemberships ?? []).map((m) => ({
    membershipId: m.id,
    name: profiles?.find((p) => p.id === m.user_id)?.full_name ?? "—",
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-foreground">
        SIM — Serviciu cu Impact Maxim
      </h1>
      <p className="mt-1.5 font-medium text-muted-foreground">
        Programul duminical: ordinea activităților și cine e responsabil de fiecare.
      </p>

      <div className="mt-8">
        <SimManager
          orgId={orgId}
          isOrgAdmin={current.role === "org_admin"}
          initialSessions={sessions ?? []}
          initialSlots={slots ?? []}
          members={memberOptions}
        />
      </div>
    </div>
  );
}
