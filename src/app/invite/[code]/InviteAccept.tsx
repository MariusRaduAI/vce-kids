"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ROLE_LABELS: Record<string, string> = {
  org_admin: "Admin biserică",
  leader: "Lider echipă",
  volunteer: "Voluntar",
};

export function InviteAccept({
  code,
  orgName,
  role,
  department,
  presetEmail,
}: {
  code: string;
  orgName: string;
  role: string;
  department: string | null;
  presetEmail: string | null;
}) {
  const [email, setEmail] = useState(presetEmail ?? "");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/invite/${code}/finish`,
        shouldCreateUser: true,
        data: { full_name: fullName },
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-neutral-300">
        Ți-am trimis un link la <strong>{email}</strong>. Deschide-l ca să intri direct în echipa {orgName}.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-6 text-sm text-neutral-300">
        Ai fost invitat(ă) în echipa <strong className="text-white">{orgName}</strong>, ca{" "}
        <strong className="text-white">{ROLE_LABELS[role] ?? role}</strong>
        {department ? ` — ${department}` : ""}.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          required
          placeholder="Numele tău"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-neutral-500 outline-none focus:border-white/30"
        />
        <input
          type="email"
          required
          readOnly={!!presetEmail}
          placeholder="email@exemplu.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-neutral-500 outline-none focus:border-white/30 read-only:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-lg bg-white px-4 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {status === "sending" ? "Se trimite..." : "Acceptă invitația"}
        </button>
        {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}
      </form>
    </div>
  );
}
