"use client";

import { useState } from "react";
import { AlertTriangle, MessageSquare, Send, Clock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type FeedbackItem = Tables<"feedback_items">;

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "sugestie", label: "Sugestie" },
  { value: "incident", label: "Incident" },
];

const STATUS_META: Record<FeedbackItem["status"], { label: string; icon: typeof Clock; color: string }> = {
  new: { label: "Nou", icon: Clock, color: "text-accent" },
  reviewed: { label: "Analizat", icon: MessageSquare, color: "text-secondary" },
  resolved: { label: "Rezolvat", icon: CheckCircle2, color: "text-success" },
};

export function FeedbackForm({
  orgId,
  userId,
  initialItems,
}: {
  orgId: string;
  userId: string;
  initialItems: FeedbackItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("feedback_items")
      .insert({ org_id: orgId, user_id: userId, category, message })
      .select("*")
      .single();
    setSending(false);
    if (!error && data) {
      setItems([data, ...items]);
      setMessage("");
      setSent(true);
      setTimeout(() => setSent(false), 2500);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className={`rounded-[24px] p-6 shadow-sm ring-1 transition-shadow hover:shadow-md ${
          category === "incident" ? "bg-destructive/5 ring-destructive/30" : "bg-card ring-border/60"
        }`}
      >
        <div className="mb-4 flex items-center gap-2">
          {category === "incident" && <AlertTriangle size={16} className="text-destructive" />}
          <p className="font-display font-bold text-foreground">Transmite feedback</p>
        </div>
        <div className="mb-3 flex gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                category === c.value
                  ? c.value === "incident"
                    ? "bg-destructive text-white shadow-sm"
                    : "bg-primary text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <textarea
          required
          placeholder="Scrie mesajul tău..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full rounded-xl bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all focus:bg-card focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/25 transition-all hover:shadow-lg disabled:opacity-50"
        >
          <Send size={14} /> {sending ? "Se trimite..." : sent ? "Trimis ✓" : "Trimite"}
        </button>
      </form>

      {items.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Feedback-ul tău
          </h2>
          <div className="space-y-2">
            {items.map((item) => {
              const meta = STATUS_META[item.status];
              const Icon = meta.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-2xl bg-muted p-3"
                >
                  <Icon size={16} className={`mt-0.5 shrink-0 ${meta.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{item.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.category} · {meta.label} ·{" "}
                      {new Date(item.created_at).toLocaleDateString("ro-RO")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
