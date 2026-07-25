"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function FinishAccept({ code }: { code: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/invites/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        if (cancelled) return;
        const body = await res.json();
        if (!res.ok) {
          setError(body.error ?? "A apărut o eroare.");
          return;
        }
        router.replace("/dashboard");
      })
      .catch(() => !cancelled && setError("A apărut o eroare de rețea."));

    return () => {
      cancelled = true;
    };
  }, [code, router]);

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  return <p className="text-sm text-neutral-300">Te adăugăm în echipă...</p>;
}
