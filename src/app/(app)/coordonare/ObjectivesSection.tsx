"use client";

import { useState } from "react";
import { Plus, Target, CheckCircle2, XCircle, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type Objective = Tables<"org_objectives">;

const STATUS_META: Record<Objective["status"], { label: string; icon: typeof Circle; color: string }> = {
  in_progress: { label: "În lucru", icon: Circle, color: "text-accent" },
  achieved: { label: "Atins", icon: CheckCircle2, color: "text-success" },
  missed: { label: "Ratat", icon: XCircle, color: "text-destructive" },
};

export function ObjectivesSection({
  orgId,
  initialObjectives,
}: {
  orgId: string;
  initialObjectives: Objective[];
}) {
  const [objectives, setObjectives] = useState(initialObjectives);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const supabase = createClient();
    const { data } = await supabase
      .from("org_objectives")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });
    setObjectives(data ?? []);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("org_objectives").insert({
      org_id: orgId,
      title,
      target_date: targetDate || null,
    });
    setSaving(false);
    setTitle("");
    setTargetDate("");
    setShowForm(false);
    refresh();
  }

  async function handleStatus(id: string, status: Objective["status"]) {
    const supabase = createClient();
    await supabase.from("org_objectives").update({ status }).eq("id", id);
    refresh();
  }

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Target size={16} className="text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Obiective pe termen scurt
        </h2>
      </div>

      <div className="rounded-[20px] border-[3px] border-border bg-card p-5">
        {objectives.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground">Niciun obiectiv setat încă.</p>
        )}

        <div className="space-y-2">
          {objectives.map((obj) => {
            const meta = STATUS_META[obj.status];
            const Icon = meta.icon;
            return (
              <div
                key={obj.id}
                className="flex items-center gap-3 rounded-2xl border-2 border-border bg-background px-4 py-3"
              >
                <Icon size={18} className={`shrink-0 ${meta.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{obj.title}</p>
                  {obj.target_date && (
                    <p className="text-xs text-muted-foreground">
                      Termen: {new Date(obj.target_date).toLocaleDateString("ro-RO")}
                    </p>
                  )}
                </div>
                <select
                  value={obj.status}
                  onChange={(e) => handleStatus(obj.id, e.target.value as Objective["status"])}
                  className="rounded-lg border-2 border-border bg-card px-2 py-1 text-xs font-semibold text-foreground outline-none"
                >
                  <option value="in_progress">În lucru</option>
                  <option value="achieved">Atins</option>
                  <option value="missed">Ratat</option>
                </select>
              </div>
            );
          })}
        </div>

        {showForm ? (
          <form onSubmit={handleAdd} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              required
              placeholder="Obiectiv nou"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 rounded-xl border-2 border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="rounded-xl border-2 border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              Adaugă
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            <Plus size={14} /> Obiectiv nou
          </button>
        )}
      </div>
    </section>
  );
}
