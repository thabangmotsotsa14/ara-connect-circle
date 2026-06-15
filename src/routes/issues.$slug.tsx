import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ThumbsUp, ThumbsDown, MinusCircle, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { makeVoteHash } from "@/lib/vote-hash";

type Issue = {
  id: string; slug: string; title: string; category: string; summary: string;
  pro_arguments: string[]; con_arguments: string[];
  impact_details: Record<string, unknown>;
  empirical_studies: Array<{ title?: string; url?: string }>;
  vote_options: string[];
};

export const Route = createFileRoute("/issues/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — V.O.T.E. | ARAFIRST` },
      { name: "description", content: "Read the full policy booklet and cast a verifiable vote on this issue." },
      { property: "og:title", content: `V.O.T.E. — ${params.slug.replace(/-/g, " ")}` },
      { property: "og:description", content: "Read summary, pro/con matrix, impact, studies. Quiet vote updates supported." },
    ],
  }),
  component: IssuePage,
});

function IssuePage() {
  const { slug } = Route.useParams();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [myAttrs, setMyAttrs] = useState<string[]>([]);
  const [myVote, setMyVote] = useState<{ choice: string; hash: string } | null>(null);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Array<{ id: string; comment_as_persona: string; comment_text: string; upvotes: number; created_at: string }>>([]);
  const [commentText, setCommentText] = useState("");
  const [commentAs, setCommentAs] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: it } = await supabase.from("issues").select("*").eq("slug", slug).maybeSingle();
      setIssue(it as Issue | null);
      const { data: au } = await supabase.auth.getUser();
      if (au.user) {
        setUser({ id: au.user.id });
        const { data: attrs } = await supabase.from("profile_attributes").select("attribute_value").eq("profile_id", au.user.id);
        const values = (attrs ?? []).map((a) => a.attribute_value as string);
        setMyAttrs(values);
        if (values.length) setCommentAs(values[0]);
        if (it) {
          const { data: v } = await supabase.from("votes").select("vote_choice,verification_hash").eq("profile_id", au.user.id).eq("issue_id", (it as Issue).id).maybeSingle();
          if (v) setMyVote({ choice: v.vote_choice as string, hash: v.verification_hash as string });
          const { data: c } = await supabase.from("town_hall_comments").select("*").eq("issue_id", (it as Issue).id).order("upvotes", { ascending: false }).order("created_at", { ascending: false }).limit(100);
          setComments((c ?? []) as never);
        }
      }
      if (it) await refreshTally((it as Issue).id);
      setLoading(false);
    })();
  }, [slug]);

  async function refreshTally(issueId: string) {
    const { data } = await supabase.rpc("get_vote_tallies", { _issue_id: issueId });
    const next: Record<string, number> = {};
    (data ?? []).forEach((r: { vote_choice: string; total: number }) => { next[r.vote_choice] = Number(r.total); });
    setTally(next);
  }

  const total = useMemo(() => Object.values(tally).reduce((a, b) => a + b, 0), [tally]);

  async function cast(choice: string) {
    if (!user || !issue) {
      toast.error("Sign in to cast a vote.");
      return;
    }
    const hash = await makeVoteHash(user.id, issue.id, choice);
    const { error } = await supabase.from("votes").upsert(
      { profile_id: user.id, issue_id: issue.id, vote_choice: choice, verification_hash: hash, updated_at: new Date().toISOString() },
      { onConflict: "profile_id,issue_id" },
    );
    if (error) return toast.error(error.message);
    setMyVote({ choice, hash });
    toast.success("Vote recorded. You can quietly update it any time.");
    await refreshTally(issue.id);
  }

  async function postComment() {
    if (!user || !issue) return;
    if (!commentAs) return toast.error("Pick a persona from your member attributes first.");
    if (commentText.trim().length < 2) return;
    const { error, data } = await supabase.from("town_hall_comments").insert({
      profile_id: user.id, issue_id: issue.id,
      comment_as_persona: commentAs, comment_text: commentText.trim(),
    }).select("*").single();
    if (error) return toast.error(error.message);
    setCommentText("");
    setComments((cs) => [data as never, ...cs]);
  }

  if (loading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  if (!issue) return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-black uppercase">Issue not found</h1>
        <Link to="/issues" className="mt-4 inline-block text-accent underline">Back to issues</Link>
      </main>
      <SiteFooter />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <Link to="/issues" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent">← All issues</Link>
        <div className="mt-4 border-l-4 border-accent pl-4">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">{issue.category}</div>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl">{issue.title}</h1>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <Tabs defaultValue="summary" className="border border-border bg-card p-6">
            <TabsList className="mb-4 grid w-full grid-cols-4 bg-secondary">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="matrix">Pro / Con</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="studies">Studies</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="text-sm leading-relaxed">{issue.summary}</TabsContent>
            <TabsContent value="matrix">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border border-accent/40 p-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-accent">For</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {issue.pro_arguments.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div className="border border-destructive/40 p-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-destructive">Against</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {issue.con_arguments.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="impact">
              <dl className="grid gap-3 sm:grid-cols-2">
                {Object.entries(issue.impact_details || {}).map(([k, v]) => (
                  <div key={k} className="border border-border p-3">
                    <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k.replace(/_/g, " ")}</dt>
                    <dd className="mt-1 font-black">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>
            <TabsContent value="studies">
              {issue.empirical_studies?.length ? (
                <ul className="space-y-2 text-sm">
                  {issue.empirical_studies.map((s, i) => (
                    <li key={i} className="border border-border p-3">
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noreferrer" className="font-bold text-accent hover:underline">
                          {s.title ?? s.url}
                        </a>
                      ) : <span>{s.title}</span>}
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-muted-foreground">No empirical studies attached yet.</p>}
            </TabsContent>
          </Tabs>

          {/* Vote panel */}
          <aside className="border-2 border-foreground bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Cast your vote
            </div>
            {!user ? (
              <div className="mt-3 text-sm">
                <p className="text-muted-foreground">Sign in to record a verifiable vote.</p>
                <Link to="/auth" className="mt-3 inline-block text-accent underline">Sign in</Link>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {issue.vote_options.map((opt) => {
                  const Icon = opt === "For" ? ThumbsUp : opt === "Against" ? ThumbsDown : MinusCircle;
                  const active = myVote?.choice === opt;
                  return (
                    <Button
                      key={opt}
                      onClick={() => cast(opt)}
                      variant={active ? "default" : "outline"}
                      className={`w-full justify-start ${active ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
                    >
                      <Icon className="mr-2 h-4 w-4" /> {opt}
                      {active && <Check className="ml-auto h-4 w-4" />}
                    </Button>
                  );
                })}
                {myVote && (
                  <div className="mt-3 border border-border bg-background p-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <Lock className="mr-1 inline h-3 w-3" /> Receipt {myVote.hash.slice(0, 16)}…
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 border-t border-border pt-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live tally ({total})</div>
              {issue.vote_options.map((opt) => {
                const n = tally[opt] ?? 0;
                const pct = total ? Math.round((n / total) * 100) : 0;
                return (
                  <div key={opt} className="mt-2">
                    <div className="flex justify-between text-xs"><span>{opt}</span><span className="font-bold">{n} · {pct}%</span></div>
                    <div className="mt-1 h-2 bg-secondary"><div className="h-full bg-accent" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        {/* Town Hall */}
        <section className="mt-12 border border-border bg-card p-6">
          <h2 className="text-2xl font-black uppercase">The Big Debate</h2>
          <p className="text-sm text-muted-foreground">Comment "as" one of your registered persona attributes.</p>

          {user ? (
            myAttrs.length === 0 ? (
              <div className="mt-4 border border-accent bg-accent/10 p-4 text-sm">
                You haven't set any persona attributes yet. <Link to="/register" className="font-bold text-accent underline">Add them on your profile</Link> to participate in the debate.
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Comment as</span>
                  <Select value={commentAs} onValueChange={setCommentAs}>
                    <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {myAttrs.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea maxLength={2000} value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Speak from your lived experience…" />
                <Button onClick={postComment} className="bg-accent text-accent-foreground hover:bg-accent/90">Post comment</Button>
              </div>
            )
          ) : (
            <div className="mt-4 text-sm"><Link to="/auth" className="text-accent underline">Sign in</Link> to join the debate.</div>
          )}

          <ul className="mt-8 space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="border-l-2 border-accent/40 pl-4">
                <div className="text-xs font-bold uppercase tracking-widest text-accent">[As a {c.comment_as_persona}]</div>
                <p className="mt-1 text-sm">{c.comment_text}</p>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {new Date(c.created_at).toLocaleString()} · {c.upvotes} upvotes
                </div>
              </li>
            ))}
            {comments.length === 0 && <li className="text-sm text-muted-foreground">No comments yet. Be the first.</li>}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}