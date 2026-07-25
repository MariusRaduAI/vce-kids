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
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-xl font-bold text-black">
            VK
          </div>
          <h1 className="text-2xl font-semibold text-white">VCE Kids</h1>
        </div>

        {isInvalid || !invite || !org ? (
          <p className="text-sm text-red-400">
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
    </main>
  );
}
