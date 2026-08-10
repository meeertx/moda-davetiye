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

/** Giriş yapmış kullanıcı ve profili; oturum yoksa null. */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}
