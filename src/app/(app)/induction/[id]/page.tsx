import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { CompleteButton } from "./CompleteButton";

export default async function InductionStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { user } = await getCurrentUser();

  const { data: step } = await supabase
    .from("induction_steps")
    .select("*")
    .eq("id", id)
    .single();

  if (!step) notFound();

  const { data: progress } = await supabase
    .from("induction_progress")
    .select("id")
    .eq("step_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/induction"
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={14} /> Toți pașii
      </Link>

      <h1 className="text-2xl font-semibold text-white">{step.title}</h1>

      <div className="prose prose-invert prose-neutral mt-6 max-w-none prose-headings:font-medium prose-a:text-amber-400">
        <ReactMarkdown>{step.body}</ReactMarkdown>
      </div>

      <div className="mt-8">
        <CompleteButton stepId={step.id} userId={user.id} alreadyDone={!!progress} />
      </div>
    </div>
  );
}
