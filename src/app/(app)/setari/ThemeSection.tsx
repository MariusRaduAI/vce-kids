"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const OPTIONS = [
  { value: "light", label: "Luminos", icon: Sun },
  { value: "dark", label: "Întunecat", icon: Moon },
  { value: "system", label: "Automat", icon: Monitor },
] as const;

export function ThemeSection() {
  const { theme, setTheme } = useTheme();

  return (
    <section>
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
        Aspect
      </h2>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="mb-3 text-sm text-neutral-400">
          Bara laterală și antetul se adaptează. Zona de conținut rămâne întunecată pentru lizibilitate — urmează în curând complet pentru toate paginile.
        </p>
        <div className="flex gap-2">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm transition ${
                  isActive
                    ? "bg-white text-black"
                    : "bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                <Icon size={15} /> {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
