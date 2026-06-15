import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Education Funding", "Unemployment", "Municipal Failure", "Business Red Tape", "Healthcare Access"] as const;
const STATUSES = ["Logged", "Under Review", "Escalated to Council", "Resolved"] as const;

export const Route = createFileRoute("/_authenticated/bottlenecks")({
  head: () => ({ meta: [{ title: "Bottleneck Escalation Desk — ARAFIRST" }] }),
  component: BottlenecksPage,
});

type Ticket = {
  id: string; geographical_node: string; category: string; headline: string;
  detailed_description: string; has_supporting_doc: boolean; status: string; created_at: string;
};

function BottlenecksPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("Education Funding");
  const [node, setNode] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [hasDoc, setHasDoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserId(u.user.id);
      const [{ data: p }, { data: t }] = await Promise.all([
        supabase.from("profiles").select("ekurhuleni_ward,province,city").eq("id", u.user.id).maybeSingle(),
        supabase.from("personal_bottlenecks").select("*").eq("profile_id", u.user.id).order("created_at", { ascending: false }),
      ]);
      if (p) setNode(p.ekurhuleni_ward ? `Ekurhuleni Ward ${p.ekurhuleni_ward}` : (p.city ? `${p.city}, ${p.province ?? ""}`.trim() : (p.province ?? "")));
      setTickets((t ?? []) as Ticket[]);
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    if (headline.trim().length < 5 || description.trim().length < 10 || node.trim().length < 2) {
      return toast.error("Add a geographical node, a headline and a fuller description.");
    }
    setSubmitting(true);
    const { error, data } = await supabase.from("personal_bottlenecks").insert({
      profile_id: userId, geographical_node: node.trim().slice(0, 100), category,
      headline: headline.trim(), detailed_description: description.trim(),
      has_supporting_doc: hasDoc,
    }).select("*").single();
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setTickets((ts) => [data as Ticket, ...ts]);
    setHeadline(""); setDescription(""); setHasDoc(false);
    toast.success("Bottleneck logged. Appears anonymously in the National Crisis Tracker.");
  }

  async function remove(id: string) {
    await supabase.from("personal_bottlenecks").delete().eq("id", id);
    setTickets((ts) => ts.filter((t) => t.id !== id));
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
        <div className="border-l-4 border-accent pl-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
            <AlertTriangle className="h-3 w-3" /> Escalation Desk
          </div>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">Log a bottleneck</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Tell ARA leadership what's blocking you. Tickets are aggregated anonymously into the{" "}
            <Link to="/crisis-tracker" className="font-bold text-accent underline">National Crisis Tracker</Link> —
            no member identity is ever exposed.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 grid gap-4 border-2 border-foreground bg-card p-6 sm:grid-cols-2">
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as typeof CATEGORIES[number])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="node">Geographical node *</Label>
            <Input id="node" value={node} onChange={(e) => setNode(e.target.value)} maxLength={100} placeholder="e.g. Ekurhuleni Ward 41" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="headline">Headline *</Label>
            <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={200} placeholder='e.g. "Accepted at Wits, NSFAS pending"' />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="desc">Detailed description *</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={4000} rows={5} />
          </div>
          <label className="flex items-center justify-between gap-3 sm:col-span-2 border border-border bg-background p-3">
            <div>
              <div className="text-sm font-bold">I have supporting documents</div>
              <div className="text-xs text-muted-foreground">Upload them via the <Link to="/vault" className="text-accent underline">Opportunity Vault</Link>.</div>
            </div>
            <Switch checked={hasDoc} onCheckedChange={setHasDoc} />
          </label>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {submitting ? "Logging…" : "Log bottleneck"}
            </Button>
          </div>
        </form>

        <section className="mt-12">
          <h2 className="border-b border-border pb-3 text-lg font-black uppercase">Your tickets ({tickets.length})</h2>
          <ul className="mt-4 divide-y divide-border">
            {tickets.length === 0 && <li className="py-6 text-sm text-muted-foreground">No tickets yet.</li>}
            {tickets.map((t) => (
              <li key={t.id} className="py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-widest text-accent">{t.category}</div>
                    <div className="mt-1 text-lg font-black">{t.headline}</div>
                    <div className="text-xs text-muted-foreground">{t.geographical_node} · {new Date(t.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="border border-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-widest">{t.status}</span>
                    <Button size="sm" variant="outline" className="border-destructive text-destructive" onClick={() => remove(t.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-foreground/80">{t.detailed_description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}