import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-10 h-16 w-16 rotate-12 rounded-2xl border-4 border-secondary/40 bg-secondary/10" />
      <div className="pointer-events-none absolute bottom-16 left-1/4 h-10 w-10 -rotate-12 rounded-full border-4 border-accent/40 bg-accent/10" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 rotate-[-4deg] items-center justify-center rounded-3xl border-4 border-border bg-gradient-to-br from-primary to-secondary text-2xl font-extrabold text-primary-foreground shadow-[0_6px_0_0_var(--color-border)]">
            VK
          </div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">VCE Kids</h1>
          <p className="mt-1.5 text-sm font-medium text-muted-foreground">
            Platforma lucrării de copii — Vertical Church Europe
          </p>
        </div>

        <div className="rounded-[28px] border-4 border-border bg-card p-6 shadow-[0_8px_0_0_var(--color-border),0_20px_40px_-20px_rgba(225,29,72,0.35)]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
