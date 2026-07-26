import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import type { Tables } from "@/lib/supabase/types";

type Node = Tables<"org_chart_nodes"> & { children: Node[] };

function buildTree(nodes: Tables<"org_chart_nodes">[]): Node[] {
  const byId = new Map<string, Node>(nodes.map((n) => [n.id, { ...n, children: [] }]));
  const roots: Node[] = [];

  for (const node of byId.values()) {
    if (node.parent_id && byId.has(node.parent_id)) {
      byId.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function NodeCard({ node, depth }: { node: Node; depth: number }) {
  return (
    <div className={depth > 0 ? "mt-3 ml-6 border-l border-white/10 pl-6" : "mt-3"}>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
          <Users size={15} />
        </div>
        <span className="text-sm text-white">{node.title}</span>
      </div>
      {node.children.map((child) => (
        <NodeCard key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default async function OrganigramaPage() {
  const supabase = await createClient();
  const { memberships } = await getCurrentUser();
  const orgId = memberships[0].org_id;

  const { data: nodes } = await supabase
    .from("org_chart_nodes")
    .select("*")
    .eq("org_id", orgId)
    .order("sort_order");

  const tree = buildTree(nodes ?? []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Organigramă</h1>
      <p className="mt-1 text-neutral-400">
        Echipa de coordonare a lucrării de copii — pentru orice nevoie, îndreaptă-te spre responsabilul potrivit.
      </p>

      {tree.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">Organigrama nu a fost încă completată.</p>
      ) : (
        <div className="mt-8">
          {tree.map((node) => (
            <NodeCard key={node.id} node={node} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}
