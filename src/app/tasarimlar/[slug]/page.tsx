import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import Breadcrumb from "@/components/marketing/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { THEMES, getTheme } from "@/data/themes";

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
  return { title: theme.name, description: theme.blurb };
}

export default async function TasarimDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = getTheme(slug);
  if (!theme) notFound();

  return (
    <SiteShell categories>
      <main className="pt-14 px-14 pb-[110px] max-w-[1300px] mx-auto w-full box-border">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Tasarımlar", href: "/tasarimlar" },
            { label: theme.name },
          ]}
        />

        <div className="grid grid-cols-[420px_1fr] gap-16 mt-8">
          <div className="relative">
            <div
              className="w-full aspect-[4/5] rounded-md flex items-center justify-center text-[oklch(45%_0.02_60)] text-[11px] uppercase"
              style={{ background: theme.stripe }}
            >
              canlı önizleme videosu
            </div>
            <div className="absolute top-4 left-4 w-11 h-11 rounded-full bg-cream/90 flex items-center justify-center text-sm">
              ▶
            </div>
          </div>

          <div>
            <div className="text-[13px] uppercase text-gold mb-3">
              {theme.categoryLabel}
            </div>
            <h1 className="font-display font-medium text-[46px] m-0 mb-[18px]">
              {theme.name}
            </h1>
            <p className="text-base leading-[1.7] text-muted max-w-[520px] m-0 mb-8">
              {theme.longDesc}
            </p>

            <div className="flex gap-3.5 mb-10">
              <ButtonLink
                href={`/davetiye-talebi?tema=${theme.slug}`}
                variant="primary"
                size="lg"
                shape="sharp"
                className="px-[30px] hover:-translate-y-0.5 hover:shadow-[0_16px_26px_-12px_oklch(24%_0.02_50_/_0.4)]"
              >
                Bu Temayla Talep Oluştur
              </ButtonLink>
              <ButtonLink
                href={`/davetiye/${theme.slug}`}
                variant="secondary"
                size="lg"
                shape="sharp"
                className="px-[30px]"
              >
                Ücretsiz Dene
              </ButtonLink>
            </div>

            <div className="border-t border-line pt-7">
              <div className="text-[13px] uppercase text-ink mb-4">
                Bu Temada Neler Var
              </div>
              <div className="grid grid-cols-2 gap-3">
                {theme.features.map((f) => (
                  <div key={f} className="text-sm text-slate flex gap-2">
                    <span className="text-gold">—</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
