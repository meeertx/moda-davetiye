import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import PanelShell from "@/components/panel/PanelShell";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import GuestPhotoModeration from "@/components/panel/GuestPhotoModeration";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getGuestPhotosForOwner } from "@/lib/invitations";

export const metadata: Metadata = { title: "Misafir Anıları" };

/**
 * Misafirlerin bıraktığı karelerin onay ekranı.
 *
 * Yükleme herkese açık olduğu için gelen her kare önce burada durur;
 * davetiyede yalnızca çiftin onayladıkları görünür.
 */
export default async function GuestPhotosPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isSupabaseConfigured) {
    return (
      <PanelShell>
        <NotConfiguredNotice />
      </PanelShell>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/giris?next=/panel/davetiye/${slug}/anilar`);

  // user_id filtresi: RLS zaten sınırlıyor, bu müşteri alanını rolden
  // bağımsız olarak "kendi davetiyem"e kilitler.
  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, slug, bride_name, groom_name, guest_photos_enabled")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!invitation) notFound();

  const photos = await getGuestPhotosForOwner(invitation.id);
  const pending = photos.filter((p) => !p.approved).length;

  const couple =
    [invitation.bride_name, invitation.groom_name].filter(Boolean).join(" & ") ||
    "Davetiyeniz";

  return (
    <PanelShell>
      <Link
        href={`/panel/davetiye/${slug}`}
        className="text-[13px] text-muted"
      >
        ← {couple}
      </Link>

      <h1 className="font-display font-medium text-[32px] m-0 mt-4 mb-1">
        Misafir Anıları
      </h1>
      <p className="text-sm text-muted m-0 mb-8">
        {pending > 0
          ? `${pending} fotoğraf onayınızı bekliyor. Yayınladıklarınız davetiyede görünür.`
          : "Misafirlerinizin gönderdiği kareler. Yayınladıklarınız davetiyede görünür."}
      </p>

      {!invitation.guest_photos_enabled && (
        <p className="text-sm text-muted bg-paper-alt border border-line-panel rounded-[10px] px-5 py-4 mb-6">
          Bu davetiyede misafir fotoğrafı toplama kapalı. Açtırmak için bizimle
          iletişime geçin.
        </p>
      )}

      <GuestPhotoModeration photos={photos} slug={slug} />
    </PanelShell>
  );
}
