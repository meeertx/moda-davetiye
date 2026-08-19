import SidebarNav, { type NavItem } from "@/components/panel/SidebarNav";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const NAV: NavItem[] = [
  { href: "/admin", label: "Genel Bakış" },
  {
    href: "/admin/siparisler",
    label: "Siparişler",
    matchPrefixes: ["/admin/siparisler"],
  },
  { href: "/admin/temalar", label: "Temalar" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar" },
];

/**
 * Yönetim panelinin kabuğu — müşteri paneliyle aynı sol menüyü ve aynı
 * açık yüzeyi kullanır, farkını logonun altındaki "Yönetim" etiketiyle
 * belli eder.
 */
export default async function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = isSupabaseConfigured ? await getCurrentUser() : null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body text-ink bg-shell">
      <SidebarNav
        items={NAV}
        badge="Yönetim"
        fullName={current?.profile?.full_name ?? "Yönetici Hesabı"}
        email={current?.user?.email ?? "admin@modadavetiye.com"}
      />
      <main className="flex-1 min-w-0 px-5 py-8 md:py-10 md:px-12 max-w-[1300px]">
        {children}
      </main>
    </div>
  );
}
