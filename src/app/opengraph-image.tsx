import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { BRAND, BRAND_HEX as C } from "@/lib/brand";

/**
 * WhatsApp/sosyal medya paylaşım görseli.
 * Davetiye linkleri ağırlıklı WhatsApp'tan paylaşıldığı için önizleme
 * kartının markalı görünmesi önemli.
 */
export const alt = `${BRAND.name} — Dijital Davetiye Platformu`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontPath = (file: string) =>
  path.join(process.cwd(), "src/assets/fonts", file);

export default async function OpengraphImage() {
  // Satori değişken font desteklemiyor — statik ağırlıklar kullanılır.
  const [regular, semibold] = await Promise.all([
    readFile(fontPath("cormorant-garamond-400-italic.woff")),
    readFile(fontPath("cormorant-garamond-600-italic.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: C.cream,
          fontFamily: "Cormorant",
        }}
      >
        <svg
          width="132"
          height="99"
          viewBox="0 0 24 18"
          fill="none"
          stroke={C.gold}
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="0.65" y="0.65" width="22.7" height="16.7" rx="1.6" />
          <path d="M0.9 1.9 L12 9.6 L23.1 1.9" />
        </svg>

        <div style={{ display: "flex", fontSize: 92, marginTop: 44 }}>
          <span style={{ color: C.ink, fontWeight: 400 }}>
            {BRAND.wordmark.light}
          </span>
          <span style={{ color: C.gold, fontWeight: 600, marginLeft: 24 }}>
            {BRAND.wordmark.bold}
          </span>
        </div>

        <div style={{ width: 88, height: 1, background: C.gold, margin: "36px 0" }} />

        <div style={{ fontSize: 34, color: C.muted }}>
          Dijital davetiye ve RSVP platformu
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: regular, style: "italic", weight: 400 },
        { name: "Cormorant", data: semibold, style: "italic", weight: 600 },
      ],
    },
  );
}
