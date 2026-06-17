import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  EKURHULENI_STATEMENTS,
  scoreMatcher,
  type MatcherChoice,
} from "@/lib/manifesto-matcher";
import { ArrowLeft, ArrowRight, Check, Minus, X, SkipForward, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/manifesto-matcher")({
  head: () => ({
    meta: [
      { title: "Ekurhuleni Manifesto Matcher — ARAFIRST" },
      {
        name: "description",
        content:
          "Match your stance on Ekurhuleni's most pressing municipal questions against the Africa Restoration Alliance manifesto. Built like Wahl-O-Mat.",
      },
      { property: "og:title", content: "Ekurhuleni Manifesto Matcher — ARAFIRST" },
      {
        property: "og:description",
        content: "Card-by-card civic alignment quiz for Ekurhuleni voters.",
      },
    ],
  }),
  component: MatcherPage,
});

type Answer = { choice: MatcherChoice; doubled: boolean };

function MatcherPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [saving, setSaving] = useState(false);

  const total = EKURHULENI_STATEMENTS.length;
  const current = EKURHULENI_STATEMENTS[step];
  const currentAnswer: Answer = answers[current?.id] ?? { choice: "skip", doubled: false };

  const result = useMemo(() => scoreMatcher(answers), [answers, done]);

  function pick(choice: MatcherChoice) {
    setAnswers((a) => ({
      ...a,
      [current.id]: { choice, doubled: a[current.id]?.doubled ?? false },
    }));
    if (step < total - 1) setStep(step + 1);
    else setDone(true);
  }

  function toggleDoubled(v: boolean) {
    setAnswers((a) => ({
      ...a,
      [current.id]: { choice: a[current.id]?.choice ?? "skip", doubled: v },
    }));
  }

  async function saveResult() {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      toast.message("Sign in to save your alignment to your member profile.");
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({ manifesto_alignment: result.percent })
      .eq("id", u.user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(`Saved ${result.percent}% alignment to your profile.`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <div className="border-l-4 border-accent pl-4">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">
            Ekurhuleni Manifesto Matcher
          </div>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Where do you stand on Ekurhuleni?
          </h1>
          <p className="mt-3 text-muted-foreground">
            {total} short statements on the municipal questions that matter. Pick{" "}
            <strong>Agree</strong>, <strong>Neutral</strong>, <strong>Disagree</strong> or
            skip. Mark statements as <strong>Double Weight</strong> if they're critical to
            you.
          </p>
        </div>

        {!done ? (
          <>
            {/* Progress */}
            <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>
                Statement {step + 1} / {total}
              </span>
              <span>{current.theme}</span>
            </div>
            <div className="mt-2 h-1 w-full bg-border">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${((step + 1) / total) * 100}%` }}
              />
            </div>

            {/* Card */}
            <article className="mt-6 border-2 border-foreground bg-card p-8 shadow-[8px_8px_0_0_var(--color-foreground)]">
              <div className="text-xs font-bold uppercase tracking-widest text-accent">
                Statement {step + 1}
              </div>
              <p className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">
                {current.statement}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <ChoiceBtn
                  active={currentAnswer.choice === "agree"}
                  onClick={() => pick("agree")}
                  icon={<Check className="h-5 w-5" />}
                  label="Agree"
                />
                <ChoiceBtn
                  active={currentAnswer.choice === "neutral"}
                  onClick={() => pick("neutral")}
                  icon={<Minus className="h-5 w-5" />}
                  label="Neutral"
                />
                <ChoiceBtn
                  active={currentAnswer.choice === "disagree"}
                  onClick={() => pick("disagree")}
                  icon={<X className="h-5 w-5" />}
                  label="Disagree"
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                <label className="flex items-center gap-3">
                  <Switch
                    checked={currentAnswer.doubled}
                    onCheckedChange={(v) => toggleDoubled(!!v)}
                  />
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Double weight this issue
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => pick("skip")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                  Skip statement
                </button>
              </div>
            </article>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="ghost"
                disabled={step === 0}
                onClick={() => setStep(Math.max(0, step - 1))}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step === total - 1 ? (
                <Button
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => setDone(true)}
                >
                  See results <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setStep(Math.min(total - 1, step + 1))}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </>
        ) : (
          <Results
            percent={result.percent}
            breakdown={result.breakdown}
            onSave={saveResult}
            saving={saving}
            onRestart={() => {
              setAnswers({});
              setStep(0);
              setDone(false);
            }}
          />
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Not yet a member?{" "}
          <Link to="/register" className="font-bold uppercase tracking-widest text-accent hover:underline">
            Join ARA Ekurhuleni →
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function ChoiceBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 border-2 px-4 py-5 transition ${
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-background hover:border-accent"
      }`}
    >
      {icon}
      <span className="mt-1 text-sm font-black uppercase tracking-wide">{label}</span>
    </button>
  );
}

function Results({
  percent,
  breakdown,
  onSave,
  saving,
  onRestart,
}: {
  percent: number;
  breakdown: ReturnType<typeof scoreMatcher>["breakdown"];
  onSave: () => void;
  saving: boolean;
  onRestart: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="mt-10 space-y-6">
      <div className="border-2 border-foreground bg-card p-8 shadow-[8px_8px_0_0_var(--color-accent)]">
        <div className="text-xs font-bold uppercase tracking-widest text-accent">
          Your alignment with ARA Ekurhuleni
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-7xl font-black tracking-tighter">{percent}%</span>
          <span className="text-sm uppercase tracking-widest text-muted-foreground">match</span>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden border border-foreground bg-background">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {saving ? "Saving…" : "Save to my profile"}
          </Button>
          <Button variant="outline" onClick={onRestart}>
            Take it again
          </Button>
        </div>
      </div>

      <div className="border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-black uppercase">Statement-by-statement breakdown</h2>
          <p className="text-xs text-muted-foreground">
            Tap any row to expand ARA's justification for that policy stance.
          </p>
        </div>
        <ul className="divide-y divide-border">
          {breakdown.map((b, i) => {
            const isOpen = open === b.statement.id;
            const matchPct =
              b.weight === 0 ? null : Math.round((b.points / b.weight) * 100);
            return (
              <li key={b.statement.id}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : b.statement.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-accent/5"
                >
                  <span className="text-xs font-black uppercase tracking-widest text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      {b.statement.theme}
                      {b.doubled && (
                        <span className="ml-2 border border-accent px-1.5 py-0.5 text-[10px] text-accent">
                          2×
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium">{b.statement.statement}</p>
                  </div>
                  <span className="hidden text-sm font-black sm:inline">
                    {b.choice === "skip" ? "—" : `${matchPct}%`}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border bg-background px-5 py-5 text-sm">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Your choice
                        </div>
                        <div className="mt-1 font-black uppercase">{b.choice}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          ARA Ekurhuleni position
                        </div>
                        <div className="mt-1 font-black uppercase">{b.statement.araPosition}</div>
                      </div>
                    </div>
                    <div className="mt-4 border-l-2 border-accent pl-3 text-muted-foreground">
                      {b.statement.justification}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}