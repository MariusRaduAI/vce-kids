import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";

export default async function InductionPage() {
  const supabase = await createClient();
  const { user, memberships } = await getCurrentUser();
  const orgId = memberships[0].org_id;

  const { data: steps } = await supabase
    .from("induction_steps")
    .select("*")
    .or(`org_id.is.null,org_id.eq.${orgId}`)
    .order("sort_order");

  const { data: progress } = await supabase
    .from("induction_progress")
    .select("step_id")
    .eq("user_id", user.id);

  const completedIds = new Set((progress ?? []).map((p) => p.step_id));
  const total = steps?.length ?? 0;
  const done = (steps ?? []).filter((s) => completedIds.has(s.id)).length;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Induction</h1>
      <p className="mt-1 text-neutral-400">
        Tot ce trebuie să știi ca să slujești în echipa Vertical Kids.
      </p>

      {total > 0 && (
        <div className="mt-6 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-amber-400 transition-all"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
          <span className="text-sm text-neutral-400">
            {done}/{total}
          </span>
        </div>
      )}

      <div className="mt-8 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {(steps ?? []).map((step) => {
          const isDone = completedIds.has(step.id);
          return (
            <Link
              key={step.id}
              href={`/induction/${step.id}`}
              className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-white/[0.06]"
            >
              {isDone ? (
                <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
              ) : (
                <Circle size={18} className="shrink-0 text-neutral-600" />
              )}
              <span className="flex-1 text-sm text-white">{step.title}</span>
              <ChevronRight size={16} className="text-neutral-600" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
