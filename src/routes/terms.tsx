import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — ARAFIRST" },
      { name: "description", content: "ARAFIRST membership terms and conditions." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">Terms & Conditions</h1>
        <div className="prose prose-sm mt-10 max-w-none space-y-6 text-sm leading-relaxed text-foreground/90">
          <p>By creating an ARAFIRST member account you confirm the following:</p>
          <ol className="list-decimal space-y-3 pl-5">
            <li>You are a South African citizen or permanent resident, 18 years or older.</li>
            <li>You are joining the <strong>Africa Restoration Alliance</strong>, a registered South African political party.</li>
            <li>The information you provide — including your RSA ID — is true and your own.</li>
            <li>You consent, voluntarily and explicitly, to the processing of your personal information as described in the Privacy Policy.</li>
            <li>You may withdraw consent and request data deletion at any time; this may end your active membership.</li>
            <li>ARA will never sell your data and will not use it for intimidation, harassment or misinformation.</li>
            <li>The platform is provided on an "as is" basis; ARA is not liable for losses arising from misuse of credentials.</li>
          </ol>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}