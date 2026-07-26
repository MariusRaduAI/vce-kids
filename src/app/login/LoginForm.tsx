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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <input
        type="email"
        required
        placeholder="email@exemplu.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-2xl bg-muted px-4 py-3.5 font-medium text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all duration-200 focus:bg-card focus:ring-2 focus:ring-primary"
      />
      <input
        type="password"
        required
        placeholder="Parolă"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-2xl bg-muted px-4 py-3.5 font-medium text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all duration-200 focus:bg-card focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 rounded-2xl bg-gradient-to-r from-orange-400 to-rose-500 px-4 py-3.5 font-display font-bold text-white shadow-md shadow-orange-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/40 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
      >
        {status === "sending" ? "Se conectează..." : "Intră în cont"}
      </button>
      {status === "error" && <p className="text-sm font-medium text-destructive">{errorMsg}</p>}
      <p className="text-center text-xs font-medium text-muted-foreground">
        Nu ai cont? Ai nevoie de o invitație de la liderul tău.
      </p>
    </form>
  );
}
