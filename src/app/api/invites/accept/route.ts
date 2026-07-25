import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Nu necesită sesiune — codul de invitație (secret, unic, cu expirare) E autorizarea.
// Creează contul direct cu parolă (email_confirm: true), fără niciun email trimis.
export async function POST(request: Request) {
  const { code, fullName, email, password } = await request.json();

  if (!code || !fullName || !email || !password) {
    return NextResponse.json({ error: "Lipsesc date din formular." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Parola trebuie să aibă cel puțin 8 caractere." },
      { status: 400 }
    );
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

  if (invite.email && invite.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json(
      { error: "Această invitație e legată de alt email." },
      { status: 403 }
    );
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError || !created.user) {
    const alreadyExists = createError?.message?.toLowerCase().includes("already registered");
    return NextResponse.json(
      {
        error: alreadyExists
          ? "Există deja un cont cu acest email. Intră direct cu parola ta."
          : (createError?.message ?? "Nu am putut crea contul."),
      },
      { status: alreadyExists ? 409 : 500 }
    );
  }

  const { error: membershipError } = await admin.from("memberships").upsert(
    {
      org_id: invite.org_id,
      user_id: created.user.id,
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
    .update({ used_at: new Date().toISOString(), used_by: created.user.id })
    .eq("id", invite.id);

  return NextResponse.json({ ok: true, orgId: invite.org_id });
}
