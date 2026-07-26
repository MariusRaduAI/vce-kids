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
        className="rounded-2xl border-[3px] border-border bg-background px-4 py-3 font-medium text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary"
      />
      <input
        type="password"
        required
        placeholder="Parolă"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-2xl border-[3px] border-border bg-background px-4 py-3 font-medium text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-2xl border-[3px] border-border bg-primary px-4 py-3 font-display font-bold text-primary-foreground shadow-[0_4px_0_0_var(--color-border)] transition active:translate-y-1 active:shadow-none disabled:opacity-50"
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
