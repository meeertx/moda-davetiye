import SiteHeader from "./SiteHeader";
import { SiteFooterFull, SiteFooterSlim } from "./SiteFooter";

interface Props {
  children: React.ReactNode;
  /** Logo altındaki kategori şeridi */
  categories?: boolean;
  /** Üstteki koyu duyuru şeridi */
  announcement?: boolean;
  /** "full" = ana sayfanın dört sütunlu footer'ı, 48/40 = ince footer varyantları */
  footer?: "full" | 48 | 40;
}

/**
 * Pazarlama sayfalarının dış kabuğu: tam yükseklik kolon + header + footer.
 * Prototipteki `<div style="min-height:100vh;display:flex;flex-direction:column">`
 * sarmalayıcısının karşılığı.
 */
export default function SiteShell({
  children,
  categories = false,
  announcement = false,
  footer = 48,
}: Props) {
  return (
    <div className="min-h-screen flex flex-col font-body text-ink bg-cream">
      <SiteHeader showCategories={categories} showAnnouncement={announcement} />
      {children}
      {footer === "full" ? <SiteFooterFull /> : <SiteFooterSlim pad={footer} />}
    </div>
  );
}
