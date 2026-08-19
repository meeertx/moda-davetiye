import Link from "next/link";
import Logo from "@/components/marketing/Logo";
import { BRAND } from "@/lib/brand";

const PRODUCT_LINKS = [
  { href: "/tasarimlar", label: "Tema Koleksiyonları" },
  { href: "/fiyatlar", label: "Paketler & Fiyatlar" },
  { href: "/yorumlar", label: "Çift Yorumları" },
];

const COMPANY_LINKS = [
  { href: "/hakkimizda", label: "Hakkımızda & Hikaye" },
  { href: "/iletisim", label: "İletişim & Destek" },
  { href: "/panel", label: "Müşteri Paneli" },
];

const LEGAL_LINKS = [
  { href: "/yasal#kullanim", label: "Kullanım Şartları" },
  { href: "/yasal#gizlilik", label: "Gizlilik Politikası" },
  { href: "/yasal#kvkk", label: "KVKK Aydınlatma Metni" },
];

const columnTitle = "text-[11.5px] font-semibold tracking-[0.2em] uppercase text-gold mb-5";
const columnLinks = "flex flex-col gap-3 text-[14px]";
const footerLink = "text-amber-100/70 hover:text-amber-200 transition-colors font-light";

/** Ana sayfadaki geniş lüks footer. */
export function SiteFooterFull() {
  return (
    <footer className="bg-[oklch(14%_0.015_270)] text-snow pt-20 pb-10 px-6 sm:px-14 border-t border-gold/30 relative overflow-hidden">
      {/* Ambient Lighting Backdrop */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-gold/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Top Trust Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-14 border-b border-gold/20 mb-14 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 text-gold flex items-center justify-center text-sm font-bold">✦</span>
            <div>
              <div className="text-sm font-semibold text-amber-100">%100 Lüks Dijital Deneyim</div>
              <div className="text-xs text-mist font-light">Canlı müzik &amp; 3D zarf açılış sahneleri</div>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 text-gold flex items-center justify-center text-sm font-bold">✦</span>
            <div>
              <div className="text-sm font-semibold text-amber-100">Anlık LCV &amp; Katılım Takibi</div>
              <div className="text-xs text-mist font-light">Konuk listenizi panelden canlı yönetin</div>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 text-gold flex items-center justify-center text-sm font-bold">✦</span>
            <div>
              <div className="text-sm font-semibold text-amber-100">WhatsApp &amp; SMS Uyumlu</div>
              <div className="text-xs text-mist font-light">Tek tıkla tüm konuklarınıza iletin</div>
            </div>
          </div>
        </div>

        {/* Main Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 pb-14 border-b border-gold/20">
          <div>
            <div className="mb-4">
              <Logo size={24} tone="dark-bg" />
            </div>
            <p className="text-sm leading-relaxed text-mist max-w-[320px] font-light mb-6">
              Çiftler için özel işlenmiş 7 lüks tema koleksiyonu ile prestijli dijital davetiye ve LCV yönetim atölyesi.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold-light text-xs font-medium">
              <span>📍 İstanbul, Türkiye</span>
            </div>
          </div>

          <div>
            <div className={columnTitle}>Koleksiyonlar</div>
            <div className={columnLinks}>
              {PRODUCT_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={footerLink}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className={columnTitle}>Kurumsal</div>
            <div className={columnLinks}>
              {COMPANY_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={footerLink}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className={columnTitle}>Yasal &amp; Güvenlik</div>
            <div className={columnLinks}>
              {LEGAL_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={footerLink}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Ribbon */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mist font-light">
          <div>
            © {BRAND.copyrightYear} <span className="text-gold font-medium">{BRAND.name}</span> — Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-gold/60">✦ Premium Digital Invitations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** İç sayfalardaki tek satırlık lüks footer. */
export function SiteFooterSlim({ pad = 48 }: { pad?: 40 | 48 }) {
  return (
    <footer
      className={`mt-auto px-6 sm:px-14 ${
        pad === 48 ? "py-10 sm:py-12" : "py-8 sm:py-10"
      } bg-[oklch(14%_0.015_270)] text-mist text-xs border-t border-gold/20
      flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
    >
      <div className="flex items-center gap-3">
        <Logo size={20} tone="dark-bg" />
        <span className="text-gold/40">•</span>
        <span className="text-amber-100/80 font-light">Dijital Davetiye Atölyesi</span>
      </div>
      <div className="font-light">
        © {BRAND.copyrightYear} <span className="text-gold font-medium">{BRAND.name}</span>
      </div>
    </footer>
  );
}
