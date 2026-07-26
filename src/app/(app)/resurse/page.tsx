import { Download, ExternalLink, BookOpen, FolderOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { accentFor } from "@/lib/colors";

const CATEGORY_LABELS: Record<string, string> = {
  joc: "Jocuri",
  craft: "Craft-uri",
  tehnica_predare: "Tehnici de predare",
  altele: "Altele",
};

export default async function ResursePage() {
  const supabase = await createClient();
  const { memberships } = await getCurrentUser();
  const orgId = memberships[0].org_id;

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("status", "approved")
    .or(`org_id.is.null,org_id.eq.${orgId}`)
    .order("category")
    .order("title");

  const { data: books } = await supabase
    .from("book_recommendations")
    .select("*")
    .or(`org_id.is.null,org_id.eq.${orgId}`)
    .order("title");

  const grouped = (resources ?? []).reduce<Record<string, typeof resources>>(
    (acc, r) => {
      acc[r.category] = [...(acc[r.category] ?? []), r];
      return acc;
    },
    {}
  );

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
        Resurse
      </h1>
      <p className="mt-2 font-medium text-muted-foreground">
        Materiale utile pentru activități: jocuri, craft-uri, ghiduri, template-uri și cărți recomandate.
      </p>

      {(resources ?? []).length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">Nu există încă resurse publicate.</p>
      )}

      <div className="mt-8 space-y-10">
        {Object.entries(grouped).map(([category, items]) => {
          const accent = accentFor(category);
          return (
            <div key={category}>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br text-white ${accent.grad}`}
                >
                  <FolderOpen size={13} />
                </span>
                {CATEGORY_LABELS[category] ?? category}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {items?.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60 transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">{r.title}</p>
                      {r.description && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{r.description}</p>
                      )}
                    </div>
                    {r.file_url && (
                      <a
                        href={r.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-transform duration-200 hover:scale-105 ${accent.grad}`}
                      >
                        <Download size={13} /> Deschide
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <BookOpen size={14} /> Cărți recomandate
          </h2>
          {(books ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nicio recomandare de carte încă — adminul poate adăuga primele titluri.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {books?.map((b) => {
                const accent = accentFor(b.id);
                return (
                  <div
                    key={b.id}
                    className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60 transition-shadow duration-200 hover:shadow-md"
                  >
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-extrabold text-white shadow-sm ${accent.grad}`}
                    >
                      {b.title.charAt(0)}
                    </div>
                    <p className="text-sm font-bold text-foreground">{b.title}</p>
                    {b.author && <p className="text-xs text-muted-foreground">{b.author}</p>}
                    {b.description && (
                      <p className="mt-2 text-xs text-muted-foreground">{b.description}</p>
                    )}
                    {b.link_url && (
                      <a
                        href={b.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-3 inline-flex items-center gap-1.5 text-xs font-bold ${accent.text}`}
                      >
                        <ExternalLink size={12} /> Vezi cartea
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
