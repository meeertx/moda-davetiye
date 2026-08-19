"use client";

import { useState } from "react";
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
    pad: "p-6",
    dark: true,
  },
  {
    slug: "altin-bahce-kapisi",
    span: "",
    badge: "VIP KOLEKSİYON",
    badgeTone: "gold" as const,
    titleSize: "text-xl",
    labelSize: "text-[10.5px]",
    pad: "p-5",
    dark: true,
  },
  {
    slug: "atelier-indigo",
    span: "",
    badge: "ARTISAN",
    badgeTone: "light" as const,
    titleSize: "text-xl",
    labelSize: "text-[10.5px]",
    pad: "p-5",
    dark: true,
  },
  {
    slug: "nar-oryantal-kina",
    span: "col-span-2",
    badge: "KINA ÖZEL",
    badgeTone: "gold" as const,
    titleSize: "text-2xl",
    labelSize: "text-[11px]",
    pad: "p-6",
    dark: true,
  },
];

const STATS = [
  { value: "12.400+", label: "yayınlanan özel davetiye" },
  { value: "4.9 / 5", label: "müşteri memnuniyeti" },
  { value: "7 Özenli", label: "tasarım koleksiyonu" },
];

const HERO_PREVIEWS = [
  {
    key: "dugun",
    label: "Düğün & Nişan",
    names: "Selin & Kaan",
    date: "24 EYLÜL 2026",
    location: "Sait Halim Paşa Yalısı • Yeniköy",
    themeBg: "linear-gradient(135deg, #181512 0%, #2e261f 50%, #15120e 100%)",
    accent: "#d4af37",
  },
  {
    key: "kina",
    label: "Kına Gecesi",
    names: "Ceren'in Kınası",
    date: "18 KASIM 2026",
    location: "Çırağan Palace Kempinski",
    themeBg: "linear-gradient(135deg, #2b0b14 0%, #4a1222 50%, #1c060d 100%)",
    accent: "#f3a5b9",
  },
  {
    key: "std",
    label: "Save the Date",
    names: "Leyla & Emir",
    date: "12 AĞUSTOS 2026",
    location: "Bodrum Villa Royal",
    themeBg: "linear-gradient(135deg, #0e1e2b 0%, #183348 50%, #08121b 100%)",
    accent: "#9bd5e8",
  },
];

