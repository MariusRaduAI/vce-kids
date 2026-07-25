import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { ConfirmButton } from "./ConfirmButton";

export default async function ProcedureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { user } = await getCurrentUser();

  const { data: procedure } = await supabase
    .from("procedures")
    .select("*")
    .eq("id", id)
    .single();

  if (!procedure) notFound();

  const { data: confirmation } = await supabase
    .from("procedure_confirmations")
    .select("version_confirmed")
    .eq("procedure_id", id)
    .eq("user_id", user.id)
    .eq("version_confirmed", procedure.version)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/proceduri"
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={14} /> Toate procedurile
      </Link>

      <h1 className="text-2xl font-semibold text-white">{procedure.title}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Versiunea {procedure.version} · actualizată{" "}
        {new Date(procedure.updated_at).toLocaleDateString("ro-RO")}
      </p>

      <div className="prose prose-invert prose-neutral mt-6 max-w-none prose-headings:font-medium prose-a:text-amber-400">
        <ReactMarkdown>{procedure.body}</ReactMarkdown>
      </div>

      <div className="mt-8">
        <ConfirmButton
          procedureId={procedure.id}
          version={procedure.version}
          userId={user.id}
          alreadyConfirmed={!!confirmation}
        />
      </div>
    </div>
  );
}
