import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ThemeRenderer from "@/components/invitation/ThemeRenderer";
import { getInvitationBySlug } from "@/lib/invitations";
import { isReservedSlug } from "@/lib/slug";
import { EVENT_HEADINGS } from "@/types/invitation";

/**
 * Davetiye adresi site kökünde yaşar: modavetiye.com/<slug>
 *
 * Next.js statik route'ları dinamik olandan önce eşler, dolayısıyla
 * /giris, /panel gibi sayfalar buraya hiç düşmez. Yine de rezerve adlar
 * burada da eleniyor: veritabanı bu adları slug olarak kabul etmiyor,
 * ama biri elle denerse davetiye aramaya kalkmayalım.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (isReservedSlug(slug)) return { title: "Sayfa bulunamadı" };

  const inv = await getInvitationBySlug(slug);
  if (!inv) return { title: "Davetiye bulunamadı" };

  const couple = `${inv.brideName} & ${inv.groomName}`;
  const heading = EVENT_HEADINGS[inv.eventType];
  const date = inv.eventAt
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(inv.eventAt))
    : null;

  const description = [heading, date, inv.venueName]
    .filter(Boolean)
    .join(" · ");

  return {
    title: `${couple} — ${heading}`,
    description,
    // Yayınlanmamış önizleme arama motorlarına düşmesin
    robots: inv.published ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      title: `${couple} — ${heading}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${couple} — ${heading}`,
      description,
    },
  };
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (isReservedSlug(slug)) notFound();

  const content = await getInvitationBySlug(slug);
  if (!content) notFound();

  return (
    <>
      {/* Yayınlanmamış davetiyeyi yalnızca sahibi ve admin görebilir (RLS).
          Yanlışlıkla paylaşılmasın diye durum açıkça belirtiliyor. */}
      {!content.published && (
        <div className="bg-warn-bg text-warn-fg text-center py-2.5 px-6 text-[13px] font-body">
          Bu davetiye henüz yayında değil — yalnızca siz görüyorsunuz.{" "}
          <Link href="/panel" className="underline text-warn-fg">
            Panele dön
          </Link>
        </div>
      )}
      <ThemeRenderer content={content} preview={!content.published} />
    </>
  );
}
