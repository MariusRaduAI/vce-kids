"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Calendar, Users2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { accentFor } from "@/lib/colors";
import type { Tables } from "@/lib/supabase/types";

type Session = Tables<"sim_sessions">;
type Slot = Tables<"sim_slots">;
type MemberOption = { membershipId: string; name: string };

function SlotRow({
  slot,
  isOrgAdmin,
  memberName,
  isFirst,
  isLast,
  onMove,
  onDelete,
}: {
  slot: Slot;
  isOrgAdmin: boolean;
  memberName: string | null;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: "up" | "down") => void;
  onDelete: () => void;
}) {
  const accent = accentFor(slot.id);
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted px-3 py-2.5">
      <div className={`h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br ${accent.grad}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">{slot.department}</p>
        {(memberName || slot.notes) && (
          <p className="text-xs text-muted-foreground">
            {memberName}
            {memberName && slot.notes ? " · " : ""}
            {slot.notes}
          </p>
        )}
      </div>
      {isOrgAdmin && (
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            disabled={isFirst}
            onClick={() => onMove("up")}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
          >
            <ArrowUp size={13} />
          </button>
          <button
            disabled={isLast}
            onClick={() => onMove("down")}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
          >
            <ArrowDown size={13} />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

function AddSlotForm({
  sessionId,
  nextOrder,
  members,
  onDone,
}: {
  sessionId: string;
  nextOrder: number;
  members: MemberOption[];
  onDone: () => void;
}) {
  const [department, setDepartment] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("sim_slots").insert({
      sim_session_id: sessionId,
      department,
      assigned_membership_id: membershipId || null,
      notes: notes || null,
      sort_order: nextOrder,
    });
    setSaving(false);
    setDepartment("");
    setMembershipId("");
    setNotes("");
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 grid gap-2 sm:grid-cols-4">
      <input
        required
        placeholder="Activitate (ex: Închinare)"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="rounded-lg bg-muted px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-2 focus:ring-primary"
      />
      <select
        value={membershipId}
        onChange={(e) => setMembershipId(e.target.value)}
        className="rounded-lg bg-muted px-2.5 py-1.5 text-sm text-foreground outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-2 focus:ring-primary"
      >
        <option value="">(responsabil)</option>
        {members.map((m) => (
          <option key={m.membershipId} value={m.membershipId}>
            {m.name}
          </option>
        ))}
      </select>
      <input
        placeholder="Notă (opțional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="rounded-lg bg-muted px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-white shadow-sm shadow-primary/25 transition-all hover:shadow-md disabled:opacity-50"
      >
        Adaugă
      </button>
    </form>
  );
}

function SessionCard({
  session,
  slots,
  isOrgAdmin,
  members,
  refresh,
}: {
  session: Session;
  slots: Slot[];
  isOrgAdmin: boolean;
  members: MemberOption[];
  refresh: () => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const sorted = [...slots].sort((a, b) => a.sort_order - b.sort_order);

  async function handleMove(slot: Slot, direction: "up" | "down") {
    const idx = sorted.findIndex((s) => s.id === slot.id);
    const swapWith = direction === "up" ? sorted[idx - 1] : sorted[idx + 1];
    if (!swapWith) return;
    const supabase = createClient();
    await Promise.all([
      supabase.from("sim_slots").update({ sort_order: swapWith.sort_order }).eq("id", slot.id),
      supabase.from("sim_slots").update({ sort_order: slot.sort_order }).eq("id", swapWith.id),
    ]);
    refresh();
  }

  async function handleDelete(slotId: string) {
    const supabase = createClient();
    await supabase.from("sim_slots").delete().eq("id", slotId);
    refresh();
  }

  return (
    <div className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border/60">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-sm">
          <Calendar size={18} />
        </div>
        <div>
          <p className="font-display font-bold text-foreground">
            {new Date(session.service_date).toLocaleDateString("ro-RO", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          {session.theme && <p className="text-xs text-muted-foreground">{session.theme}</p>}
        </div>
      </div>

      <div className="space-y-2">
        {sorted.map((slot, i) => (
          <SlotRow
            key={slot.id}
            slot={slot}
            isOrgAdmin={isOrgAdmin}
            memberName={members.find((m) => m.membershipId === slot.assigned_membership_id)?.name ?? null}
            isFirst={i === 0}
            isLast={i === sorted.length - 1}
            onMove={(dir) => handleMove(slot, dir)}
            onDelete={() => handleDelete(slot.id)}
          />
        ))}
      </div>

      {isOrgAdmin &&
        (showAdd ? (
          <AddSlotForm
            sessionId={session.id}
            nextOrder={sorted.length}
            members={members}
            onDone={() => {
              setShowAdd(false);
              refresh();
            }}
          />
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            <Plus size={14} /> Adaugă activitate
          </button>
        ))}
    </div>
  );
}

export function SimManager({
  orgId,
  isOrgAdmin,
  initialSessions,
  initialSlots,
  members,
}: {
  orgId: string;
  isOrgAdmin: boolean;
  initialSessions: Session[];
  initialSlots: Slot[];
  members: MemberOption[];
}) {
  const [sessions, setSessions] = useState(initialSessions);
  const [slots, setSlots] = useState(initialSlots);
  const [showNewSession, setShowNewSession] = useState(false);
  const [serviceDate, setServiceDate] = useState("");
  const [theme, setTheme] = useState("");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const supabase = createClient();
    const { data: s } = await supabase
      .from("sim_sessions")
      .select("*")
      .eq("org_id", orgId)
      .order("service_date", { ascending: false });
    setSessions(s ?? []);

    const sessionIds = (s ?? []).map((session) => session.id);
    if (sessionIds.length === 0) {
      setSlots([]);
      return;
    }
    const { data: sl } = await supabase.from("sim_slots").select("*").in("sim_session_id", sessionIds);
    setSlots(sl ?? []);
  }

  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("sim_sessions").insert({
      org_id: orgId,
      service_date: serviceDate,
      theme: theme || null,
    });
    setSaving(false);
    setServiceDate("");
    setTheme("");
    setShowNewSession(false);
    refresh();
  }

  return (
    <div>
      {isOrgAdmin && (
        <div className="mb-6">
          {showNewSession ? (
            <form
              onSubmit={handleCreateSession}
              className="grid gap-3 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60 sm:grid-cols-3"
            >
              <input
                type="date"
                required
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-2 focus:ring-primary"
              />
              <input
                placeholder="Temă (opțional)"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/25 transition-all hover:shadow-lg disabled:opacity-50"
              >
                Creează duminica
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowNewSession(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-md"
            >
              <Plus size={15} /> Duminică nouă
            </button>
          )}
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-muted/60 py-14 text-center">
          <Users2 size={28} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Niciun program SIM configurat încă.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              slots={slots.filter((s) => s.sim_session_id === session.id)}
              isOrgAdmin={isOrgAdmin}
              members={members}
              refresh={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
