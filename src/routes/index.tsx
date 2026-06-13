import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Users, Vote, Scale } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARAFIRST — Africa Restoration Alliance Member Platform" },
      { name: "description", content: "Join the Africa Restoration Alliance. A POPIA-compliant member platform for civic engagement, voter mobilisation and ward-level organising across South Africa." },
      { property: "og:title", content: "ARAFIRST — Putting SA First" },
      { property: "og:description", content: "Become an ARA member. Secure, POPIA-compliant onboarding for South African citizens." },
    ],
  }),
  component: Index,
});

const PILLARS = [
  { n: "01", title: "Justice for all", body: "An independent judicial system with enforcement powers. Empowerment over violence and gangsterism." },
  { n: "02", title: "End corruption", body: "Transparent, accountable government — without fear of victimisation by state agencies." },
  { n: "03", title: "Thriving economy", body: "Building jobs and the country through internal investment and a shared-build strategy." },
  { n: "04", title: "Equality for all", body: "Free quality education, healthcare and housing. Eradication of shack dwellings." },
];

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-x-0 top-0 select-none overflow-hidden whitespace-nowrap text-center text-[18vw] font-black uppercase leading-none tracking-tighter text-foreground/[0.04]">
            PUTTING SA FIRST
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 border border-accent px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Africa Restoration Alliance
              </div>
              <h1 className="mt-6 text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
                Born out of <br /> the need of <br /> our country.
              </h1>
              <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
                A robust party, radical for change. Join thousands of South Africans
                building a transparent, ward-by-ward movement for restoration.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/register">
                  <Button size="lg" className="h-14 bg-accent px-8 text-accent-foreground hover:bg-accent/90">
                    Become a member <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="h-14 px-8">
                    Member sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-b border-border bg-foreground text-background">
          <div className="mx-auto grid max-w-7xl gap-px bg-background/10 px-0 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, label: "POPIA compliant", body: "Explicit opt-in consent. Right to be forgotten." },
              { icon: Vote, label: "IEC aligned", body: "Voter data never used for intimidation or misinformation." },
              { icon: Users, label: "Ward-level", body: "Organised across all 112 Ekurhuleni wards and beyond." },
            ].map((f) => (
              <div key={f.label} className="bg-foreground px-6 py-8">
                <f.icon className="h-6 w-6 text-accent" />
                <div className="mt-4 text-sm font-bold uppercase tracking-widest text-accent">{f.label}</div>
                <p className="mt-2 text-sm text-background/70">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pillars */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="flex items-end justify-between border-b border-foreground pb-6">
            <h2 className="text-4xl font-black uppercase tracking-tight sm:text-6xl">4 Key Pillars</h2>
            <Scale className="hidden h-10 w-10 text-accent sm:block" />
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div key={p.n} className="bg-background p-8">
                <div className="text-6xl font-black text-accent">{p.n}</div>
                <h3 className="mt-6 text-xl font-black uppercase">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-secondary">
          <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6">
            <h2 className="text-4xl font-black uppercase tracking-tight sm:text-6xl">
              Stand with us. <br /><span className="text-accent">Register today.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
              Registration takes under 2 minutes. Your RSA ID is verified locally and stored securely.
              You control your data — you can request deletion at any time.
            </p>
            <div className="mt-10">
              <Link to="/register">
                <Button size="lg" className="h-14 bg-foreground px-10 text-background hover:bg-foreground/90">
                  Start your membership <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
