"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/marketing/Logo";
import { signOutAction } from "@/app/actions/auth";

export interface NavItem {
  href: string;
  label: string;
  matchPrefixes?: string[];
}

/**
 * Müşteri ve yönetim panellerinin ortak menüsü.
 * VIP Cam efekti ve 24K Altın Yaldız detaylı profil kartı.
 */
export default function SidebarNav({
  items,
  badge,
  fullName,
  email,
}: {
  items: NavItem[];
  badge?: string;
  fullName?: string | null;
  email?: string | null;
}) {
  const pathname = usePathname();

  const isActive = (item: NavItem) =>
    pathname === item.href ||
    (item.matchPrefixes?.some((prefix) => pathname.startsWith(prefix)) ?? false);

  const initialLetter = (fullName || email || "M").charAt(0).toUpperCase();

  return (
    <aside
      className="
        bg-cream/90 backdrop-blur-2xl border-line-panel shrink-0
        border-b px-5 py-4
        md:w-64 md:border-b-0 md:border-r md:border-gold/20 md:px-6 md:py-8
        md:flex md:flex-col shadow-sm justify-between
      "
    >
      <div>
        <div className="flex items-center justify-between gap-4 md:block">
          <div className="md:px-1">
            <Link href="/" className="text-ink inline-block group transition-transform duration-200 hover:scale-105">
              <Logo size={23} />
            </Link>
            {badge ? (
              <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-[10px] tracking-[0.18em] uppercase text-gold font-semibold shadow-xs">
                ★ {badge}
              </div>
            ) : (
              <div className="mt-1.5 text-[10.5px] tracking-[0.14em] uppercase text-gold font-medium">
                MÜŞTERİ PANELİ
              </div>
            )}
          </div>

          {/* Dar ekranda mobil çıkış butonu */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="text-right">
              {fullName && <div className="text-xs font-semibold text-ink truncate max-w-[120px]">{fullName}</div>}
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="cursor-pointer px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/25 text-red-700 text-[11px] font-semibold apple-press"
              >
                Çıkış
              </button>
            </form>
          </div>
        </div>

        <nav
          className="
            flex gap-1.5 mt-5 overflow-x-auto
            md:flex-col md:mt-8 md:overflow-visible
          "
        >
          {items.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap px-4 py-3 rounded-xl text-xs tracking-wide transition-all duration-200 apple-press ${
                  active
                    ? "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C09622] text-ink-deep font-bold shadow-md border border-gold/50"
                    : "text-slate hover:bg-gold/15 hover:text-ink font-medium"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Geniş ekranda lüks Profil Kartı ve Oturumu Kapat Butonu */}
      <div className="hidden md:block mt-8 pt-5 border-t border-gold/20">
        <div className="glass-luxury rounded-2xl p-3.5 border border-gold/25 shadow-xs flex flex-col gap-3 transition-all hover:border-gold/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F5E6B3] to-[#C09622] text-ink-deep font-bold text-xs flex items-center justify-center shrink-0 shadow-xs border border-gold/40">
              {initialLetter}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-ink font-semibold text-xs truncate leading-tight">
                {fullName || "Kullanıcı Hesabı"}
              </div>
              <div className="text-[10.5px] text-muted font-light truncate mt-0.5">
                {email || "Oturum Açık"}
              </div>
            </div>
          </div>

          <form action={signOutAction} className="w-full">
            <button
              type="submit"
              className="w-full cursor-pointer px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-700 text-[11.5px] font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 apple-press shadow-xs"
            >
              <span>🔒 Güvenli Çıkış Yap</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
