import type { Metadata } from "next";
import { Cormorant_Garamond, Work_Sans, Great_Vibes } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-work-sans",
  display: "swap",
});

/**
 * Davetiyelerde çift isimleri için kaligrafi.
 *
 * Yalnızca isim/imza gibi büyük puntolarda kullanılır — küçük boyutta
 * okunmuyor. `latin-ext` alt kümesi Türkçe'nin ş/ğ/ı/İ/ç/ö/ü harflerini
 * kapsıyor.
 */
const greatVibes = Great_Vibes({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

const description =
  "Çiftler için dijital davetiye ve RSVP platformu. Temanızı seçin, bilgilerinizi paylaşın, paylaşılabilir davetiyenize kavuşun.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${BRAND.name} | Dijital Davetiye Oluşturma Platformu`,
    template: `%s · ${BRAND.name}`,
  },
  description,
  applicationName: BRAND.name,
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: BRAND.name,
    title: `${BRAND.name} | Dijital Davetiye Oluşturma Platformu`,
    description,
    // Görsel app/opengraph-image.tsx tarafından otomatik eklenir
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} | Dijital Davetiye Oluşturma Platformu`,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${workSans.variable} ${greatVibes.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
