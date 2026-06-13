import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ARAFIRST" },
      { name: "description", content: "How the Africa Restoration Alliance collects, stores and protects your personal information under POPIA." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Effective date: 13 June 2026 · Aligned with the Protection of Personal Information
          Act, No. 4 of 2013 (POPIA) and Section 14 of the Constitution.
        </p>
        <div className="prose prose-sm mt-10 max-w-none space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-xl font-black uppercase">1. Responsible party</h2>
            <p>The Africa Restoration Alliance ("ARA", "we") is the responsible party for the processing of your personal information on the ARAFIRST platform.</p>
          </section>
          <section>
            <h2 className="text-xl font-black uppercase">2. Special personal information</h2>
            <p>Under Section 26 of POPIA, political persuasion is Special Personal Information. We process it only with your explicit, voluntary and informed consent, captured at registration with timestamp and policy version.</p>
          </section>
          <section>
            <h2 className="text-xl font-black uppercase">3. What we collect</h2>
            <ul className="list-disc pl-5">
              <li>First name, surname, contact details</li>
              <li>RSA ID number (validated via Luhn checksum, stored securely)</li>
              <li>Street address, province, Ekurhuleni ward (where applicable)</li>
              <li>Voter registration status and voting district</li>
              <li>Consent records (timestamp, version, channels opted-in)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-black uppercase">4. Purpose</h2>
            <p>Member administration, internal communication, ward-level organising and voter mobilisation. Your data is never sold, never shared with third parties for commercial purposes, and never used for intimidation or misinformation, in line with IEC guidance.</p>
          </section>
          <section>
            <h2 className="text-xl font-black uppercase">5. Security</h2>
            <p>Row-level security restricts access so that only you and authorised ARA administrators can view your record. Administrators only see your RSA ID masked to the last four digits.</p>
          </section>
          <section>
            <h2 className="text-xl font-black uppercase">6. Retention</h2>
            <p>Member data is retained for the duration of your membership and a maximum of 5 years thereafter for legal and electoral record-keeping, unless you request earlier deletion.</p>
          </section>
          <section>
            <h2 className="text-xl font-black uppercase">7. Your rights</h2>
            <p>You have the right to access, correct, object to and request deletion of your information (Right to be Forgotten). You can do this from your member dashboard or by contacting our Information Officer.</p>
          </section>
          <section>
            <h2 className="text-xl font-black uppercase">8. Contact</h2>
            <p>Information Officer: info@ara-sa.org.za. Complaints may be lodged with the Information Regulator of South Africa.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}