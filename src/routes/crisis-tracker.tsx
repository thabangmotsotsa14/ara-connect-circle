import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/crisis-tracker")({
  head: () => ({
    meta: [
      { title: "National Crisis Tracker — ARAFIRST" },
      { name: "description", content: "Real-time, anonymized aggregation of structural bottlenecks logged by ARA members across South Africa." },
      { property: "og:title", content: "National Crisis Tracker — ARAFIRST" },
      { property: "og:description", content: "Member-reported structural bottlenecks, aggregated by region and category." },
    ],
  }),
  component: CrisisTracker,
});

type Row = { id: string; geographical_node: string; category: string; status: string; created_at: string };

const CATEGORIES = ["Education Funding", "Unemployment", "Municipal Failure", "Business Red Tape", "Healthcare Access"] as const;

function CrisisTracker() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [nodeFilter, setNodeFilter] = useState("");

  useEffect(() => {
    supabase.from("crisis_tracker").select("*").order("created_at", { ascending: false }).limit(5000).then(({ data }) => {
      setRows((data ?? []) as Row[]);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(
    () => nodeFilter ? rows.filter((r) => r.geographical_node.toLowerCase().includes(nodeFilter.toLowerCase())) : rows,
    [rows, nodeFilter],
  );

  const byCategory = useMemo(() => {
    const m: Record<string, number> = {};
    CATEGORIES.forEach((c) => (m[c] = 0));
    filtered.forEach((r) => (m[r.category] = (m[r.category] ?? 0) + 1));
    return m;
  }, [filtered]);

  const byNode = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.forEach((r) => (m[r.geographical_node] = (m[r.geographical_node] ?? 0) + 1));
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [filtered]);

  const max = Math.max(1, ...Object.values(byCategory));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <div className="border-l-4 border-accent pl-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
            <AlertTriangle className="h-3 w-3" /> Live · Anonymized
          </div>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-6xl">National Crisis Tracker</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Every dot below is a real bottleneck logged by an ARA member. We never expose
            the member — only the category, the municipal node and the status.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <input
            value={nodeFilter}
            onChange={(e) => setNodeFilter(e.target.value)}
            placeholder="Filter by region / ward / municipality…"
            className="w-full max-w-md border border-border bg-background px-3 py-2 text-sm"
          />
          <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest text-accent hover:underline">
            Log your own bottleneck →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="border border-border bg-card p-6">
            <h2 className="text-lg font-black uppercase">By category</h2>
            <div className="mt-4 space-y-3">
              {CATEGORIES.map((c) => {
                const n = byCategory[c] ?? 0;
                return (
                  <div key={c}>
                    <div className="flex justify-between text-sm">
                      <span>{c}</span>
                      <span className="font-black">{n}</span>
                    </div>
                    <div className="mt-1 h-3 bg-secondary"><div className="h-full bg-accent" style={{ width: `${(n / max) * 100}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border border-border bg-card p-6">
            <h2 className="text-lg font-black uppercase">Top regions</h2>
            <ul className="mt-4 divide-y divide-border">
              {byNode.length === 0 && <li className="py-2 text-sm text-muted-foreground">No data yet.</li>}
              {byNode.map(([node, n]) => (
                <li key={node} className="flex items-center justify-between py-2 text-sm">
                  <span>{node}</span>
                  <span className="font-black text-accent">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-2 border-foreground bg-foreground p-6 text-background">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">Total tickets</div>
          <div className="mt-1 text-6xl font-black">{filtered.length}</div>
          <p className="mt-2 text-sm text-background/70">{loading ? "Loading…" : "Updated in real time as members log new tickets."}</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}