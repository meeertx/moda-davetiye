import SidebarNav, { type NavItem } from "./SidebarNav";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const NAV: NavItem[] = [
  {
    href: "/panel",
    label: "Siparişlerim",
    matchPrefixes: ["/panel/siparis"],
  },
  { href: "/panel/davetiyelerim", label: "Davetiyelerim" },
  { href: "/panel/ayarlar", label: "Hesap Bilgilerim" },
];

/**
 * Müşteri panelinin sol menülü kabuğu.
 *
 * `max` ana sütunun genişliği — ayarlar sayfası 760px, diğerleri 1200px.
 */
export default async function PanelShell({
  children,
  max = 1200,
}: {
  children: React.ReactNode;
  max?: 760 | 1200;
}) {
  const current = isSupabaseConfigured ? await getCurrentUser() : null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body text-ink bg-shell">
      <SidebarNav
        items={NAV}
        fullName={current?.profile?.full_name}
        email={current?.user.email}
      />
      <main
        className={`flex-1 min-w-0 px-5 py-8 md:py-10 md:px-12 ${
          max === 1200 ? "max-w-[1200px]" : "max-w-[760px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
