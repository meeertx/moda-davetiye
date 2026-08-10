"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ORDER_STATUS } from "@/lib/orders";
import Button from "@/components/ui/Button";
import FilterPill from "@/components/ui/FilterPill";
import { inputClass } from "@/components/ui/field";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Tümü" },
  ...Object.entries(ORDER_STATUS).map(([key, v]) => ({
    key,
    label: v.label,
  })),
];

/**
 * Durum filtresi ve arama. Değerler URL'de tutulur — böylece filtrelenmiş
 * liste paylaşılabilir ve sayfa yenilendiğinde korunur.
 */
export default function OrderFilters({
  activeStatus,
  initialQuery,
}: {
  activeStatus: string;
  initialQuery: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initialQuery);

  const push = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    }
    router.push(`/admin/siparisler?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      <div className="flex gap-2.5 flex-wrap">
        {FILTERS.map((f) => (
          <FilterPill
            key={f.key}
            active={activeStatus === f.key}
            onClick={() => push({ durum: f.key })}
          >
            {f.label}
          </FilterPill>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          push({ q });
        }}
        className="flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Sipariş no veya isim ara…"
          aria-label="Sipariş ara"
          className={inputClass("panel", "w-[260px] py-2.5 text-[13px] bg-paper-alt")}
        />
        <Button type="submit" variant="secondary" size="sm">
          Ara
        </Button>
      </form>
    </div>
  );
}
