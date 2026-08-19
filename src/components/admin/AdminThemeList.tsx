"use client";

import { useState } from "react";
import Link from "next/link";
import type { Theme } from "@/data/themes";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Props {
  themes: Theme[];
}

export default function AdminThemeList({ themes }: Props) {
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredThemes = themes.filter((t) => {
    if (filterCategory === "all") return true;
    return t.category === filterCategory;
  });

  const gridCols = "grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.5fr] min-w-[840px]";

  return (
    <div>
      {/* Kategori Filtreleri */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {[
          { key: "all", label: "Tümü (" + themes.length + ")" },
          { key: "dugun", label: "Düğün" },
          { key: "nisan", label: "Nişan" },
          { key: "kina", label: "Kına" },
          { key: "save_the_date", label: "Save the Date" },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilterCategory(cat.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              filterCategory === cat.key
                ? "bg-gold text-ink-deep font-bold shadow-xs"
                : "bg-white/80 text-muted hover:text-ink border border-gold/30"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tablo Yapısı */}
      <div className="glass-luxury border border-gold/25 rounded-2xl overflow-hidden shadow-xs">
        <div
          className={`${gridCols} px-5 py-3.5 text-xs tracking-[0.03em] uppercase text-muted border-b border-gold/20 font-medium bg-gold/5`}
        >
          <div>Tema Adı</div>
          <div>Kategori</div>
          <div>Sıra</div>
          <div>Durum</div>
          <div>Paket</div>
          <div className="text-right">Önizleme</div>
        </div>

        {filteredThemes.map((t) => (
          <div
            key={t.slug}
            className={`${gridCols} px-5 py-3.5 text-xs border-b border-gold/15 items-center hover:bg-gold/5 transition-colors`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-10 rounded-md border border-gold/30 shadow-xs shrink-0"
                style={{ background: t.stripeSmall }}
              />
              <div>
                <div className="font-semibold text-ink text-sm">{t.name}</div>
                <div className="text-[11px] text-muted truncate max-w-[220px]">
                  {t.blurb}
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-paper border border-gold/30 text-ink">
                {t.categoryLabel}
              </span>
            </div>

            <div className="text-muted text-xs font-mono">{t.order}</div>

            <div>
              <Badge tone={t.active ? "ok" : "muted"}>
                {t.active ? "Aktif" : "Pasif"}
              </Badge>
            </div>

            <div className="text-muted text-xs font-medium">{t.tierLabel}</div>

            <div className="text-right">
              <Link
                href={`/tasarimlar/${t.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 hover:bg-gold/30 border border-gold/30 text-ink text-xs font-semibold transition-all apple-press"
              >
                <span>👁️ Önizle</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
