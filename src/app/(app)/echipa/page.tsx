import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { CreateInviteForm } from "./CreateInviteForm";

const ROLE_LABELS: Record<string, string> = {
  org_admin: "Admin biserică",
  leader: "Lider echipă",
  volunteer: "Voluntar",
};

export default async function EchipaPage() {
  const { memberships } = await getCurrentUser();
  const current = memberships[0];

  if (current.role !== "org_admin") redirect("/dashboard");

  const supabase = await createClient();
  const orgId = current.org_id;

  const { data: orgMemberships } = await supabase
    .from("memberships")
    .select("*")
    .eq("org_id", orgId)
    .eq("status", "active");

  const memberIds = (orgMemberships ?? []).map((m) => m.user_id);
  const { data: profiles } = memberIds.length
    ? await supabase.from("profiles").select("*").in("id", memberIds)
    : { data: [] };

  const { data: invites } = await supabase
    .from("invites")
    .select("*")
    .eq("org_id", orgId)
    .is("used_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Echipă & Invitații</h1>
      <p className="mt-1 text-neutral-400">
        Singurul mod de a intra în platformă. Fără invitație, nimeni nu-și poate crea cont.
      </p>

      <div className="mt-8">
        <CreateInviteForm orgId={orgId} />
      </div>

      {(invites ?? []).length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
            Invitații active
          </h2>
          <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {invites?.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-white">
                  {ROLE_LABELS[inv.role]}
                  {inv.department ? ` — ${inv.department}` : ""}
                  {inv.email ? ` · ${inv.email}` : ""}
                </span>
                <span className="text-neutral-500">
                  expiră {new Date(inv.expires_at).toLocaleDateString("ro-RO")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
          Membri activi ({profiles?.length ?? 0})
        </h2>
        <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {(orgMemberships ?? []).map((m) => {
            const p = profiles?.find((pr) => pr.id === m.user_id);
            return (
              <div key={m.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-white">{p?.full_name ?? "—"}</span>
                <span className="text-neutral-500">
                  {ROLE_LABELS[m.role]}
                  {m.department ? ` — ${m.department}` : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
