import { Suspense } from "react";
import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import Breadcrumb from "@/components/marketing/Breadcrumb";
import ThemeGallery from "@/components/marketing/ThemeGallery";

export const metadata: Metadata = {
  title: "Tema Galerisi",
  description:
    "Düğün, nişan, kına ve save-the-date için yedi özel dijital davetiye teması.",
};

export default function TasarimlarPage() {
  return (
    <SiteShell categories>
      <main className="pt-14 px-14 pb-[110px] max-w-[1400px] mx-auto w-full box-border">
        <Breadcrumb
          items={[{ label: "Ana Sayfa", href: "/" }, { label: "Tasarımlar" }]}
        />
        <h1 className="font-display font-medium text-[44px] mt-2 mb-8">
          Tema Galerisi
        </h1>
        <Suspense fallback={null}>
          <ThemeGallery />
        </Suspense>
      </main>
    </SiteShell>
  );
}
