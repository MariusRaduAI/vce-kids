import Link from "next/link";
import {
  Shield,
  Users,
  GraduationCap,
  Network,
  FolderOpen,
  PartyPopper,
  Compass,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";

type CardDef = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: "teal" | "rose" | "purple" | "orange" | "blue" | "green";
  adminOnly?: boolean;
  soon?: boolean;
};

const COLOR_CLASSES: Record<CardDef["color"], { badge: string; ring: string }> = {
  teal: { badge: "bg-teal-500 text-white", ring: "hover:border-teal-400" },
  rose: { badge: "bg-rose-500 text-white", ring: "hover:border-rose-400" },
  purple: { badge: "bg-purple-500 text-white", ring: "hover:border-purple-400" },
  orange: { badge: "bg-orange-500 text-white", ring: "hover:border-orange-400" },
  blue: { badge: "bg-blue-500 text-white", ring: "hover:border-blue-400" },
  green: { badge: "bg-emerald-500 text-white", ring: "hover:border-emerald-400" },
};

const CARDS: CardDef[] = [
  {
    href: "/induction",
    title: "Induction",
    description: "Viziunea, rolurile și programul SIM — tot ce trebuie să știi ca să slujești.",
    icon: GraduationCap,
    color: "purple",
  },
  {
    href: "/proceduri",
    title: "Proceduri & Siguranță",
    description: "Proceduri oficiale pentru urgențe, siguranța copiilor și bune practici.",
    icon: Shield,
    color: "rose",
  },
  {
    href: "/organigrama",
    title: "Organigramă",
    description: "Echipa de coordonare și responsabilii de departamente.",
    icon: Network,
    color: "blue",
  },
  {
    href: "/resurse",
    title: "Resurse",
    description: "Jocuri, craft-uri, ghiduri și cărți recomandate.",
    icon: FolderOpen,
    color: "teal",
  },
  {
    href: "/evenimente",
    title: "Evenimente",
    description: "Tabere, întâlniri de echipă și ce urmează.",
    icon: PartyPopper,
    color: "orange",
  },
  {
    href: "/coordonare",
    title: "Coordonare",
    description: "Obiective, prezență și status-ul lucrării — cu pastorul.",
    icon: Compass,
    color: "green",
    adminOnly: true,
  },
  {
    href: "/echipa",
    title: "Echipă & Invitații",
    description: "Invită oameni noi și vezi cine face parte din echipă.",
    icon: Users,
    color: "purple",
    adminOnly: true,
  },
];

export default async function DashboardPage() {
  const { profile, memberships } = await getCurrentUser();
  const current = memberships[0];
  const isOrgAdmin = current.role === "org_admin";

  const visibleCards = CARDS.filter((c) => !c.adminOnly || isOrgAdmin);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl font-extrabold text-foreground">
        Bine ai venit, {profile?.full_name?.split(" ")[0] ?? ""} 👋
      </h1>
      <p className="mt-1.5 font-medium text-muted-foreground">
        {current.organization?.name} ·{" "}
        {current.role === "org_admin" ? "Admin biserică" : current.role === "leader" ? "Lider echipă" : "Voluntar"}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {visibleCards.map((card) => {
          const Icon = card.icon;
          const colors = COLOR_CLASSES[card.color];
          return (
            <Link
              key={card.href}
              href={card.href}
              className={`group rounded-[24px] border-[3px] border-border bg-card p-5 shadow-[0_4px_0_0_var(--color-border)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-border)] ${colors.ring}`}
            >
              <div
                className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] border-border ${colors.badge}`}
              >
                <Icon size={20} />
              </div>
              <p className="font-display font-bold text-foreground">{card.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
            </Link>
          );
        })}

        <div className="rounded-[24px] border-[3px] border-dashed border-border/60 bg-transparent p-5 opacity-60">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] border-border bg-muted text-muted-foreground">
            <Lock size={18} />
          </div>
          <p className="font-display font-bold text-foreground">Teachers Hub, Pray Wall, Feedback...</p>
          <p className="mt-1 text-sm text-muted-foreground">Urmează în curând.</p>
        </div>
      </div>
    </div>
  );
}
