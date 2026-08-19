import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import AdminThemeList from "@/components/admin/AdminThemeList";
import { THEMES } from "@/data/themes";

export const metadata: Metadata = { title: "Temalar Kataloğu" };

export default function AdminTemalarPage() {
  return (
    <AdminShell>
      <div className="flex justify-between items-baseline mb-2">
        <h1 className="font-display font-medium text-[32px] m-0">Davetiye Temaları</h1>
      </div>
      <p className="text-sm text-muted m-0 mb-7 max-w-[680px] leading-[1.7]">
        Sistemde tanımlı tüm lüks dijital davetiye koleksiyonları, renk paletleri ve canlı önizleme şablonları.
      </p>

      <AdminThemeList themes={THEMES} />
    </AdminShell>
  );
}
