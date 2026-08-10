"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { EVENT_TYPES, isValidInvitationUrl } from "@/lib/orders";
import {
  sendNewOrderAdminAlert,
  sendOrderCompletedEmail,
  sendOrderInProgressEmail,
  sendOrderReceivedEmail,
} from "@/lib/email";
import { getUserEmail, hasServiceRole } from "@/lib/supabase/admin";
import type { EventType, OrderStatus, ProgramItem } from "@/types/supabase";

export interface ActionState {
  error?: string;
  ok?: string;
}

const NOT_CONFIGURED =
  "Supabase henüz yapılandırılmadı. .env dosyasındaki Supabase değerlerini doldurun.";

/**
 * Talep formu gönderimi — yeni sipariş oluşturur.
 * `order_number` veritabanı trigger'ı tarafından üretilir.
 */
export async function createOrderAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/giris?next=/davetiye-talebi");

  const eventType = String(formData.get("event_type") ?? "") as EventType;
  const contactPhone = String(formData.get("contact_phone") ?? "").trim();

  if (!(eventType in EVENT_TYPES)) return { error: "Etkinlik türünü seçin." };
  if (!contactPhone) return { error: "İletişim telefonu zorunlu." };

  const text = (key: string) => {
    const v = String(formData.get(key) ?? "").trim();
    return v === "" ? null : v;
  };

  /** JSON dizisi olarak gelen alanları güvenle çözer. */
  const jsonArray = <T,>(key: string): T[] => {
    const raw = String(formData.get(key) ?? "");
    if (!raw) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  };

  const mapUrl = text("venue_map_url");
  if (mapUrl && !isValidInvitationUrl(mapUrl)) {
    return { error: "Harita bağlantısı http:// veya https:// ile başlamalı." };
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      event_type: eventType,
      bride_name: text("bride_name"),
      groom_name: text("groom_name"),
      event_date: text("event_date"),
      theme_preference: text("theme_preference"),
      contact_phone: contactPhone,
      contact_note: text("contact_note"),

      // 2. aşamada toplanan detaylar
      venue_name: text("venue_name"),
      venue_address: text("venue_address"),
      venue_map_url: mapUrl,
      program: jsonArray<ProgramItem>("program"),
      story: text("story"),
      photos: jsonArray<string>("photos"),
      rsvp_deadline: text("rsvp_deadline"),
      rsvp_plus_one: formData.get("rsvp_plus_one") !== null,
      rsvp_questions: jsonArray<string>("rsvp_questions"),
      gift_note: text("gift_note"),
      gift_iban: text("gift_iban"),
      music_note: text("music_note"),
      bride_parents: text("bride_parents"),
      groom_parents: text("groom_parents"),
      menu: jsonArray<string>("menu"),
      extra_info: text("extra_info"),
    })
    .select("order_number")
    .single();

  if (error) {
    console.error("[orders] oluşturma hatası:", error);
    return { error: "Sipariş oluşturulamadı. Lütfen tekrar deneyin." };
  }

  // Bildirimler başarısız olsa da sipariş kaydı geçerli — akış bloke edilmez.
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name || "Değerli müşterimiz";

  try {
    await Promise.all([
      user.email
        ? sendOrderReceivedEmail({
            to: user.email,
            fullName,
            orderNumber: data.order_number,
          })
        : Promise.resolve(),
      sendNewOrderAdminAlert({
        orderNumber: data.order_number,
        customerName: fullName,
        eventType: EVENT_TYPES[eventType],
      }),
    ]);
  } catch (e) {
    console.error("[orders] bildirim gönderilemedi:", e);
  }

  revalidatePath("/panel");
  redirect(`/davetiye-talebi/tesekkurler?no=${data.order_number}`);
}

/**
 * Admin: davetiye linki ve/veya durum güncellemesi.
 *
 * Yetki garantisi RLS'te (`Admin siparişleri güncelleyebilir`); buradaki
 * kontroller kullanıcıya anlamlı hata mesajı göstermek için.
 */
export async function updateOrderAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const orderNumber = String(formData.get("order_number") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  const rawUrl = String(formData.get("invitation_url") ?? "").trim();
  const adminNote = String(formData.get("admin_note") ?? "").trim();

  if (rawUrl && !isValidInvitationUrl(rawUrl)) {
    return {
      error:
        "Geçersiz bağlantı. http:// veya https:// ile başlayan tam bir adres girin.",
    };
  }

  // Veritabanındaki CHECK kısıtı da bunu engelliyor; mesajı burada
  // anlaşılır hale getiriyoruz.
  if (status === "completed" && !rawUrl) {
    return {
      error:
        "Durum \"Tamamlandı\" yapılabilmesi için önce davetiye linki girilmeli.",
    };
  }

  const supabase = await createClient();
  // .select() ŞART: RLS bir güncellemeyi engellediğinde Postgres hata
  // döndürmez, sadece 0 satır etkiler. select olmadan bu "başarılı"
  // görünür ve sessiz başarısızlığa yol açar.
  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      invitation_url: rawUrl || null,
      admin_note: adminNote || null,
    })
    .eq("order_number", orderNumber)
    .select("order_number");

  if (error) {
    console.error("[orders] güncelleme hatası:", error);
    return { error: `Güncellenemedi: ${error.message}` };
  }

  if (!data?.length) {
    console.error(
      `[orders] ${orderNumber} güncellemesi 0 satır etkiledi (RLS engeli veya kayıt yok)`,
    );
    return {
      error:
        "Kayıt güncellenemedi. Sipariş bulunamadı ya da bu işlem için yetkiniz yok.",
    };
  }

  revalidatePath(`/admin/siparisler/${orderNumber}`);
  revalidatePath("/admin/siparisler");
  revalidatePath("/admin");
  revalidatePath("/panel");
  // Müşterinin detay sayfası da tazelenmeli — yoksa link atandıktan sonra
  // müşteri eski durumu görebilir.
  revalidatePath(`/panel/siparis/${orderNumber}`);
  revalidatePath("/panel/davetiyelerim");
  return { ok: "Sipariş güncellendi." };
}

/** Admin: müşteriye durum bildirimi gönderir. */
export async function notifyCustomerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const orderNumber = String(formData.get("order_number") ?? "");
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("order_number, status, invitation_url, user_id")
    .eq("order_number", orderNumber)
    .single();

  if (error || !order) return { error: "Sipariş bulunamadı." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", order.user_id)
    .single();

  // E-posta adresi auth.users'da; anon istemci göremediği için service-role
  // ile okunur.
  const email = await getUserEmail(order.user_id);
  if (!email)
    return {
      error: hasServiceRole
        ? "Müşterinin e-posta adresi bulunamadı."
        : "SUPABASE_SERVICE_ROLE_KEY tanımlı değil — müşteri e-postası okunamıyor.",
    };

  const fullName = profile?.full_name || "Değerli müşterimiz";

  const result =
    order.status === "completed" && order.invitation_url
      ? await sendOrderCompletedEmail({
          to: email,
          fullName,
          orderNumber: order.order_number,
          invitationUrl: order.invitation_url,
        })
      : await sendOrderInProgressEmail({
          to: email,
          fullName,
          orderNumber: order.order_number,
        });

  if (!result.ok && "skipped" in result)
    return { error: "RESEND_API_KEY tanımlı değil — e-posta gönderilmedi." };
  if (!result.ok) return { error: "E-posta gönderilemedi." };

  return { ok: "Bildirim gönderildi." };
}
