import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/marketing/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/field";
import { getTheme, THEMES } from "@/data/themes";
import { getPackage, PACKAGES } from "@/data/packages";

export const metadata: Metadata = {
  title: "Satın Al",
  description: "Seçtiğiniz tema ve paket için güvenli ödeme adımı.",
};

const field = inputClass("marketing");

export default async function SatinAlPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; paket?: string }>;
}) {
  const { slug, paket } = await searchParams;
  // Geçersiz parametrelerde prototipteki gibi varsayılana düşülür
  const theme = getTheme(slug ?? "") ?? THEMES[0];
  const pkg = getPackage(paket ?? "") ?? PACKAGES[1];

  return (
    <div className="min-h-screen flex flex-col font-body text-ink bg-cream">
      <header className="flex items-center justify-between px-14 py-[22px] border-b border-line">
        <Link href="/" className="text-ink">
          <Logo size={22} />
        </Link>
        <div className="text-[13px] text-muted">Güvenli Ödeme 🔒</div>
      </header>

      <main className="flex-1 pt-14 px-14 pb-25 max-w-[1100px] mx-auto w-full box-border grid grid-cols-[1fr_380px] gap-14">
        <div>
          <h1 className="font-display font-medium text-[32px] m-0 mb-8">
            Sipariş Özeti
          </h1>

          <div className="flex gap-4 p-5 bg-paper border border-line rounded-[4px] mb-8">
            <div
              className="w-[70px] h-[88px] shrink-0 rounded-[2px]"
              style={{ background: theme.stripe }}
            />
            <div>
              <div className="text-[11px] uppercase text-gold mb-1">
                {theme.categoryLabel}
              </div>
              <div className="font-display text-xl font-semibold">
                {theme.name}
              </div>
              <div className="text-[13px] text-muted">{pkg.name} paket</div>
            </div>
          </div>

          <div className="text-[13px] tracking-[0.03em] uppercase mb-4">
            Hesap Bilgileri
          </div>
          <div className="flex flex-col gap-3.5 mb-8">
            <input placeholder="Ad Soyad" className={field} />
            <input type="email" placeholder="E-posta" className={field} />
          </div>

          <div className="text-[13px] tracking-[0.03em] uppercase mb-4">
            Kart Bilgileri
          </div>
          <div className="flex flex-col gap-3.5">
            <input placeholder="Kart Numarası" className={field} />
            <div className="grid grid-cols-2 gap-3.5">
              <input placeholder="AA/YY" className={field} />
              <input placeholder="CVC" className={field} />
            </div>
            {/* Kupon alanı ödeme entegrasyonuyla birlikte gelecek —
                çalışmayan bir buton koymak yerine şimdilik çıkarıldı. */}
          </div>
        </div>

        <div>
          <div className="bg-ink text-snow p-7 rounded-md sticky top-8">
            <div className="text-[13px] tracking-[0.03em] uppercase text-gold-light mb-[18px]">
              Ödeme Özeti
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span>{pkg.name} Paket</span>
              <span>{pkg.price}</span>
            </div>
            <div className="flex justify-between text-sm text-faint mb-5">
              <span>KDV dahil</span>
              <span>—</span>
            </div>
            <div className="border-t border-[oklch(40%_0.01_60)] pt-5 flex justify-between font-display text-2xl font-semibold mb-6">
              <span>Toplam</span>
              <span>{pkg.price}</span>
            </div>
            <ButtonLink
              href={`/odeme-basarili?slug=${theme.slug}`}
              variant="on-dark"
              shape="sharp"
              block
              className="mb-2.5"
            >
              Ödemeyi Tamamla
            </ButtonLink>
            <Link
              href="/odeme-basarisiz"
              className="block text-center text-faint hover:text-mist text-xs"
            >
              (demo: başarısız senaryo)
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
