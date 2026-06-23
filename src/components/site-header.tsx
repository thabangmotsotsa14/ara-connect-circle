import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLowData } from "@/hooks/use-low-data";
import { Wifi, WifiOff } from "lucide-react";

export function SiteHeader() {
  const { user } = useAuth();
  const { lowData, toggle } = useLowData();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Identity Branding */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="https://ara-sa.org.za/wp-content/uploads/2023/04/cropped-ARA-LOGO-192x192.png" 
            alt="Africa Restoration Alliance" 
            className="h-10 w-10 object-contain" 
          />
          <span className="hidden text-xs font-bold uppercase tracking-wider sm:inline md:text-sm">
            Ekurhuleni First <span className="mx-1 text-accent">|</span> Ward 45
          </span>
        </Link>
        
        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 text-sm font-bold uppercase tracking-wide md:flex">
          <Link to="/" className="hover:text-accent">Home</Link>
          <Link to="/manifesto-matcher" className="hover:text-accent">Matcher</Link>
          <Link to={"/party-intel" as any} className="hover:text-accent">Council Insights</Link>
          <Link to="/register" className="hover:text-accent">Join</Link>
          <Link to="/membership" className="hover:text-accent">Membership</Link>
        </nav>
        
        {/* Interface Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Bandwidth Constraints Toggle Button */}
          <button
            type="button"
            onClick={toggle}
            title={lowData ? "Low data mode ON" : "Low data mode OFF"}
            className="hidden items-center gap-1.5 border border-border px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:border-accent hover:text-accent sm:inline-flex"
          >
            {lowData ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
            {lowData ? "Lite" : "Full"}
          </button>
          
          {/* System Authentication State Machine */}
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => supabase.auth.signOut()}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Become a member
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}