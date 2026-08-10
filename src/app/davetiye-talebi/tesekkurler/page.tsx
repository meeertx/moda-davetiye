import { ButtonLink } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Talebiniz Alındı" };

export default async function TesekkurlerPage({
  searchParams,
}: {
  searchParams: Promise<{ no?: string }>;
}) {
  const { no } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center font-body text-ink bg-cream text-center p-10">
      <div className="max-w-[520px]">
        <div className="w-16 h-16 rounded-full bg-ink text-gold-light flex items-center justify-center text-[28px] mx-auto mb-7">
          ✓
        </div>
        <h1 className="font-display font-medium text-[34px] m-0 mb-3.5">
          Talebiniz alındı
        </h1>

        {no && (
          <div className="inline-block border border-line bg-paper rounded-[4px] px-5 py-3 mb-6">
            <div className="text-[11px] tracking-[0.06em] uppercase text-muted mb-1">
              Sipariş Numaranız
            </div>
            <div className="font-display text-2xl font-semibold tracking-[0.02em]">
              {no}
            </div>
          </div>
        )}

        <p className="text-[15px] leading-[1.7] text-muted m-0 mb-8">
          Ekibimiz davetiyenizi hazırlamaya başlıyor. Hazır olduğunda bağlantısı
          panelinizde görünecek ve size e-posta ile bildirilecek.
        </p>

        <div className="flex gap-3 justify-center">
          <ButtonLink
            href={no ? `/panel/siparis/${no}` : "/panel"}
            variant="primary"
            size="lg"
            shape="sharp"
          >
            Siparişimi Takip Et
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg" shape="sharp">
            Ana Sayfa
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
