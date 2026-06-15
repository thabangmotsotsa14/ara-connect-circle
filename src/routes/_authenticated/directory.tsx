import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Briefcase, Eye } from "lucide-react";
import { INDUSTRY_SECTORS } from "@/lib/personas";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/directory")({
  head: () => ({ meta: [{ title: "Community Directory — ARAFIRST" }] }),
  component: DirectoryPage,
});

type Entry = {
  doc_id: string; title: string | null; document_type: string;
  file_path: string; uploaded_at: string;
  profile_id: string; first_name: string | null; surname: string | null;
  industry_sector: string | null; province: string | null; ekurhuleni_ward: number | null;
};

function DirectoryPage() {
  const [rows, setRows] = useState<Entry[]>([]);
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("member_documents")
        .select("id,title,document_type,file_path,uploaded_at,profile_id,profiles!inner(first_name,surname,industry_sector,province,ekurhuleni_ward)")
        .eq("is_public", true)
        .order("uploaded_at", { ascending: false });
      if (error) return;
      const flat: Entry[] = (data ?? []).map((r: any) => ({
        doc_id: r.id, title: r.title, document_type: r.document_type,
        file_path: r.file_path, uploaded_at: r.uploaded_at,
        profile_id: r.profile_id,
        first_name: r.profiles?.first_name ?? null,
        surname: r.profiles?.surname ?? null,
        industry_sector: r.profiles?.industry_sector ?? null,
        province: r.profiles?.province ?? null,
        ekurhuleni_ward: r.profiles?.ekurhuleni_ward ?? null,
      }));
      setRows(flat);
    })();
  }, []);

  const filtered = useMemo(() => rows.filter((r) => {
    if (sector !== "all" && r.industry_sector !== sector) return false;
    if (q) {
      const hay = `${r.title} ${r.first_name} ${r.surname} ${r.industry_sector} ${r.province}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  }), [rows, q, sector]);

  async function open(path: string) {
    const { data, error } = await supabase.storage.from("member-documents").createSignedUrl(path, 300);
    if (error || !data) return toast.error("Could not generate link.");
    window.open(data.signedUrl, "_blank", "noopener");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <div className="border-l-4 border-accent pl-4">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">B2B + B2C</div>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">Community Directory</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Member-owned CVs, business profiles and capability statements that the owner has marked
            discoverable. Hire local. Build local.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Input className="max-w-sm" placeholder="Search name, sector, region…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-56"><SelectValue placeholder="All sectors" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sectors</SelectItem>
              {INDUSTRY_SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <ul className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && <li className="bg-card p-8 text-sm text-muted-foreground">No discoverable members match those filters yet.</li>}
          {filtered.map((r) => (
            <li key={r.doc_id} className="flex flex-col bg-card p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                <Briefcase className="h-3 w-3" /> {r.document_type}
              </div>
              <div className="mt-3 text-lg font-black">{r.first_name} {r.surname}</div>
              <div className="text-xs text-muted-foreground">{r.industry_sector ?? "—"} · {r.province ?? "—"}{r.ekurhuleni_ward ? ` · Ward ${r.ekurhuleni_ward}` : ""}</div>
              {r.title && <div className="mt-3 text-sm">{r.title}</div>}
              <div className="mt-auto pt-4">
                <Button size="sm" variant="outline" onClick={() => open(r.file_path)}>
                  <Eye className="mr-2 h-3.5 w-3.5" /> Open profile
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}