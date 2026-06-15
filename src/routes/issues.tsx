import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Vote } from "lucide-react";

export const Route = createFileRoute("/issues")({
  head: () => ({
    meta: [
      { title: "V.O.T.E. — Issue Booklets | ARAFIRST" },
      { name: "description", content: "Browse Swiss-style policy booklets on every major issue facing South Africa. Pro/con, impact data, empirical studies." },
      { property: "og:title", content: "V.O.T.E. Issue Booklets — ARAFIRST" },
      { property: "og:description", content: "Informed, transparent civic engagement. Vote on issues that matter." },
    ],
  }),
  component: IssuesIndex,
});

type Issue = { id: string; slug: string; title: string; category: string; summary: string };

function IssuesIndex() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("issues").select("id,slug,title,category,summary").order("created_at", { ascending: false }).then(({ data }) => {
      setIssues(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <div className="border-l-4 border-accent pl-4">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">V.O.T.E. Protocol</div>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-6xl">Issue Booklets</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Swiss-style informational booklets. Read the summary, weigh the pro/con,
            review impact data and empirical studies, then cast a verifiable vote.
            You can quietly update your vote at any time.
          </p>
        </div>
        <div className="mt-10 grid gap-px bg-border sm:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card p-6 h-40 animate-pulse" />
              ))
            : issues.map((it) => (
                <Link
                  key={it.id}
                  to="/issues/$slug"
                  params={{ slug: it.slug }}
                  className="group bg-card p-6 hover:bg-accent/5"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                    <Vote className="h-3 w-3" /> {it.category}
                  </div>
                  <h2 className="mt-3 text-2xl font-black uppercase tracking-tight group-hover:text-accent">
                    {it.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">{it.summary}</p>
                  <div className="mt-4 text-xs font-bold uppercase tracking-widest text-foreground/70">
                    Open booklet →
                  </div>
                </Link>
              ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}