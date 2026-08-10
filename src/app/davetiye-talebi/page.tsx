import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import Breadcrumb from "@/components/marketing/Breadcrumb";
import DraftForm from "@/components/order/DraftForm";
import { draftFromParams } from "@/lib/order-draft";
import { getTheme } from "@/data/themes";

export const metadata: Metadata = {
  title: "Davetiye Talebi",
  description:
    "Birkaç bilgi girin, davetiyenizin demosunu hemen görün. Hesap açmanıza gerek yok.",
};

export default async function DavetiyeTalebiPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  // Önizlemeden "düzenle" ile dönüldüğünde alanlar dolu gelsin
  const draft = draftFromParams(params);
  const temaParam = Array.isArray(params.tema) ? params.tema[0] : params.tema;

  return (
    <SiteShell footer={40}>
      <main className="flex-1 max-w-[860px] mx-auto pt-14 px-6 pb-[110px] w-full box-border">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Davetiye Talebi" },
          ]}
        />

        <div className="text-[13px] tracking-[0.12em] uppercase text-gold mb-3 mt-2">
          Adım 1 / 2
        </div>
        <h1 className="font-display font-medium text-[44px] m-0 mb-3">
          Önce demosunu görün
        </h1>
        <p className="text-base leading-[1.7] text-muted max-w-[560px] m-0 mb-10">
          Birkaç bilgi yeterli — davetiyenizin nasıl görüneceğini hemen
          gösterelim. Beğenirseniz sipariş adımında kalan detayları alırız.
        </p>

        <DraftForm
          initial={
            draft ?? (getTheme(temaParam ?? "") ? { themeSlug: temaParam } : undefined)
          }
        />
      </main>
    </SiteShell>
  );
}
