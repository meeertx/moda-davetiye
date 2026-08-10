import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: `${BRAND.name}, kağıt davetiyenin zarafetini dijitalin pratikliğiyle buluşturur.`,
};

const STATS = [
  { value: "2023", label: "kuruluş" },
  { value: "12.400+", label: "davetiye" },
  { value: "9", label: "ekip üyesi" },
];

export default function HakkimizdaPage() {
  return (
    <SiteShell footer={40}>
      <main className="flex-1 max-w-[800px] mx-auto pt-[90px] px-6 pb-[110px]">
        <div className="text-[13px] tracking-[0.12em] uppercase text-gold mb-[18px] text-center">
          Hakkımızda
        </div>
        <h1 className="font-display font-medium text-[42px] m-0 mb-8 text-center [text-wrap:pretty]">
          Her hikaye, kendi zarafetiyle anlatılmayı hak eder.
        </h1>
        <p className="text-base leading-[1.8] text-muted m-0 mb-6">
          {BRAND.name}, 2023&apos;te üç arkadaşın kendi düğün davetiyelerini
          dijitalde bulamamasıyla başladı. Kağıt davetiyenin zarafetini korurken,
          dijitalin hızını ve RSVP takibinin pratikliğini bir araya getirmeyi
          hedefledik.
        </p>
        <p className="text-base leading-[1.8] text-muted m-0 mb-6">
          Bugün binlerce çiftin özel gününü duyurmasına eşlik ediyoruz — her
          biri özenle tasarlanmış yedi temayla.
        </p>

        <div className="grid grid-cols-3 gap-6 mt-14">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-[34px] font-semibold text-gold">
                {s.value}
              </div>
              <div className="text-[13px] text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
