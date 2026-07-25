import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-xl font-bold text-black">
            VK
          </div>
          <h1 className="text-2xl font-semibold text-white">VCE Kids</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Platforma lucrării de copii — Vertical Church Europe
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
