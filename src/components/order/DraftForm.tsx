"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EVENT_TYPE_OPTIONS } from "@/lib/orders";
import Button from "@/components/ui/Button";
import { inputClass, labelClass } from "@/components/ui/field";
import { draftToQuery, type OrderDraft } from "@/lib/order-draft";
import { THEMES } from "@/data/themes";
import type { EventType } from "@/types/supabase";

const input = inputClass("marketing");
const label = labelClass;

/**
 * 1. aşama: demoyu görmek için gereken en az bilgi.
 * Giriş gerektirmez; gönderim yalnızca önizleme sayfasına yönlendirir,
 * hiçbir kayıt oluşturmaz.
 */
export default function DraftForm({ initial }: { initial?: Partial<OrderDraft> }) {
  const router = useRouter();
  const [theme, setTheme] = useState(initial?.themeSlug ?? "");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const draft: OrderDraft = {
      eventType: String(fd.get("event_type")) as EventType,
      brideName: String(fd.get("bride_name")).trim(),
      groomName: String(fd.get("groom_name")).trim(),
      eventDate: String(fd.get("event_date")),
      themeSlug: theme,
    };

    if (!theme) {
      setError("Bir tema seçin.");
      return;
    }
    router.push(`/davetiye-talebi/onizleme?${draftToQuery(draft)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {error && (
        <div
          role="alert"
          className="text-[13px] px-3.5 py-3 rounded-[4px] border border-[oklch(85%_0.06_30)] bg-danger-bg text-danger-fg"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="event_type" className={label}>
          Etkinlik Türü
        </label>
        <select
          id="event_type"
          name="event_type"
          required
          defaultValue={initial?.eventType ?? ""}
          className={input}
        >
          <option value="" disabled>
            Seçiniz
          </option>
          {EVENT_TYPE_OPTIONS.map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="bride_name" className={label}>
            Gelin Adı
          </label>
          <input
            id="bride_name"
            name="bride_name"
            required
            defaultValue={initial?.brideName}
            placeholder="Elif"
            className={input}
          />
        </div>
        <div>
          <label htmlFor="groom_name" className={label}>
            Damat Adı
          </label>
          <input
            id="groom_name"
            name="groom_name"
            required
            defaultValue={initial?.groomName}
            placeholder="Kaan"
            className={input}
          />
        </div>
      </div>

      <div>
        <label htmlFor="event_date" className={label}>
          Etkinlik Tarihi
        </label>
        <input
          id="event_date"
          name="event_date"
          type="date"
          required
          defaultValue={initial?.eventDate}
          className={`${input} max-w-[240px]`}
        />
      </div>

      <div>
        <span className={label}>Tema</span>
        <div className="grid grid-cols-4 gap-3">
          {THEMES.filter((t) => t.active).map((t) => {
            const selected = theme === t.slug;
            return (
              <button
                key={t.slug}
                type="button"
                onClick={() => {
                  setTheme(t.slug);
                  setError(null);
                }}
                aria-pressed={selected}
                className={`text-left cursor-pointer bg-transparent p-0 rounded-[4px] overflow-hidden border-2 transition-colors ${
                  selected ? "border-gold" : "border-line hover:border-muted"
                }`}
              >
                <span
                  className="block w-full aspect-[4/5]"
                  style={{ background: t.stripe }}
                />
                <span className="block px-2 py-2 text-[12px] leading-tight">
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        shape="sharp"
        className="self-start"
      >
        Demoyu Göster →
      </Button>

      <p className="text-xs text-muted m-0">
        Bu adımda hesap açmanıza gerek yok. Demoyu beğenirseniz sipariş
        adımında devam edersiniz.
      </p>
    </form>
  );
}
