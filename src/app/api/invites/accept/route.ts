import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Rulează cu sesiunea userului logat (după magic link), dar folosește service_role
// doar pentru pașii care necesită să ocolească RLS: validarea codului + crearea membership-ului.
export async function POST(request: Request) {
  const { code } = await request.json();
  if (!code) {
    return NextResponse.json({ error: "Cod invitație lipsă." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Trebuie să fii logat." }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: invite, error: inviteError } = await admin
    .from("invites")
    .select("*")
    .eq("code", code)
    .single();

  if (inviteError || !invite) {
    return NextResponse.json({ error: "Invitație invalidă." }, { status: 404 });
  }

  if (invite.used_at) {
    return NextResponse.json({ error: "Invitația a fost deja folosită." }, { status: 409 });
  }

  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: "Invitația a expirat." }, { status: 410 });
  }

  if (invite.email && invite.email.toLowerCase() !== user.email?.toLowerCase()) {
    return NextResponse.json(
      { error: "Această invitație e legată de alt email." },
      { status: 403 }
    );
  }

  const { error: membershipError } = await admin.from("memberships").upsert(
    {
      org_id: invite.org_id,
      user_id: user.id,
      role: invite.role,
      department: invite.department,
      status: "active",
    },
    { onConflict: "org_id,user_id" }
  );

  if (membershipError) {
    return NextResponse.json({ error: membershipError.message }, { status: 500 });
  }

  await admin
    .from("invites")
    .update({ used_at: new Date().toISOString(), used_by: user.id })
    .eq("id", invite.id);

  return NextResponse.json({ ok: true, orgId: invite.org_id });
}
