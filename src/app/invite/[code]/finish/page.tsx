import { FinishAccept } from "./FinishAccept";

export default async function InviteFinishPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-xl font-bold text-black">
          VK
        </div>
        <FinishAccept code={code} />
      </div>
    </main>
  );
}
