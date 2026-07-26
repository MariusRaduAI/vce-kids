"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  GraduationCap,
  Shield,
  Network,
  CalendarCheck,
  FolderOpen,
  BookOpen,
  BookMarked,
  PartyPopper,
  Heart,
  MessageSquare,
  Sparkles,
  Users,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { NAV_ITEMS, ADMIN_NAV_ITEMS, type NavItem } from "@/lib/nav";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  "graduation-cap": GraduationCap,
  shield: Shield,
  sitemap: Network,
  "calendar-check": CalendarCheck,
  folder: FolderOpen,
  "book-open": BookOpen,
  book: BookMarked,
  party: PartyPopper,
  heart: Heart,
  message: MessageSquare,
  sparkles: Sparkles,
  users: Users,
};

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const Icon = ICONS[item.icon] ?? Home;
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const isSoon = item.status === "soon";

  const content = (
    <span
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        isActive
          ? "bg-black/5 text-neutral-900 dark:bg-white/10 dark:text-white"
          : isSoon
            ? "text-neutral-400 dark:text-neutral-600"
            : "text-neutral-600 hover:bg-black/5 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white"
      }`}
    >
      <Icon size={17} strokeWidth={2} className="shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {isSoon && <Lock size={13} className="shrink-0 text-neutral-400 dark:text-neutral-700" />}
    </span>
  );

  if (isSoon) {
    return <div className="cursor-not-allowed">{content}</div>;
  }

  return <Link href={item.href}>{content}</Link>;
}

export function Sidebar({
  orgName,
  isOrgAdmin,
}: {
  orgName: string;
  isOrgAdmin: boolean;
}) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-black/10 bg-white px-3 py-4 dark:border-white/10 dark:bg-neutral-950">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-sm font-bold text-black">
          VK
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">VCE Kids</p>
          <p className="truncate text-xs text-neutral-500">{orgName}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {isOrgAdmin && (
          <>
            <div className="mt-4 mb-1 px-3 text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
              Administrare
            </div>
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
