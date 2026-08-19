import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import AdminThemeList from "@/components/admin/AdminThemeList";
import { THEMES } from "@/data/themes";

export const metadata: Metadata = { title: "Temalar" };

export default function AdminTemalarPage() {
  return (
    <AdminShell>
      <div className="flex justify-between items-baseline mb-2">
        <h1 className="font-display font-medium text-[32px] m-0">Temalar & AI Promptlar</h1>
      </div>
      <p className="text-sm text-muted m-0 mb-7 max-w-[680px] leading-[1.7]">
        Davetiye temaları ve Midjourney/DALL-E AI Görsel Üretim Promptları kod tarafında{" "}
        <code className="text-[13px] bg-paper-alt px-1.5 py-0.5 rounded-[3px] border border-line-panel">
          src/data/themes.ts
        </code>{" "}
        dosyasında tutulmaktadır. Temalara özel müşteri bilgilerini girerek AI promptlarını anında üretebilir ve kopyalayabilirsiniz.
      </p>

      <AdminThemeList themes={THEMES} />
    </AdminShell>
  );
}
