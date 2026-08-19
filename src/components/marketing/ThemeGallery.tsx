"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { THEME_CATEGORIES, filterThemes } from "@/data/themes";
import FilterPill from "@/components/ui/FilterPill";
import VisualCover from "@/components/marketing/VisualCover";

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {themes.map((theme) => (
          <Link
            key={theme.slug}
            href={`/tasarimlar/${theme.slug}`}
            className="group block text-inherit bg-paper border border-line-panel rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(212,175,55,0.25)] hover:border-amber-400/60"
          >
            <VisualCover theme={theme} />

            <div className="p-5 bg-paper">
              <div className="flex justify-between items-center mb-1.5">
                <div className="text-[11px] font-semibold tracking-wider uppercase text-amber-600">
                  {theme.categoryLabel}
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-paper-alt border border-line-panel text-muted">
                  {theme.tierLabel}
                </span>
              </div>
              <div className="font-display text-[22px] font-semibold mb-1.5 text-foreground group-hover:text-amber-600 transition-colors">
                {theme.name}
              </div>
              <div className="text-[13px] text-muted leading-[1.6] line-clamp-2">
                {theme.blurb}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
