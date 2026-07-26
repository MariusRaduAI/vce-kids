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
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} /> Toți pașii
      </Link>

      <h1 className="font-display text-3xl font-extrabold text-foreground">{step.title}</h1>

      <div className="prose dark:prose-invert prose-neutral mt-6 max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-strong:text-foreground">
        <ReactMarkdown>{step.body}</ReactMarkdown>
      </div>

      <div className="mt-8">
        <CompleteButton stepId={step.id} userId={user.id} alreadyDone={!!progress} />
      </div>
    </div>
  );
}
