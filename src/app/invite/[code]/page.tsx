import { createAdminClient } from "@/lib/supabase/admin";
import { InviteAccept } from "./InviteAccept";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const admin = createAdminClient();

  const { data: invite } = await admin
    .from("invites")
    .select("code, role, department, email, expires_at, used_at, org_id")
    .eq("code", code)
    .single();

  const org = invite
    ? (await admin.from("organizations").select("name").eq("id", invite.org_id).single()).data
    : null;

  const isInvalid =
    !invite || !!invite.used_at || new Date(invite.expires_at) < new Date();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 rotate-[-4deg] items-center justify-center rounded-3xl border-4 border-border bg-gradient-to-br from-primary to-secondary text-2xl font-extrabold text-primary-foreground shadow-md">
            VK
          </div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">VCE Kids</h1>
        </div>

        <div className="rounded-[28px] border-4 border-border bg-card p-6 shadow-md">
          {isInvalid || !invite || !org ? (
            <p className="text-sm font-semibold text-destructive">
              Această invitație nu (mai) este validă. Cere-i liderului tău una nouă.
            </p>
          ) : (
            <InviteAccept
              code={invite.code}
              orgName={org.name}
              role={invite.role}
              department={invite.department}
              presetEmail={invite.email}
            />
          )}
        </div>
      </div>
    </main>
  );
}
