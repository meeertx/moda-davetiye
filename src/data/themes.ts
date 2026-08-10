/**
 * Tema kataloğu — prototipteki üç ayrı sayfada (tasarimlar, tasarim-detay,
 * admin-temalar) tekrar eden tema listelerinin tek kaynağı.
 *
 * `stripe` alanları prototipte gerçek tema görsellerinin yerini tutan
 * yer tutucu desenlerdir; gerçek görseller geldiğinde `image` alanı eklenip
 * bunlar kaldırılacak.
 */

export type ThemeCategory = "dugun" | "nisan" | "kina" | "save_the_date";

export interface Theme {
  slug: string;
  name: string;
  category: ThemeCategory;
  categoryLabel: string;
  tierLabel: string;
  blurb: string;
  longDesc: string;
  features: string[];
  /** Galeri/detay kartlarındaki geniş desen */
  stripe: string;
  /** Admin tablosundaki küçük önizleme deseni (daha sık tekrar) */
  stripeSmall: string;
  /** Admin panelindeki sıra ve yayın durumu */
  order: number;
  active: boolean;
}

export const THEMES: Theme[] = [
  {
    slug: "belle-epoque",
    name: "Belle Époque",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Standart+",
    blurb: "Vintage zarafet, yaldız detaylar.",
    longDesc:
      "Belle Époque, ipek dokulu arka planlar ve ince yaldız çizgilerle klasik bir düğün havası sunar. Serif başlıklar ve yumuşak geçiş animasyonlarıyla davetinizi bir davet kartı zarafetinde dijitale taşır.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(93% 0.02 78) 0 12px, oklch(97% 0.012 78) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(93% 0.02 78) 0 6px, oklch(97% 0.012 78) 6px 12px)",
    order: 1,
    active: true,
  },
  {
    slug: "kalp-cizgisi",
    name: "Kalp Çizgisi",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Başlangıç+",
    blurb: "Modern, sade çizgisel tasarım.",
    longDesc:
      "Tek çizgi illüstrasyon estetiğiyle minimal ve modern bir düğün deneyimi. Bol beyaz alan, ince tipografi ve yumuşak kaydırma efektleriyle sade ama unutulmaz.",
    features: [
      "Geri sayım",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
    ],
    stripe:
      "repeating-linear-gradient(90deg, oklch(95% 0.006 75) 0 16px, oklch(98% 0.004 75) 16px 32px)",
    stripeSmall:
      "repeating-linear-gradient(90deg, oklch(95% 0.006 75) 0 8px, oklch(98% 0.004 75) 8px 16px)",
    order: 2,
    active: true,
  },
  {
    slug: "zeytin-bahcesi",
    name: "Zeytin Bahçesi",
    category: "nisan",
    categoryLabel: "Nişan",
    tierLabel: "Standart+",
    blurb: "Ege esintili, zeytin yeşili doku.",
    longDesc:
      "Zeytin yaprağı motifleri ve toprak tonlarıyla Ege kıyısında bir nişan atmosferi. Doğal dokular ve sıcak aydınlatma hissi veren renk paleti.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(88% 0.05 140) 0 12px, oklch(94% 0.03 140) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(88% 0.05 140) 0 6px, oklch(94% 0.03 140) 6px 12px)",
    order: 3,
    active: true,
  },
  {
    slug: "kirmizi-kina",
    name: "Kırmızı Kına",
    category: "kina",
    categoryLabel: "Kına",
    tierLabel: "Premium",
    blurb: "Geleneksel motifler, canlı kırmızı.",
    longDesc:
      "Geleneksel kına gecesi ruhunu canlı kırmızı ve yaldız işlemeli motiflerle yansıtır. Ritmik animasyonlar ve özel müzik kütüphanesiyle eğlenceli bir davet deneyimi.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
      "Özel davetli notu",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(45% 0.14 25) 0 12px, oklch(50% 0.13 25) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(45% 0.14 25) 0 6px, oklch(50% 0.13 25) 6px 12px)",
    order: 4,
    active: true,
  },
  {
    slug: "soz-vakti",
    name: "Söz Vakti",
    category: "save_the_date",
    categoryLabel: "Save the Date",
    tierLabel: "Başlangıç+",
    blurb: "Lacivert, kısa ve öz duyuru.",
    longDesc:
      "Tarih duyurusu için tasarlanmış, lacivert zemin üzerine krem tipografiyle sakin ve şık bir save-the-date. Tek ekranlık, hızlı yüklenen deneyim.",
    features: ["Geri sayım", "Harita/konum", "Takvime ekle"],
    stripe:
      "repeating-linear-gradient(90deg, oklch(30% 0.04 260) 0 14px, oklch(35% 0.035 260) 14px 28px)",
    stripeSmall:
      "repeating-linear-gradient(90deg, oklch(30% 0.04 260) 0 7px, oklch(35% 0.035 260) 7px 14px)",
    order: 5,
    active: true,
  },
  {
    slug: "mermer-yaldiz",
    name: "Mermer & Yaldız",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Premium",
    blurb: "Siyah mermer dokusu, yaldız çizgiler.",
    longDesc:
      "Koyu mermer dokusu ve ince yaldız çizgileriyle en prestijli temamız. Video arka plan desteği ve özel davetli galerisiyle üst segment düğünler için tasarlandı.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
      "Hediye/IBAN bilgisi",
    ],
    stripe:
      "repeating-linear-gradient(120deg, oklch(20% 0.01 50) 0 10px, oklch(26% 0.015 50) 10px 20px, oklch(20% 0.01 50) 20px 30px)",
    stripeSmall:
      "repeating-linear-gradient(120deg, oklch(20% 0.01 50) 0 5px, oklch(26% 0.015 50) 5px 10px)",
    order: 6,
    active: false,
  },
  {
    slug: "nisan-cemberi",
    name: "Nişan Çemberi",
    category: "nisan",
    categoryLabel: "Nişan",
    tierLabel: "Standart+",
    blurb: "Pudra pembesi, dairesel çerçeveler.",
    longDesc:
      "Pudra pembesi tonlar ve dairesel çerçeve motifleriyle romantik bir nişan davetiyesi. Fotoğraf odaklı galeri düzeni ön plandadır.",
    features: [
      "Geri sayım",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(90% 0.04 20) 0 12px, oklch(95% 0.025 20) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(90% 0.04 20) 0 6px, oklch(95% 0.025 20) 6px 12px)",
    order: 7,
    active: true,
  },
];

export function getTheme(slug: string): Theme | undefined {
  return THEMES.find((t) => t.slug === slug);
}

/** Galeri filtresi — "dugun_nisan" iki kategoriyi birleştirir. */
export const THEME_CATEGORIES = [
  { key: "all", label: "Tümü" },
  { key: "dugun_nisan", label: "Düğün & Nişan" },
  { key: "kina", label: "Kına" },
  { key: "save_the_date", label: "Save the Date" },
] as const;

export type ThemeFilterKey = (typeof THEME_CATEGORIES)[number]["key"];

export function filterThemes(key: string): Theme[] {
  if (key === "all") return THEMES;
  if (key === "dugun_nisan")
    return THEMES.filter((t) => t.category === "dugun" || t.category === "nisan");
  return THEMES.filter((t) => t.category === key);
}
