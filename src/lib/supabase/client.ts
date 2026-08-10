import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/** Tarayıcı (client component) tarafı Supabase istemcisi. */
export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
