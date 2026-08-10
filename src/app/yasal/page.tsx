import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooterSlim } from "@/components/site/SiteFooter";
import Logo from "@/components/marketing/Logo";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Yasal",
  description: `${BRAND.name} kullanım şartları, gizlilik politikası ve KVKK aydınlatma metni.`,
};

const SECTIONS = [
  {
    id: "kullanim",
    title: "Kullanım Şartları",
    body: `${BRAND.name} platformunu kullanarak, davetiye içeriklerinin doğruluğundan ve paylaşım linkinin güvenliğinden sorumlu olduğunuzu kabul edersiniz. Paketler tek seferlik satın alınır ve süre sonunda yenileme opsiyoneldir.`,
  },
  {
    id: "gizlilik",
    title: "Gizlilik Politikası",
    body: "Davetiyenize girdiğiniz bilgiler ve RSVP yanıtları yalnızca sizinle ve davet ettiğiniz misafirlerle paylaşılır. Verileriniz üçüncü taraflarla pazarlama amacıyla paylaşılmaz.",
  },
  {
    id: "kvkk",
    title: "KVKK Aydınlatma Metni",
    body: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, kişisel verileriniz davetiye hizmetinin sunulması amacıyla işlenir ve yasal saklama süreleri sonunda silinir.",
  },
];

export default function YasalPage() {
  return (
    <div className="min-h-screen flex flex-col font-body text-ink bg-cream">
      {/* Yasal sayfası pazarlama header'ını değil, kendi sade başlığını kullanır */}
      <header className="px-14 py-[22px] border-b border-line flex justify-between items-center">
        <Link href="/" className="text-ink">
          <Logo size={22} />
        </Link>
        <div className="flex gap-6 text-[13px]">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-ink hover:text-gold">
              {s.id === "kvkk" ? "KVKK" : s.title}
            </a>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-[720px] mx-auto pt-[70px] px-6 pb-[110px] text-[15px] leading-[1.8] text-slate">
        {SECTIONS.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className={i < SECTIONS.length - 1 ? "mb-14" : undefined}
          >
            <h1 className="font-display font-medium text-[30px] text-ink m-0 mb-[18px]">
              {s.title}
            </h1>
            <p>{s.body}</p>
          </section>
        ))}
      </main>

      <SiteFooterSlim pad={40} />
    </div>
  );
}
