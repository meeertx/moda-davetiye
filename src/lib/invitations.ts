import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/types/supabase";
import type { InvitationContent } from "@/types/invitation";

type InvitationRow = Database["public"]["Tables"]["invitations"]["Row"];

const BUCKET = "order-photos";
const GUEST_BUCKET = "guest-photos";
const PHOTO_TTL = 60 * 60; // 1 saat

/**
 * Misafir fotoğrafı bucket'ı herkese açık — davetiyedeki <img> etiketleri
 * imzalı adresi kendi kendine yenileyemez. Gizlilik, hangi karenin
 * gösterileceğine karar veren `guest_photos.approved` alanında korunuyor.
 */
function guestPhotoUrl(supabaseUrl: string, path: string) {
  return `${supabaseUrl}/storage/v1/object/public/${GUEST_BUCKET}/${path}`;
}

/**
 * Fotoğrafları görüntülenebilir adreslere çevirir.
 *
 * Bucket herkese açık değil. Davetiye sayfasını giriş yapmamış misafirler
 * de görüyor, dolayısıyla imzalı adresleri sunucuda service-role ile
 * üretiyoruz — böylece dosyalar listelenemez ama davetiyede görünür.
 */
async function signPhotos(paths: string[]): Promise<string[]> {
  if (!paths.length || !hasServiceRole) return [];
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrls(paths, PHOTO_TTL);
  if (error) {
    console.error("[invitations] fotoğraf imzalanamadı:", error);
    return [];
  }
  return data.flatMap((d) => (d.signedUrl ? [d.signedUrl] : []));
}

function toContent(
  row: InvitationRow,
  photoUrls: string[],
  guestPhotoUrls: string[] = [],
): InvitationContent {
  return {
    id: row.id,
    slug: row.slug,
    themeSlug: row.theme_slug,
    eventType: row.event_type,
    brideName: row.bride_name ?? "",
    groomName: row.groom_name ?? "",
    brideParents: row.bride_parents,
    groomParents: row.groom_parents,
    eventAt: row.event_at,
    venueName: row.venue_name,
    venueAddress: row.venue_address,
    venueMapUrl: row.venue_map_url,
    story: row.story,
    program: row.program ?? [],
    photoUrls,
    menu: row.menu ?? [],
    extraInfo: row.extra_info,
    giftNote: row.gift_note,
    giftIban: row.gift_iban,
    musicUrl: row.music_url,
    musicTitle: row.music_title,
    rsvp: {
      enabled: row.rsvp_enabled,
      deadline: row.rsvp_deadline,
      plusOne: row.rsvp_plus_one,
      questions: row.rsvp_questions ?? [],
    },
    guestPhotosEnabled: row.guest_photos_enabled,
    guestPhotoUrls,
    published: row.published,
  };
}

/**
 * Davetiyede gösterilecek misafir kareleri — yalnızca onaylananlar.
 *
 * RLS "approved = true" satırlarını herkese açtığı için normal istemciyle
 * okunabiliyor; sahibi ayrıca onay bekleyenleri de görür ama davetiye
 * sayfası bilinçli olarak yalnızca onaylıları ister.
 */
async function loadGuestPhotos(
  supabase: Awaited<ReturnType<typeof createClient>>,
  invitationId: string,
  enabled: boolean,
): Promise<string[]> {
  if (!enabled) return [];

  const { data, error } = await supabase
    .from("guest_photos")
    .select("path")
    .eq("invitation_id", invitationId)
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(60);

  if (error) {
    console.error("[invitations] misafir fotoğrafları okunamadı:", error);
    return [];
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return data.map((r) => guestPhotoUrl(base, r.path));
}

/**
 * Slug'a göre davetiyeyi getirir.
 *
 * RLS gereği giriş yapmamış ziyaretçiye yalnızca yayındaki davetiyeler
 * döner; sahibi ve admin yayınlanmamışı da görebilir (önizleme).
 */
export async function getInvitationBySlug(
  slug: string,
): Promise<InvitationContent | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[invitations] okunamadı:", error);
    return null;
  }
  if (!data) return null;

  const [photoUrls, guestPhotoUrls] = await Promise.all([
    signPhotos(data.photos ?? []),
    loadGuestPhotos(supabase, data.id, data.guest_photos_enabled),
  ]);

  return toContent(data, photoUrls, guestPhotoUrls);
}

/** Sipariş numarasına bağlı davetiye — admin ve müşteri panelinde kullanılır. */
export async function getInvitationByOrderId(
  orderId: string,
): Promise<InvitationContent | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("invitations")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  if (!data) return null;

  const [photoUrls, guestPhotoUrls] = await Promise.all([
    signPhotos(data.photos ?? []),
    loadGuestPhotos(supabase, data.id, data.guest_photos_enabled),
  ]);

  return toContent(data, photoUrls, guestPhotoUrls);
}

/**
 * Davetiyenin misafir kareleri — onay bekleyenler dahil.
 * Müşteri panelindeki moderasyon ekranı kullanır.
 */
export async function getGuestPhotosForOwner(invitationId: string) {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guest_photos")
    .select("id, path, guest_name, approved, created_at")
    .eq("invitation_id", invitationId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[invitations] misafir fotoğrafları okunamadı:", error);
    return [];
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return data.map((r) => ({ ...r, url: guestPhotoUrl(base, r.path) }));
}

/** Ham satır — admin editörü form alanlarını doldurmak için kullanır. */
export async function getInvitationRowByOrderId(
  orderId: string,
): Promise<InvitationRow | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("invitations")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();
  return data ?? null;
}
