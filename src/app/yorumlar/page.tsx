import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import Initials from "@/components/marketing/Initials";
import Stars from "@/components/ui/Stars";
import { ButtonLink } from "@/components/ui/Button";
import { ALL_TESTIMONIALS } from "@/data/testimonials";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Yorumlar",
  description: `${BRAND.name} ile davetiyesini hazırlayan çiftlerin deneyimleri.`,
};

export default function YorumlarPage() {
  const [featured, ...rest] = ALL_TESTIMONIALS;

  return (
    <SiteShell footer={40}>
      <main className="flex-1 w-full max-w-[1100px] mx-auto pt-16 px-6 pb-[110px]">
        <h1 className="font-display font-medium text-[38px] sm:text-[46px] m-0 mb-4 max-w-[620px] text-balance">
          Çiftlerimiz Ne Diyor
        </h1>
        <p className="text-base leading-[1.7] text-muted max-w-[520px] m-0">
          Davetiyesini bizimle hazırlayan çiftlerin kendi cümleleri.
        </p>

        {/* ÖNE ÇIKAN — kart değil, sayfanın kendi zemininde bir alıntı */}
        <figure className="border-y border-line my-14 py-12 m-0">
          <Stars className="text-gold mb-7" />
          <blockquote className="m-0">
            <p className="font-display italic text-[30px] sm:text-[40px] leading-[1.35] m-0 max-w-[880px] text-balance">
              &ldquo;{featured.quote}&rdquo;
            </p>
          </blockquote>
          <figcaption className="flex items-center gap-4 mt-9">
            <Initials name={featured.author} />
            <div>
              <div className="text-[15px] text-ink">{featured.author}</div>
              <div className="text-[13px] text-muted">{featured.context}</div>
            </div>
          </figcaption>
        </figure>

        {/*
          Kalan yorumlar sütun akışında: metin uzunlukları farklı olduğu için
          kartlar doğal olarak farklı yükseklikte durur — altı özdeş kutuluk
          ızgaranın tekdüzeliği kırılır.
        */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {rest.map((r) => (
            <figure
              key={r.author + r.quote.slice(0, 12)}
              className="break-inside-avoid mb-6 bg-paper border border-line rounded-md p-7 m-0"
            >
              <Stars className="text-gold-light mb-4" />
              <blockquote className="m-0">
                <p className="font-display italic text-[19px] leading-[1.55] m-0">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-line-soft">
                <Initials name={r.author} size={44} />
                <div>
                  <div className="text-sm text-ink">{r.author}</div>
                  <div className="text-[13px] text-muted">{r.context}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="border-t border-line mt-6 pt-12 text-center">
          <p className="font-display italic text-[26px] m-0 mb-6 text-balance">
            Sıradaki hikaye sizinki olsun.
          </p>
          <ButtonLink
            href="/davetiye-talebi"
            variant="primary"
            size="lg"
            shape="sharp"
          >
            Davetiyenizi Oluşturun
          </ButtonLink>
        </div>
      </main>
    </SiteShell>
  );
}
