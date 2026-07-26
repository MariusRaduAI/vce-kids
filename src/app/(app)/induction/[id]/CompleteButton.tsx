"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function CompleteButton({
  stepId,
  userId,
  alreadyDone,
}: {
  stepId: string;
  userId: string;
  alreadyDone: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(alreadyDone);

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
        <CheckCircle2 size={18} />
        Ai marcat acest pas ca parcurs.
      </div>
    );
  }

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const supabase = createClient();
        const { error } = await supabase
          .from("induction_progress")
          .insert({ step_id: stepId, user_id: userId });
        setLoading(false);
        if (!error) {
          setDone(true);
          router.refresh();
        }
      }}
      className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
    >
      {loading ? "Se salvează..." : "Am parcurs acest pas"}
    </button>
  );
}
