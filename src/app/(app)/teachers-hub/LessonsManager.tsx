"use client";

import { useMemo, useState } from "react";
import { Plus, Download, Trash2, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { accentFor } from "@/lib/colors";
import type { Tables } from "@/lib/supabase/types";

type Lesson = Tables<"curriculum_lessons">;

const AGE_GROUPS = ["2-3", "4-6", "7-9", "10-12"];

function LessonForm({
  orgId,
  ageGroup,
  onDone,
}: {
  orgId: string;
  ageGroup: string;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [weekStartDate, setWeekStartDate] = useState("");
  const [materialsUrl, setMaterialsUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("curriculum_lessons").insert({
      org_id: orgId,
      age_group: ageGroup,
      week_start_date: weekStartDate,
      title,
      materials_url: materialsUrl || null,
    });
    setSaving(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 grid gap-2 sm:grid-cols-4">
      <input
        type="date"
        required
        value={weekStartDate}
        onChange={(e) => setWeekStartDate(e.target.value)}
        className="rounded-lg bg-muted px-2.5 py-1.5 text-sm text-foreground outline-none ring-1 ring-transparent transition-all focus:bg-card focus:ring-2 focus:ring-primary"
      />
      <input
        required
        placeholder="Titlu lecție"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-lg bg-muted px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all focus:bg-card focus:ring-2 focus:ring-primary"
      />
      <input
        placeholder="Link materiale (opțional)"
        value={materialsUrl}
        onChange={(e) => setMaterialsUrl(e.target.value)}
        className="rounded-lg bg-muted px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all focus:bg-card focus:ring-2 focus:ring-primary"
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

export function LessonsManager({
  orgId,
  isOrgAdmin,
  initialLessons,
}: {
  orgId: string;
  isOrgAdmin: boolean;
  initialLessons: Lesson[];
}) {
  const [lessons, setLessons] = useState(initialLessons);
  const [activeGroup, setActiveGroup] = useState(AGE_GROUPS[0]);
  const [addingFor, setAddingFor] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, Lesson[]>();
    for (const l of lessons) {
      map.set(l.age_group, [...(map.get(l.age_group) ?? []), l]);
    }
    return map;
  }, [lessons]);

  async function refresh() {
    const supabase = createClient();
    const { data } = await supabase
      .from("curriculum_lessons")
      .select("*")
      .or(`org_id.is.null,org_id.eq.${orgId}`)
      .order("week_start_date", { ascending: false });
    setLessons(data ?? []);
    setAddingFor(null);
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("curriculum_lessons").delete().eq("id", id);
    refresh();
  }

  const activeLessons = (grouped.get(activeGroup) ?? []).sort(
    (a, b) => new Date(b.week_start_date).getTime() - new Date(a.week_start_date).getTime()
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2 rounded-2xl bg-muted p-1.5">
        {AGE_GROUPS.map((g) => {
          const accent = accentFor(g);
          const isActive = activeGroup === g;
          return (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-r text-white shadow-sm ${accent.grad}`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {g} ani
            </button>
          );
        })}
      </div>

      {activeLessons.length === 0 && addingFor !== activeGroup ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-muted/60 py-12 text-center">
          <BookOpen size={26} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Nicio lecție pentru grupa {activeGroup} încă.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {activeLessons.map((lesson) => {
            const accent = accentFor(lesson.id);
            return (
              <div
                key={lesson.id}
                className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60 transition-shadow duration-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground">
                      {new Date(lesson.week_start_date).toLocaleDateString("ro-RO", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="mt-0.5 font-display font-bold text-foreground">{lesson.title}</p>
                  </div>
                  {isOrgAdmin && lesson.org_id && (
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                {lesson.materials_url && (
                  <a
                    href={lesson.materials_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-transform duration-200 hover:scale-105 ${accent.grad}`}
                  >
                    <Download size={12} /> Materiale
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isOrgAdmin &&
        (addingFor === activeGroup ? (
          <LessonForm orgId={orgId} ageGroup={activeGroup} onDone={refresh} />
        ) : (
          <button
            onClick={() => setAddingFor(activeGroup)}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            <Plus size={14} /> Adaugă lecție la {activeGroup}
          </button>
        ))}
    </div>
  );
}
