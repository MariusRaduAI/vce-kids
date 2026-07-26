import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-orange-400/30 to-rose-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400/25 to-emerald-400/20 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-orange-400 to-rose-500 text-2xl font-extrabold text-white shadow-lg shadow-orange-500/30">
            VK
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            VCE Kids
          </h1>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Platforma lucrării de copii — Vertical Church Europe
          </p>
        </div>

        <div className="rounded-[28px] bg-card p-7 shadow-xl shadow-black/5 ring-1 ring-border/60">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
