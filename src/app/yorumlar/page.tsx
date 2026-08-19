import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import Initials from "@/components/marketing/Initials";
import Stars from "@/components/ui/Stars";
import { ButtonLink } from "@/components/ui/Button";
import { ALL_TESTIMONIALS } from "@/data/testimonials";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Çiftlerimizin Yorumları",
  description: `${BRAND.name} ile davetiyesini hazırlayan çiftlerin gerçek deneyimleri.`,
};

export default function YorumlarPage() {
  const [featured, ...rest] = ALL_TESTIMONIALS;

  return (
    <SiteShell footer={40}>
      <main className="flex-1 w-full max-w-[1200px] mx-auto pt-20 px-6 sm:px-14 pb-28">
        {/* Header */}
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11.5px] font-semibold tracking-[0.15em] uppercase mb-4 shadow-sm">
            ★ MUTLU ÇİFTLERİMİZ
          </div>
          <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-ink m-0 mb-4 tracking-tight">
            Çiftlerimiz Ne Diyor?
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted font-light m-0">
            Davetiyesini bizimle hazırlayan ve sevdiklerine ulaştıran çiftlerin samimi görüşleri.
          </p>
        </div>

        {/* ÖNE ÇIKAN ALINTI - Glassmorphic Hero Review */}
        <figure className="glass-luxury rounded-2xl p-8 sm:p-14 border border-gold/30 shadow-[0_20px_50px_-15px_rgba(212,175,55,0.15)] mb-16 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <div className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30">
              <Stars className="text-gold scale-95" />
            </div>
            <span className="text-xs text-gold font-medium tracking-wider uppercase">ÖNE ÇIKAN DEĞERLENDİRME</span>
          </div>
          <blockquote className="m-0">
            <p className="font-display italic text-2xl sm:text-4xl leading-relaxed text-ink font-medium m-0 max-w-[950px]">
              &ldquo;{featured.quote}&rdquo;
            </p>
          </blockquote>
          <figcaption className="flex items-center gap-4 mt-8 pt-6 border-t border-gold/15">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-gold to-gold-light">
              <Initials name={featured.author} size={44} />
            </div>
            <div>
              <div className="text-base font-semibold text-ink tracking-wide">{featured.author}</div>
              <div className="text-xs text-muted font-light">{featured.context}</div>
            </div>
          </figcaption>
        </figure>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {rest.map((r) => (
            <figure
              key={r.author + r.quote.slice(0, 12)}
              className="break-inside-avoid glass-luxury rounded-2xl p-7 border border-gold/20 shadow-md hover:shadow-xl transition-all duration-300 apple-press m-0"
            >
              <Stars className="text-gold mb-4 scale-90 -ml-1" />
              <blockquote className="m-0">
                <p className="font-display italic text-lg leading-relaxed text-ink/90 font-medium m-0">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-gold/15">
                <Initials name={r.author} size={44} />
                <div>
                  <div className="text-sm font-semibold text-ink">{r.author}</div>
                  <div className="text-xs text-muted font-light">{r.context}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Call to action */}
        <div className="glass-dark rounded-2xl p-12 mt-16 border border-gold/30 text-center relative overflow-hidden">
          <h3 className="font-display italic font-medium text-3xl sm:text-4xl text-amber-100 m-0 mb-4">
            Sıradaki hikaye sizinki olsun.
          </h3>
          <p className="text-mist font-light text-sm max-w-[500px] mx-auto mb-8">
            Dakikalar içinde prestijli dijital davetiyenizi tasarlayın ve paylaşın.
          </p>
          <ButtonLink
            href="/tasarimlar"
            variant="gold"
            size="lg"
            shape="pill"
            className="px-9 py-4 font-semibold text-sm apple-press"
          >
            Temaları Keşfet →
          </ButtonLink>
        </div>
      </main>
    </SiteShell>
  );
}
