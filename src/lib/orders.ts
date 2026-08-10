import type { BadgeTone } from "@/components/ui/Badge";
import type { EventType, OrderStatus } from "@/types/supabase";

/** Sipariş durumlarının Türkçe etiketi ve rozet rengi. */
export const ORDER_STATUS: Record<
  OrderStatus,
  { label: string; tone: BadgeTone; description: string }
> = {
  new: {
    label: "Yeni",
    tone: "warn",
    description: "Talebiniz bize ulaştı, ekibimiz en kısa sürede inceleyecek.",
  },
  in_progress: {
    label: "İşlemde",
    tone: "neutral",
    description:
      "Davetiyeniz hazırlanıyor. Tamamlandığında burada ve e-postanızda göreceksiniz.",
  },
  completed: {
    label: "Tamamlandı",
    tone: "ok",
    description: "Davetiyeniz hazır — aşağıdaki bağlantıdan görüntüleyebilirsiniz.",
  },
  cancelled: {
    label: "İptal",
    tone: "danger",
    description: "Bu sipariş iptal edildi.",
  },
};

/** Müşteri panelindeki durum zaman çizelgesinin sırası. */
export const STATUS_TIMELINE: OrderStatus[] = [
  "new",
  "in_progress",
  "completed",
];

export const EVENT_TYPES: Record<EventType, string> = {
  dugun: "Düğün",
  nisan: "Nişan",
  kina: "Kına Gecesi",
  save_the_date: "Save the Date",
};

export const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPES) as [
  EventType,
  string,
][];

/** "2026-09-12" → "12 Eylül 2026" */
export function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** ISO timestamp → "12 Eyl 2026, 14:30" */
export function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Davetiye linkinin güvenli olduğunu doğrular.
 * Yalnızca http/https kabul edilir — `javascript:` gibi şemalar engellenir.
 */
export function isValidInvitationUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
