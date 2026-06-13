import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EKURHULENI_WARDS } from "@/lib/wards";
import { Users, MapPin, Vote, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — ARAFIRST" }] }),
  component: AdminPage,
});

type Member = {
  id: string; first_name: string | null; surname: string | null; email: string | null;
  phone: string | null; rsa_id_masked: string | null; street_address: string | null;
  city: string | null; province: string | null; is_registered_voter: boolean;
  voting_district: string | null; ekurhuleni_ward: number | null;
  consent_given_at: string | null; created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<null | boolean>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [q, setQ] = useState("");
  const [wardFilter, setWardFilter] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return navigate({ to: "/auth" });
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin");
      const ok = !!roles && roles.length > 0;
      setAuthorized(ok);
      if (!ok) return;
      const { data, error } = await supabase.from("admin_members").select("*").order("created_at", { ascending: false }).limit(1000);
      if (!error && data) setMembers(data as Member[]);
    })();
  }, [navigate]);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchesQ = !q || [m.first_name, m.surname, m.email, m.city].some((v) => v?.toLowerCase().includes(q.toLowerCase()));
      const matchesWard = !wardFilter || String(m.ekurhuleni_ward) === wardFilter;
      return matchesQ && matchesWard;
    });
  }, [members, q, wardFilter]);

  const wardCounts = useMemo(() => {
    const map = new Map<number, number>();
    members.forEach((m) => { if (m.ekurhuleni_ward) map.set(m.ekurhuleni_ward, (map.get(m.ekurhuleni_ward) ?? 0) + 1); });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [members]);

  const voterCount = members.filter((m) => m.is_registered_voter).length;

  if (authorized === null) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!authorized) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-4 text-center">
          <ShieldAlert className="h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-3xl font-black uppercase">Not authorised</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is restricted to ARA administrators.
          </p>
          <Link to="/dashboard" className="mt-6 text-sm font-bold uppercase text-accent">← Back to dashboard</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6">
        <div className="border-b border-border pb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">Admin console</div>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight">Member directory</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Read-only. RSA IDs are masked to the last 4 digits. Aggregate analytics below.
          </p>
        </div>

        <div className="mt-6 grid gap-px bg-border sm:grid-cols-3">
          <Kpi icon={Users} label="Total members" value={members.length} />
          <Kpi icon={Vote} label="Registered voters" value={voterCount} sub={`${members.length ? Math.round((voterCount / members.length) * 100) : 0}% of base`} />
          <Kpi icon={MapPin} label="Top ward" value={wardCounts[0] ? `Ward ${wardCounts[0][0]}` : "—"} sub={wardCounts[0] ? `${wardCounts[0][1]} members` : undefined} />
        </div>

        {wardCounts.length > 0 && (
          <section className="mt-8 border border-border bg-card p-6">
            <h2 className="text-sm font-black uppercase tracking-widest">Ekurhuleni ward distribution (top 8)</h2>
            <div className="mt-4 space-y-2">
              {wardCounts.map(([w, c]) => {
                const max = wardCounts[0][1];
                return (
                  <div key={w} className="flex items-center gap-3 text-sm">
                    <div className="w-20 font-bold">Ward {w}</div>
                    <div className="h-2 flex-1 bg-secondary">
                      <div className="h-full bg-accent" style={{ width: `${(c / max) * 100}%` }} />
                    </div>
                    <div className="w-10 text-right tabular-nums">{c}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-8 border border-border bg-card">
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <Input placeholder="Search name, email, city…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
            <select value={wardFilter} onChange={(e) => setWardFilter(e.target.value)} className="h-9 border border-input bg-background px-3 text-sm">
              <option value="">All wards</option>
              {EKURHULENI_WARDS.map((w) => <option key={w} value={w}>Ward {w}</option>)}
            </select>
            <Button variant="ghost" size="sm" onClick={() => { setQ(""); setWardFilter(""); }}>Reset</Button>
            <div className="ml-auto text-xs text-muted-foreground">{filtered.length} of {members.length}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3 text-left">Member</th>
                  <th className="px-4 py-3 text-left">RSA ID</th>
                  <th className="px-4 py-3 text-left">Ward</th>
                  <th className="px-4 py-3 text-left">Province</th>
                  <th className="px-4 py-3 text-left">Voter</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="font-bold">{[m.first_name, m.surname].filter(Boolean).join(" ") || "—"}</div>
                      <div className="text-xs text-muted-foreground">{m.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{m.rsa_id_masked ?? "—"}</td>
                    <td className="px-4 py-3">{m.ekurhuleni_ward ? `Ward ${m.ekurhuleni_ward}` : "—"}</td>
                    <td className="px-4 py-3">{m.province ?? "—"}</td>
                    <td className="px-4 py-3">
                      {m.is_registered_voter ? (
                        <span className="inline-flex items-center bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">YES</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No members match.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub }: { icon: any; label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-background p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-accent" /> {label}
      </div>
      <div className="mt-2 text-3xl font-black">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}