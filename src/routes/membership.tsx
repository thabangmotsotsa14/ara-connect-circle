import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { toast } from "sonner";
import araLogo from "@/assets/ara-logo.png.asset.json";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership Form — Africa Restoration Alliance" },
      { name: "description", content: "Apply for membership of the Africa Restoration Alliance. Complete the official ARA membership form." },
    ],
  }),
  component: MembershipPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  gender: z.string().optional(),
  date_of_birth: z.string().optional(),
  id_number: z.string().trim().max(20).optional(),
  nationality: z.string().trim().max(60).optional(),
  religion: z.string().trim().max(60).optional(),
  residence_status: z.string().optional(),
  marital_status: z.string().optional(),
  mobile_no: z.string().trim().min(6).max(20),
  address: z.string().trim().max(200).optional(),
  suburb: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  province: z.string().trim().max(80).optional(),
  postal_code: z.string().trim().max(10).optional(),
  country: z.string().trim().max(60).optional(),
  email: z.string().trim().email().max(255),
  municipality: z.string().trim().max(80).optional(),
  ward: z.string().trim().max(20).optional(),
  ward_leader: z.string().trim().max(120).optional(),
  captured_by: z.string().trim().max(120).optional(),
  marketing_consent: z.boolean(),
  voter_registration_status: z.string().optional(),
});

type FormState = z.input<typeof schema>;

const initial: FormState = {
  full_name: "", gender: "", date_of_birth: "", id_number: "", nationality: "",
  religion: "", residence_status: "", marital_status: "", mobile_no: "",
  address: "", suburb: "", city: "", province: "Gauteng", postal_code: "",
  country: "South Africa", email: "", municipality: "City of Ekurhuleni",
  ward: "", ward_leader: "", captured_by: "", marketing_consent: false,
  voter_registration_status: "",
};

function MembershipPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please complete the required fields.");
      return;
    }
    setSubmitting(true);
    const payload = Object.fromEntries(
      Object.entries(parsed.data).map(([k, v]) => [k, v === "" ? null : v]),
    );
    const { error } = await supabase.from("membership_applications").insert(payload as never);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Membership application submitted. ARA will be in touch.");
    setForm(initial);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        {/* Header banner */}
        <div className="overflow-hidden border border-border bg-[hsl(330_85%_55%)]">
          <div className="flex items-stretch">
            <div className="flex items-center justify-center bg-white p-4">
              <img src={araLogo.url} alt="ARA logo" className="h-20 w-auto" />
            </div>
            <div className="flex flex-1 flex-col justify-center px-6 py-4">
              <div className="rounded-md border-2 border-sky-300 bg-white px-6 py-3 text-center">
                <h1 className="text-3xl font-black uppercase tracking-tight text-foreground sm:text-4xl">
                  Membership Form
                </h1>
              </div>
              <div className="mt-3 text-center text-lg font-bold uppercase tracking-wide text-white">
                Africa Restoration Alliance
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-8">
          <Section title="Personal Information">
            <Field label="Full Name" required>
              <Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} maxLength={120} required />
            </Field>
            <Field label="Gender">
              <RadioGroup className="flex gap-6" value={form.gender} onValueChange={(v) => set("gender", v)}>
                <Radio v="Male" /> <Radio v="Female" />
              </RadioGroup>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date of Birth">
                <Input type="date" value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} />
              </Field>
              <Field label="ID Number">
                <Input value={form.id_number} onChange={(e) => set("id_number", e.target.value)} maxLength={20} />
              </Field>
              <Field label="Nationality">
                <Input value={form.nationality} onChange={(e) => set("nationality", e.target.value)} maxLength={60} />
              </Field>
              <Field label="Religion">
                <Input value={form.religion} onChange={(e) => set("religion", e.target.value)} maxLength={60} />
              </Field>
            </div>
            <Field label="Residence Status">
              <RadioGroup className="flex gap-6" value={form.residence_status} onValueChange={(v) => set("residence_status", v)}>
                <Radio v="Residence" /> <Radio v="Non-Residence" />
              </RadioGroup>
            </Field>
            <Field label="Marital Status">
              <RadioGroup className="flex flex-wrap gap-6" value={form.marital_status} onValueChange={(v) => set("marital_status", v)}>
                <Radio v="Single" /> <Radio v="Married" /> <Radio v="Divorced" /> <Radio v="Widowed" />
              </RadioGroup>
            </Field>
            <Field label="Mobile No" required>
              <Input type="tel" value={form.mobile_no} onChange={(e) => set("mobile_no", e.target.value)} maxLength={20} required placeholder="+27..." />
            </Field>
          </Section>

          <Section title="Contact Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Address"><Input value={form.address} onChange={(e) => set("address", e.target.value)} maxLength={200} /></Field>
              <Field label="Suburb"><Input value={form.suburb} onChange={(e) => set("suburb", e.target.value)} maxLength={80} /></Field>
              <Field label="City"><Input value={form.city} onChange={(e) => set("city", e.target.value)} maxLength={80} /></Field>
              <Field label="Province"><Input value={form.province} onChange={(e) => set("province", e.target.value)} maxLength={80} /></Field>
              <Field label="Code"><Input value={form.postal_code} onChange={(e) => set("postal_code", e.target.value)} maxLength={10} /></Field>
              <Field label="Country"><Input value={form.country} onChange={(e) => set("country", e.target.value)} maxLength={60} /></Field>
            </div>
            <Field label="Email" required>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={255} required />
            </Field>
          </Section>

          <Section title="More Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Municipality"><Input value={form.municipality} onChange={(e) => set("municipality", e.target.value)} maxLength={80} /></Field>
              <Field label="Ward"><Input value={form.ward} onChange={(e) => set("ward", e.target.value)} maxLength={20} placeholder="e.g. 45" /></Field>
              <Field label="Ward Leader"><Input value={form.ward_leader} onChange={(e) => set("ward_leader", e.target.value)} maxLength={120} /></Field>
              <Field label="Captured By"><Input value={form.captured_by} onChange={(e) => set("captured_by", e.target.value)} maxLength={120} /></Field>
            </div>
            <Field label="Consent (Yes to use your personal information for Marketing Purposes)">
              <RadioGroup
                className="flex gap-6"
                value={form.marketing_consent ? "Yes" : form.marketing_consent === false && form.marketing_consent !== undefined ? "No" : ""}
                onValueChange={(v) => set("marketing_consent", v === "Yes")}
              >
                <Radio v="Yes" /> <Radio v="No" />
              </RadioGroup>
            </Field>
            <Field label="Voter Registration Status">
              <RadioGroup className="flex flex-wrap gap-6" value={form.voter_registration_status} onValueChange={(v) => set("voter_registration_status", v)}>
                <Radio v="Registered Voter" /> <Radio v="Not Registered Voter" />
              </RadioGroup>
            </Field>
          </Section>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs text-muted-foreground">
              By submitting, you authorise ARA to contact you regarding your membership application.
            </p>
            <Button type="submit" size="lg" className="bg-[hsl(330_85%_55%)] text-white hover:bg-[hsl(330_85%_48%)]" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Membership Application"}
            </Button>
          </div>
        </form>

        <div className="mt-10 grid gap-2 border-t-2 border-[hsl(330_85%_55%)] pt-6 text-sm text-muted-foreground sm:grid-cols-3">
          <div>+27 61 429 6288<br />ara.ekurhuleniregion@gmail.com<br />www.ara-sa.org.za</div>
          <div>16688 Seinoli Street, Ext 26,<br />Vosloorus, 1475, Gauteng<br />Province, South Africa</div>
          <div className="text-right" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border bg-card">
      <div className="bg-[hsl(330_85%_55%)] px-4 py-2 text-center text-base font-black uppercase tracking-wide text-white">
        {title}
      </div>
      <div className="space-y-5 p-6">{children}</div>
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-bold uppercase tracking-wide">
        {label}{required && <span className="text-destructive"> *</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Radio({ v }: { v: string }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <RadioGroupItem value={v} id={`r-${v}`} />
      <span>{v}</span>
    </label>
  );
}