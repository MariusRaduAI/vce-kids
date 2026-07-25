import Link from "next/link";
import { Shield, Users, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";

export default async function DashboardPage() {
  const { profile, memberships } = await getCurrentUser();
  const current = memberships[0];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">
        Bine ai venit, {profile?.full_name?.split(" ")[0] ?? ""} 👋
      </h1>
      <p className="mt-1 text-neutral-400">
        {current.organization?.name} · {current.role === "org_admin" ? "Admin biserică" : current.role === "leader" ? "Lider echipă" : "Voluntar"}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/proceduri"
          className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
        >
          <Shield className="mb-3 text-amber-400" size={22} />
          <p className="font-medium text-white">Proceduri & Siguranță</p>
          <p className="mt-1 text-sm text-neutral-400">
            Citește și confirmă procedurile curente de siguranță.
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm text-neutral-300 group-hover:text-white">
            Deschide <ArrowRight size={14} />
          </span>
        </Link>

        {current.role === "org_admin" && (
          <Link
            href="/echipa"
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            <Users className="mb-3 text-amber-400" size={22} />
            <p className="font-medium text-white">Echipă & Invitații</p>
            <p className="mt-1 text-sm text-neutral-400">
              Invită oameni noi și vezi cine face parte din echipă.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-neutral-300 group-hover:text-white">
              Deschide <ArrowRight size={14} />
            </span>
          </Link>
        )}
      </div>

      <p className="mt-10 text-sm text-neutral-600">
        Restul modulelor (Induction, Organigramă, SIM, Resurse, Teachers Hub și celelalte) sunt în lucru — apar în meniu pe măsură ce le construim.
      </p>
    </div>
  );
}
