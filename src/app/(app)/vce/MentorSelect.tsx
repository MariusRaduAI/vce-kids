"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function MentorSelect({
  orgId,
  currentMentorId,
  options,
}: {
  orgId: string;
  currentMentorId: string | null;
  options: { id: string; name: string }[];
}) {
  const [value, setValue] = useState(currentMentorId ?? "");
  const [saving, setSaving] = useState(false);

  async function handleChange(newValue: string) {
    setValue(newValue);
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("organizations")
      .update({ mentor_org_id: newValue || null })
      .eq("id", orgId);
    setSaving(false);
  }

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border-2 border-border bg-background px-2 py-1 text-xs font-semibold text-foreground outline-none disabled:opacity-50"
    >
      <option value="">(fără mentor)</option>
      {options
        .filter((o) => o.id !== orgId)
        .map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
    </select>
  );
}
