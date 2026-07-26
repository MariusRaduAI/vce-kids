"use client";

import { useState } from "react";
import { Users, Pencil, Trash2, Plus, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { accentFor } from "@/lib/colors";
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
      className="grid gap-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60 sm:grid-cols-2"
    >
      <input
        required
        placeholder="Titlu / rol (ex: Coordonator Kids)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-2 focus:ring-primary sm:col-span-2"
      />
      <select
        value={parentId}
        onChange={(e) => setParentId(e.target.value)}
        className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-2 focus:ring-primary"
      >
        <option value="">(rădăcină — fără superior)</option>
        {flatten(nodes)
          .filter((n) => n.id !== existing?.id)
          .map((n) => (
            <option key={n.id} value={n.id}>
              sub: {n.title}
            </option>
          ))}
      </select>
      <select
        value={membershipId}
        onChange={(e) => setMembershipId(e.target.value)}
        className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-2 focus:ring-primary"
      >
        <option value="">(fără persoană din cont legată)</option>
        {members.map((m) => (
          <option key={m.membershipId} value={m.membershipId}>
            {m.name}
          </option>
        ))}
      </select>
      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/25 transition-all hover:shadow-lg disabled:opacity-50"
        >
          {saving ? "Se salvează..." : existing ? "Salvează" : "Adaugă"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
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
  const accent = accentFor(node.id);
  const isRoot = depth === 0;

  async function handleDelete() {
    if (!confirm(`Ștergi "${node.title}"? Se șterg și toți subordonații lui.`)) return;
    const supabase = createClient();
    await supabase.from("org_chart_nodes").delete().eq("id", node.id);
    refresh();
  }

  return (
    <div>
      {editingId === node.id ? (
        <NodeForm orgId={orgId} nodes={allNodes} members={members} existing={node} onDone={refresh} />
      ) : (
        <div className="group flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60 transition-shadow duration-200 hover:shadow-md">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${accent.grad}`}
          >
            {isRoot ? <Crown size={17} /> : <Users size={16} />}
          </div>
          <span className="flex-1 text-sm font-bold text-foreground">{node.title}</span>
          {isOrgAdmin && (
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => setAddingUnderId(node.id)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                title="Adaugă subordonat"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => setEditingId(node.id)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {addingUnderId === node.id && (
        <div className="mt-3">
          <NodeForm
            orgId={orgId}
            nodes={allNodes}
            members={members}
            defaultParentId={node.id}
            onDone={refresh}
          />
        </div>
      )}

      {node.children.length > 0 && (
        <div
          className={
            isRoot
              ? "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              : "mt-3 ml-6 space-y-3 border-l-2 border-border pl-6"
          }
        >
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
      )}
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
              className="inline-flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-md"
            >
              <Plus size={15} /> Adaugă rol la vârf
            </button>
          )}
        </div>
      )}

      {tree.length === 0 ? (
        <p className="text-sm text-muted-foreground">Organigrama nu a fost încă completată.</p>
      ) : (
        <div className="space-y-4">
          {tree.map((node) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
