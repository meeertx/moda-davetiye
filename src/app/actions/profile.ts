"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface ProfileActionState {
  error?: string;
  ok?: string;
}

const NOT_CONFIGURED = "Supabase yapılandırılmadı.";

/** Supabase'in İngilizce hata mesajlarını kullanıcıya Türkçe göster. */
function translate(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Mevcut şifreniz hatalı.";
  if (m.includes("should be different from the old password"))
    return "Yeni şifre eskisiyle aynı olamaz.";
  if (m.includes("password should be at least"))
    return "Şifre en az 8 karakter olmalı.";
  if (m.includes("email address is invalid") || m.includes("invalid email"))
    return "Geçerli bir e-posta adresi girin.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Bu e-posta adresi başka bir hesapta kullanılıyor.";
  // Kullanıcının hatası değil: e-posta gönderim kotası. Yanıltıcı bir
  // "çok fazla deneme" mesajı yerine gerçek durumu söylüyoruz.
  if (m.includes("email rate limit"))
    return "E-posta gönderim kotası şu an dolu. Kısa bir süre sonra tekrar deneyin.";
  if (m.includes("rate limit") || m.includes("too many") || m.includes("security purposes"))
    return "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin.";
  return message;
}

/** Oturumdaki kullanıcıyı döndürür. */
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/**
 * Mevcut şifreyi doğrular.
 *
 * Supabase, geçerli bir oturum varken eski şifreyi sormadan güncellemeye
 * izin verir. Açık kalmış bir oturumu ele geçiren birinin şifreyi ya da
 * e-postayı değiştirmesini engellemek için hassas işlemlerde yeniden
 * kimlik doğrulaması yapıyoruz.
 */
async function verifyPassword(
  email: string,
  password: string,
): Promise<string | null> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? translate(error.message) : null;
}

// --- Hesap bilgileri --------------------------------------------------------

export async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName) return { error: "Ad soyad boş bırakılamaz." };
  if (fullName.length > 120) return { error: "Ad soyad çok uzun." };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Oturum bulunamadı, tekrar giriş yapın." };

  // Profiles tablosuna upsert et (kayıt yoksa oluşturur, varsa günceller)
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      phone: phone || null,
      email: user.email ?? null,
      updated_at: new Date().toISOString(),
    })
    .select("id");

  if (error) {
    console.error("[profile] güncelleme hatası:", error);
    return { error: `Kaydedilemedi: ${error.message}` };
  }

  // auth.users meta verilerini de eşzamanlı olarak güncelle
  await supabase.auth.updateUser({
    data: { full_name: fullName, phone: phone || null },
  });

  revalidatePath("/", "layout");
  revalidatePath("/panel", "layout");
  revalidatePath("/admin", "layout");
  return { ok: "Profil bilgileriniz Supabase veritabanına anında kaydedildi." };
}

// --- E-posta ----------------------------------------------------------------

export async function updateEmailAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const newEmail = String(formData.get("new_email") ?? "").trim().toLowerCase();
  const currentPassword = String(formData.get("current_password") ?? "");

  if (!newEmail) return { error: "Yeni e-posta adresini girin." };
  if (!currentPassword)
    return { error: "Değişikliği onaylamak için mevcut şifrenizi girin." };

  const { user } = await requireUser();
  if (!user?.email) return { error: "Oturum bulunamadı, tekrar giriş yapın." };
  if (newEmail === user.email.toLowerCase())
    return { error: "Bu zaten mevcut e-posta adresiniz." };

  const authError = await verifyPassword(user.email, currentPassword);
  if (authError) return { error: authError };

  // verifyPassword oturumu tazelediği için istemci yeniden alınıyor
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) return { error: translate(error.message) };

  revalidatePath("/panel", "layout");
  return {
    ok: `Onay bağlantısı ${newEmail} adresine gönderildi. Bağlantıya tıklayana kadar mevcut adresiniz geçerli kalır.`,
  };
}

// --- Şifre ------------------------------------------------------------------

export async function updatePasswordAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const currentPassword = String(formData.get("current_password") ?? "");
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (!currentPassword) return { error: "Mevcut şifrenizi girin." };
  if (newPassword.length < 8)
    return { error: "Yeni şifre en az 8 karakter olmalı." };
  if (newPassword !== confirmPassword)
    return { error: "Yeni şifre ile tekrarı aynı değil." };
  if (newPassword === currentPassword)
    return { error: "Yeni şifre eskisiyle aynı olamaz." };

  const { user } = await requireUser();
  if (!user?.email) return { error: "Oturum bulunamadı, tekrar giriş yapın." };

  const authError = await verifyPassword(user.email, currentPassword);
  if (authError) return { error: authError };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: translate(error.message) };

  revalidatePath("/panel", "layout");
  return { ok: "Şifreniz güncellendi." };
}
