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
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
        Lucrarea mea
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2"
      >
        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Nume biserică</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Oraș</label>
          <input
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setSaved(false);
            }}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Țară</label>
          <input
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setSaved(false);
            }}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Curriculum folosit</label>
          <input
            placeholder="ex: În căutarea adevărului"
            value={curriculumName}
            onChange={(e) => {
              setCurriculumName(e.target.value);
              setSaved(false);
            }}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-white/30"
          />
        </div>

        {mentorName && (
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs text-neutral-500">Biserică mentoră</label>
            <p className="text-sm text-neutral-300">{mentorName}</p>
            <p className="mt-0.5 text-xs text-neutral-600">
              Setată de coordonarea rețelei VCE — nu poate fi schimbată de aici.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-fit rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50 sm:col-span-2"
        >
          {saving ? "Se salvează..." : saved ? "Salvat ✓" : "Salvează"}
        </button>
      </form>
    </section>
  );
}
