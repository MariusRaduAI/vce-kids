"use client";

import { useState } from "react";
import { Users, Pencil, Trash2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type NodeRow = Tables<"org_chart_nodes">;
type Node = NodeRow & { children: Node[] };
type MemberOption = { membershipId: string; name: string };

function buildTree(nodes: NodeRow[]): Node[] {
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

function flatten(nodes: NodeRow[]) {
  return nodes.map((n) => ({ id: n.id, title: n.title }));
}

function NodeForm({
  orgId,
  nodes,
  members,
  existing,
  defaultParentId,
  onDone,
}: {
  orgId: string;
  nodes: NodeRow[];
  members: MemberOption[];
  existing?: NodeRow;
  defaultParentId?: string | null;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [parentId, setParentId] = useState(existing?.parent_id ?? defaultParentId ?? "");
  const [membershipId, setMembershipId] = useState(existing?.membership_id ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    const payload = {
      org_id: orgId,
      title,
      parent_id: parentId || null,
      membership_id: membershipId || null,
    };

    const { error } = existing
      ? await supabase.from("org_chart_nodes").update(payload).eq("id", existing.id)
      : await supabase.from("org_chart_nodes").insert(payload);

    setSaving(false);
    if (!error) onDone();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 sm:grid-cols-2"
    >
      <input
        required
        placeholder="Titlu / rol (ex: Coordonator Kids)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-white/30 sm:col-span-2"
      />
      <select
        value={parentId}
        onChange={(e) => setParentId(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
      >
        <option value="" className="bg-neutral-900">
          (rădăcină — fără superior)
        </option>
        {flatten(nodes)
          .filter((n) => n.id !== existing?.id)
          .map((n) => (
            <option key={n.id} value={n.id} className="bg-neutral-900">
              sub: {n.title}
            </option>
          ))}
      </select>
      <select
        value={membershipId}
        onChange={(e) => setMembershipId(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
      >
        <option value="" className="bg-neutral-900">
          (fără persoană din cont legată)
        </option>
        {members.map((m) => (
          <option key={m.membershipId} value={m.membershipId} className="bg-neutral-900">
            {m.name}
          </option>
        ))}
      </select>
      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {saving ? "Se salvează..." : existing ? "Salvează" : "Adaugă"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg px-4 py-2 text-sm text-neutral-400 hover:text-white"
        >
          Renunță
        </button>
      </div>
    </form>
  );
}

function NodeCard({
  node,
  depth,
  isOrgAdmin,
  orgId,
  allNodes,
  members,
  editingId,
  addingUnderId,
  setEditingId,
  setAddingUnderId,
  refresh,
}: {
  node: Node;
  depth: number;
  isOrgAdmin: boolean;
  orgId: string;
  allNodes: NodeRow[];
  members: MemberOption[];
  editingId: string | null;
  addingUnderId: string | null;
  setEditingId: (id: string | null) => void;
  setAddingUnderId: (id: string | null) => void;
  refresh: () => void;
}) {
  async function handleDelete() {
    if (!confirm(`Ștergi "${node.title}"? Se șterg și toți subordonații lui.`)) return;
    const supabase = createClient();
    await supabase.from("org_chart_nodes").delete().eq("id", node.id);
    refresh();
  }

  return (
    <div className={depth > 0 ? "mt-3 ml-6 border-l border-white/10 pl-6" : "mt-3"}>
      {editingId === node.id ? (
        <NodeForm orgId={orgId} nodes={allNodes} members={members} existing={node} onDone={refresh} />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
            <Users size={15} />
          </div>
          <span className="flex-1 text-sm text-white">{node.title}</span>
          {isOrgAdmin && (
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => setAddingUnderId(node.id)}
                className="rounded-lg p-1.5 text-neutral-500 hover:bg-white/10 hover:text-white"
                title="Adaugă subordonat"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => setEditingId(node.id)}
                className="rounded-lg p-1.5 text-neutral-500 hover:bg-white/10 hover:text-white"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg p-1.5 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {addingUnderId === node.id && (
        <div className="mt-3 ml-6 border-l border-white/10 pl-6">
          <NodeForm
            orgId={orgId}
            nodes={allNodes}
            members={members}
            defaultParentId={node.id}
            onDone={refresh}
          />
        </div>
      )}

      {node.children.map((child) => (
        <NodeCard
          key={child.id}
          node={child}
          depth={depth + 1}
          isOrgAdmin={isOrgAdmin}
          orgId={orgId}
          allNodes={allNodes}
          members={members}
          editingId={editingId}
          addingUnderId={addingUnderId}
          setEditingId={setEditingId}
          setAddingUnderId={setAddingUnderId}
          refresh={refresh}
        />
      ))}
    </div>
  );
}

export function OrgChartManager({
  orgId,
  isOrgAdmin,
  initialNodes,
  members,
}: {
  orgId: string;
  isOrgAdmin: boolean;
  initialNodes: NodeRow[];
  members: MemberOption[];
}) {
  const [nodes, setNodes] = useState(initialNodes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingUnderId, setAddingUnderId] = useState<string | null>(null);
  const [addingRoot, setAddingRoot] = useState(false);

  async function refresh() {
    const supabase = createClient();
    const { data } = await supabase
      .from("org_chart_nodes")
      .select("*")
      .eq("org_id", orgId)
      .order("sort_order");
    setNodes(data ?? []);
    setEditingId(null);
    setAddingUnderId(null);
    setAddingRoot(false);
  }

  const tree = buildTree(nodes);

  return (
    <div>
      {isOrgAdmin && (
        <div className="mb-4">
          {addingRoot ? (
            <NodeForm orgId={orgId} nodes={nodes} members={members} onDone={refresh} />
          ) : (
            <button
              onClick={() => setAddingRoot(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              <Plus size={15} /> Adaugă rol la vârf
            </button>
          )}
        </div>
      )}

      {tree.length === 0 ? (
        <p className="text-sm text-neutral-500">Organigrama nu a fost încă completată.</p>
      ) : (
        tree.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
            depth={0}
            isOrgAdmin={isOrgAdmin}
            orgId={orgId}
            allNodes={nodes}
            members={members}
            editingId={editingId}
            addingUnderId={addingUnderId}
            setEditingId={setEditingId}
            setAddingUnderId={setAddingUnderId}
            refresh={refresh}
          />
        ))
      )}
    </div>
  );
}
