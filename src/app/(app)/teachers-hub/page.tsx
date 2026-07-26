import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { LessonsManager } from "./LessonsManager";

export default async function TeachersHubPage() {
  const supabase = await createClient();
  const { memberships } = await getCurrentUser();
  const current = memberships[0];
  const orgId = current.org_id;

  const { data: lessons } = await supabase
    .from("curriculum_lessons")
    .select("*")
    .or(`org_id.is.null,org_id.eq.${orgId}`)
    .order("week_start_date", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-foreground">Teachers Hub</h1>
      <p className="mt-1.5 font-medium text-muted-foreground">
        Programa, lecțiile și materialele necesare pentru fiecare grupă de vârstă.
        {current.organization?.curriculum_name && (
          <> Curriculum: <strong className="text-foreground">{current.organization.curriculum_name}</strong>.</>
        )}
      </p>

      <div className="mt-8">
        <LessonsManager
          orgId={orgId}
          isOrgAdmin={current.role === "org_admin"}
          initialLessons={lessons ?? []}
        />
      </div>
    </div>
  );
}
