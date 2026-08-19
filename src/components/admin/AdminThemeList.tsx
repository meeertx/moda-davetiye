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
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredThemes = themes.filter((t) => {
    if (filterCategory === "all") return true;
    return t.category === filterCategory;
  });

  const gridCols = "grid grid-cols-[2.2fr_1fr_0.8fr_1fr_1fr_1.8fr] min-w-[840px]";

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
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              filterCategory === cat.key
                ? "bg-gradient-to-r from-[#D4AF37] via-[#F5E6B3] to-[#C09622] text-[#16161D] font-bold shadow-md shadow-gold/20 scale-[1.02]"
                : "bg-white/80 text-muted hover:text-ink border border-gold/30 hover:border-gold"
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
          <div>Paket Seviyesi</div>
          <div className="text-right">İşlemler</div>
        </div>

        {filteredThemes.map((t) => (
          <div
            key={t.slug}
            className={`${gridCols} px-5 py-4 text-xs border-b border-gold/15 items-center hover:bg-gold/5 transition-colors`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-11 rounded-lg border border-gold/30 shadow-xs shrink-0"
                style={{ background: t.stripeSmall }}
              />
              <div>
                <div className="font-semibold text-ink text-sm leading-tight">{t.name}</div>
                <div className="text-[11.5px] text-muted truncate max-w-[240px] mt-0.5">
                  {t.blurb}
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/90 border border-gold/30 text-ink shadow-2xs">
                {t.categoryLabel}
              </span>
            </div>

            <div className="text-muted text-xs font-mono font-medium">{t.order}</div>

            <div>
              <Badge tone={t.active ? "ok" : "muted"}>
                {t.active ? "Aktif" : "Pasif"}
              </Badge>
            </div>

            <div className="text-ink font-semibold text-xs">{t.tierLabel}</div>

            <div className="text-right flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedTheme(t)}
                className="px-3 py-1.5 rounded-xl bg-gold/10 hover:bg-gold/20 border border-gold/30 text-ink text-xs font-medium transition-all cursor-pointer apple-press"
              >
                Detaylar
              </button>
              <Link
                href={`/tasarimlar/${t.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5E6B3] to-[#C09622] text-[#16161D] font-bold text-xs shadow-xs hover:shadow-md transition-all apple-press"
              >
                <span>👁️ Önizle</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* TEMA DETAY MODALI */}
      {selectedTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/95 border border-gold/30 rounded-3xl max-w-xl w-full shadow-2xl p-7 relative">
            {/* Kapat Butonu */}
            <button
              type="button"
              onClick={() => setSelectedTheme(null)}
              className="absolute top-5 right-5 text-muted hover:text-ink w-8 h-8 rounded-full flex items-center justify-center bg-gold/10 hover:bg-gold/20 transition-colors font-bold text-xs cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-5 pr-8">
              <div
                className="w-11 h-14 rounded-xl border border-gold/40 shrink-0 shadow-xs"
                style={{ background: selectedTheme.stripeSmall }}
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10.5px] uppercase tracking-wider text-gold font-bold">
                    {selectedTheme.categoryLabel}
                  </span>
                  <span className="text-muted text-[10.5px]">•</span>
                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                    {selectedTheme.tierLabel}
                  </span>
                </div>
                <h2 className="text-lg font-display font-semibold text-ink leading-snug">
                  {selectedTheme.name}
                </h2>
              </div>
            </div>

            {/* Tasarım Detayları & Açıklama */}
            <div className="mb-5 bg-cream/70 p-4 rounded-2xl border border-gold/20 text-xs leading-relaxed text-slate">
              <div className="text-[11px] font-bold text-ink mb-1.5 uppercase tracking-wider">
                Tema Hakkında
              </div>
              <p className="m-0 text-ink/90">{selectedTheme.longDesc || selectedTheme.blurb}</p>
            </div>

            {/* Öne Çıkan Özellikler */}
            <div className="mb-6">
              <div className="text-[11px] font-bold text-ink mb-2.5 uppercase tracking-wider">
                Öne Çıkan İnteraktif Özellikler
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedTheme.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-gold/5 border border-gold/15 text-xs text-ink font-medium"
                  >
                    <span className="text-gold font-bold">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div className="flex justify-end items-center gap-3 pt-4 border-t border-gold/20">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedTheme(null)}
                className="px-5 text-xs"
              >
                Kapat
              </Button>
              <Link
                href={`/tasarimlar/${selectedTheme.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5E6B3] to-[#C09622] text-[#16161D] font-bold text-xs shadow-md hover:shadow-lg transition-all apple-press"
              >
                <span>👁️ Temayı Canlı İncele</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
