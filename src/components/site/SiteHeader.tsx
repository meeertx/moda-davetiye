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

const navLink = "text-[11.5px] tracking-[0.08em] uppercase whitespace-nowrap transition-all duration-200 relative py-1";

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
        <div className="bg-[oklch(16%_0.02_50)] text-snow text-center py-2 px-4 text-[12px] tracking-[0.04em] border-b border-gold/20 relative z-50 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold/20 text-gold-light text-[10px] font-semibold tracking-widest uppercase border border-gold/30">
            ★ VIP YENİ
          </span>
          <span className="text-mist font-light">Mermer &amp; Yaldız koleksiyonu yayında</span>
          <span className="text-gold/40">•</span>
          <Link
            href="/tasarimlar"
            className="text-gold-light hover:text-white font-medium underline underline-offset-4 decoration-gold/40 hover:decoration-gold transition-colors"
          >
            şimdi keşfedin →
          </Link>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-xl border-b border-gold/15 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-6 px-8 py-4 max-w-[1600px] mx-auto">
          <nav className="flex gap-7 items-center min-w-0 overflow-hidden">
            {LEFT_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${navLink} ${
                    active
                      ? "text-ink font-semibold"
                      : "text-slate hover:text-ink"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold to-gold-light rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <Link href="/" className="text-ink justify-self-center group transition-transform duration-300 hover:scale-105">
            <Logo size={24} />
          </Link>

          <nav className="flex gap-7 justify-end items-center min-w-0 overflow-hidden">
            {RIGHT_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${navLink} ${
                    active
                      ? "text-ink font-semibold"
                      : "text-slate hover:text-ink"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold to-gold-light rounded-full" />
                  )}
                </Link>
              );
            })}
            <div className="w-px h-4 bg-line-soft shrink-0" />
            <AuthNavLink className={`${navLink} text-ink hover:text-gold font-medium`} />
          </nav>
        </div>

        {showCategories && (
          <div className="flex justify-center gap-10 py-2.5 bg-paper/50 backdrop-blur-md border-t border-line-soft/80 shadow-inner">
            {CATEGORY_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[11.5px] tracking-[0.08em] uppercase text-slate/90 hover:text-gold transition-colors font-medium whitespace-nowrap flex items-center gap-1.5 group"
              >
                <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
