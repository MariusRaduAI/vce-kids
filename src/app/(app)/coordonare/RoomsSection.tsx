"use client";

import { useState } from "react";
import { Plus, Home, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type Room = Tables<"org_rooms">;

export function RoomsSection({
  orgId,
  initialRooms,
}: {
  orgId: string;
  initialRooms: Room[];
}) {
  const [rooms, setRooms] = useState(initialRooms);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [capacity, setCapacity] = useState("");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const supabase = createClient();
    const { data } = await supabase.from("org_rooms").select("*").eq("org_id", orgId).order("name");
    setRooms(data ?? []);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("org_rooms").insert({
      org_id: orgId,
      name,
      age_group: ageGroup || null,
      capacity: capacity ? Number(capacity) : null,
    });
    setSaving(false);
    setName("");
    setAgeGroup("");
    setCapacity("");
    setShowForm(false);
    refresh();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("org_rooms").delete().eq("id", id);
    refresh();
  }

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Home size={16} className="text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Săli</h2>
      </div>

      <div className="rounded-[20px] border-[3px] border-border bg-card p-5">
        {rooms.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground">Nicio sală configurată încă.</p>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between rounded-xl border-2 border-border bg-background px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{room.name}</p>
                <p className="text-xs text-muted-foreground">
                  {room.age_group ?? "orice grupă"}
                  {room.capacity ? ` · max ${room.capacity}` : ""}
                </p>
              </div>
              <button
                onClick={() => handleDelete(room.id)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {showForm ? (
          <form onSubmit={handleAdd} className="mt-3 grid gap-2 sm:grid-cols-3">
            <input
              required
              placeholder="Nume sală"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-2 border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
            <input
              placeholder="Grupă (opțional)"
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="rounded-xl border-2 border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
            <input
              type="number"
              min={0}
              placeholder="Capacitate"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="rounded-xl border-2 border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50 sm:col-span-3"
            >
              Adaugă
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            <Plus size={14} /> Sală nouă
          </button>
        )}
      </div>
    </section>
  );
}
