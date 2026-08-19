"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/marketing/Logo";
import { signOutAction } from "@/app/actions/auth";

export interface NavItem {
  href: string;
  label: string;
  /**
   * Alt sayfalarda da bu öğe aktif kalsın diye ek yol önekleri
   * (örn. "/panel/siparis"). Fonksiyon değil dizi: sunucu bileşeninden
   * istemci bileşenine yalnızca serileştirilebilir değerler geçebilir.
   */
  matchPrefixes?: string[];
}

/**
 * Müşteri ve yönetim panellerinin ortak menüsü.
 *
 * Geniş ekranda solda sabit bir sütun, dar ekranda üstte yatay kaydırılabilir
 * bir şerit olur — panel telefondan da kullanılabilsin diye.
 *
 * İki panel aynı açık, sıcak yüzeyi paylaşır; yönetim tarafı farkını
 * `badge` etiketiyle belli eder.
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

  return (
    <aside
      className="
        bg-cream/90 backdrop-blur-2xl border-line-panel shrink-0
        border-b px-5 py-4
        md:w-64 md:border-b-0 md:border-r md:border-gold/20 md:px-6 md:py-8
        md:flex md:flex-col shadow-sm
      "
    >
      <div className="flex items-center justify-between gap-4 md:block">
        <div className="md:px-2">
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

        {/* Dar ekranda hesap bilgisi ve çıkış üst satırda durur */}
        <div className="text-right md:hidden">
          {fullName && <div className="text-xs font-semibold text-ink">{fullName}</div>}
          <form action={signOutAction}>
            <button
              type="submit"
              className="cursor-pointer bg-transparent border-0 p-0 text-xs text-gold hover:underline"
            >
              Çıkış yap
            </button>
          </form>
        </div>
      </div>

      <nav
        className="
          flex gap-1.5 mt-5 overflow-x-auto
          md:flex-col md:mt-10 md:overflow-visible
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

      {/* Geniş ekranda hesap bilgisi menünün altına yerleşir */}
      <div className="hidden md:block mt-auto pt-8 px-2 border-t border-gold/15">
        {(fullName || email) && (
          <div className="text-xs text-muted leading-[1.6] mb-3 break-words">
            {fullName && <div className="text-ink font-semibold text-sm mb-0.5">{fullName}</div>}
            <div className="text-[11.5px] text-muted font-light">{email}</div>
          </div>
        )}
        <form action={signOutAction}>
          <button
            type="submit"
            className="cursor-pointer bg-transparent border-0 p-0 text-xs text-gold hover:text-gold-light font-medium underline underline-offset-4 transition-colors duration-150 apple-press"
          >
            Güvenli Çıkış yap →
          </button>
        </form>
      </div>
    </aside>
  );
}
