import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: memberships } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active");

  const orgIds = (memberships ?? []).map((m) => m.org_id);
  const { data: organizations } = orgIds.length
    ? await supabase.from("organizations").select("*").in("id", orgIds)
    : { data: [] };

  const membershipsWithOrg = (memberships ?? []).map((m) => ({
    ...m,
    organization: (organizations ?? []).find((o) => o.id === m.org_id) ?? null,
  }));

  return { user, profile, memberships: membershipsWithOrg };
}
