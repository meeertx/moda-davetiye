/**
 * Davetiye adresleri site kökünde yaşıyor: modavetiye.com/<slug>
 * Bu yüzden slug üretimi iki şeyi garanti etmeli:
 *  1. uygulamanın kendi sayfa adlarıyla çakışmamalı (rezerve liste),
 *  2. tahmin edilememeli — yoksa biri başkasının düğün tarihini/adresini
 *     slug deneyerek bulabilir.
 */

/** Türkçe karakterleri ASCII'ye indirger. */
const TR_MAP: Record<string, string> = {
  ç: "c", Ç: "c",
  ğ: "g", Ğ: "g",
  ı: "i", I: "i", İ: "i", i: "i",
  ö: "o", Ö: "o",
  ş: "s", Ş: "s",
  ü: "u", Ü: "u",
  â: "a", Â: "a", î: "i", Î: "i", û: "u", Û: "u",
};

export function slugifyTr(input: string): string {
  return input
    .split("")
    .map((ch) => TR_MAP[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Uygulamanın kendi route'ları. Veritabanındaki `reserved_slugs` tablosu
 * asıl garantidir; bu liste form doğrulamasında anında geri bildirim
 * verebilmek için tutulur — ikisi birbiriyle uyumlu kalmalı.
 */
export const RESERVED_SLUGS = new Set([
  "admin", "panel", "giris", "kayit", "cikis",
  "sifremi-unuttum", "davetiye", "davetiye-talebi",
  "tasarimlar", "fiyatlar", "iletisim", "hakkimizda",
  "yorumlar", "yasal", "satin-al",
  "odeme-basarili", "odeme-basarisiz",
  "api", "auth", "_next", "static", "public",
  "favicon", "icon", "manifest", "robots", "sitemap",
  "opengraph-image", "apple-touch-icon", "images", "assets",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}

/** Karışması kolay harf/rakamlar (0/O, 1/l/I) dışarıda bırakıldı. */
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

export function randomSuffix(length = 7): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/**
 * "Elif", "Kaan" → "elif-kaan-7f3ad4k"
 * İsimler boşsa yalnızca rastgele ek üretilir.
 */
export function buildInvitationSlug(
  brideName: string | null,
  groomName: string | null,
): string {
  const base = [brideName, groomName]
    .filter(Boolean)
    .map((n) => slugifyTr(n!))
    .filter(Boolean)
    .join("-")
    .slice(0, 50);

  const suffix = randomSuffix();
  const slug = base ? `${base}-${suffix}` : `davetiye-${suffix}`;

  // Rezerve bir ada denk gelmesi rastgele ek yüzünden imkânsıza yakın,
  // yine de sessizce geçmesin.
  return isReservedSlug(slug) ? `${slug}-${randomSuffix(3)}` : slug;
}

/** Kullanıcı slug'ı elle düzenlerse geçerliliğini denetler. */
export function validateSlug(slug: string): string | null {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
    return "Adres yalnızca küçük harf, rakam ve tire içerebilir.";
  if (slug.length < 3 || slug.length > 80)
    return "Adres 3-80 karakter arasında olmalı.";
  if (isReservedSlug(slug))
    return "Bu adres sistem tarafından kullanılıyor, başka bir tane seçin.";
  return null;
}
