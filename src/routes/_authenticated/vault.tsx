import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Trash2, Eye, Lock } from "lucide-react";
import { toast } from "sonner";
import { showVaultCV, showVaultBusiness } from "@/lib/personas";

export const Route = createFileRoute("/_authenticated/vault")({
  head: () => ({ meta: [{ title: "Opportunity Vault — ARAFIRST" }] }),
  component: VaultPage,
});

type Doc = {
  id: string; document_type: string; title: string | null;
  file_path: string | null; file_url: string; is_public: boolean; uploaded_at: string;
};

const DOC_TYPES = ["CV", "Business Profile", "Academic Letter", "Company Registration"] as const;

function VaultPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [attrs, setAttrs] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [docType, setDocType] = useState<typeof DOC_TYPES[number]>("CV");
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserId(u.user.id);
      const [{ data: a }, { data: p }, { data: d }] = await Promise.all([
        supabase.from("profile_attributes").select("attribute_value").eq("profile_id", u.user.id),
        supabase.from("profiles").select("primary_role").eq("id", u.user.id).maybeSingle(),
        supabase.from("member_documents").select("*").eq("profile_id", u.user.id).order("uploaded_at", { ascending: false }),
      ]);
      setAttrs((a ?? []).map((x) => x.attribute_value as string));
      setRole((p?.primary_role as string | null) ?? null);
      setDocs((d ?? []) as Doc[]);
    })();
  }, []);

  const canCV = showVaultCV(attrs);
  const canBiz = showVaultBusiness(attrs, role);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    const file = fileRef.current?.files?.[0];
    if (!file) return toast.error("Pick a file first.");
    if (file.size > 10 * 1024 * 1024) return toast.error("Max 10MB.");
    setUploading(true);
    const path = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("member-documents").upload(path, file, { upsert: false });
    if (upErr) { setUploading(false); return toast.error(upErr.message); }
    const { data: signed } = await supabase.storage.from("member-documents").createSignedUrl(path, 60 * 60 * 24 * 7);
    const { error: insErr, data } = await supabase.from("member_documents").insert({
      profile_id: userId, document_type: docType, title: title || file.name,
      file_path: path, file_url: signed?.signedUrl ?? path, is_public: isPublic,
    }).select("*").single();
    setUploading(false);
    if (insErr) return toast.error(insErr.message);
    setDocs((ds) => [data as Doc, ...ds]);
    setTitle(""); if (fileRef.current) fileRef.current.value = "";
    toast.success("Document uploaded.");
  }

  async function remove(d: Doc) {
    if (d.file_path) await supabase.storage.from("member-documents").remove([d.file_path]);
    await supabase.from("member_documents").delete().eq("id", d.id);
    setDocs((ds) => ds.filter((x) => x.id !== d.id));
  }

  async function togglePublic(d: Doc) {
    const next = !d.is_public;
    await supabase.from("member_documents").update({ is_public: next }).eq("id", d.id);
    setDocs((ds) => ds.map((x) => x.id === d.id ? { ...x, is_public: next } : x));
  }

  async function open(d: Doc) {
    if (!d.file_path) return;
    const { data, error } = await supabase.storage.from("member-documents").createSignedUrl(d.file_path, 300);
    if (error || !data) return toast.error("Could not generate link.");
    window.open(data.signedUrl, "_blank", "noopener");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
        <div className="border-l-4 border-accent pl-4">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">Opportunity Vault</div>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">Your documents</h1>
          <p className="mt-3 text-muted-foreground">
            CVs, business profiles, academic letters and company registrations.
            Files are encrypted at rest. You control who sees what.
          </p>
        </div>

        {!canCV && !canBiz && (
          <div className="mt-8 border-2 border-accent bg-accent/10 p-5 text-sm">
            Add persona attributes like <strong>Worker</strong>, <strong>Student</strong>,
            <strong> Hirer</strong> or <strong>Entrepreneur</strong> on your{" "}
            <Link to="/register" className="font-bold underline">profile</Link> to unlock vault upload prompts.
            You can still upload any document type below.
          </div>
        )}

        <form onSubmit={handleUpload} className="mt-8 grid gap-4 border border-border bg-card p-6 sm:grid-cols-2">
          <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
            <Upload className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-black uppercase">Upload a document</h2>
          </div>
          <div>
            <Label>Document type</Label>
            <Select value={docType} onValueChange={(v) => setDocType(v as typeof DOC_TYPES[number])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DOC_TYPES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="title">Title (optional)</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="file">File (PDF, DOC, max 10MB)</Label>
            <Input id="file" ref={fileRef} type="file" accept=".pdf,.doc,.docx" />
          </div>
          <label className="flex items-center justify-between gap-3 sm:col-span-2 border border-border bg-background p-3">
            <div>
              <div className="text-sm font-bold">Allow verified ARA members to find this document</div>
              <div className="text-xs text-muted-foreground">Default: private. Toggle on to appear in the community directory.</div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </label>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={uploading} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </div>
        </form>

        <section className="mt-10">
          <div className="flex items-end justify-between border-b border-border pb-3">
            <h2 className="text-lg font-black uppercase">Your vault ({docs.length})</h2>
            <Link to="/directory" className="text-xs font-bold uppercase tracking-widest text-accent hover:underline">Browse directory →</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {docs.length === 0 && <li className="py-6 text-sm text-muted-foreground">No documents yet.</li>}
            {docs.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-4 w-4 text-accent" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{d.title || "(untitled)"}</div>
                    <div className="text-xs text-muted-foreground">{d.document_type} · {new Date(d.uploaded_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${d.is_public ? "border-accent text-accent" : "border-border text-muted-foreground"}`}>
                    <Lock className="h-3 w-3" /> {d.is_public ? "Discoverable" : "Private"}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => togglePublic(d)}>
                    {d.is_public ? "Make private" : "Make discoverable"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => open(d)}><Eye className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="outline" className="border-destructive text-destructive" onClick={() => remove(d)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}