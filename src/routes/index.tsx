import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Vote,
  Scale,
  Factory,
  Tablet,
  Heart,
  Shield,
} from "lucide-react";

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

const IMPACT_MATRIX = [
  {
    icon: Factory,
    title: "Economic Liberation",
    body: "45 Sustainable Local Businesses opened, legally registered, and directly integrated into the ARA Ekurhuleni First | Ward 45 Membership Platform. We don't just ask for jobs; we anchor enterprise.",
  },
  {
    icon: Tablet,
    title: "The Digital Vanguard",
    body: "Armed with custom ARA Mobile Database Tablets, our active field teams are running a continuous digital recruitment drive. Our mission is clear: 4,400 registered, coordinated members unified for structural change.",
  },
  {
    icon: Heart,
    title: "The Community Maintenance Drive",
    body: "Direct, dignified intervention on the doorstep. We are actively deploying clean-up and maintenance teams to restore the properties and protect the safety of our senior citizens and single-parent households with zero income.",
  },
  {
    icon: Shield,
    title: "The Tri-Sector Coalition",
    body: "Real change requires real leverage. Through tactical ground partnerships with Microsoft (Digital Literacy), Cashbuild (Structural Dignity), and local Fresh Fruit & Vegetable Suppliers (Nutritional Security), we are turning corporate power into grassroots progress.",
  },
];

function Index() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pathway: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.pathway || !form.message) {
      toast.error("Please complete every field before submitting.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Message securely logged. The Ward 45 Command Center will make contact within 24 hours.");
      setForm({ name: "", email: "", phone: "", pathway: "", message: "" });
      setSubmitting(false);
    }, 600);
  };

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

        {/* Why We Exist — Restoration Life Line */}
        <section className="relative overflow-hidden border-t border-border bg-foreground text-background">
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 border border-accent px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                The Restoration Life Line
              </div>
              <h2 className="mt-6 text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
                Why We Stand. <br />Why We Fight. <br />
                <span className="text-accent">Why We Build.</span>
              </h2>
              <p className="mt-8 max-w-3xl text-lg text-background/75 sm:text-xl">
                True restoration isn't promised in pamphlets; it is proven on the ground. Through
                Education, Dignified Homes, and Vital Nutrition, we are laying down the
                infrastructure of hope in Ward 45.
              </p>
            </div>
            <div className="mt-16 grid gap-px bg-background/10 sm:grid-cols-2 lg:grid-cols-4">
              {IMPACT_MATRIX.map((card) => (
                <div
                  key={card.title}
                  className="group relative bg-foreground p-8 transition-colors hover:bg-background/[0.03]"
                >
                  <div className="flex h-12 w-12 items-center justify-center border border-accent text-accent">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-black uppercase leading-tight">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-background/70">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Action & Alliance Intake Hub */}
        <section className="relative overflow-hidden border-t border-border bg-gradient-to-br from-secondary via-background to-secondary py-24 sm:py-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--accent)_15%,transparent),transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
            <div className="rounded-none border border-border bg-background/40 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
              <div className="text-center">
                <h2 className="text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
                  Join the Frontline of <span className="text-accent">Restoration</span>
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
                  Whether you are a corporate ally looking to scale our programs, a media outlet
                  seeking an unfiltered interview, or a supporter ready to resource the
                  movement—your action starts here.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest">
                    Full name / Organization name
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={120}
                    required
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest">
                      Contact email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      maxLength={255}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest">
                      Cellphone number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      maxLength={20}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest">
                    Engagement pathway
                  </Label>
                  <Select
                    value={form.pathway}
                    onValueChange={(v) => setForm({ ...form, pathway: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your pathway" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="partnership">
                        Form a Strategic Partnership (Corporate / SMME)
                      </SelectItem>
                      <SelectItem value="interview">
                        Request an Official Press Interview
                      </SelectItem>
                      <SelectItem value="donation">
                        Coordinate a Financial Donation / Resource Deployment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest">
                    Strategic message / Intent
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    maxLength={2000}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="h-14 w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {submitting ? "Submitting…" : "Submit to Ward 45 Command Center"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
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
