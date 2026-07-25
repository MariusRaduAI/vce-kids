import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";

const CATEGORY_LABELS: Record<string, string> = {
  siguranta: "Siguranță copii",
  urgente: "Situații de urgență",
  receptie: "Recepție",
  altele: "Altele",
};

export default async function ProceduriPage() {
  const supabase = await createClient();
  const { user, memberships } = await getCurrentUser();
  const orgId = memberships[0].org_id;

  const { data: procedures } = await supabase
    .from("procedures")
    .select("*")
    .or(`org_id.is.null,org_id.eq.${orgId}`)
    .order("category")
    .order("title");

  const { data: confirmations } = await supabase
    .from("procedure_confirmations")
    .select("procedure_id, version_confirmed")
    .eq("user_id", user.id);

  const confirmedMap = new Map(
    (confirmations ?? []).map((c) => [c.procedure_id, c.version_confirmed])
  );

  const grouped = (procedures ?? []).reduce<Record<string, typeof procedures>>(
    (acc, p) => {
      acc[p.category] = [...(acc[p.category] ?? []), p];
      return acc;
    },
    {}
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Proceduri & Siguranță</h1>
      <p className="mt-1 text-neutral-400">
        Citește fiecare procedură și confirmă că ai înțeles-o. E important pentru siguranța copiilor.
      </p>

      {(procedures ?? []).length === 0 && (
        <p className="mt-8 text-sm text-neutral-500">
          Nu există încă proceduri publicate pentru biserica ta.
        </p>
      )}

      <div className="mt-8 space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {items?.map((p) => {
                const isConfirmed = confirmedMap.get(p.id) === p.version;
                return (
                  <Link
                    key={p.id}
                    href={`/proceduri/${p.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-white/[0.06]"
                  >
                    {isConfirmed ? (
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                    ) : (
                      <Circle size={18} className="shrink-0 text-neutral-600" />
                    )}
                    <span className="flex-1 text-sm text-white">{p.title}</span>
                    {!p.org_id && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-neutral-400">
                        template
                      </span>
                    )}
                    <ChevronRight size={16} className="text-neutral-600" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
