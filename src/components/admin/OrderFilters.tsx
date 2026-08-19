"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { ORDER_STATUS } from "@/lib/orders";
import Button from "@/components/ui/Button";
import FilterPill from "@/components/ui/FilterPill";
import { inputClass } from "@/components/ui/field";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Tüm Siparişler" },
  ...Object.entries(ORDER_STATUS).map(([key, v]) => ({
    key,
    label: v.label,
  })),
];

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
  const [isPending, startTransition] = useTransition();

  const push = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => {
      router.push(`/admin/siparisler?${params.toString()}`);
    });
  };

  // Debounced auto-search as user types
  useEffect(() => {
    if (q === initialQuery) return;
    const timer = setTimeout(() => {
      push({ q });
    }, 350);

    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div className="glass-luxury p-5 rounded-2xl border border-gold/25 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Status Filter Pills */}
      <div className="flex gap-2 flex-wrap items-center">
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

      {/* Search Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          push({ q });
        }}
        className="flex items-center gap-2 w-full md:w-auto relative"
      >
        <div className="relative w-full md:w-[320px]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Sipariş No, Müşteri veya Çift adı ara…"
            aria-label="Sipariş ara"
            className={inputClass(
              "panel",
              "w-full py-2.5 pl-4 pr-9 text-xs rounded-xl bg-white/90 border-gold/30 focus:border-gold shadow-xs font-medium text-ink",
            )}
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                push({ q: "" });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gold/20 text-gold hover:bg-gold hover:text-ink text-[10px] font-bold flex items-center justify-center transition-colors"
              title="Aramayı Temizle"
            >
              ✕
            </button>
          )}
        </div>

        <Button
          type="submit"
          variant="gold"
          size="sm"
          shape="pill"
          disabled={isPending}
          className="apple-press px-5 font-semibold text-xs py-2.5 shrink-0"
        >
          {isPending ? "Aranıyor…" : "ARA"}
        </Button>
      </form>
    </div>
  );
}
