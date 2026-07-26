// Paletă de gradiente vii, stil "Apple pentru copii" — colorate, dar clean.
// Fiecare gradient rămâne în aceeași familie de nuanțe (nu combinații gen violet→cyan).
// Fiecare element primește o culoare stabilă (nu se schimbă la re-render).

export const ACCENT_PALETTE = [
  { grad: "from-orange-400 to-rose-500", text: "text-orange-600 dark:text-orange-400", glow: "group-hover:shadow-orange-500/40" },
  { grad: "from-emerald-400 to-teal-600", text: "text-emerald-600 dark:text-emerald-400", glow: "group-hover:shadow-emerald-500/40" },
  { grad: "from-sky-400 to-blue-600", text: "text-sky-600 dark:text-sky-400", glow: "group-hover:shadow-sky-500/40" },
  { grad: "from-yellow-400 to-amber-500", text: "text-amber-600 dark:text-amber-400", glow: "group-hover:shadow-amber-500/40" },
  { grad: "from-fuchsia-500 to-pink-600", text: "text-fuchsia-600 dark:text-fuchsia-400", glow: "group-hover:shadow-fuchsia-500/40" },
  { grad: "from-lime-400 to-green-600", text: "text-green-600 dark:text-green-400", glow: "group-hover:shadow-green-500/40" },
  { grad: "from-red-400 to-rose-600", text: "text-red-600 dark:text-red-400", glow: "group-hover:shadow-red-500/40" },
  { grad: "from-cyan-400 to-sky-600", text: "text-cyan-600 dark:text-cyan-400", glow: "group-hover:shadow-cyan-500/40" },
  { grad: "from-amber-400 to-orange-600", text: "text-orange-600 dark:text-orange-400", glow: "group-hover:shadow-amber-500/40" },
  { grad: "from-teal-400 to-emerald-600", text: "text-teal-600 dark:text-teal-400", glow: "group-hover:shadow-teal-500/40" },
] as const;

export function accentFor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return ACCENT_PALETTE[hash % ACCENT_PALETTE.length];
}
