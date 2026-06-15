import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MANIFESTO_QUIZ, scoreQuiz } from "@/lib/manifesto-quiz";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Manifesto Alignment Quiz — ARAFIRST" },
      { name: "description", content: "5-question Wahl-o-mat-style quiz. See exactly how your views align with the ARA manifesto." },
      { property: "og:title", content: "Where do you stand? — ARAFIRST" },
      { property: "og:description", content: "Five questions. One alignment percentage. Fully transparent." },
    ],
  }),
  component: QuizPage,
});

type Answer = "aligned" | "opposed" | null;

function QuizPage() {
  const [answers, setAnswers] = useState<Record<string, Answer>>(() =>
    Object.fromEntries(MANIFESTO_QUIZ.map((q) => [q.id, null])),
  );
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && setUser({ id: data.user.id }));
  }, []);

  const score = useMemo(() => scoreQuiz(answers), [answers]);
  const allAnswered = Object.values(answers).every((a) => a !== null);

  async function persist() {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ manifesto_alignment: score }).eq("id", user.id);
    if (error) return toast.error(error.message);
    toast.success(`Alignment saved to your profile: ${score}%`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <div className="border-l-4 border-accent pl-4">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">Wahl-o-mat-style</div>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">Manifesto Pulse Check</h1>
          <p className="mt-3 text-muted-foreground">5 questions. Pick the statement closest to your view.</p>
        </div>

        <ol className="mt-10 space-y-6">
          {MANIFESTO_QUIZ.map((q, idx) => (
            <li key={q.id} className="border border-border bg-card p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-accent">Q{idx + 1}</div>
              <p className="mt-2 font-medium">{q.prompt}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {(["aligned", "opposed"] as const).map((choice) => {
                  const label = choice === "aligned" ? q.aligned : q.opposed;
                  const active = answers[q.id] === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: choice }))}
                      className={`border p-3 text-left text-sm transition ${active ? "border-accent bg-accent/10 font-bold" : "border-border hover:border-accent/50"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>

        {!submitted ? (
          <div className="mt-8 flex justify-end">
            <Button
              disabled={!allAnswered}
              onClick={() => setSubmitted(true)}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              See my alignment
            </Button>
          </div>
        ) : (
          <div className="mt-8 border-4 border-accent bg-accent/5 p-8 text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-accent">Your manifesto alignment</div>
            <div className="mt-2 text-7xl font-black">{score}%</div>
            <p className="mt-3 text-sm text-muted-foreground">
              {score >= 80 ? "Strong alignment with ARA's manifesto." :
               score >= 50 ? "Partial alignment — explore the issue booklets." :
               "Limited alignment — read the issue booklets to weigh the trade-offs."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {user ? (
                <Button onClick={persist} className="bg-foreground text-background hover:bg-foreground/90">
                  Save to my profile
                </Button>
              ) : (
                <Link to="/register">
                  <Button className="bg-foreground text-background hover:bg-foreground/90">Join ARA</Button>
                </Link>
              )}
              <Link to="/issues"><Button variant="outline">Read issue booklets</Button></Link>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}