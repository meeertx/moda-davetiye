import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import ContactForm from "@/components/marketing/ContactForm";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "İletişim",
  description: `${BRAND.name} ekibine ulaşın — e-posta, telefon ve ofis bilgileri.`,
};

const DETAILS = [
  { label: "E-posta", value: BRAND.email },
  { label: "Telefon", value: BRAND.phone },
  { label: "Ofis", value: BRAND.office },
];

export default function IletisimPage() {
  return (
    <SiteShell footer={40}>
      <main className="flex-1 max-w-[1100px] mx-auto pt-[90px] px-6 pb-[110px] grid grid-cols-2 gap-16">
        <div>
          <div className="text-[13px] tracking-[0.12em] uppercase text-gold mb-[18px]">
            İletişim
          </div>
          <h1 className="font-display font-medium text-[38px] m-0 mb-6">
            Size nasıl yardımcı olabiliriz?
          </h1>
          <div className="flex flex-col gap-5 text-[15px] text-muted">
            {DETAILS.map((d) => (
              <div key={d.label}>
                <div className="text-ink font-medium mb-1">{d.label}</div>
                {d.value}
              </div>
            ))}
          </div>
        </div>

        <ContactForm />
      </main>
    </SiteShell>
  );
}
