import type { MetadataRoute } from "next";
import { BRAND, BRAND_HEX } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.shortName,
    description: "Çiftler için dijital davetiye ve RSVP platformu.",
    start_url: "/",
    display: "standalone",
    lang: "tr",
    // Tasarım sistemindeki zemin ve vurgu renkleri
    background_color: BRAND_HEX.cream,
    theme_color: BRAND_HEX.gold,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
