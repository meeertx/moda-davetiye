import Link from "next/link";
import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import { PACKAGES } from "@/data/packages";

export const metadata: Metadata = {
  title: "Fiyatlar",
  description:
    "Başlangıç, Standart ve Premium dijital davetiye paketleri — tek seferlik ödeme.",
};

export default function FiyatlarPage() {
  return (
    <SiteShell categories>
      <main className="pt-16 px-14 pb-[110px] max-w-[1200px] mx-auto w-full box-border text-center">
        <div className="text-[13px] uppercase text-gold mb-4">Paketler</div>
        <h1 className="font-display font-medium text-[44px] m-0 mb-12">
          İhtiyacınıza uygun paketi seçin
        </h1>

        <div className="grid grid-cols-3 gap-7 text-left">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.key}
              className={`px-8 py-10 border rounded-[4px] relative transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_42px_-20px_oklch(24%_0.02_50_/_0.22)] ${
                pkg.highlight
                  ? "border-ink bg-ink text-snow"
                  : "border-line bg-paper text-ink"
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-3 right-6 bg-gold text-cream text-[11px] tracking-[0.04em] px-3 py-[5px] rounded-xl">
                  EN POPÜLER
                </div>
              )}
              <div className="text-[13px] uppercase text-gold mb-2">
                {pkg.name}
              </div>
              <div className="font-display text-[40px] font-semibold mb-1.5">
                {pkg.price}
              </div>
              <div
                className={`text-[13px] mb-6 ${
                  pkg.highlight ? "text-[oklch(82%_0.006_75)]" : "text-slate"
                }`}
              >
                tek seferlik ödeme
              </div>

              <div className="flex flex-col gap-3 mb-8">
                {pkg.features.map((f) => (
                  <div
                    key={f}
                    className={`text-[13.5px] flex gap-2 ${
                      pkg.highlight ? "text-[oklch(82%_0.006_75)]" : "text-slate"
                    }`}
                  >
                    <span className="text-gold">—</span>
                    {f}
                  </div>
                ))}
              </div>

              <Link
                href="/tasarimlar"
                className={`block text-center border text-[13px] py-[13px] rounded-[2px] text-ink hover:text-ink ${
                  pkg.highlight
                    ? "border-cream bg-cream"
                    : "border-ink bg-transparent"
                }`}
              >
                Bu Paketle Başla
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[13px] text-muted">
          Tüm paketler KDV dahildir. Yayın süresi dolduğunda opsiyonel yıllık
          yenileme ile davetiyeniz canlı tutulabilir.
        </p>
      </main>
    </SiteShell>
  );
}
