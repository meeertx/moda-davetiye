import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: `${BRAND.name}, kağıt davetiyenin zarafetini dijitalin pratikliğiyle buluşturur.`,
};

const STATS = [
  { value: "2023", label: "Kuruluş Yılı" },
  { value: "12.400+", label: "Yayınlanan Davetiye" },
  { value: "9 Özenli", label: "Tasarım Ekibi Üyesi" },
];

export default function HakkimizdaPage() {
  return (
    <SiteShell footer={40}>
      <main className="flex-1 max-w-[950px] mx-auto pt-20 px-6 sm:px-14 pb-28">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11.5px] font-semibold tracking-[0.15em] uppercase mb-4 shadow-sm">
            HİKAYEMİZ
          </div>
          <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-ink m-0 mb-6 tracking-tight leading-tight">
            Her hikaye, kendi zarafetiyle anlatılmayı hak eder.
          </h1>
        </div>

        {/* Story Card */}
        <div className="glass-luxury rounded-2xl p-8 sm:p-12 border border-gold/30 shadow-xl space-y-6 text-base sm:text-lg leading-relaxed text-slate font-light">
          <p className="m-0">
            <strong className="text-ink font-medium">{BRAND.name}</strong>, 2023&apos;te kendi özel günleri için kağıt davetiyelerin hantallığı ile dijitalin sıradanlığı arasında sıkışıp kalan üç arkadaşın hayaliyle doğdu.
          </p>
          <p className="m-0">
            Amacımız netti: Kağıt davetiyenin o zamansız dokusunu ve yüksek zarafetini korurken; müzik ekleme, LCV (RSVP) katılım takibi yapma ve anında sevdiklerinize ulaştırma pratikliğini sunmak.
          </p>
          <p className="m-0">
            Bugün binlerce mutlu çiftin en unutulmaz ilk izlenimini oluşturmaktan gurur duyuyoruz.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="glass-luxury p-8 rounded-xl border border-gold/20 text-center shadow-md"
            >
              <div className="font-display text-4xl sm:text-5xl font-semibold text-gold mb-2 tracking-tight">
                {s.value}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
