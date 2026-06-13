import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EKURHULENI_WARDS, SA_PROVINCES, CONSENT_VERSION } from "@/lib/wards";
import { validateRsaId } from "@/lib/luhn";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Become a member — ARAFIRST" },
      { name: "description", content: "Register as a member of the Africa Restoration Alliance. POPIA-compliant onboarding with explicit consent." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [rsaId, setRsaId] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState<string>("Gauteng");
  const [isVoter, setIsVoter] = useState(false);
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState<string>("");
  const [consentParty, setConsentParty] = useState(false);
  const [consentData, setConsentData] = useState(false);
  const [consentComms, setConsentComms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      setUserEmail(data.user.email ?? null);
      setChecking(false);
    });
  }, [navigate]);

  const idCheck = useMemo(() => (rsaId.length === 13 ? validateRsaId(rsaId) : null), [rsaId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consentParty || !consentData) {
      toast.error("You must explicitly consent to political party membership and data processing.");
      return;
    }
    const idResult = validateRsaId(rsaId);
    if (!idResult.ok) {
      toast.error(idResult.reason ?? "Invalid RSA ID");
      return;
    }
    if (province === "Gauteng" && !ward) {
      toast.error("Please select your Ekurhuleni ward (1–112) or choose another province.");
      return;
    }
    setSubmitting(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      navigate({ to: "/auth" });
      return;
    }
    const { error } = await supabase.from("profiles").upsert({
      id: u.user.id,
      email: userEmail,
      first_name: firstName.trim(),
      surname: surname.trim(),
      phone: phone.trim() || null,
      rsa_id: rsaId,
      rsa_id_last4: rsaId.slice(-4),
      street_address: street.trim() || null,
      city: city.trim() || null,
      province,
      is_registered_voter: isVoter,
      voting_district: isVoter ? district.trim() || null : null,
      ekurhuleni_ward: ward ? parseInt(ward, 10) : null,
      consent_given_at: new Date().toISOString(),
      consent_version: CONSENT_VERSION,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome to ARA. Your membership is registered.");
    navigate({ to: "/dashboard" });
  }

  if (checking) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <div className="border-l-4 border-accent pl-4">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">Member registration</div>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Complete your profile
          </h1>
          <p className="mt-3 text-muted-foreground">
            Your information is stored securely under POPIA. Only you and authorised ARA
            administrators can access your profile, and admins only see a masked ID.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-10">
          {/* Personal */}
          <section className="border border-border bg-card p-6">
            <h2 className="text-lg font-black uppercase">Personal details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="first_name">First name *</Label>
                <Input id="first_name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={100} />
              </div>
              <div>
                <Label htmlFor="surname">Surname *</Label>
                <Input id="surname" required value={surname} onChange={(e) => setSurname(e.target.value)} maxLength={100} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+27..." />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="rsa_id">RSA ID number *</Label>
                <Input
                  id="rsa_id"
                  required
                  inputMode="numeric"
                  pattern="\d{13}"
                  maxLength={13}
                  value={rsaId}
                  onChange={(e) => setRsaId(e.target.value.replace(/\D/g, "").slice(0, 13))}
                  placeholder="13-digit South African ID"
                />
                {idCheck && (
                  <p className={`mt-1 text-xs ${idCheck.ok ? "text-accent" : "text-destructive"}`}>
                    {idCheck.ok ? "Valid RSA ID (Luhn passed)" : idCheck.reason}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Encrypted at rest. Admins only ever see ********{rsaId.slice(-4) || "####"}.
                </p>
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="border border-border bg-card p-6">
            <h2 className="text-lg font-black uppercase">Address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="street">Street address</Label>
                <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} maxLength={255} />
              </div>
              <div>
                <Label htmlFor="city">City / Town</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} maxLength={120} />
              </div>
              <div>
                <Label>Province</Label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SA_PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {province === "Gauteng" && (
                <div className="sm:col-span-2">
                  <Label>Ekurhuleni ward (1–112)</Label>
                  <Select value={ward} onValueChange={setWard}>
                    <SelectTrigger><SelectValue placeholder="Select your ward" /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {EKURHULENI_WARDS.map((w) => (
                        <SelectItem key={w} value={String(w)}>Ward {w}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </section>

          {/* Voter */}
          <section className="border border-border bg-card p-6">
            <h2 className="text-lg font-black uppercase">Voter information</h2>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="is_voter" className="text-base">I am a registered voter</Label>
                <p className="text-xs text-muted-foreground">Confirm your voting district below if yes.</p>
              </div>
              <Switch id="is_voter" checked={isVoter} onCheckedChange={setIsVoter} />
            </div>
            {isVoter && (
              <div className="mt-4">
                <Label htmlFor="district">Voting district</Label>
                <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} maxLength={120} placeholder="e.g. Tembisa Central" />
              </div>
            )}
          </section>

          {/* Consent */}
          <section className="border-2 border-accent bg-accent/5 p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-black uppercase">POPIA consent</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Section 26 of POPIA classifies political affiliation as Special Personal Information.
              We require your explicit, voluntary and informed consent to process it.
            </p>
            <div className="mt-4 space-y-4 text-sm">
              <label className="flex items-start gap-3">
                <Checkbox required checked={consentParty} onCheckedChange={(v) => setConsentParty(v === true)} />
                <span>
                  I understand that by registering I am joining the <strong>Africa Restoration Alliance</strong>,
                  a registered political party in South Africa.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <Checkbox required checked={consentData} onCheckedChange={(v) => setConsentData(v === true)} />
                <span>
                  I expressly consent to ARA processing my personal information — including my political
                  persuasion and RSA ID — strictly for internal communication, ward organising and
                  voter mobilisation, as set out in the{" "}
                  <Link to="/privacy" className="underline">Privacy Policy</Link>.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <Checkbox checked={consentComms} onCheckedChange={(v) => setConsentComms(v === true)} />
                <span className="text-muted-foreground">
                  (Optional) Send me ward-level updates via SMS and email. I can opt out at any time.
                </span>
              </label>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              You may request deletion of your data at any time from your member dashboard
              (Right to be Forgotten). Consent version: {CONSENT_VERSION}.
            </p>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-accent">
              Cancel
            </Link>
            <Button
              type="submit"
              size="lg"
              disabled={submitting || !consentParty || !consentData}
              className="bg-accent px-8 text-accent-foreground hover:bg-accent/90"
            >
              {submitting ? "Submitting…" : "Confirm membership"}
            </Button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}