"use client";

import { BotanicalSprig } from "./Botanical";

/**
 * Mühürlü zarf açılış sahnesi.
 *
 * Gerçek bir davetiyeyi açma hareketini taklit eder: mühür kırılır,
 * kapak arkaya devrilir, kart zarftan yükselir. Üçü art arda değil,
 * birbirinin içine geçerek akar — hareket böylece tek bir jest gibi
 * okunur.
 *
 * SVG yerine HTML + CSS 3B dönüşümleriyle kuruldu: kapağın gerçekten
 * arkaya devrilmesi (rotateX) ve kartın kapağın arkasından öne geçmesi
 * için katman sırasının animasyon ortasında değişmesi gerekiyor; bu
 * SVG içinde yapılamıyor.
 */
export interface EnvelopePalette {
  /**
   * Zarf kâğıdının rengi.
   *
   * KURAL: kapının zeminiyle BELİRGİN kontrast oluşturmalı. Koyu temaya
   * koyu zarf verildiğinde zarf silik bir dikdörtgene dönüşüyor —
   * koyu zeminler açık kâğıt, açık zeminler bir ton derin kâğıt ister.
   */
  paper: string;
  /** Kapak ve cebin biraz daha koyu tonu — kat izini görünür kılar */
  paperShade: string;
  /** İçeriden çıkan kartın rengi */
  card: string;
  /** Mum mührü */
  seal: string;
  /** Mühür üzerindeki kabartma (baş harfler) */
  sealInk: string;
  /** İnce çizgiler, monogram, yazı */
  accent: string;
  /** Kart üzerindeki metin */
  ink: string;
}

