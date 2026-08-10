"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface ActionState {
  error?: string;
}

const NOT_CONFIGURED =
  "Supabase henüz yapılandırılmadı. .env dosyasındaki NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY değerlerini doldurun.";

/** Supabase'in İngilizce hata mesajlarını kullanıcıya Türkçe göster. */
function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "E-posta veya şifre hatalı.";
  if (m.includes("email not confirmed"))
    return "E-posta adresiniz henüz doğrulanmamış. Gelen kutunuzu kontrol edin.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Bu e-posta adresiyle zaten bir hesap var. Giriş yapmayı deneyin.";
  if (m.includes("password should be at least"))
    return "Şifre en az 8 karakter olmalı.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin.";
  return message;
}

export async function signUpAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const kvkk = formData.get("kvkk");
  const next = String(formData.get("next") ?? "") || "/panel";

  if (!fullName) return { error: "Ad soyad zorunlu." };
  if (!email) return { error: "E-posta zorunlu." };
  if (password.length < 8) return { error: "Şifre en az 8 karakter olmalı." };
  if (!kvkk)
    return { error: "Devam etmek için KVKK aydınlatma metnini onaylamalısınız." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    // Trigger bu alanları okuyup profiles satırını oluşturuyor
    options: { data: { full_name: fullName, phone: phone || null } },
  });

  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/panel");
}

export async function signInAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "") || "/panel";

  if (!email || !password)
    return { error: "E-posta ve şifre alanlarını doldurun." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  // Açık yönlendirmeyi önlemek için yalnızca site içi yollara izin verilir
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/panel");
}

/** Admin girişi — rol kontrolü middleware'de, burada yalnızca oturum açılır. */
export async function adminSignInAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: translateAuthError(error.message) };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "Bu hesabın yönetim paneline erişim yetkisi yok." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function signOutAction() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/giris");
}

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState & { sent?: boolean }> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "E-posta adresinizi girin." };

  const supabase = await createClient();
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${site}/giris`,
  });

  if (error) return { error: translateAuthError(error.message) };
  return { sent: true };
}
