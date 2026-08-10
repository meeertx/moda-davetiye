import { EVENT_TYPES } from "@/lib/orders";
import { getTheme } from "@/data/themes";
import type { EventType } from "@/types/supabase";

/**
 * 1. aşamada girilen taslak bilgiler.
 *
 * Bu veriler URL sorgu parametrelerinde taşınır — böylece kullanıcı araya
 * giren kayıt/giriş adımından döndüğünde bilgileri kaybolmaz ve önizleme
 * bağlantısı paylaşılabilir olur. Kalıcı bir taslak kaydı gerekmez.
 */
export interface OrderDraft {
  eventType: EventType;
  brideName: string;
  groomName: string;
  eventDate: string;
  themeSlug: string;
}

const KEYS = {
  eventType: "tur",
  brideName: "gelin",
  groomName: "damat",
  eventDate: "tarih",
  themeSlug: "tema",
} as const;

export function draftToQuery(draft: OrderDraft): string {
  const params = new URLSearchParams();
  params.set(KEYS.eventType, draft.eventType);
  params.set(KEYS.brideName, draft.brideName);
  params.set(KEYS.groomName, draft.groomName);
  params.set(KEYS.eventDate, draft.eventDate);
  params.set(KEYS.themeSlug, draft.themeSlug);
  return params.toString();
}

/** Eksik/geçersiz parametre varsa null döner — sayfa 1. adıma yönlendirir. */
export function draftFromParams(
  params: Record<string, string | string[] | undefined>,
): OrderDraft | null {
  const get = (key: string) => {
    const v = params[key];
    return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
  };

  const eventType = get(KEYS.eventType);
  const brideName = get(KEYS.brideName);
  const groomName = get(KEYS.groomName);
  const eventDate = get(KEYS.eventDate);
  const themeSlug = get(KEYS.themeSlug);

  if (!(eventType in EVENT_TYPES)) return null;
  if (!brideName || !groomName || !eventDate) return null;
  if (!getTheme(themeSlug)) return null;

  return {
    eventType: eventType as EventType,
    brideName,
    groomName,
    eventDate,
    themeSlug,
  };
}
