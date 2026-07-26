"use client";

import { useMemo, useState } from "react";
import { Plus, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type Record_ = Tables<"attendance_records">;

export function AttendanceSection({
  orgId,
  ageGroups,
  initialRecords,
}: {
  orgId: string;
  ageGroups: string[];
  initialRecords: Record_[];
}) {
  const [records, setRecords] = useState(initialRecords);
  const [showForm, setShowForm] = useState(false);
  const [recordDate, setRecordDate] = useState("");
  const [ageGroup, setAgeGroup] = useState(ageGroups[0] ?? "");
  const [memberCount, setMemberCount] = useState("");
  const [nonMemberCount, setNonMemberCount] = useState("");
  const [saving, setSaving] = useState(false);

  const last6MonthsTotal = useMemo(() => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 6);
    return records
      .filter((r) => new Date(r.record_date) >= cutoff)
      .reduce((sum, r) => sum + r.member_count + r.non_member_count, 0);
  }, [records]);

  async function refresh() {
    const supabase = createClient();
    const { data } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("org_id", orgId)
      .order("record_date", { ascending: false })
      .limit(30);
    setRecords(data ?? []);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("attendance_records").insert({
      org_id: orgId,
      record_date: recordDate,
      age_group: ageGroup,
      member_count: Number(memberCount) || 0,
      non_member_count: Number(nonMemberCount) || 0,
    });
    setSaving(false);
    setRecordDate("");
    setMemberCount("");
    setNonMemberCount("");
    setShowForm(false);
    refresh();
  }

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp size={16} className="text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Prezență (ultimele 6 luni: {last6MonthsTotal} copii-prezențe)
        </h2>
      </div>

      <div className="rounded-[20px] border-[3px] border-border bg-card p-5">
        {records.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground">Nicio înregistrare de prezență încă.</p>
        )}

        <div className="space-y-1.5">
          {records.slice(0, 8).map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-xl border-2 border-border bg-background px-3 py-2 text-sm"
            >
              <span className="font-semibold text-foreground">
                {new Date(r.record_date).toLocaleDateString("ro-RO")} · {r.age_group}
              </span>
              <span className="text-muted-foreground">
                {r.member_count} membri + {r.non_member_count} non-membri
              </span>
            </div>
          ))}
        </div>

        {showForm ? (
          <form onSubmit={handleAdd} className="mt-3 grid gap-2 sm:grid-cols-4">
            <input
              type="date"
              required
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
              className="rounded-xl border-2 border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
            <input
              placeholder="Grupă"
              required
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="rounded-xl border-2 border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
            <input
              type="number"
              min={0}
              placeholder="Membri"
              value={memberCount}
              onChange={(e) => setMemberCount(e.target.value)}
              className="rounded-xl border-2 border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
            <input
              type="number"
              min={0}
              placeholder="Non-membri"
              value={nonMemberCount}
              onChange={(e) => setNonMemberCount(e.target.value)}
              className="rounded-xl border-2 border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50 sm:col-span-4"
            >
              Salvează
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            <Plus size={14} /> Adaugă prezență
          </button>
        )}
      </div>
    </section>
  );
}
