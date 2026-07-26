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
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
        Induction
      </h1>
      <p className="mt-2 font-medium text-muted-foreground">
        Tot ce trebuie să știi ca să slujești în echipa Vertical Kids.
      </p>

      {total > 0 && (
        <div className="mt-6 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-500 transition-all duration-500"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-muted-foreground">
            {done}/{total}
          </span>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {(steps ?? []).map((step) => {
          const isDone = completedIds.has(step.id);
          const accent = accentFor(step.id);
          return (
            <Link
              key={step.id}
              href={`/induction/${step.id}`}
              className="group flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${accent.grad}`}
              >
                <Sparkles size={16} />
              </div>
              <span className="flex-1 text-sm font-bold text-foreground">{step.title}</span>
              {isDone ? (
                <CheckCircle2 size={18} className="shrink-0 text-success" />
              ) : (
                <Circle size={18} className="shrink-0 text-muted-foreground/40" />
              )}
              <ChevronRight
                size={16}
                className="shrink-0 text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
