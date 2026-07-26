import Link from "next/link";
import { Settings } from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";
import { Sidebar } from "./Sidebar";
import { LogOutButton } from "./LogOutButton";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, memberships } = await getCurrentUser();

  if (memberships.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-center">
        <div>
          <h1 className="text-lg font-medium text-white">
            Nu ești încă alocat(ă) unei biserici.
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Cere-i liderului tău un link de invitație pentru echipa lui.
          </p>
        </div>
      </main>
    );
  }

  // v1: primul membership activ e organizația curentă (selector multi-org vine ulterior)
  const current = memberships[0];
  const isOrgAdmin = current.role === "org_admin";

  return (
    <div className="flex bg-white dark:bg-neutral-950">
      <Sidebar orgName={current.organization?.name ?? ""} isOrgAdmin={isOrgAdmin} />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-3 dark:border-white/10 dark:bg-neutral-950">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Salut, <span className="text-neutral-900 dark:text-white">{profile?.full_name ?? "acolo"}</span>
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/setari"
              className="text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              title="Contul meu"
            >
              <Settings size={18} />
            </Link>
            <LogOutButton />
          </div>
        </header>
        <main className="flex-1 bg-neutral-950 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
