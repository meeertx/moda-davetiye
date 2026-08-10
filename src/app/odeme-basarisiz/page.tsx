import type { Metadata } from "next";
import ResultScreen from "@/components/site/ResultScreen";

export const metadata: Metadata = {
  title: "Ödeme Gerçekleştirilemedi",
};

export default function OdemeBasarisizPage() {
  return (
    <ResultScreen
      icon="✕"
      iconClass="bg-[oklch(90%_0.01_30)] text-[oklch(45%_0.14_25)]"
      title="Ödeme Gerçekleştirilemedi"
      body="Kartınızdan çekim yapılamadı. Bilgilerinizi kontrol edip tekrar deneyebilir veya farklı bir kart kullanabilirsiniz."
      ctaLabel="Tekrar Dene"
      ctaHref="/satin-al"
    />
  );
}
