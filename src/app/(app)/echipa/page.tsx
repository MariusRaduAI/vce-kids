import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { accentFor } from "@/lib/colors";
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
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
        Echipă & Invitații
      </h1>
      <p className="mt-2 font-medium text-muted-foreground">
        Singurul mod de a intra în platformă. Fără invitație, nimeni nu-și poate crea cont.
      </p>

      <div className="mt-8">
        <CreateInviteForm orgId={orgId} />
      </div>

      {(invites ?? []).length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Invitații active
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {invites?.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-2xl bg-card px-4 py-3.5 text-sm shadow-sm ring-1 ring-border/60"
              >
                <span className="font-semibold text-foreground">
                  {ROLE_LABELS[inv.role]}
                  {inv.department ? ` — ${inv.department}` : ""}
                  {inv.email ? ` · ${inv.email}` : ""}
                </span>
                <span className="text-xs text-muted-foreground">
                  expiră {new Date(inv.expires_at).toLocaleDateString("ro-RO")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Membri activi ({profiles?.length ?? 0})
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(orgMemberships ?? []).map((m) => {
            const p = profiles?.find((pr) => pr.id === m.user_id);
            const accent = accentFor(m.id);
            return (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 text-sm shadow-sm ring-1 ring-border/60 transition-shadow duration-200 hover:shadow-md"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-extrabold text-white shadow-sm ${accent.grad}`}
                >
                  {(p?.full_name ?? "?").charAt(0)}
                </div>
                <span className="flex-1 font-semibold text-foreground">{p?.full_name ?? "—"}</span>
                <span className="text-xs text-muted-foreground">
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
