"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface GuestPhotoState {
  error?: string;
  ok?: string;
}

const NOT_CONFIGURED = "Supabase yapılandırılmadı.";
const BUCKET = "guest-photos";
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_FILES = 6;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic"]);

/** "IMG_2043.JPEG" → "jpeg"; bilinmeyen uzantı jpg'ye düşer. */
function extensionOf(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  return file.type.split("/")[1] ?? "jpg";
}

/**
 * Misafirin davetiyeye fotoğraf bırakması ("Anı Bırakın").
 *
 * Giriş gerektirmez — misafirlerin hesap açması beklenemez. Buna karşılık
 * yükleme HERKESE AÇIK bir yazma işlemi olduğu için üç kapı var:
 *  1. RLS: yalnızca yayında VE fotoğraf toplama açık davetiyeye insert.
 *  2. Boyut/tür kontrolü burada, bucket ayarında da ayrıca.
 *  3. `approved = false` — çift onaylayana kadar davetiyede görünmez.
 */
export async function uploadGuestPhotosAction(
  _prev: GuestPhotoState,
  formData: FormData,
): Promise<GuestPhotoState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const invitationId = String(formData.get("invitation_id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const guestName = String(formData.get("guest_name") ?? "").trim();

  if (!invitationId) return { error: "Davetiye bulunamadı." };

  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (!files.length) return { error: "Lütfen en az bir fotoğraf seçin." };
  if (files.length > MAX_FILES)
    return { error: `En fazla ${MAX_FILES} fotoğraf yükleyebilirsiniz.` };

  for (const file of files) {
    if (file.size > MAX_BYTES)
      return {
        error: `"${file.name}" 8 MB'tan büyük. Daha küçük bir kare seçin.`,
      };
    if (!TYPES.has(file.type))
      return { error: `"${file.name}" desteklenmeyen bir dosya türü.` };
  }

  const supabase = await createClient();
  const uploaded: string[] = [];

  for (const file of files) {
    const path = `${invitationId}/${crypto.randomUUID()}.${extensionOf(file)}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) {
      console.error("[guest-photos] yükleme hatası:", error);
      return { error: "Fotoğraf yüklenemedi. Lütfen tekrar deneyin." };
    }
    uploaded.push(path);
  }

  const { error: insertError } = await supabase.from("guest_photos").insert(
    uploaded.map((path) => ({
      invitation_id: invitationId,
      path,
      guest_name: guestName || null,
    })),
  );

  if (insertError) {
    console.error("[guest-photos] kayıt hatası:", insertError);
    // Kayıt açılmadıysa dosyalar yetim kalmasın
    await supabase.storage.from(BUCKET).remove(uploaded);
    return {
      error:
        "Fotoğraf kaydedilemedi. Davetiye fotoğraf kabul etmiyor olabilir.",
    };
  }

  if (slug) revalidatePath(`/${slug}`);

  return {
    ok:
      uploaded.length === 1
        ? "Fotoğrafınız gönderildi. Çift onayladıktan sonra davetiyede görünecek."
        : `${uploaded.length} fotoğraf gönderildi. Çift onayladıktan sonra davetiyede görünecek.`,
  };
}

/** Çiftin bir kareyi onaylaması ya da onayı geri alması. */
export async function moderateGuestPhotoAction(
  _prev: GuestPhotoState,
  formData: FormData,
): Promise<GuestPhotoState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const id = String(formData.get("photo_id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const approve = String(formData.get("approve") ?? "") === "1";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guest_photos")
    .update({ approved: approve })
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("[guest-photos] moderasyon hatası:", error);
    return { error: `İşlem başarısız: ${error.message}` };
  }
  if (!data?.length) return { error: "Kayıt bulunamadı ya da yetkiniz yok." };

  if (slug) {
    revalidatePath(`/panel/davetiye/${slug}/anilar`);
    revalidatePath(`/${slug}`);
  }

  return { ok: approve ? "Fotoğraf yayınlandı." : "Fotoğraf gizlendi." };
}

/** Çiftin bir kareyi tamamen silmesi — dosya da bucket'tan kalkar. */
export async function deleteGuestPhotoAction(
  _prev: GuestPhotoState,
  formData: FormData,
): Promise<GuestPhotoState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const id = String(formData.get("photo_id") ?? "");
  const slug = String(formData.get("slug") ?? "");

  const supabase = await createClient();

  // Yolu silmeden ÖNCE oku — satır gidince dosyanın adresi kaybolur
  const { data: row } = await supabase
    .from("guest_photos")
    .select("path")
    .eq("id", id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("guest_photos")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("[guest-photos] silme hatası:", error);
    return { error: `Silinemedi: ${error.message}` };
  }
  if (!data?.length) return { error: "Kayıt bulunamadı ya da yetkiniz yok." };

  if (row?.path) await supabase.storage.from(BUCKET).remove([row.path]);

  if (slug) {
    revalidatePath(`/panel/davetiye/${slug}/anilar`);
    revalidatePath(`/${slug}`);
  }

  return { ok: "Fotoğraf silindi." };
}
