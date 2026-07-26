"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ROLES = [
  { value: "volunteer", label: "Voluntar" },
  { value: "leader", label: "Lider echipă" },
  { value: "org_admin", label: "Admin biserică" },
];

export function CreateInviteForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [role, setRole] = useState("volunteer");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("invites")
      .insert({
        org_id: orgId,
        role: role as "org_admin" | "leader" | "volunteer",
        department: department || null,
        email: email || null,
      })
      .select("code")
      .single();

    setLoading(false);
    if (!error && data) {
      setLink(`${window.location.origin}/invite/${data.code}`);
      router.refresh();
    }
  }

  return (
    <div className="rounded-[24px] border-[3px] border-border bg-card p-5">
      <h2 className="mb-4 font-display font-bold text-foreground">Invită pe cineva nou</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-xl border-2 border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Departament (opțional) — ex: recepție"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="rounded-xl border-2 border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
        />
        <input
          type="email"
          placeholder="Email (opțional — leagă invitația de un email anume)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border-2 border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary sm:col-span-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition disabled:opacity-50 sm:col-span-2"
        >
          {loading ? "Se generează..." : "Generează link de invitație"}
        </button>
      </form>

      {link && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border-2 border-border bg-background px-3 py-2.5">
          <code className="flex-1 truncate text-xs font-bold text-primary">{link}</code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
