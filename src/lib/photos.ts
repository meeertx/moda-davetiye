import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const BUCKET = "order-photos";
/** İmzalı URL ömrü — sayfa görüntülemesi için yeterli. */
const TTL_SECONDS = 60 * 60;

/**
 * Storage yollarından görüntülenebilir imzalı URL'ler üretir.
 * Bucket herkese açık olmadığı için doğrudan URL kullanılamaz.
 */
export async function signPhotoUrls(
  supabase: SupabaseClient<Database>,
  paths: string[],
): Promise<string[]> {
  if (!paths.length) return [];

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, TTL_SECONDS);

  if (error) {
    console.error("[photos] imzalı URL üretilemedi:", error);
    return [];
  }
  return data.flatMap((d) => (d.signedUrl ? [d.signedUrl] : []));
}
