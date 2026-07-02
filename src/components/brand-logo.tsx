import { useState } from "react";
import araLogo from "@/assets/ara-logo.png.asset.json";

// Cache-busting version — bump when replacing public/logo.png
const LOGO_VERSION = "2026070201";
const PRIMARY_SRC = `/logo.png?v=${LOGO_VERSION}`;
const CDN_FALLBACK = araLogo.url;
const INLINE_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' rx='6' fill='%23111'/><text x='50%' y='55%' text-anchor='middle' font-family='Arial,sans-serif' font-size='14' font-weight='700' fill='%23fff'>ARA</text></svg>`
  );

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { alt?: string };

export function BrandLogo({ alt = "Africa Restoration Alliance", className, ...rest }: Props) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const src = stage === 0 ? PRIMARY_SRC : stage === 1 ? CDN_FALLBACK : INLINE_FALLBACK;
  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={() => setStage((s) => (s < 2 ? ((s + 1) as 0 | 1 | 2) : s))}
      className={className}
      {...rest}
    />
  );
}