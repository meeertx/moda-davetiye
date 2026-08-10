"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/marketing/Logo";
import AuthNavLink from "./AuthNavLink";

const LEFT_NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/tasarimlar", label: "Tasarımlar" },
  { href: "/fiyatlar", label: "Fiyatlar" },
];

const RIGHT_NAV = [
  { href: "/iletisim", label: "İletişim" },
  { href: "/yorumlar", label: "Yorumlar" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

const CATEGORY_NAV = [
  { href: "/tasarimlar?cat=dugun_nisan", label: "Düğün & Nişan" },
  { href: "/tasarimlar?cat=kina", label: "Kına Gecesi" },
  { href: "/tasarimlar?cat=save_the_date", label: "Save the Date" },
  { href: "/tasarimlar", label: "Koleksiyonlar" },
];

const navLink = "text-[11.5px] tracking-[0.06em] uppercase whitespace-nowrap";

interface Props {
  /** Logo altındaki kategori şeridi — ana sayfa, tasarımlar, detay ve fiyatlarda var. */
  showCategories?: boolean;
  /** Üstteki koyu duyuru şeridi — yalnızca ana sayfada var. */
  showAnnouncement?: boolean;
}

export default function SiteHeader({
  showCategories = false,
  showAnnouncement = false,
}: Props) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <>
      {showAnnouncement && (
        <div className="bg-ink text-[oklch(88%_0.02_78)] text-center py-[9px] text-[12.5px] tracking-[0.03em]">
          Yeni · Mermer &amp; Yaldız koleksiyonu yayında —{" "}
          <Link
            href="/tasarimlar"
            className="text-[oklch(72%_0.1_78)] underline"
          >
            şimdi keşfedin →
          </Link>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-[8px] border-b border-line">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 px-8 py-[18px] max-w-[1600px] mx-auto">
          <nav className="flex gap-5 min-w-0 overflow-hidden">
            {LEFT_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${navLink} ${
                  isActive(item.href)
                    ? "text-ink font-semibold"
                    : "text-slate hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="text-ink justify-self-center">
            <Logo size={23} />
          </Link>

          <nav className="flex gap-5 justify-end items-center min-w-0 overflow-hidden">
            {RIGHT_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${navLink} ${
                  isActive(item.href)
                    ? "text-ink font-semibold"
                    : "text-slate hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="w-px h-[14px] bg-line shrink-0" />
            <AuthNavLink className={`${navLink} text-ink hover:text-gold`} />
          </nav>
        </div>

        {showCategories && (
          <div className="flex justify-center gap-11 py-[13px] border-t border-line-soft">
            {CATEGORY_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs tracking-[0.05em] uppercase text-slate hover:text-ink whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
