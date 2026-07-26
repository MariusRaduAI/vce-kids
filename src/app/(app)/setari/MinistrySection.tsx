"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function MinistrySection({
  orgId,
  name: initialName,
  city: initialCity,
  country: initialCountry,
  curriculumName: initialCurriculum,
  mentorName,
}: {
  orgId: string;
  name: string;
  city: string | null;
  country: string | null;
  curriculumName: string | null;
  mentorName: string | null;
}) {
  const [name, setName] = useState(initialName);
  const [city, setCity] = useState(initialCity ?? "");
  const [country, setCountry] = useState(initialCountry ?? "");
  const [curriculumName, setCurriculumName] = useState(initialCurriculum ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    const { error } = await supabase
      .from("organizations")
      .update({
        name,
        city: city || null,
        country: country || null,
        curriculum_name: curriculumName || null,
      })
      .eq("id", orgId);
    setSaving(false);
    if (!error) setSaved(true);
  }

  return (
    <section>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Lucrarea mea
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-[24px] bg-card shadow-sm ring-1 ring-border/60 p-5 sm:grid-cols-2"
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Nume biserică</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
            className="w-full rounded-xl bg-muted px-3 py-2.5 text-sm text-foreground outline-none ring-1 ring-transparent transition-all focus:bg-card focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Oraș</label>
          <input
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setSaved(false);
            }}
            className="w-full rounded-xl bg-muted px-3 py-2.5 text-sm text-foreground outline-none ring-1 ring-transparent transition-all focus:bg-card focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Țară</label>
          <input
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setSaved(false);
            }}
            className="w-full rounded-xl bg-muted px-3 py-2.5 text-sm text-foreground outline-none ring-1 ring-transparent transition-all focus:bg-card focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Curriculum folosit</label>
          <input
            placeholder="ex: În căutarea adevărului"
            value={curriculumName}
            onChange={(e) => {
              setCurriculumName(e.target.value);
              setSaved(false);
            }}
            className="w-full rounded-xl bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all focus:bg-card focus:ring-2 focus:ring-primary"
          />
        </div>

        {mentorName && (
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Biserică mentoră</label>
            <p className="text-sm font-semibold text-foreground">{mentorName}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Setată de coordonarea rețelei VCE — nu poate fi schimbată de aici.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-fit rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition disabled:opacity-50 sm:col-span-2"
        >
          {saving ? "Se salvează..." : saved ? "Salvat ✓" : "Salvează"}
        </button>
      </form>
    </section>
  );
}
