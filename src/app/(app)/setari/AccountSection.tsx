"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AccountSection({
  userId,
  email,
  fullName: initialFullName,
}: {
  userId: string;
  email: string;
  fullName: string;
}) {
  const [fullName, setFullName] = useState(initialFullName);
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    setNameSaved(false);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", userId);
    setSavingName(false);
    if (!error) setNameSaved(true);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);

    if (password.length < 8) {
      setPasswordError("Parola trebuie să aibă cel puțin 8 caractere.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Parolele nu coincid.");
      return;
    }

    setSavingPassword(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setPasswordSaved(true);
  }

  return (
    <section>
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
        Contul meu
      </h2>

      <div className="space-y-4 rounded-2xl border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/5">
        <form onSubmit={handleSaveName} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs text-neutral-500">Nume complet</label>
            <input
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setNameSaved(false);
              }}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/30"
            />
          </div>
          <button
            type="submit"
            disabled={savingName}
            className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            {savingName ? "Se salvează..." : nameSaved ? "Salvat ✓" : "Salvează"}
          </button>
        </form>

        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Email</label>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{email}</p>
        </div>
      </div>

      <form
        onSubmit={handleChangePassword}
        className="mt-4 grid gap-3 rounded-2xl border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/5 sm:grid-cols-2"
      >
        <p className="text-sm font-medium text-neutral-900 dark:text-white sm:col-span-2">
          Schimbă parola
        </p>
        <input
          type="password"
          placeholder="Parolă nouă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white/30"
        />
        <input
          type="password"
          placeholder="Confirmă parola"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white/30"
        />
        <button
          type="submit"
          disabled={savingPassword || !password}
          className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-black/5 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-black/10 disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 sm:col-span-2"
        >
          {passwordSaved && <Check size={14} />}
          {savingPassword ? "Se salvează..." : passwordSaved ? "Parolă schimbată" : "Schimbă parola"}
        </button>
        {passwordError && <p className="text-sm text-red-500 dark:text-red-400 sm:col-span-2">{passwordError}</p>}
      </form>
    </section>
  );
}
