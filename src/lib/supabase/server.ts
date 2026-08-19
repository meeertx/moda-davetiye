import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Server component / route handler / server action tarafı istemci.
 *
 * Oturum çerezden okunur, dolayısıyla RLS politikaları giriş yapan
 * kullanıcının kimliğiyle çalışır — sorgularda ekstra yetki kontrolü
 * gerekmez.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server component'ten çağrıldığında çerez yazılamaz; oturum
          // tazeleme middleware tarafından yapıldığı için bu güvenle yutulur.
        }
      },
    },
  });
}

/** Zaman aşımı koruması — Supabase ağ sorgusu yavaşlarsa sayfayı kilitlemez. */
export async function withTimeout<T>(promise: PromiseLike<T>, ms = 1800): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Supabase request timeout")), ms);
  });
  return Promise.race([Promise.resolve(promise), timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

/** Giriş yapmış kullanıcı ve profili; oturum yoksa veya yavaşsa null. */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const res = await withTimeout(supabase.auth.getUser(), 1500);
    const user = res.data?.user;
    if (!user) return null;

    const profileRes = await withTimeout(
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      1500,
    );

    return { user, profile: profileRes.data };
  } catch {
    return null;
  }
}
