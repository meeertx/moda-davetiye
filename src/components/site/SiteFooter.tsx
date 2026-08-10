import Link from "next/link";
import Logo from "@/components/marketing/Logo";
import { BRAND } from "@/lib/brand";

const PRODUCT_LINKS = [
  { href: "/tasarimlar", label: "Tasarımlar" },
  { href: "/fiyatlar", label: "Fiyatlar" },
];

const COMPANY_LINKS = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

const LEGAL_LINKS = [
  { href: "/yasal#kullanim", label: "Kullanım Şartları" },
  { href: "/yasal#gizlilik", label: "Gizlilik Politikası" },
  { href: "/yasal#kvkk", label: "KVKK" },
];

const columnTitle =
  "text-xs tracking-[0.05em] uppercase text-snow mb-4";
const columnLinks = "flex flex-col gap-2.5 text-[13.5px]";
const footerLink = "text-faint hover:text-snow";

/** Ana sayfadaki dört sütunlu geniş footer. */
export function SiteFooterFull() {
  return (
    <footer className="px-14 pt-16 pb-8 bg-ink-deep text-faint">
      <div className="max-w-[1440px] mx-auto grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-11 border-b border-line-dark">
        <div>
          <div className="text-snow mb-3.5">
            <Logo size={24} tone="dark-bg" />
          </div>
          <p className="text-[13px] leading-[1.7] max-w-[260px]">
            Çiftler için dijital davetiye ve RSVP platformu.
          </p>
        </div>
        <div>
          <div className={columnTitle}>Ürün</div>
          <div className={columnLinks}>
            {PRODUCT_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={footerLink}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className={columnTitle}>Şirket</div>
          <div className={columnLinks}>
            {COMPANY_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={footerLink}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className={columnTitle}>Yasal</div>
          <div className={columnLinks}>
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={footerLink}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto pt-6 text-[12.5px]">
        © {BRAND.copyrightYear} {BRAND.name} — Tüm hakları saklıdır.
      </div>
    </footer>
  );
}

/**
 * İç sayfalardaki tek satırlık footer.
 * Kaynak prototipte iki dikey boşluk varyantı var: 48px (galeri/fiyat
 * sayfaları) ve 40px (kurumsal/yasal sayfalar).
 */
export function SiteFooterSlim({ pad = 48 }: { pad?: 40 | 48 }) {
  return (
    <footer
      className={`mt-auto px-6 sm:px-14 ${
        pad === 48 ? "py-10 sm:py-12" : "py-8 sm:py-10"
      } bg-ink text-faint-dim text-[13px]
      flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
    >
      <div className="text-snow">
        <Logo size={20} tone="dark-bg" />
      </div>
      <div>
        © {BRAND.copyrightYear} {BRAND.name}
      </div>
    </footer>
  );
}
