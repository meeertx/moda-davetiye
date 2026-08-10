"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { buildInvitationSlug, validateSlug } from "@/lib/slug";
import { isValidInvitationUrl } from "@/lib/orders";
import type { ProgramItem } from "@/types/supabase";

export interface InvitationState {
  error?: string;
  ok?: string;
}

const NOT_CONFIGURED = "Supabase yapılandırılmadı.";

/** Yerel tarih+saat girdisini ("2026-09-12T18:00") ISO'ya çevirir. */
function toIso(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function jsonArray<T>(formData: FormData, key: string): T[] {
  const raw = String(formData.get(key) ?? "");
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

/**
 * Siparişten davetiye taslağı oluşturur.
 *
 * Alanlar siparişte toplanan bilgilerden doldurulur — admin sıfırdan
 * yazmaz, gelen veriyi düzeltir. Slug tahmin edilemez bir ek taşır.
 */
export async function createInvitationAction(
  _prev: InvitationState,
  formData: FormData,
): Promise<InvitationState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const orderNumber = String(formData.get("order_number") ?? "");
  const supabase = await createClient();

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (orderErr || !order) return { error: "Sipariş bulunamadı." };

  const { data: existing } = await supabase
    .from("invitations")
    .select("id")
    .eq("order_id", order.id)
    .maybeSingle();
  if (existing) return { error: "Bu sipariş için zaten bir davetiye var." };

  // Sipariş tarihi saat taşımıyor; varsayılan 18:00
  const eventAt = order.event_date
    ? toIso(`${order.event_date}T18:00`)
    : null;

  const { error } = await supabase.from("invitations").insert({
    slug: buildInvitationSlug(order.bride_name, order.groom_name),
    order_id: order.id,
    user_id: order.user_id,
    theme_slug: order.theme_preference ?? "belle-epoque",
    event_type: order.event_type,
    bride_name: order.bride_name,
    groom_name: order.groom_name,
    bride_parents: order.bride_parents,
    groom_parents: order.groom_parents,
    event_at: eventAt,
    venue_name: order.venue_name,
    venue_address: order.venue_address,
    venue_map_url: order.venue_map_url,
    story: order.story,
    program: order.program ?? [],
    photos: order.photos ?? [],
    menu: order.menu ?? [],
    extra_info: order.extra_info,
    gift_note: order.gift_note,
    gift_iban: order.gift_iban,
    // Müşterinin müzik talebi (bağlantı/şarkı adı) davetiyeye doğrudan
    // taşınmaz: parçanın çalınabilir bir ses dosyasına dönüştürülmesi
    // gerekiyor. Talep sipariş detayında admin'in önünde duruyor.
    music_title: order.music_note,
    rsvp_deadline: order.rsvp_deadline,
    rsvp_plus_one: order.rsvp_plus_one ?? true,
    rsvp_questions: order.rsvp_questions ?? [],
  });

  if (error) {
    console.error("[invitations] oluşturma hatası:", error);
    return { error: `Davetiye oluşturulamadı: ${error.message}` };
  }

  revalidatePath(`/admin/siparisler/${orderNumber}`);
  redirect(`/admin/siparisler/${orderNumber}/davetiye`);
}

/** Davetiye içeriğini günceller. */
export async function updateInvitationAction(
  _prev: InvitationState,
  formData: FormData,
): Promise<InvitationState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const id = String(formData.get("invitation_id") ?? "");
  const orderNumber = String(formData.get("order_number") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();

  const slugError = validateSlug(slug);
  if (slugError) return { error: slugError };

  const mapUrl = String(formData.get("venue_map_url") ?? "").trim();
  if (mapUrl && !isValidInvitationUrl(mapUrl))
    return { error: "Harita bağlantısı http:// veya https:// ile başlamalı." };

  const musicUrl = String(formData.get("music_url") ?? "").trim();
  if (musicUrl) {
    if (!isValidInvitationUrl(musicUrl))
      return { error: "Müzik adresi http:// veya https:// ile başlamalı." };
    // YouTube/Spotify bağlantısı <audio> ile çalmaz — sessizce müziksiz
    // bir davetiye yayınlamak yerine burada uyarıyoruz.
    if (/youtube\.com|youtu\.be|spotify\.com|soundcloud\.com/i.test(musicUrl))
      return {
        error:
          "YouTube/Spotify bağlantıları davetiyede çalınamaz. Ses dosyasını (mp3/m4a) yükleyip doğrudan adresini girin.",
      };
  }

  const text = (key: string) => {
    const v = String(formData.get(key) ?? "").trim();
    return v === "" ? null : v;
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .update({
      slug,
      theme_slug: String(formData.get("theme_slug") ?? "belle-epoque"),
      bride_name: text("bride_name"),
      groom_name: text("groom_name"),
      bride_parents: text("bride_parents"),
      groom_parents: text("groom_parents"),
      event_at: toIso(String(formData.get("event_at") ?? "")),
      venue_name: text("venue_name"),
      venue_address: text("venue_address"),
      venue_map_url: mapUrl || null,
      story: text("story"),
      program: jsonArray<ProgramItem>(formData, "program"),
      menu: jsonArray<string>(formData, "menu"),
      extra_info: text("extra_info"),
      gift_note: text("gift_note"),
      gift_iban: text("gift_iban"),
      music_url: musicUrl || null,
      music_title: text("music_title"),
      rsvp_enabled: formData.get("rsvp_enabled") !== null,
      rsvp_deadline: text("rsvp_deadline"),
      rsvp_plus_one: formData.get("rsvp_plus_one") !== null,
      rsvp_questions: jsonArray<string>(formData, "rsvp_questions"),
      guest_photos_enabled: formData.get("guest_photos_enabled") !== null,
    })
    .eq("id", id)
    .select("slug");

  if (error) {
    console.error("[invitations] güncelleme hatası:", error);
    if (error.code === "23505")
      return { error: "Bu adres başka bir davetiyede kullanılıyor." };
    if (error.code === "23514")
      return {
        error:
          "Bu adres sistem tarafından ayrılmış ya da içerik eksik. Çift adı ve tarih zorunlu.",
      };
    return { error: `Kaydedilemedi: ${error.message}` };
  }
  if (!data?.length)
    return { error: "Kaydedilemedi: kayıt bulunamadı ya da yetkiniz yok." };

  revalidatePath(`/admin/siparisler/${orderNumber}/davetiye`);
  revalidatePath(`/${data[0].slug}`);
  return { ok: "Davetiye kaydedildi." };
}

/** Yayına alır ya da yayından kaldırır. */
export async function togglePublishAction(
  _prev: InvitationState,
  formData: FormData,
): Promise<InvitationState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const id = String(formData.get("invitation_id") ?? "");
  const orderNumber = String(formData.get("order_number") ?? "");
  const publish = String(formData.get("publish") ?? "") === "1";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .update({ published: publish })
    .eq("id", id)
    .select("slug, published");

  if (error) {
    console.error("[invitations] yayın hatası:", error);
    if (error.code === "23514")
      return {
        error:
          "Yayına almak için gelin adı, damat adı ve etkinlik tarihi dolu olmalı.",
      };
    return { error: `İşlem başarısız: ${error.message}` };
  }
  if (!data?.length) return { error: "Kayıt bulunamadı ya da yetkiniz yok." };

  // Müşteri panelindeki durum da tazelensin
  revalidatePath(`/admin/siparisler/${orderNumber}/davetiye`);
  revalidatePath(`/${data[0].slug}`);
  revalidatePath("/panel");
  revalidatePath("/panel/davetiyelerim");

  return {
    ok: publish
      ? "Davetiye yayına alındı."
      : "Davetiye yayından kaldırıldı.",
  };
}
