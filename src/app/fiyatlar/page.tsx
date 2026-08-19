import Link from "next/link";
import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import { PACKAGES } from "@/data/packages";

export const metadata: Metadata = {
  title: "Fiyatlar & Paketler",
  description:
    "Başlangıç, Standart ve Premium dijital davetiye paketleri — tek seferlik ödeme.",
};

export default function FiyatlarPage() {
  return (
    <SiteShell categories>
      <main className="pt-20 px-6 sm:px-14 pb-28 max-w-[1300px] mx-auto w-full box-border text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11.5px] font-semibold tracking-[0.15em] uppercase mb-5 shadow-sm">
          ★ ŞEFFAF FİYATLANDIRMA
        </div>
        <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-ink m-0 mb-6 tracking-tight">
          İhtiyacınıza uygun prestijli paketi seçin
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-[600px] mx-auto mb-16 font-light">
          Gizli ücret yok. Tek seferlik ödemeyle tüm premium özelliklere anında sahip olun.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left items-stretch">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.key}
              className={`p-8 sm:p-10 rounded-2xl relative transition-all duration-300 flex flex-col justify-between apple-press ${
                pkg.highlight
                  ? "glass-dark border-gold/40 shadow-[0_25px_60px_-15px_rgba(212,175,55,0.25)] text-snow"
                  : "glass-luxury border-gold/20 shadow-lg text-ink"
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-gold via-amber-300 to-gold text-ink-deep font-semibold text-[11px] tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md border border-gold-light/40">
                  ★ EN POPÜLER
                </div>
              )}
              <div>
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3">
                  {pkg.name}
                </div>
                <div className="font-display text-4xl sm:text-5xl font-semibold mb-2 tracking-tight">
                  {pkg.price}
                </div>
                <div
                  className={`text-xs uppercase tracking-wider mb-8 font-light ${
                    pkg.highlight ? "text-mist" : "text-muted"
                  }`}
                >
                  tek seferlik ödeme
                </div>

                <div className="w-full h-px bg-gold/15 mb-8" />

                <div className="flex flex-col gap-4 mb-10">
                  {pkg.features.map((f) => (
                    <div
                      key={f}
                      className={`text-sm flex items-start gap-3 ${
                        pkg.highlight ? "text-amber-100/90" : "text-slate"
                      }`}
                    >
                      <span className="text-gold font-bold">✓</span>
                      <span className="leading-snug">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/tasarimlar"
                className={`block text-center text-sm font-semibold tracking-wider uppercase py-4 rounded-xl transition-all duration-200 apple-press ${
                  pkg.highlight
                    ? "bg-gradient-to-r from-gold via-amber-300 to-gold text-ink-deep shadow-md hover:shadow-lg"
                    : "bg-ink text-cream hover:bg-ink-lift shadow-sm"
                }`}
              >
                Bu Paketle Başla →
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-14 text-xs text-muted font-light max-w-[600px] mx-auto">
          Tüm paketlere KDV dahildir. Yayın süresi dolduğunda opsiyonel yıllık
          yenileme ile davetiyeniz yayında kalmaya devam edebilir.
        </p>
      </main>
    </SiteShell>
  );
}
