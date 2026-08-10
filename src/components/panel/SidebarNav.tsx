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
        bg-rail border-line-panel shrink-0
        border-b px-5 py-4
        md:w-60 md:border-b-0 md:border-r md:px-5 md:py-7
        md:flex md:flex-col
      "
    >
      <div className="flex items-center justify-between gap-4 md:block">
        <div className="md:px-2">
          <Link href="/" className="text-ink">
            <Logo size={22} />
          </Link>
          {badge && (
            <div className="mt-1 text-[11px] tracking-[0.16em] uppercase text-gold">
              {badge}
            </div>
          )}
        </div>

        {/* Dar ekranda hesap bilgisi ve çıkış üst satırda durur */}
        <div className="text-right md:hidden">
          {fullName && <div className="text-xs text-ink">{fullName}</div>}
          <form action={signOutAction}>
            <button
              type="submit"
              className="cursor-pointer bg-transparent border-0 p-0 text-xs text-muted hover:text-ink underline underline-offset-2"
            >
              Çıkış yap
            </button>
          </form>
        </div>
      </div>

      <nav
        className="
          flex gap-1 mt-4 overflow-x-auto
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
              className={`whitespace-nowrap px-3 py-[11px] rounded-md text-sm transition-colors duration-150 ${
                active
                  ? "bg-ink text-cream"
                  : "text-slate hover:bg-rail-hover hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Geniş ekranda hesap bilgisi menünün altına yerleşir */}
      <div className="hidden md:block mt-auto pt-8 px-2">
        {(fullName || email) && (
          <div className="text-xs text-muted leading-[1.6] mb-3 break-words">
            {fullName && <div className="text-ink">{fullName}</div>}
            {email}
          </div>
        )}
        <form action={signOutAction}>
          <button
            type="submit"
            className="cursor-pointer bg-transparent border-0 p-0 text-xs text-muted hover:text-ink underline underline-offset-2 transition-colors duration-150"
          >
            Çıkış yap
          </button>
        </form>
      </div>
    </aside>
  );
}
