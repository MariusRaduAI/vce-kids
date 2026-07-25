"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setErrorMsg(
        error.status === 400
          ? "Email sau parolă greșite."
          : `Eroare neașteptată: ${error.message}`
      );
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        placeholder="email@exemplu.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-neutral-500 outline-none focus:border-white/30"
      />
      <input
        type="password"
        required
        placeholder="Parolă"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-neutral-500 outline-none focus:border-white/30"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-white px-4 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
      >
        {status === "sending" ? "Se conectează..." : "Intră în cont"}
      </button>
      {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}
      <p className="text-center text-xs text-neutral-600">
        Nu ai cont? Ai nevoie de o invitație de la liderul tău.
      </p>
    </form>
  );
}
