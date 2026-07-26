"use client";

import { useState } from "react";
import { CalendarDays, MapPin, Pencil, Trash2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type EventRow = Tables<"events">;

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function EventForm({
  orgId,
  existing,
  onDone,
}: {
  orgId: string;
  existing?: EventRow;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [startAt, setStartAt] = useState(
    existing ? toDatetimeLocal(existing.start_at) : ""
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    const payload = {
      org_id: orgId,
      title,
      description: description || null,
      location: location || null,
      start_at: new Date(startAt).toISOString(),
    };

    const { error } = existing
      ? await supabase.from("events").update(payload).eq("id", existing.id)
      : await supabase.from("events").insert(payload);

    setSaving(false);
    if (!error) onDone();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2"
    >
      <input
        required
        placeholder="Titlu eveniment"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-white/30 sm:col-span-2"
      />
      <input
        required
        type="datetime-local"
        value={startAt}
        onChange={(e) => setStartAt(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
      />
      <input
        placeholder="Locație (opțional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-white/30"
      />
      <textarea
        placeholder="Descriere (opțional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-white/30 sm:col-span-2"
      />
      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {saving ? "Se salvează..." : existing ? "Salvează modificările" : "Adaugă eveniment"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg px-4 py-2 text-sm text-neutral-400 hover:text-white"
        >
          Renunță
        </button>
      </div>
    </form>
  );
}

export function EventsManager({
  orgId,
  isOrgAdmin,
  initialEvents,
}: {
  orgId: string;
  isOrgAdmin: boolean;
  initialEvents: EventRow[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function refresh() {
    const supabase = createClient();
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("org_id", orgId)
      .order("start_at");
    setEvents(data ?? []);
    setShowCreate(false);
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Ștergi acest eveniment?")) return;
    const supabase = createClient();
    await supabase.from("events").delete().eq("id", id);
    refresh();
  }

  return (
    <div>
      {isOrgAdmin && (
        <div className="mb-6">
          {showCreate ? (
            <EventForm orgId={orgId} onDone={refresh} />
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              <Plus size={15} /> Adaugă eveniment
            </button>
          )}
        </div>
      )}

      {events.length === 0 ? (
        <p className="text-sm text-neutral-500">Niciun eveniment programat.</p>
      ) : (
        <div className="space-y-3">
          {events.map((ev) =>
            editingId === ev.id ? (
              <EventForm key={ev.id} orgId={orgId} existing={ev} onDone={refresh} />
            ) : (
              <div
                key={ev.id}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-1 flex-col gap-1">
                  <p className="font-medium text-white">{ev.title}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={13} />
                      {new Date(ev.start_at).toLocaleDateString("ro-RO", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {ev.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} /> {ev.location}
                      </span>
                    )}
                  </div>
                  {ev.description && (
                    <p className="mt-1 text-sm text-neutral-400">{ev.description}</p>
                  )}
                </div>
                {isOrgAdmin && (
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => setEditingId(ev.id)}
                      className="rounded-lg p-2 text-neutral-500 hover:bg-white/10 hover:text-white"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(ev.id)}
                      className="rounded-lg p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
