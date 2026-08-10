import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { SUPABASE_URL } from "./config";

/**
 * Service-role istemcisi — RLS'i TAMAMEN atlar.
 *
 * Yalnızca RLS ile çözülemeyen işler için kullanılır; şu an tek kullanım
 * alanı müşteri e-posta adresini `auth.users`'tan okumak (anon istemci
 * bu tabloyu göremez).
 *
 * Kural: bu istemci asla bir client component'e sızmamalı ve kullanıcıdan
 * gelen filtrelerle serbestçe sorgu çalıştırmak için kullanılmamalıdır.
 */
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const hasServiceRole = Boolean(SUPABASE_URL && serviceRoleKey);

export function createAdminClient() {
  if (!hasServiceRole) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY tanımlı değil — admin istemcisi kullanılamaz.",
    );
  }
  return createSupabaseClient<Database>(SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Kullanıcının e-posta adresini auth.users'tan okur. */
export async function getUserEmail(userId: string): Promise<string | null> {
  if (!hasServiceRole) return null;
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error) {
    console.error("[supabase/admin] kullanıcı okunamadı:", error);
    return null;
  }
  return data.user?.email ?? null;
}
