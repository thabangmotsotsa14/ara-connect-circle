import { Link } from "@tanstack/react-router";
import araLogo from "@/assets/ara-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src={araLogo.url} alt="Africa Restoration Alliance" className="h-10 w-auto bg-background p-1" />
            <div className="text-2xl font-black uppercase tracking-tight">Ekurhuleni First</div>
          </div>
          <p className="mt-3 max-w-xs text-sm text-background/70">
            Africa Restoration Alliance — Ekurhuleni. A member platform for civic
            engagement, ward organising and transparent communication.
          </p>
          <div className="mt-4">
            <a
              href="https://www.youtube.com/@AfricanRestorationAlliance"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent hover:underline"
            >
              YouTube → @AfricanRestorationAlliance
            </a>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-accent">Platform</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/register" className="hover:text-accent">Become a member</Link></li>
            <li><Link to="/auth" className="hover:text-accent">Member sign in</Link></li>
            <li><Link to="/dashboard" className="hover:text-accent">Dashboard</Link></li>
            <li><Link to="/manifesto-matcher" className="hover:text-accent">Ekurhuleni Manifesto Matcher</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-accent">Resources</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-accent">Privacy & POPIA</Link></li>
            <li><Link to="/terms" className="hover:text-accent">Terms & conditions</Link></li>
            <li>
              <a href="https://www.elections.org.za/" target="_blank" rel="noreferrer" className="hover:text-accent">
                IEC South Africa
              </a>
            </li>
            <li>
              <a href="https://www.ekurhuleni.gov.za/" target="_blank" rel="noreferrer" className="hover:text-accent">
                City of Ekurhuleni
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10 px-4 py-4 text-center text-xs text-background/60">
        © {new Date().getFullYear()} Africa Restoration Alliance. POPIA-compliant member platform.
      </div>
    </footer>
  );
}