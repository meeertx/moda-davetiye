/**
 * Supabase yapılandırması tek yerden okunur.
 *
 * Anahtarlar tanımlı değilse uygulama çökmez: auth ve sipariş ekranları
 * "yapılandırma bekleniyor" durumuna düşer, sitenin geri kalanı (pazarlama
 * sayfaları, mock paneller) çalışmaya devam eder. Bu sayede proje henüz
 * açılmadan da geliştirmeye devam edilebilir.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
