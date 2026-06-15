import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function QrShare({ url, caption }: { url: string; caption?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3 border-2 border-foreground bg-card p-5">
      <div className="bg-white p-3">
        <QRCodeSVG value={url} size={144} level="M" />
      </div>
      {caption && <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">{caption}</p>}
      <div className="flex w-full items-center gap-2">
        <code className="flex-1 truncate border border-border bg-background px-2 py-1.5 text-xs">{url}</code>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            navigator.clipboard?.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
}