"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: false, // fără invitație nu-ți poți crea cont
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(
        "Nu găsim un cont cu acest email. Dacă ești nou în echipă, ai nevoie de o invitație de la liderul tău."
      );
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-neutral-300">
        Ți-am trimis un link de acces la <strong>{email}</strong>. Deschide-l de pe telefonul/laptopul pe care vrei să rămâi logat.
      </p>
    );
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
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-white px-4 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
      >
        {status === "sending" ? "Se trimite..." : "Trimite-mi link de acces"}
      </button>
      {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}
    </form>
  );
}
