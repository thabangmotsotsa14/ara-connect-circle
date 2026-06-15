import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldCheck, MapPin, Vote, IdCard, Trash2, FolderOpen, AlertTriangle, Vote as VoteIcon, Users } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { QrShare } from "@/components/qr-share";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Member Dashboard — ARAFIRST" }] }),
  component: Dashboard,
});

type Profile = {
  first_name: string | null; surname: string | null; email: string | null;
  rsa_id_last4: string | null; ekurhuleni_ward: number | null; province: string | null;
  is_registered_voter: boolean; voting_district: string | null; member_number: string | null;
  consent_given_at: string | null; street_address: string | null; city: string | null;
  manifesto_alignment: number | null; primary_role: string | null;
};

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const [{ data: p }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", u.user.id),
      ]);
      setProfile(p as Profile | null);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      setLoading(false);
      if (typeof window !== "undefined") {
        setShareUrl(`${window.location.origin}/register?ref=${u.user.id.slice(0, 8)}`);
      }
    })();
  }, []);

  async function handleDelete() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("profiles").delete().eq("id", u.user.id);
    if (error) return toast.error(error.message);
    await supabase.auth.signOut();
    toast.success("Your profile data has been deleted.");
    navigate({ to: "/" });
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }

  const incomplete = !profile?.rsa_id_last4;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-accent">Member dashboard</div>
            <h1 className="mt-2 text-4xl font-black uppercase tracking-tight">
              Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}
            </h1>
          </div>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline">Admin console</Button>
            </Link>
          )}
        </div>

        {incomplete && (
          <div className="mt-6 border-2 border-accent bg-accent/10 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span className="text-sm font-bold uppercase">Complete your registration</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your membership profile is missing required information.
            </p>
            <Link to="/register">
              <Button className="mt-3 bg-accent text-accent-foreground hover:bg-accent/90">
                Complete profile
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={IdCard} label="RSA ID" value={profile?.rsa_id_last4 ? `********${profile.rsa_id_last4}` : "—"} />
          <Stat icon={MapPin} label="Province" value={profile?.province ?? "—"} sub={profile?.ekurhuleni_ward ? `Ward ${profile.ekurhuleni_ward}` : undefined} />
          <Stat icon={Vote} label="Voter status" value={profile?.is_registered_voter ? "Registered" : "Not registered"} sub={profile?.voting_district ?? undefined} />
          <Stat icon={ShieldCheck} label="Alignment" value={profile?.manifesto_alignment != null ? `${profile.manifesto_alignment}%` : "—"} sub={profile?.primary_role ?? undefined} />
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink to="/vault" icon={FolderOpen} label="Opportunity Vault" sub="Upload CV / business profile" />
          <QuickLink to="/directory" icon={Users} label="Community Directory" sub="Browse member businesses" />
          <QuickLink to="/bottlenecks" icon={AlertTriangle} label="Escalation Desk" sub="Log a structural bottleneck" />
          <QuickLink to="/issues" icon={VoteIcon} label="V.O.T.E. Booklets" sub="Vote on national issues" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 border border-border bg-card p-6">
            <h2 className="text-lg font-black uppercase">Your details</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <Row k="Full name" v={[profile?.first_name, profile?.surname].filter(Boolean).join(" ") || "—"} />
              <Row k="Email" v={profile?.email ?? "—"} />
              <Row k="Street" v={profile?.street_address ?? "—"} />
              <Row k="City" v={profile?.city ?? "—"} />
            </dl>
            <Link to="/register" className="mt-6 inline-block text-sm font-bold uppercase text-accent hover:underline">
              Update profile →
            </Link>
          </div>

          <div className="space-y-6">
            <div className="border border-border bg-card p-6">
              <h2 className="text-lg font-black uppercase">Share & recruit</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                QR your friends and family straight into the ARA member database.
              </p>
              {shareUrl && <div className="mt-4"><QrShare url={shareUrl} caption="Scan to join ARA" /></div>}
            </div>

            <div className="border border-border bg-card p-6">
            <h2 className="text-lg font-black uppercase">Privacy controls</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You can request deletion of all your data at any time (POPIA Right to be Forgotten).
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="mt-4 w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete my data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your membership data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes your member profile. You will be signed out.
                    Your auth account remains until removed separately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-background p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-accent" /> {label}
      </div>
      <div className="mt-2 text-xl font-black">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k}</dt>
      <dd className="mt-0.5 font-medium">{v}</dd>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label, sub }: { to: string; icon: any; label: string; sub: string }) {
  return (
    <Link to={to} className="group bg-card p-5 hover:bg-accent/5">
      <Icon className="h-5 w-5 text-accent" />
      <div className="mt-3 text-sm font-black uppercase tracking-widest group-hover:text-accent">{label}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </Link>
  );
}