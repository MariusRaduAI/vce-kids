export const ACCENT_PALETTE = [
  { badge: "bg-teal-500", ring: "hover:border-teal-400", text: "text-teal-600 dark:text-teal-400" },
  { badge: "bg-rose-500", ring: "hover:border-rose-400", text: "text-rose-600 dark:text-rose-400" },
  { badge: "bg-purple-500", ring: "hover:border-purple-400", text: "text-purple-600 dark:text-purple-400" },
  { badge: "bg-orange-500", ring: "hover:border-orange-400", text: "text-orange-600 dark:text-orange-400" },
  { badge: "bg-blue-500", ring: "hover:border-blue-400", text: "text-blue-600 dark:text-blue-400" },
  { badge: "bg-emerald-500", ring: "hover:border-emerald-400", text: "text-emerald-600 dark:text-emerald-400" },
  { badge: "bg-pink-500", ring: "hover:border-pink-400", text: "text-pink-600 dark:text-pink-400" },
  { badge: "bg-amber-500", ring: "hover:border-amber-400", text: "text-amber-600 dark:text-amber-400" },
] as const;

// Culoare stabilă per element (nu se schimbă la fiecare re-render), pe baza unui id/text.
export function accentFor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return ACCENT_PALETTE[hash % ACCENT_PALETTE.length];
}
