import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { accentFor } from "@/lib/colors";

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
      <h1 className="font-display text-3xl font-extrabold text-foreground">Induction</h1>
      <p className="mt-1.5 font-medium text-muted-foreground">
        Tot ce trebuie să știi ca să slujești în echipa Vertical Kids.
      </p>

      {total > 0 && (
        <div className="mt-6 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-border bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-muted-foreground">
            {done}/{total}
          </span>
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {(steps ?? []).map((step) => {
          const isDone = completedIds.has(step.id);
          const accent = accentFor(step.id);
          return (
            <Link
              key={step.id}
              href={`/induction/${step.id}`}
              className={`flex items-center gap-3 rounded-2xl border-[3px] border-border bg-card p-4 transition hover:-translate-y-0.5 ${accent.ring}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-border text-white ${accent.badge}`}
              >
                <Sparkles size={15} />
              </div>
              <span className="flex-1 text-sm font-bold text-foreground">{step.title}</span>
              {isDone ? (
                <CheckCircle2 size={18} className="shrink-0 text-success" />
              ) : (
                <Circle size={18} className="shrink-0 text-muted-foreground/40" />
              )}
              <ChevronRight size={16} className="shrink-0 text-muted-foreground/40" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