export default function Envelope({
  palette,
  initials,
  opening,
  brideName,
  groomName,
  dateLabel,
  reduced,
}: {
  palette: EnvelopePalette;
  /** Mühürdeki baş harfler — "E & K" */
  initials: string;
  /** Açılış animasyonu başladı mı */
  opening: boolean;
  brideName: string;
  groomName: string;
  dateLabel: string | null;
  reduced: boolean;
}) {
  // Hareket azaltma tercihi varsa sahne animasyonsuz, tek karede biter
  const anim = (value: string) => (reduced ? undefined : value);

  return (
    <div
      className="relative w-[min(88vw,420px)] aspect-[1.42/1]"
      style={{
        perspective: "1400px",
        animation: opening ? anim("envelopeLeave 1.5s ease-in 0.45s both") : undefined,
      }}
      aria-hidden="true"
    >
      {/* ---- ZARFIN ARKA YÜZÜ ----
          Düz renk değil: el yapımı kâğıdın hafif dokusunu veren çok
          düşük kontrastlı bir tarama üstüne biniyor. */}
      <div
        className="absolute inset-0 rounded-[3px]"
        style={{
          background: palette.paper,
          backgroundImage:
            "repeating-linear-gradient(64deg, rgba(0,0,0,0.022) 0 1px, transparent 1px 4px), repeating-linear-gradient(154deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 5px)",
          boxShadow:
            "0 34px 80px -22px rgba(0,0,0,0.72), 0 2px 6px rgba(0,0,0,0.35)",
          zIndex: 0,
        }}
      />

      {/* ---- İÇERİDEKİ KART ----
          Zarfın içinden yükselir. Kapaktan sonra öne geçer. */}
      <div
        className="absolute left-[7%] right-[7%] top-[8%] bottom-[16%] rounded-[2px] flex flex-col items-center justify-center gap-3 px-6 text-center"
        style={{
          background: palette.card,
          color: palette.ink,
          boxShadow: "0 8px 24px -8px rgba(0,0,0,0.4)",
          zIndex: 1,
          animation: opening
            ? anim("cardRise 1.5s cubic-bezier(0.4,0,0.2,1) 0.55s both")
            : undefined,
        }}
      >
        <div
          className="absolute inset-[6px] pointer-events-none"
          style={{ border: `1px solid ${palette.accent}`, opacity: 0.4 }}
        />
        {/* Motif `currentColor` kullanıyor — rengi saran kutudan alır */}
        <span style={{ color: palette.accent }}>
          <BotanicalSprig className="w-16 h-auto" />
        </span>
        <p className="font-script m-0 leading-none text-[clamp(1.4rem,5vw,2rem)]">
          {brideName} &amp; {groomName}
        </p>
        {dateLabel && (
          <p
            className="m-0 text-[9px] tracking-[0.3em] uppercase"
            style={{ color: palette.accent }}
          >
            {dateLabel}
          </p>
        )}
      </div>

      {/* ---- YAN VE ALT KANATLAR ----
          Gerçek bir zarfın arka yüzü dört kanattan oluşur. Üçü sabit,
          dördüncüsü (üst kapak) açılır. Kanatlar dikdörtgeni tamamen
          kaplar — kart hiçbir aralıktan sızmaz. */}
      <div
        className="absolute inset-0 rounded-[3px] overflow-hidden"
        style={{ zIndex: 2 }}
      >
        {/* Sol kanat */}
        <div
          className="absolute inset-0"
          style={{
            background: palette.paperShade,
            clipPath: "polygon(0 0, 52% 50%, 0 100%)",
            filter: "brightness(0.94)",
          }}
        />
        {/* Sağ kanat */}
        <div
          className="absolute inset-0"
          style={{
            background: palette.paperShade,
            clipPath: "polygon(100% 0, 48% 50%, 100% 100%)",
            filter: "brightness(0.94)",
          }}
        />
        {/* Alt cep — üstteki kanatların üzerine biner */}
        <div
          className="absolute inset-0"
          style={{
            background: palette.paperShade,
            clipPath: "polygon(0 100%, 50% 44%, 100% 100%)",
          }}
        />
        {/* Kat çizgileri — kanat kenarlarını görünür kılar */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom right, transparent calc(50% - 0.5px), ${palette.accent}1f 50%, transparent calc(50% + 0.5px)), linear-gradient(to bottom left, transparent calc(50% - 0.5px), ${palette.accent}1f 50%, transparent calc(50% + 0.5px))`,
          }}
        />
      </div>

      {/* ---- ÜST KAPAK ----
          transform-origin üstte: gerçek bir zarf kapağı gibi arkaya devrilir. */}
      <div
        className="absolute left-0 right-0 top-0 h-[62%]"
        style={{
          background: palette.paperShade,
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          // Kapağın ucuna doğru hafif koyulaşan bir gölge — kâğıdın
          // katlandığı yerde ışığın azalması
          boxShadow: "inset 0 -30px 40px -30px rgba(0,0,0,0.55)",
          zIndex: 4,
          animation: opening
            ? anim("flapOpen 1.1s cubic-bezier(0.6,0,0.35,1) 0.35s both")
            : undefined,
        }}
      >
        {/* Kapağın üzerinde ince bir monogram — boş bir üçgen yerine
            gerçek bir davetiye zarfının baskısı */}
        <div
          className="absolute left-1/2 top-[18%] -translate-x-1/2"
          style={{ color: palette.accent, opacity: 0.5 }}
        >
          <BotanicalSprig className="w-[clamp(60px,17vw,86px)] h-auto" />
        </div>
      </div>

      {/* ---- MÜHÜR ----
          Kapağın ucunda durur; kapakla birlikte değil, ondan ÖNCE kırılır.
          İki katman: dışta taşan mum, içte kabartma yüzey. */}
      <div
        className="absolute left-1/2 top-[62%] w-[clamp(56px,15vw,74px)] aspect-square"
        style={{
          transform: "translate(-50%, -50%)",
          zIndex: 5,
          animation: opening
            ? anim("sealBreak 0.5s cubic-bezier(0.4,0,1,1) both")
            : undefined,
        }}
      >
        {/* Dışa taşan mum — kenarı düzensiz, kâğıda yayılmış izlenimi */}
        <div
          className="absolute -inset-[7%]"
          style={{
            background: palette.seal,
            borderRadius: "44% 56% 52% 48% / 53% 45% 55% 47%",
            filter: "brightness(0.86)",
            boxShadow: "0 5px 14px -3px rgba(0,0,0,0.6)",
          }}
        />
        {/* Mührün basıldığı yüzey */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: palette.seal,
            borderRadius: "48% 52% 51% 49% / 50% 48% 52% 50%",
            boxShadow: `inset 0 2px 7px rgba(255,255,255,0.3), inset 0 -4px 9px rgba(0,0,0,0.45)`,
          }}
        >
          <span
            className="font-display italic text-[clamp(14px,3.6vw,18px)] leading-none select-none"
            style={{
              color: palette.sealInk,
              // Kabartma etkisi: üstte gölge, altta ışık
              textShadow:
                "0 1px 1px rgba(0,0,0,0.45), 0 -1px 0 rgba(255,255,255,0.18)",
            }}
          >
            {initials}
          </span>
        </div>
        {/* Mum üzerinde dolaşan ışık */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "48% 52% 51% 49% / 50% 48% 52% 50%",
            background:
              "radial-gradient(circle at 32% 26%, rgba(255,255,255,0.5), transparent 58%)",
            animation: opening
              ? undefined
              : anim("sealGlow 3.4s ease-in-out infinite"),
          }}
        />
      </div>
    </div>
  );
}
