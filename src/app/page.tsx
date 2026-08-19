import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import { ButtonLink } from "@/components/ui/Button";
import TestimonialSlider from "@/components/marketing/TestimonialSlider";
import { HOW_IT_WORKS } from "@/data/testimonials";
import { getTheme } from "@/data/themes";

/** Öne çıkan temalar bento ızgarası — slug'lar tema kataloğundan çözülür. */
const FEATURED = [
  {
    slug: "royal-starlight",
    span: "row-span-2",
    badge: "★ AMİRAL GEMİSİ",
    badgeTone: "gold" as const,
    titleSize: "text-[26px]",
    labelSize: "text-[11px]",
    pad: "p-[22px]",
    dark: true,
  },
  {
    slug: "altin-bahce-kapisi",
    span: "",
    badge: "Popüler VIP",
    badgeTone: "gold" as const,
    titleSize: "text-xl",
    labelSize: "text-[10.5px]",
    pad: "p-[18px]",
    dark: true,
  },
  {
    slug: "atelier-indigo",
    span: "",
    badge: "Artisan",
    badgeTone: "light" as const,
    titleSize: "text-xl",
    labelSize: "text-[10.5px]",
    pad: "p-[18px]",
    dark: true,
  },
  {
    slug: "nar-oryantal-kina",
    span: "col-span-2",
    badge: "Kına Özel",
    badgeTone: "gold" as const,
    titleSize: "text-2xl",
    labelSize: "text-[11px]",
    pad: "p-[22px]",
    dark: true,
  },
];

const STATS = [
  { value: "12.400+", label: "yayınlanan davetiye" },
  { value: "4.9/5", label: "ortalama değerlendirme" },
  { value: "7", label: "özel tema" },
];

