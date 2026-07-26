import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { EventsManager } from "./EventsManager";

export default async function EvenimentePage() {
  const supabase = await createClient();
  const { memberships } = await getCurrentUser();
  const current = memberships[0];

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("org_id", current.org_id)
    .order("start_at");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Evenimente</h1>
      <p className="mt-1 text-neutral-400">
        Evenimente viitoare, tabere și întâlniri de echipă.
      </p>

      <div className="mt-8">
        <EventsManager
          orgId={current.org_id}
          isOrgAdmin={current.role === "org_admin"}
          initialEvents={events ?? []}
        />
      </div>
    </div>
  );
}
