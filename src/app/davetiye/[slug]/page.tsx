import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ThemeRenderer, {
  IMPLEMENTED_THEMES,
} from "@/components/invitation/ThemeRenderer";

import { THEMES, getTheme } from "@/data/themes";
import { demoContentFor } from "@/data/demo-invitation";

/**
 * Tema önizlemesi: modavetiye.com/davetiye/<tema-slug>
 *
 * Gerçek tema bileşenini örnek içerikle basar — ziyaretçi "Ücretsiz Dene"
 * dediğinde satın alacağı tasarımın aynısını görür. (Gerçek davetiyeler
 * site kökünde yaşar: modavetiye.com/<davetiye-slug>)
 */

export function generateStaticParams() {
  return THEMES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const theme = getTheme(slug);
  if (!theme) return { title: "Tema bulunamadı" };
  return {
    title: `${theme.name} — Örnek Davetiye`,
    description: theme.blurb,
    robots: { index: false },
  };
}

export default async function TemaOnizlemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = getTheme(slug);
  if (!theme) notFound();

  const implemented = IMPLEMENTED_THEMES.has(theme.slug);

  return (
    <>
      <div className="bg-gold-light text-[oklch(20%_0.02_50)] text-center py-2.5 px-6 text-[12.5px] font-body">
        <strong className="font-medium">{theme.name}</strong> — örnek davetiye.
        {!implemented && " Bu temanın kendi tasarımı hazırlanıyor."} Katılım
        yanıtları kaydedilmez.{" "}
        <Link
          href={`/davetiye-talebi?tema=${theme.slug}`}
          className="text-[oklch(20%_0.02_50)] underline font-medium"
        >
          Bu temayla talep oluştur
        </Link>
      </div>
      <ThemeRenderer content={demoContentFor(theme.slug)} preview />
    </>
  );
}
