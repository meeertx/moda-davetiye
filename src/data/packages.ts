/** Paket kataloğu — /fiyatlar ve /satin-al sayfalarının ortak kaynağı. */

export type PackageKey = "baslangic" | "standart" | "premium";

export interface Package {
  key: PackageKey;
  name: string;
  price: string;
  /** Fiyatlar sayfasında "EN POPÜLER" rozetiyle öne çıkan paket */
  highlight: boolean;
  features: string[];
}

export const PACKAGES: Package[] = [
  {
    key: "baslangic",
    name: "Başlangıç",
    price: "₺990",
    highlight: false,
    features: ["3 tema seçeneği", "RSVP formu", "30 gün yayında"],
  },
  {
    key: "standart",
    name: "Standart",
    price: "₺1.790",
    highlight: true,
    features: [
      "7 tema seçeneği",
      "Müzik + galeri",
      "RSVP + istatistik",
      "1 yıl yayında",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    price: "₺2.990",
    highlight: false,
    features: [
      "Tüm temalar",
      "Özel domain",
      "Hediye/IBAN modülü",
      "Süresiz yayında",
    ],
  },
];

export function getPackage(key: string): Package | undefined {
  return PACKAGES.find((p) => p.key === key);
}