export default function HomePage() {
  return (
    <SiteShell announcement categories footer="full">
      <main>
        {/* HERO */}
        <section className="grid grid-cols-[1.1fr_1fr] gap-16 items-center pt-22 px-14 pb-25 max-w-[1440px] mx-auto">
          <div>
            <div
              className="flex items-center gap-3.5 mb-6"
              style={{ animation: "fadeUp 0.7s ease both" }}
            >
              <div className="w-7 h-px bg-gold" />
              <div className="text-[13px] tracking-[0.14em] uppercase text-gold">
                Dijital Davetiye Atölyesi
              </div>
            </div>

            <h1
              className="font-display font-medium text-[72px] leading-[1.02] m-0 mb-[30px] [text-wrap:pretty]"
              style={{ animation: "fadeUp 0.8s ease 0.08s both" }}
            >
              Davetinizin ilk
              <br />
              izlenimi, <span className="italic text-gold">kağıttan güzel</span>{" "}
              olsun.
            </h1>

            <p
              className="text-lg leading-[1.7] text-muted max-w-[460px] m-0 mb-[38px]"
              style={{ animation: "fadeUp 0.8s ease 0.16s both" }}
            >
              Yedi özenle tasarlanmış temadan seçin, bilgilerinizi girin,
              dakikalar içinde paylaşılabilir, müzikli ve RSVP takipli bir
              davetiyeye kavuşun.
            </p>

            <div
              className="flex gap-4 mb-15"
              style={{ animation: "fadeUp 0.8s ease 0.24s both" }}
            >
              <ButtonLink
                href="/tasarimlar"
                variant="primary"
                size="lg"
                shape="sharp"
                className="tracking-[0.03em] py-[17px] hover:-translate-y-0.5 hover:shadow-[0_14px_24px_-10px_oklch(24%_0.02_50_/_0.4)]"
              >
                Temaları Keşfet
              </ButtonLink>
              <ButtonLink
                href="/fiyatlar"
                variant="secondary"
                size="lg"
                shape="sharp"
                className="tracking-[0.03em] py-[17px]"
              >
                Paketleri Gör
              </ButtonLink>
            </div>

            <div
              className="flex border-t border-line pt-7"
              style={{ animation: "fadeUp 0.8s ease 0.32s both" }}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={
                    i === 0
                      ? "flex-1 border-r border-line pr-6"
                      : i === 1
                        ? "flex-1 border-r border-line px-6"
                        : "flex-1 pl-6"
                  }
                >
                  <div className="font-display text-[30px] font-semibold">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative h-[600px] overflow-hidden"
            style={{ animation: "fadeUp 0.9s ease 0.2s both" }}
          >
            <div className="absolute top-6 left-[70px] w-[280px] h-[280px] rounded-full bg-[oklch(93%_0.03_78)] opacity-50" />
            <div
              className="absolute top-5 left-[60px] w-[240px] h-[500px] border-[9px] border-ink rounded-3xl overflow-hidden shadow-[0_40px_70px_-24px_oklch(24%_0.02_50_/_0.3)] rotate-[-6deg]"
              style={{
                background:
                  "repeating-linear-gradient(135deg, oklch(94% 0.02 78) 0 14px, oklch(97% 0.015 78) 14px 28px)",
              }}
            />
            <div
              className="absolute bottom-5 right-10 w-[230px] h-[480px] border-[9px] border-ink rounded-3xl overflow-hidden shadow-[0_40px_70px_-24px_oklch(24%_0.02_50_/_0.35)] rotate-[5deg] flex items-center justify-center text-faint-dim text-[10px] uppercase text-center p-5"
              style={{
                background:
                  "repeating-linear-gradient(45deg, oklch(24% 0.02 50) 0 14px, oklch(30% 0.02 50) 14px 28px)",
              }}
            >
              davetiye önizleme
            </div>
            <div className="absolute top-[60%] left-0 w-[170px] px-[18px] py-4 bg-paper border border-line rounded-[4px] shadow-[0_20px_34px_-10px_oklch(24%_0.02_50_/_0.2)]">
              <div className="text-[11px] text-muted mb-1">RSVP</div>
              <div className="font-display text-[22px] font-semibold">
                86 katılıyor
              </div>
            </div>
          </div>
        </section>

        {/* ÖNE ÇIKAN TEMALAR */}
        <section className="pt-5 px-14 pb-[110px] max-w-[1440px] mx-auto">
          <div className="flex items-baseline justify-between mb-9">
            <h2 className="font-display font-medium text-4xl m-0">
              Öne Çıkan Temalar
            </h2>
            <Link
              href="/tasarimlar"
              className="text-sm text-gold border-b border-gold"
            >
              Tümünü Gör →
            </Link>
          </div>

          <div className="grid grid-cols-[1.4fr_1fr_1fr] grid-rows-[260px_260px] gap-5">
            {FEATURED.map((card) => {
              const theme = getTheme(card.slug)!;
              return (
                <Link
                  key={card.slug}
                  href={`/tasarimlar/${card.slug}`}
                  className={`${card.span} relative rounded-md overflow-hidden text-inherit transition-[transform,box-shadow] duration-300 shadow-[0_20px_30px_-18px_oklch(24%_0.02_50_/_0.18)] hover:-translate-y-1.5 hover:shadow-[0_30px_44px_-20px_oklch(24%_0.02_50_/_0.26)]`}
                  style={{ background: theme.stripe }}
                >
                  {card.badge && (
                    <div
                      className={
                        card.badgeTone === "gold"
                          ? "absolute top-[18px] left-[18px] bg-gold-light text-[oklch(20%_0.02_50)] text-[10.5px] tracking-[0.05em] uppercase px-3 py-[5px] rounded-xl"
                          : card.pad === "p-[22px]"
                            ? "absolute top-[18px] left-[18px] bg-cream/92 text-[10.5px] tracking-[0.05em] uppercase px-3 py-[5px] rounded-xl"
                            : "absolute top-4 left-4 bg-cream/92 text-[10px] tracking-[0.05em] uppercase px-2.5 py-1 rounded-[10px]"
                      }
                    >
                      {card.badge}
                    </div>
                  )}
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${card.pad} ${
                      card.dark
                        ? card.slug === "mermer-yaldiz"
                          ? "bg-linear-to-t from-[oklch(15%_0.01_50_/_0.9)] to-transparent"
                          : "bg-linear-to-t from-[oklch(20%_0.02_30_/_0.85)] to-transparent"
                        : "bg-linear-to-t from-cream/95 to-transparent"
                    }`}
                  >
                    <div
                      className={`${card.labelSize} tracking-[0.05em] uppercase mb-1.5 ${
                        card.slug === "kirmizi-kina"
                          ? "text-[oklch(80%_0.06_40)]"
                          : card.dark
                            ? "text-gold-light"
                            : "text-gold"
                      }`}
                    >
                      {theme.categoryLabel}
                    </div>
                    <div
                      className={`font-display ${card.titleSize} font-semibold ${
                        card.dark ? "text-[oklch(97%_0.006_75)]" : ""
                      }`}
                    >
                      {theme.name}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* NASIL ÇALIŞIR */}
        <section className="py-[90px] px-14 bg-ink text-snow">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="font-display font-medium text-4xl m-0 mb-14 text-center">
              Nasıl Çalışır
            </h2>
            <div className="grid grid-cols-3 relative">
              <div className="absolute top-[22px] left-[8%] right-[8%] h-px bg-[oklch(40%_0.01_60)]" />
              {HOW_IT_WORKS.map((step) => (
                <div key={step.num} className="text-center px-6">
                  <div className="w-11 h-11 rounded-full bg-ink border border-gold-light text-gold-light flex items-center justify-center font-display text-lg mx-auto mb-6 relative z-[1]">
                    {step.num}
                  </div>
                  <div className="text-lg font-medium mb-2.5">{step.title}</div>
                  <div className="text-sm leading-[1.7] text-mist">
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TestimonialSlider />

        {/* CTA */}
        <section className="relative py-[110px] px-14 text-center bg-ink text-snow overflow-hidden">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "repeating-linear-gradient(45deg, oklch(28% 0.02 50) 0 40px, oklch(24% 0.02 50) 40px 80px)",
            }}
          />
          <div className="relative max-w-[640px] mx-auto">
            <h2 className="font-display italic font-medium text-[42px] m-0 mb-[22px]">
              Hikayenizi anlatmaya hazır mısınız?
            </h2>
            <p className="text-base text-mist m-0 mb-[34px]">
              Paketleri karşılaştırın, temanızı seçin, davetinizi 20 dakikada
              yayına alın.
            </p>
            <ButtonLink
              href="/fiyatlar"
              size="lg"
              shape="sharp"
              className="border border-gold-light bg-transparent text-gold-light tracking-[0.03em] px-[34px] hover:bg-gold-light hover:border-gold-light hover:text-[oklch(20%_0.02_50)]"
            >
              Paketleri Gör
            </ButtonLink>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
