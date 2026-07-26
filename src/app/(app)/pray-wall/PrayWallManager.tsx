"use client";

import { useState } from "react";
import { Heart, Send, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { accentFor } from "@/lib/colors";
import type { Tables } from "@/lib/supabase/types";

type Prayer = Tables<"prayer_requests">;

export function PrayWallManager({
  orgId,
  userId,
  initialPrayers,
  initialPrayedIds,
  authorNames,
}: {
  orgId: string;
  userId: string;
  initialPrayers: Prayer[];
  initialPrayedIds: string[];
  authorNames: Record<string, string>;
}) {
  const [prayers, setPrayers] = useState(initialPrayers);
  const [prayedIds, setPrayedIds] = useState(new Set(initialPrayedIds));
  const [prayedCounts, setPrayedCounts] = useState<Record<string, number>>({});
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [posting, setPosting] = useState(false);

  async function refresh() {
    const supabase = createClient();
    const { data } = await supabase
      .from("prayer_requests")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });
    setPrayers(data ?? []);
  }

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    const supabase = createClient();
    await supabase.from("prayer_requests").insert({
      org_id: orgId,
      user_id: userId,
      content,
      is_anonymous: anonymous,
    });
    setPosting(false);
    setContent("");
    setAnonymous(false);
    refresh();
  }

  async function handlePrayed(prayerId: string) {
    if (prayedIds.has(prayerId)) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("prayer_prayed_for")
      .insert({ prayer_request_id: prayerId, user_id: userId });
    if (!error) {
      setPrayedIds(new Set([...prayedIds, prayerId]));
      setPrayedCounts((prev) => ({ ...prev, [prayerId]: (prev[prayerId] ?? 0) + 1 }));
    }
  }

  return (
    <div>
      <form onSubmit={handlePost} className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border/60">
        <textarea
          placeholder="Scrie un motiv de rugăciune..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full rounded-xl bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-2 focus:ring-primary"
        />
        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 rounded accent-primary"
            />
            Postează anonim
          </label>
          <button
            type="submit"
            disabled={posting || !content.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/25 transition-all hover:shadow-lg disabled:opacity-50"
          >
            <Send size={14} /> Postează
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {prayers.length === 0 ? (
          <p className="text-sm text-muted-foreground sm:col-span-2">
            Niciun motiv de rugăciune încă — fii primul care scrie unul.
          </p>
        ) : (
          prayers.map((p) => {
            const accent = accentFor(p.id);
            const hasPrayed = prayedIds.has(p.id);
            const authorLabel = p.is_anonymous ? "Anonim" : authorNames[p.user_id ?? ""] ?? "Cineva";
            return (
              <div
                key={p.id}
                className="flex flex-col rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60 transition-shadow duration-200 hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br text-white ${accent.grad}`}
                  >
                    <User size={13} />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{authorLabel}</span>
                </div>
                <p className="flex-1 text-sm text-foreground">{p.content}</p>
                <button
                  onClick={() => handlePrayed(p.id)}
                  disabled={hasPrayed}
                  className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                    hasPrayed
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <Heart size={13} fill={hasPrayed ? "currentColor" : "none"} />
                  {hasPrayed ? "M-am rugat" : "Mă rog pentru asta"}
                  {prayedCounts[p.id] > 0 && (
                    <span className="text-muted-foreground">+{prayedCounts[p.id]}</span>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
