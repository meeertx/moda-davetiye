"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface RsvpState {
  error?: string;
  sent?: boolean;
}

/**
 * Misafir katılım bildirimi.
 *
 * Giriş gerektirmez. Yetki garantisi RLS'te: yalnızca yayında, RSVP'si
 * açık ve son tarihi geçmemiş bir davetiyeye kayıt eklenebilir.
 */
export async function submitRsvpAction(
  _prev: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  if (!isSupabaseConfigured)
    return { error: "Şu an yanıt alınamıyor, lütfen sonra tekrar deneyin." };

  const invitationId = String(formData.get("invitation_id") ?? "");
  const guestName = String(formData.get("guest_name") ?? "").trim();
  const attendingRaw = String(formData.get("attending") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!invitationId) return { error: "Davetiye bulunamadı." };
  if (guestName.length < 2)
    return { error: "Lütfen adınızı ve soyadınızı yazın." };
  if (attendingRaw !== "yes" && attendingRaw !== "no")
    return { error: "Katılıp katılmayacağınızı seçin." };

  const attending = attendingRaw === "yes";

  // Katılmıyorsa kişi sayısı sorulmaz
  let partySize = 0;
  if (attending) {
    const raw = Number(formData.get("party_size") ?? 1);
    if (!Number.isFinite(raw) || raw < 1 || raw > 20)
      return { error: "Kişi sayısı 1 ile 20 arasında olmalı." };
    partySize = Math.floor(raw);
  }

  // Davetiyeye özel sorular "soru_<index>" adıyla gelir
  const answers: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("soru_")) continue;
    const question = String(formData.get(`${key}__label`) ?? "").trim();
    const answer = String(value).trim();
    if (question && answer) answers[question] = answer.slice(0, 300);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("rsvps").insert({
    invitation_id: invitationId,
    guest_name: guestName.slice(0, 80),
    attending,
    party_size: partySize,
    note: note ? note.slice(0, 500) : null,
    answers,
  });

  if (error) {
    console.error("[rsvp] kayıt hatası:", error);
    // RLS reddi büyük ihtimalle süresi dolmuş ya da kapatılmış RSVP
    if (error.code === "42501")
      return {
        error:
          "Bu davetiye için katılım bildirimi kapanmış. Çiftle doğrudan iletişime geçebilirsiniz.",
      };
    return { error: "Yanıtınız kaydedilemedi, lütfen tekrar deneyin." };
  }

  return { sent: true };
}
