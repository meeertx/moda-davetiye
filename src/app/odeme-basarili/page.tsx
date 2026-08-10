import type { Metadata } from "next";
import ResultScreen from "@/components/site/ResultScreen";

export const metadata: Metadata = {
  title: "Ödemeniz Alındı",
};

export default function OdemeBasariliPage() {
  return (
    <ResultScreen
      icon="✓"
      iconClass="bg-ink text-gold-light"
      title="Ödemeniz Alındı"
      body="Siparişiniz onaylandı. Şimdi davetiyenizi kişiselleştirmeye başlayabilirsiniz — adım adım editör sizi yönlendirecek."
      ctaLabel="Siparişlerime Git"
      ctaHref="/panel"
    />
  );
}
