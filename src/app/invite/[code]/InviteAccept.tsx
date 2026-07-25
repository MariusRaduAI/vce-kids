"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [email, setEmail] = useState(presetEmail ?? "");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMsg("Parolele nu coincid.");
      return;
    }

    setStatus("sending");

    const res = await fetch("/api/invites/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, fullName, email, password }),
    });
    const body = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(body.error ?? "A apărut o eroare.");
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setStatus("error");
      setErrorMsg("Contul a fost creat, dar autentificarea a eșuat. Intră manual din /login.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <p className="mb-6 text-sm text-neutral-300">
        Ai fost invitat(ă) în echipa <strong className="text-white">{orgName}</strong>, ca{" "}
        <strong className="text-white">{ROLE_LABELS[role] ?? role}</strong>
        {department ? ` — ${department}` : ""}. Alege-ți o parolă ca să intri oricând.
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
        <input
          type="password"
          required
          minLength={8}
          placeholder="Parolă (minim 8 caractere)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-neutral-500 outline-none focus:border-white/30"
        />
        <input
          type="password"
          required
          placeholder="Confirmă parola"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-neutral-500 outline-none focus:border-white/30"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-lg bg-white px-4 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {status === "sending" ? "Se creează contul..." : "Acceptă invitația și creează cont"}
        </button>
        {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}
      </form>
    </div>
  );
}
