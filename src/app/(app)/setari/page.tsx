import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { AccountSection } from "./AccountSection";
import { MinistrySection } from "./MinistrySection";

export default async function SetariPage() {
  const supabase = await createClient();
  const { user, profile, memberships } = await getCurrentUser();
  const current = memberships[0];
  const isOrgAdmin = current.role === "org_admin";

  let mentorName: string | null = null;
  if (isOrgAdmin && current.organization?.mentor_org_id) {
    const { data: mentor } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", current.organization.mentor_org_id)
      .maybeSingle();
    mentorName = mentor?.name ?? null;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Contul meu</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Detaliile tale și lucrarea ta. Aspectul (luminos/întunecat) e sus, în antet.
        </p>
      </div>

      <AccountSection userId={user.id} email={user.email ?? ""} fullName={profile?.full_name ?? ""} />

      {isOrgAdmin && current.organization && (
        <MinistrySection
          orgId={current.organization.id}
          name={current.organization.name}
          city={current.organization.city}
          country={current.organization.country}
          curriculumName={current.organization.curriculum_name}
          mentorName={mentorName}
        />
      )}
    </div>
  );
}
