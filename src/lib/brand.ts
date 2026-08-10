/**
 * Marka bilgilerinin tek kaynağı. İsim, domain veya iletişim bilgisi
 * değiştiğinde yalnızca bu dosya güncellenir.
 */
export const BRAND = {
  /** Tam ad — başlık, footer, yasal metinler */
  name: "Moda Davetiye",
  /** Kısa/tek kelime kullanım — manifest short_name, dar alanlar */
  shortName: "Modavetiye",
  /** Logotype'ın iki parçası: ince + vurgulu */
  wordmark: { light: "Moda", bold: "Davetiye" },
  domain: "modavetiye.com",
  email: "merhaba@modavetiye.com",
  phone: "0850 123 45 67",
  office: "Nişantaşı, İstanbul",
  copyrightYear: 2026,
} as const;

/** Davetiye linklerinde gösterilen kısa adres */
export const invitationUrl = (slug: string) =>
  `${BRAND.domain}/davetiye/${slug}`;

/** Marka renkleri (hex) — SVG/e-posta gibi oklch desteklemeyen yerler için. */
export const BRAND_HEX = {
  ink: "#271d17",
  inkDeep: "#1c1410",
  gold: "#8a5f18",
  goldLight: "#b68947",
  cream: "#fbf8f4",
  snow: "#f4f1ed",
  paper: "#fdfbf9",
  muted: "#655b56",
  line: "#e0d9d4",
} as const;
