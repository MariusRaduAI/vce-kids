import Link from "next/link";
import { Settings } from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";
import { Sidebar } from "./Sidebar";
import { LogOutButton } from "./LogOutButton";
import { ThemeToggle } from "./ThemeToggle";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, memberships } = await getCurrentUser();

  if (memberships.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <h1 className="font-display text-lg font-bold text-foreground">
            Nu ești încă alocat(ă) unei biserici.
          </h1>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Cere-i liderului tău un link de invitație pentru echipa lui.
          </p>
        </div>
      </main>
    );
  }

  // v1: primul membership activ e organizația curentă (selector multi-org vine ulterior)
  const current = memberships[0];
  const isOrgAdmin = current.role === "org_admin";
  const isPlatformAdmin = profile?.is_platform_admin ?? false;

  return (
    <div className="flex bg-background">
      <Sidebar
        orgName={current.organization?.name ?? ""}
        isOrgAdmin={isOrgAdmin}
        isPlatformAdmin={isPlatformAdmin}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between bg-card px-8 py-4 shadow-sm ring-1 ring-border/60">
          <p className="text-sm font-medium text-muted-foreground">
            Salut, <span className="font-bold text-foreground">{profile?.full_name ?? "acolo"}</span>
          </p>
          <div className="flex items-center gap-5">
            <ThemeToggle />
            <Link
              href="/setari"
              className="text-muted-foreground transition-colors duration-200 hover:text-primary"
              title="Contul meu"
            >
              <Settings size={18} />
            </Link>
            <LogOutButton />
          </div>
        </header>
        <main className="flex-1 bg-background px-8 py-10">{children}</main>
      </div>
    </div>
  );
}
