import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { PrayWallManager } from "./PrayWallManager";

export default async function PrayWallPage() {
  const supabase = await createClient();
  const { user, memberships } = await getCurrentUser();
  const orgId = memberships[0].org_id;

  const { data: prayers } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  const prayerIds = (prayers ?? []).map((p) => p.id);
  const { data: myPrayed } = prayerIds.length
    ? await supabase
        .from("prayer_prayed_for")
        .select("prayer_request_id")
        .eq("user_id", user.id)
        .in("prayer_request_id", prayerIds)
    : { data: [] };

  const authorIds = [...new Set((prayers ?? []).map((p) => p.user_id).filter(Boolean))] as string[];
  const { data: authors } = authorIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", authorIds)
    : { data: [] };

  const authorNames = Object.fromEntries(
    (authors ?? []).map((a) => [a.id, a.full_name ?? "Cineva"])
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-foreground">Pray Wall</h1>
      <p className="mt-1.5 font-medium text-muted-foreground">
        Lasă un motiv de rugăciune și roagă-te împreună cu echipa.
      </p>

      <div className="mt-8">
        <PrayWallManager
          orgId={orgId}
          userId={user.id}
          initialPrayers={prayers ?? []}
          initialPrayedIds={(myPrayed ?? []).map((m) => m.prayer_request_id)}
          authorNames={authorNames}
        />
      </div>
    </div>
  );
}
