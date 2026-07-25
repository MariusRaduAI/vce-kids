"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ConfirmButton({
  procedureId,
  version,
  userId,
  alreadyConfirmed,
}: {
  procedureId: string;
  version: number;
  userId: string;
  alreadyConfirmed: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(alreadyConfirmed);

  if (confirmed) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
        <CheckCircle2 size={18} />
        Ai confirmat că ai citit și înțeles această procedură.
      </div>
    );
  }

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const supabase = createClient();
        const { error } = await supabase.from("procedure_confirmations").insert({
          procedure_id: procedureId,
          user_id: userId,
          version_confirmed: version,
        });
        setLoading(false);
        if (!error) {
          setConfirmed(true);
          router.refresh();
        }
      }}
      className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
    >
      {loading ? "Se salvează..." : "Am citit și am înțeles"}
    </button>
  );
}
