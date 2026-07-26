import Link from "next/link";
import {
  Shield,
  Users,
  GraduationCap,
  Network,
  FolderOpen,
  PartyPopper,
  Compass,
  CalendarCheck,
  BookOpen,
  Heart,
  MessageSquare,
  Sparkles,
  Globe,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";

type CardDef = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: "teal" | "coral" | "sky" | "amber" | "pink" | "green";
  adminOnly?: boolean;
  platformOnly?: boolean;
};

const COLOR_CLASSES: Record<CardDef["color"], { grad: string; glow: string }> = {
  teal: { grad: "from-emerald-400 to-teal-600", glow: "shadow-teal-500/25 group-hover:shadow-teal-500/40" },
  coral: { grad: "from-red-400 to-orange-500", glow: "shadow-orange-500/25 group-hover:shadow-orange-500/40" },
  sky: { grad: "from-sky-400 to-blue-600", glow: "shadow-blue-500/25 group-hover:shadow-blue-500/40" },
  amber: { grad: "from-yellow-400 to-amber-500", glow: "shadow-amber-500/25 group-hover:shadow-amber-500/40" },
  pink: { grad: "from-pink-400 to-rose-600", glow: "shadow-rose-500/25 group-hover:shadow-rose-500/40" },
  green: { grad: "from-lime-400 to-green-600", glow: "shadow-green-500/25 group-hover:shadow-green-500/40" },
};

const CARDS: CardDef[] = [
  {
    href: "/induction",
    title: "Induction",
    description: "Viziunea, rolurile și programul SIM — tot ce trebuie să știi ca să slujești.",
    icon: GraduationCap,
    color: "pink",
  },
  {
    href: "/proceduri",
    title: "Proceduri & Siguranță",
    description: "Proceduri oficiale pentru urgențe, siguranța copiilor și bune practici.",
    icon: Shield,
    color: "coral",
  },
  {
    href: "/organigrama",
    title: "Organigramă",
    description: "Echipa de coordonare și responsabilii de departamente.",
    icon: Network,
    color: "sky",
  },
  {
    href: "/sim",
    title: "SIM — Program duminical",
    description: "Ordinea activităților din duminica aceasta și cine e responsabil.",
    icon: CalendarCheck,
    color: "amber",
  },
  {
    href: "/resurse",
    title: "Resurse",
    description: "Jocuri, craft-uri, ghiduri și cărți recomandate.",
    icon: FolderOpen,
    color: "teal",
  },
  {
    href: "/teachers-hub",
    title: "Teachers Hub",
    description: "Programa și materialele pe grupe de vârstă.",
    icon: BookOpen,
    color: "pink",
  },
  {
    href: "/evenimente",
    title: "Evenimente",
    description: "Tabere, întâlniri de echipă și ce urmează.",
    icon: PartyPopper,
    color: "amber",
  },
  {
    href: "/pray-wall",
    title: "Pray Wall",
    description: "Lasă un motiv de rugăciune și roagă-te împreună cu echipa.",
    icon: Heart,
    color: "green",
  },
  {
    href: "/feedback",
    title: "Feedback",
    description: "Transmite observații, sugestii sau raportează un incident.",
    icon: MessageSquare,
    color: "sky",
  },
  {
    href: "/implica-te",
    title: "Implică-te",
    description: "Vrei mai mult impact? Descoperă traseul de slujire.",
    icon: Sparkles,
    color: "coral",
  },
  {
    href: "/coordonare",
    title: "Coordonare",
    description: "Obiective, prezență și status-ul lucrării — cu pastorul.",
    icon: Compass,
    color: "teal",
    adminOnly: true,
  },
  {
    href: "/echipa",
    title: "Echipă & Invitații",
    description: "Invită oameni noi și vezi cine face parte din echipă.",
    icon: Users,
    color: "amber",
    adminOnly: true,
  },
  {
    href: "/vce",
    title: "VCE — toată rețeaua",
    description: "Status pe toate lucrările de copii din rețea.",
    icon: Globe,
    color: "sky",
    platformOnly: true,
  },
];

export default async function DashboardPage() {
  const { profile, memberships } = await getCurrentUser();
  const current = memberships[0];
  const isOrgAdmin = current.role === "org_admin";
  const isPlatformAdmin = profile?.is_platform_admin ?? false;

  const visibleCards = CARDS.filter((c) => {
    if (c.platformOnly) return isPlatformAdmin;
    if (c.adminOnly) return isOrgAdmin;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
        Bine ai venit, {profile?.full_name?.split(" ")[0] ?? ""} 👋
      </h1>
      <p className="mt-2 font-medium text-muted-foreground">
        {current.organization?.name} ·{" "}
        {current.role === "org_admin" ? "Admin biserică" : current.role === "leader" ? "Lider echipă" : "Voluntar"}
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCards.map((card) => {
          const Icon = card.icon;
          const colors = COLOR_CLASSES[card.color];
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${colors.grad} ${colors.glow}`}
              >
                <Icon size={22} />
              </div>
              <p className="font-display font-bold text-foreground">{card.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
              <ArrowUpRight
                size={16}
                className="absolute right-5 top-6 text-muted-foreground/0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-muted-foreground/60"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
