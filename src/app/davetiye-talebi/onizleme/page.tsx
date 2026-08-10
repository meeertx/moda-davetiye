import { ButtonLink } from "@/components/ui/Button";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import DemoPreview from "@/components/order/DemoPreview";
import { draftFromParams, draftToQuery } from "@/lib/order-draft";
import { getTheme } from "@/data/themes";

export const metadata: Metadata = {
  title: "Demo Önizleme",
  robots: { index: false },
};

export default async function OnizlemePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const draft = draftFromParams(params);

  // Eksik/bozuk parametreyle gelinirse 1. adıma dön
  if (!draft) redirect("/davetiye-talebi");

  const theme = getTheme(draft.themeSlug)!;
  const query = draftToQuery(draft);

  return (
    <SiteShell footer={40}>
      <main className="flex-1 max-w-[1000px] mx-auto pt-14 px-6 pb-[110px] w-full box-border">
        <div className="text-[13px] tracking-[0.12em] uppercase text-gold mb-3">
          Demo Önizleme
        </div>
        <h1 className="font-display font-medium text-[40px] m-0 mb-3">
          Davetiyeniz böyle bir his verecek
        </h1>
        <p className="text-base leading-[1.7] text-muted max-w-[560px] m-0 mb-10">
          Bu kısıtlı bir önizleme — gerçek davetiyeniz seçtiğiniz tema
          üzerinde, aşağıdaki tüm bölümlerle birlikte ekibimiz tarafından
          hazırlanır.
        </p>

        <div className="flex gap-14 items-start flex-wrap">
          <DemoPreview draft={draft} />

          <div className="flex-1 min-w-[300px]">
            <div className="text-[13px] tracking-[0.03em] uppercase text-muted mb-4">
              {theme.name} temasında neler var
            </div>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {theme.features.map((f) => (
                <div key={f} className="text-sm text-slate flex gap-2">
                  <span className="text-gold">—</span>
                  {f}
                </div>
              ))}
            </div>

            <div className="border-t border-line pt-7">
              <p className="text-sm text-muted leading-[1.7] m-0 mb-6">
                Beğendiyseniz devam edin — sipariş adımında mekan, program,
                hikayeniz ve fotoğraflarınızı alalım, gerisini biz halledelim.
              </p>

              <div className="flex gap-3 flex-wrap">
                <ButtonLink
                  href={`/davetiye-talebi/detaylar?${query}`}
                  variant="primary"
                  size="lg"
                  shape="sharp"
                >
                  Beğendim, Sipariş Oluştur →
                </ButtonLink>
                <ButtonLink
                  href={`/davetiye-talebi?${query}`}
                  variant="secondary"
                  size="lg"
                  shape="sharp"
                >
                  Bilgileri Düzenle
                </ButtonLink>
              </div>

              <p className="text-xs text-muted mt-4 m-0">
                Sipariş adımında hesabınıza giriş yapmanız istenir. Girdiğiniz
                bilgiler kaybolmaz.
              </p>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
