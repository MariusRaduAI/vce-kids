import { Sparkles, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";

export default async function ImplicaTePage() {
  const supabase = await createClient();
  const { memberships } = await getCurrentUser();
  const orgId = memberships[0].org_id;

  const { data: step } = await supabase
    .from("induction_steps")
    .select("*")
    .or(`org_id.is.null,org_id.eq.${orgId}`)
    .ilike("title", "%implic%")
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl border-4 border-border bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-md">
          <Sparkles size={24} />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-foreground">
          Nu trebuie să știi totul acum.
        </h1>
        <p className="mt-1 text-lg font-bold text-primary">Trebuie doar să faci următorul pas.</p>
      </div>

      {step ? (
        <div className="prose dark:prose-invert prose-neutral max-w-none rounded-[24px] bg-card shadow-sm ring-1 ring-border/60 p-6 prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-strong:text-foreground">
          <ReactMarkdown>{step.body}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Conținutul acesta va fi disponibil în curând.
        </p>
      )}

      <div className="mt-6 rounded-[24px] shadow-lg bg-gradient-to-br from-primary/10 to-accent/10 p-6 text-center">
        <p className="font-display font-bold text-foreground">Totul începe cu un pas simplu.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Spune-i coordonatorului tău că îți dorești să crești — nu e o aplicare, e începutul unei conversații.
        </p>
        <a
          href="/feedback"
          className="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
        >
          Vreau să mă implic <ArrowRight size={15} />
        </a>
      </div>
    </div>
  );
}
