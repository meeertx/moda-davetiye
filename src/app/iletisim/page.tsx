import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import ContactForm from "@/components/marketing/ContactForm";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "İletişim",
  description: `${BRAND.name} ekibine ulaşın — e-posta, telefon ve ofis bilgileri.`,
};

const DETAILS = [
  { label: "E-posta", value: BRAND.email, icon: "✉" },
  { label: "Telefon", value: BRAND.phone, icon: "📞" },
  { label: "Ofis", value: BRAND.office, icon: "📍" },
];

export default function IletisimPage() {
  return (
    <SiteShell footer={40}>
      <main className="flex-1 max-w-[1200px] mx-auto pt-20 px-6 sm:px-14 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Info Column */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11.5px] font-semibold tracking-[0.15em] uppercase mb-4 shadow-sm">
              BİZE ULAŞIN
            </div>
            <h1 className="font-display font-medium text-4xl sm:text-5xl text-ink m-0 mb-6 tracking-tight">
              Size nasıl yardımcı olabiliriz?
            </h1>
            <p className="text-base leading-relaxed text-muted font-light mb-10 max-w-[480px]">
              Sorularınız, özel tema istekleriniz veya destek ihtiyaçlarınız için ekibimiz haftanın 7 günü yanınızda.
            </p>

            <div className="flex flex-col gap-6">
              {DETAILS.map((d) => (
                <div
                  key={d.label}
                  className="glass-luxury p-5 rounded-xl border border-gold/20 flex items-start gap-4 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center text-lg shrink-0">
                    {d.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-gold mb-0.5">
                      {d.label}
                    </div>
                    <div className="text-base text-ink font-medium">{d.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Glass Contact Form Container */}
          <div className="glass-luxury p-8 sm:p-10 rounded-2xl border border-gold/30 shadow-xl">
            <h2 className="font-display font-medium text-2xl text-ink mb-2">
              Mesaj Gönderin
            </h2>
            <p className="text-xs text-muted font-light mb-6">
              Formu doldurun, en geç 2 saat içinde size dönüş yapalım.
            </p>
            <ContactForm />
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
