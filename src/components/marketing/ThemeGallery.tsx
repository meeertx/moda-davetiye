"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { THEME_CATEGORIES, filterThemes } from "@/data/themes";
import FilterPill from "@/components/ui/FilterPill";

/**
 * Tema galerisi. Başlangıç kategorisi `?cat=` parametresinden okunur,
 * sonrasında filtre değişimi yalnızca istemci tarafında yaşar —
 * prototipteki davranışın birebir karşılığı.
 */
export default function ThemeGallery() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("cat") ?? "all";
  const [category, setCategory] = useState(initial);

  const themes = filterThemes(category);

  return (
    <>
      <div className="flex gap-2.5 mb-10 flex-wrap">
        {THEME_CATEGORIES.map((cat) => (
          <FilterPill
            key={cat.key}
            active={category === cat.key}
            onClick={() => setCategory(cat.key)}
          >
            {cat.label}
          </FilterPill>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-7">
        {themes.map((theme) => (
          <Link
            key={theme.slug}
            href={`/tasarimlar/${theme.slug}`}
            className="block text-inherit bg-paper border border-line rounded-[4px] overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-2 hover:shadow-[0_30px_44px_-20px_oklch(24%_0.02_50_/_0.22)]"
          >
            <div
              className="w-full aspect-[4/5] flex items-center justify-center text-[oklch(45%_0.02_60)] text-[10px] uppercase"
              style={{ background: theme.stripe }}
            >
              tema görseli
            </div>
            <div className="px-5 py-[18px]">
              <div className="flex justify-between items-baseline mb-1.5">
                <div className="text-[11px] uppercase text-gold">
                  {theme.categoryLabel}
                </div>
                <div className="text-[11px] text-muted">{theme.tierLabel}</div>
              </div>
              <div className="font-display text-[22px] font-semibold mb-1.5">
                {theme.name}
              </div>
              <div className="text-[13px] text-muted leading-[1.5]">
                {theme.blurb}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
