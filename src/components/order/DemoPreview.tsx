import { EVENT_TYPES, formatDate } from "@/lib/orders";
import { getTheme } from "@/data/themes";
import type { OrderDraft } from "@/lib/order-draft";

/** Etkinliğe kalan gün — girilen tarihten türetilir. */
function daysUntil(date: string): number | null {
  const target = new Date(`${date}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  return diff >= 0 ? diff : null;
}

/**
 * Sınırlı demo önizleme.
 *
 * Kasıtlı olarak yalnızca tema + isimler + tarih gösterir. Program, galeri,
 * RSVP gibi gerçek davetiye bölümleri burada YOK — onlar sipariş sonrası
 * hazırlanır.
 */
export default function DemoPreview({ draft }: { draft: OrderDraft }) {
  const theme = getTheme(draft.themeSlug)!;
  const remaining = daysUntil(draft.eventDate);

  return (
    <div
      className="w-[300px] h-[600px] shrink-0 border-8 border-ink rounded-[30px] overflow-hidden shadow-[0_40px_70px_-24px_oklch(24%_0.02_50_/_0.35)] flex items-center justify-center p-6"
      style={{ background: theme.stripe }}
    >
      {/* Tema deseni üzerinde okunabilirlik için koyu panel */}
      <div className="w-full bg-ink/92 rounded-2xl px-6 py-10 text-center text-snow">
        <div className="text-[10px] tracking-[0.16em] uppercase text-gold-light mb-5">
          {EVENT_TYPES[draft.eventType]} Davetiyesi
        </div>

        <div className="font-display italic text-[30px] leading-[1.15] mb-1">
          {draft.brideName}
        </div>
        <div className="font-display italic text-lg text-gold-light my-1">
          &amp;
        </div>
        <div className="font-display italic text-[30px] leading-[1.15] mb-5">
          {draft.groomName}
        </div>

        <div className="w-10 h-px bg-gold-light mx-auto mb-5" />

        <div className="text-[13px] tracking-[0.04em] text-mist">
          {formatDate(draft.eventDate)}
        </div>

        {remaining !== null && (
          <div className="mt-7">
            <div className="font-display text-[34px] font-semibold">
              {remaining}
            </div>
            <div className="text-[10px] tracking-[0.1em] uppercase text-faint">
              gün kaldı
            </div>
          </div>
        )}

        <div className="mt-8 text-[10px] tracking-[0.08em] uppercase text-faint-dim">
          {theme.name}
        </div>
      </div>
    </div>
  );
}
