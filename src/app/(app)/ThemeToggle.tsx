"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const OPTIONS = [
  { value: "light", icon: Sun, label: "Luminos" },
  { value: "dark", icon: Moon, label: "Întunecat" },
  { value: "system", icon: Monitor, label: "Automat" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 rounded-xl bg-muted p-1">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            title={opt.label}
            className={`rounded-lg p-1.5 transition-all duration-200 ${
              isActive
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}
