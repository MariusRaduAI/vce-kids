import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { FeedbackForm } from "./FeedbackForm";

export default async function FeedbackPage() {
  const supabase = await createClient();
  const { user, memberships } = await getCurrentUser();
  const orgId = memberships[0].org_id;

  const { data: items } = await supabase
    .from("feedback_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-extrabold text-foreground">Feedback</h1>
      <p className="mt-1.5 font-medium text-muted-foreground">
        Transmite feedback, observații, sugestii sau raportează un incident.
      </p>

      <div className="mt-8">
        <FeedbackForm orgId={orgId} userId={user.id} initialItems={items ?? []} />
      </div>
    </div>
  );
}
