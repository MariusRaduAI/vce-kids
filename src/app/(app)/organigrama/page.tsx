import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { OrgChartManager } from "./OrgChartManager";

export default async function OrganigramaPage() {
  const supabase = await createClient();
  const { memberships } = await getCurrentUser();
  const current = memberships[0];
  const orgId = current.org_id;

  const { data: nodes } = await supabase
    .from("org_chart_nodes")
    .select("*")
    .eq("org_id", orgId)
    .order("sort_order");

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
      <h1 className="font-display text-3xl font-extrabold text-foreground">Organigramă</h1>
      <p className="mt-1.5 font-medium text-muted-foreground">
        Echipa de coordonare a lucrării de copii — pentru orice nevoie, îndreaptă-te spre responsabilul potrivit.
      </p>

      <div className="mt-8">
        <OrgChartManager
          orgId={orgId}
          isOrgAdmin={current.role === "org_admin"}
          initialNodes={nodes ?? []}
          members={memberOptions}
        />
      </div>
    </div>
  );
}
