import { Download, ExternalLink, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";

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
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Resurse</h1>
      <p className="mt-1 text-neutral-400">
        Materiale utile pentru activități: jocuri, craft-uri, ghiduri, template-uri și cărți recomandate.
      </p>

      {(resources ?? []).length === 0 && (
        <p className="mt-8 text-sm text-neutral-500">Nu există încă resurse publicate.</p>
      )}

      <div className="mt-8 space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {items?.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{r.title}</p>
                    {r.description && (
                      <p className="mt-0.5 truncate text-xs text-neutral-500">{r.description}</p>
                    )}
                  </div>
                  {r.file_url && (
                    <a
                      href={r.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
                    >
                      <Download size={13} /> Deschide
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-neutral-500">
            <BookOpen size={14} /> Cărți recomandate
          </h2>
          {(books ?? []).length === 0 ? (
            <p className="text-sm text-neutral-500">
              Nicio recomandare de carte încă — adminul poate adăuga primele titluri.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {books?.map((b) => (
                <div key={b.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-white">{b.title}</p>
                  {b.author && <p className="text-xs text-neutral-500">{b.author}</p>}
                  {b.description && (
                    <p className="mt-2 text-xs text-neutral-400">{b.description}</p>
                  )}
                  {b.link_url && (
                    <a
                      href={b.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300"
                    >
                      <ExternalLink size={12} /> Vezi cartea
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
