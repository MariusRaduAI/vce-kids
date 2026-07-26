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
  Compass,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { NAV_ITEMS, ADMIN_NAV_ITEMS, PLATFORM_NAV_ITEMS, type NavItem } from "@/lib/nav";

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
  compass: Compass,
  globe: Globe,
};

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const Icon = ICONS[item.icon] ?? Home;
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const isSoon = item.status === "soon";

  const content = (
    <span
      className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
        isActive
          ? "bg-primary text-primary-foreground shadow-[0_3px_0_0_var(--color-border)]"
          : isSoon
            ? "text-muted-foreground/50"
            : "text-foreground/70 hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon size={17} strokeWidth={2.25} className="shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {isSoon && <Lock size={13} className="shrink-0 text-muted-foreground/40" />}
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
  isPlatformAdmin,
}: {
  orgName: string;
  isOrgAdmin: boolean;
  isPlatformAdmin: boolean;
}) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r-4 border-border bg-card px-3 py-4">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 shrink-0 rotate-[-3deg] items-center justify-center rounded-2xl border-[3px] border-border bg-gradient-to-br from-primary to-secondary text-sm font-extrabold text-primary-foreground shadow-[0_3px_0_0_var(--color-border)]">
          VK
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold text-foreground">VCE Kids</p>
          <p className="truncate text-xs font-medium text-muted-foreground">{orgName}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {isOrgAdmin && (
          <>
            <div className="mt-4 mb-1 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
              Administrare
            </div>
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </>
        )}

        {isPlatformAdmin && (
          <>
            <div className="mt-4 mb-1 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
              VCE — rețea
            </div>
            {PLATFORM_NAV_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