export default function HomePage() {
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const currentPreview = HERO_PREVIEWS[activePreviewIndex];

  return (
    <SiteShell announcement categories footer="full">
      <main className="overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative pt-16 lg:pt-24 pb-24 px-6 sm:px-14 max-w-[1500px] mx-auto">
          {/* Ambient Lighting Backdrops */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-200/20 via-amber-400/15 to-transparent blur-[140px] pointer-events-none rounded-full" />
          <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center relative z-10">
            {/* Left Content */}
            <div>
              <div
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-[12px] font-medium tracking-[0.14em] uppercase mb-8 shadow-sm backdrop-blur-2xl saturate-180"
                style={{ animation: "fadeUp 0.7s ease both" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                DİJİTAL DAVETİYE ATÖLYESİ
              </div>

              <h1
                className="font-display font-normal text-5xl sm:text-6xl lg:text-[72px] leading-[1.03] tracking-[-0.025em] m-0 mb-7 text-ink"
                style={{ animation: "fadeUp 0.8s ease 0.08s both" }}
              >
                Davetinizin ilk izlenimi,{" "}
                <span className="italic font-serif font-medium gold-shimmer-text block sm:inline">
                  kağıttan güzel
                </span>{" "}
                olsun.
              </h1>

              <p
                className="text-lg leading-[1.75] text-muted max-w-[500px] m-0 mb-9 font-light tracking-tight"
                style={{ animation: "fadeUp 0.8s ease 0.16s both" }}
              >
                Yedi özenle işlenmiş lüks temadan seçin, detaylarınızı ekleyin.
                Dakikalar içinde canlı, müzikli ve LCV takipli prestijli davetiyenizi paylaşın.
              </p>

              <div
                className="flex flex-wrap gap-4 mb-14"
                style={{ animation: "fadeUp 0.8s ease 0.24s both" }}
              >
                <ButtonLink
                  href="/tasarimlar"
                  variant="gold"
                  size="lg"
                  shape="sharp"
                  className="py-[18px] px-9 tracking-wider font-semibold text-[14px] apple-press"
                >
                  Temaları Keşfet →
                </ButtonLink>
                <ButtonLink
                  href="/fiyatlar"
                  variant="secondary"
                  size="lg"
                  shape="sharp"
                  className="py-[18px] px-8 tracking-wider text-[14px] apple-press"
                >
                  Paketleri Gör
                </ButtonLink>
              </div>

              {/* Stats Ribbon */}
              <div
                className="grid grid-cols-3 gap-4 pt-8 border-t border-gold/20"
                style={{ animation: "fadeUp 0.8s ease 0.32s both" }}
              >
                {STATS.map((s, i) => (
                  <div
                    key={s.label}
                    className={
                      i !== 2 ? "border-r border-gold/20 pr-4" : ""
                    }
                  >
                    <div className="font-display text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
                      {s.value}
                    </div>
                    <div className="text-xs text-muted font-light mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Steady Luxury Digital Phone Showcase */}
            <div
              className="relative flex flex-col items-center justify-center pt-4"
              style={{ animation: "fadeUp 0.9s ease 0.2s both" }}
            >
              {/* Category Selector Tabs */}
              <div className="flex gap-2 p-1.5 rounded-full bg-paper/80 backdrop-blur-2xl saturate-180 border border-gold/25 shadow-md mb-6 relative z-20">
                {HERO_PREVIEWS.map((prev, idx) => (
                  <button
                    key={prev.key}
                    onClick={() => setActivePreviewIndex(idx)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase apple-press cursor-pointer transition-all duration-200 ${
                      activePreviewIndex === idx
                        ? "bg-ink text-gold-light shadow-md"
                        : "text-slate hover:text-ink"
                    }`}
                  >
                    {prev.label}
                  </button>
                ))}
              </div>

              {/* Steady Apple Phone Mockup Frame */}
              <div className="relative w-[300px] sm:w-[325px] h-[590px] rounded-[46px] p-3.5 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] border border-amber-500/25 transition-transform duration-300 hover:scale-[1.01]">
                {/* Dynamic Island / Speaker Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                  <div className="w-10 h-1 bg-zinc-800 rounded-full" />
                </div>

                {/* Inner Screen */}
                <div
                  className="w-full h-full rounded-[36px] overflow-hidden relative flex flex-col justify-between p-6 text-white text-center transition-all duration-700 select-none"
                  style={{ background: currentPreview.themeBg }}
                >
                  {/* Gold Foil Crest / Wax Seal */}
                  <div className="mt-8 mx-auto w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center bg-gold/10 backdrop-blur-md shadow-inner apple-press">
                    <span className="font-display italic text-gold text-lg">S&amp;K</span>
                  </div>

                  {/* Main Preview Content */}
                  <div className="my-auto py-4">
                    <div className="text-[10px] tracking-[0.25em] uppercase text-gold/80 mb-2 font-medium">
                      DÜĞÜN DAVETİYESİ
                    </div>
                    <div className="font-display italic text-3xl sm:text-4xl text-amber-100 font-medium mb-3 leading-tight tracking-tight">
                      {currentPreview.names}
                    </div>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
                    <div className="text-[11px] tracking-widest text-amber-200/90 font-light mb-1">
                      {currentPreview.date}
                    </div>
                    <div className="text-[10px] text-white/65 font-light max-w-[200px] mx-auto">
                      {currentPreview.location}
                    </div>
                  </div>

                  {/* Envelope Wax Seal Interactive Button */}
                  <div className="mb-2">
                    <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-white/15 backdrop-blur-2xl border border-white/30 text-[11px] text-white tracking-wider uppercase font-medium shadow-lg apple-press">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Davetiyeyi Aç
                    </div>
                  </div>
                </div>

                {/* Steady Floating RSVP Badge */}
                <div className="absolute top-28 -left-8 sm:-left-12 glass-luxury px-4 py-3 rounded-xl border border-gold/30 shadow-xl hidden sm:block pointer-events-none">
                  <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                    <span>86 Konuk Katılıyor</span>
                  </div>
                  <div className="text-[10px] text-muted mt-0.5 font-light">Anlık LCV Takibi</div>
                </div>

                {/* Steady Floating Music Pill */}
                <div className="absolute bottom-20 -right-8 sm:-right-10 glass-dark px-4 py-2.5 rounded-full border border-gold/30 shadow-xl hidden sm:block pointer-events-none">
                  <div className="flex items-center gap-2 text-[11px] text-amber-200 font-medium">
                    <span className="text-gold">🎵</span>
                    <span>Arka Plan Müziği</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ÖNE ÇIKAN TEMALAR */}
        <section className="py-20 px-6 sm:px-14 max-w-[1500px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-2">
                EXCLUSİVE SELECTION
              </div>
              <h2 className="font-display font-medium text-4xl sm:text-5xl text-ink m-0 tracking-tight">
                Öne Çıkan Temalar
              </h2>
            </div>
            <Link
              href="/tasarimlar"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light font-medium tracking-wide group transition-colors apple-press"
            >
              Tüm Koleksiyonu Keşfet
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] grid-rows-none lg:grid-rows-[280px_280px] gap-6">
            {FEATURED.map((card) => {
              const theme = getTheme(card.slug)!;
              return (
                <Link
                  key={card.slug}
                  href={`/tasarimlar/${card.slug}`}
                  className={`${card.span} relative rounded-2xl overflow-hidden group text-inherit apple-card-hover apple-press border border-gold/20 shadow-md hover:shadow-xl`}
                  style={{ background: theme.stripe }}
                >
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Badge */}
                  {card.badge && (
                    <div className="absolute top-5 left-5 z-20">
                      <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-2xl text-amber-200 border border-gold/40 text-[10.5px] font-medium tracking-widest uppercase shadow-md">
                        {card.badge}
                      </span>
                    </div>
                  )}

                  {/* Content Container */}
                  <div className={`absolute bottom-0 left-0 right-0 ${card.pad} z-20 text-white`}>
                    <div className="text-[11px] tracking-[0.15em] uppercase mb-1.5 text-gold-light font-medium">
                      {theme.categoryLabel}
                    </div>
                    <div className={`font-display ${card.titleSize} font-medium mb-1 group-hover:text-amber-200 transition-colors tracking-tight`}>
                      {theme.name}
                    </div>
                    <div className="text-xs text-white/70 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-1">
                      İncele ve Kişiselleştir →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* NASIL ÇALIŞIR */}
        <section className="py-28 px-6 sm:px-14 bg-[oklch(15%_0.02_50)] text-snow relative overflow-hidden">
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="max-w-[1300px] mx-auto relative z-10">
            <div className="text-center max-w-[600px] mx-auto mb-20">
              <div className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-light mb-3">
                KOLAY &amp; HIZLI ADIMLAR
              </div>
              <h2 className="font-display font-medium text-4xl sm:text-5xl text-snow m-0 tracking-tight">
                Nasıl Çalışır?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting Gold Glow Line */}
              <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-gold-light to-transparent opacity-40 z-0" />

              {HOW_IT_WORKS.map((step) => (
                <div
                  key={step.num}
                  className="glass-dark p-8 sm:p-10 rounded-2xl border border-gold/20 text-center relative z-10 apple-card-hover"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gold to-gold-light text-ink-deep font-display font-bold text-xl flex items-center justify-center mx-auto mb-7 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    {step.num}
                  </div>
                  <h3 className="font-display text-2xl font-medium mb-3 text-amber-100 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-mist font-light m-0">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <TestimonialSlider />

        {/* LUXURY CTA */}
        <section className="relative py-28 px-6 sm:px-14 text-center bg-gradient-to-b from-[oklch(16%_0.02_50)] to-[oklch(12%_0.02_40)] text-snow overflow-hidden border-t border-gold/20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/10 blur-[130px] pointer-events-none rounded-full" />
          
          <div className="relative z-10 max-w-[700px] mx-auto">
            <h2 className="font-display italic font-medium text-4xl sm:text-5xl lg:text-6xl m-0 mb-6 leading-tight text-amber-100 tracking-tight">
              Hikayenizi anlatmaya hazır mısınız?
            </h2>
            <p className="text-base sm:text-lg text-mist font-light m-0 mb-10 leading-relaxed">
              Koleksiyonlarımızı inceleyin, temanızı seçin ve prestijli dijital davetiyenizi dakikalar içinde yayına alın.
            </p>
            <ButtonLink
              href="/fiyatlar"
              variant="gold"
              size="lg"
              shape="pill"
              className="px-10 py-4 font-semibold tracking-wider text-base apple-press"
            >
              Paketleri Gör ve Başla →
            </ButtonLink>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
