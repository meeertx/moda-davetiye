import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import { THEMES } from "@/data/themes";

export const metadata: Metadata = { title: "Temalar" };

const gridCols = "grid grid-cols-[2fr_1fr_1fr_1fr_1fr] min-w-[720px]";

export default function AdminTemalarPage() {
  return (
    <AdminShell>
      <div className="flex justify-between items-baseline mb-2">
        <h1 className="font-display font-medium text-[32px] m-0">Temalar</h1>
      </div>
      {/* Temalar şu an veritabanında değil, kod içindeki katalogda tutuluyor.
          İşlevi olmayan "Ekle/Düzenle/Sil" butonları koymak yerine durum
          açıkça yazılıyor. */}
      <p className="text-sm text-muted m-0 mb-7 max-w-[620px] leading-[1.7]">
        Tema kataloğu kod tarafında{" "}
        <code className="text-[13px] bg-paper-alt px-1.5 py-0.5 rounded-[3px] border border-line-panel">
          src/data/themes.ts
        </code>{" "}
        dosyasında tutuluyor. Tema eklemek, sırasını değiştirmek veya
        yayından kaldırmak için bu dosya güncellenir.
      </p>

      <div className="bg-paper-alt border border-line-panel rounded-[10px] overflow-x-auto">
        <div
          className={`${gridCols} px-5 py-3.5 text-xs tracking-[0.03em] uppercase text-muted border-b border-line-panel`}
        >
          <div>Tema Adı</div>
          <div>Kategori</div>
          <div>Sıra</div>
          <div>Durum</div>
          <div>Paket</div>
        </div>

        {THEMES.map((t) => (
          <div
            key={t.slug}
            className={`${gridCols} px-5 py-3 text-[13.5px] border-b border-line-soft items-center`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-10 rounded-[3px]"
                style={{ background: t.stripeSmall }}
              />
              {t.name}
            </div>
            <div>{t.categoryLabel}</div>
            <div>{t.order}</div>
            <div>
              <Badge tone={t.active ? "ok" : "muted"}>
                {t.active ? "Aktif" : "Pasif"}
              </Badge>
            </div>
            <div className="text-muted">{t.tierLabel}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
