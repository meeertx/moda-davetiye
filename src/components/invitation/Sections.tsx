"use client";

import { BotanicalSprig, ProgramIcon, programIcon } from "./Botanical";
import { useCountdown, pad } from "./useCountdown";
import type { InvitationContent } from "@/types/invitation";
import type { ProgramItem } from "@/types/supabase";

/**
 * Temaların ortak kullandığı içerik blokları.
 *
 * Yedi tema yapısal olarak birbirinden ayrı — biri iki sütun, biri tek
 * ekran, biri daire geometrisi. Ama menü listesi ya da harita gömme gibi
 * işler her temada aynı: burada bir kez yazılıp `tone` ile zemine
 * uyarlanıyor. Böylece yeni bir alan eklendiğinde yedi dosya değil, bir
 * dosya değişiyor.
 */

type Tone = "light" | "dark";

interface ToneProps {
  tone?: Tone;
  className?: string;
}

/* ===========================================================================
   GÖMÜLÜ HARİTA
   ========================================================================= */

/**
 * Google Maps yerleştirmesi.
 *
 * API anahtarı GEREKTİRMEZ: `maps.google.com/maps?output=embed` uç
 * noktası ücretsiz ve kotasız. Anahtarlı Embed API'ye geçmek fatura ve
 * anahtar sızma riski getirirdi; davetiye için tek ihtiyaç duyulan şey
 * mekânın haritada görünmesi.
 *
 * Sorgu, adres yoksa mekân adına düşer — ikisi de yoksa harita çizilmez.
 */
export function VenueMap({
  content,
  tone = "light",
  className,
}: ToneProps & { content: InvitationContent }) {
  const query = content.venueAddress || content.venueName;
  if (!query) return null;

  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  const dark = tone === "dark";

  return (
    <div
      className={`relative overflow-hidden ${
        dark ? "border border-white/15" : "border border-black/10"
      } ${className ?? ""}`}
    >
      <iframe
        src={src}
        title={`${content.venueName ?? "Mekân"} haritası`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full h-[260px] sm:h-[320px] border-0"
        // Koyu temalarda parlak beyaz harita göz alıyor; hafifçe
        // söndürülüp doygunluğu düşürülüyor.
        style={dark ? { filter: "grayscale(0.35) brightness(0.82)" } : undefined}
      />
    </div>
  );
}

/**
 * Harita ve takvim eylemleri — "Yol tarifi al" ve "Takvime ekle".
 *
 * Takvim dosyası bir data-URI olarak üretiliyor; sunucuya ek bir uç
 * nokta açmaya gerek yok ve dosya kullanıcının cihazında oluşuyor.
 */
export function EventActions({
  content,
  tone = "light",
  className,
}: ToneProps & { content: InvitationContent }) {
  const dark = tone === "dark";
  const query = content.venueAddress || content.venueName;

  const directionsUrl =
    content.venueMapUrl ||
    (query
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
      : null);

  const button = `inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-[11.5px] tracking-[0.16em] uppercase transition-colors ${
    dark
      ? "border border-white/35 text-white hover:bg-white hover:text-black"
      : "border border-black/25 text-ink hover:bg-ink hover:text-cream"
  }`;

  if (!directionsUrl && !content.eventAt) return null;

  return (
    <div className={`flex flex-wrap gap-3 ${className ?? ""}`}>
      {directionsUrl && (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={button}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.6" />
          </svg>
          Yol Tarifi Al
        </a>
      )}
      {content.eventAt && (
        <a href={calendarHref(content)} download={calendarFileName(content)} className={button}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
            <path d="M3.5 9.5h17M8 3v4M16 3v4" />
          </svg>
          Takvime Ekle
        </a>
      )}
    </div>
  );
}

/** iCalendar zaman damgası: 2026-09-12T15:00:00Z → 20260912T150000Z */
function icsStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function calendarFileName(content: InvitationContent) {
  return `${content.slug || "davetiye"}.ics`;
}

/** Etkinliği .ics olarak data-URI'ye yazar. */
function calendarHref(content: InvitationContent) {
  const start = new Date(content.eventAt!);
  // Süre bilgisi toplanmıyor; düğün için 5 saat makul bir varsayılan
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
  const title = `${content.brideName} & ${content.groomName}`;
  const location = [content.venueName, content.venueAddress]
    .filter(Boolean)
    .join(", ");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Moda Davetiye//TR",
    "BEGIN:VEVENT",
    `UID:${content.id}@modavetiye.com`,
    // DTSTAMP normalde "dosyanın üretildiği an"dır, ama `new Date()`
    // sunucu ve istemcide farklı değer üretip hidrasyon uyuşmazlığına
    // yol açıyor. Etkinlik başlangıcı deterministik ve takvim
    // uygulamaları bunu sorunsuz kabul ediyor.
    `DTSTAMP:${icsStamp(start)}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${title}`,
    location ? `LOCATION:${location}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}

/* ===========================================================================
   EBEVEYN İSİMLERİ
   ========================================================================= */

/**
 * Çiftin ailelerinin isimleri.
 *
 * Türk davetiyelerinde çiftin isimlerinin hemen altında, "kızları" /
 * "oğulları" ilişkisini kuran bir blok olarak durur. İki aile de
 * girilmemişse hiç çizilmez.
 */
export function ParentsLine({
  content,
  tone = "light",
  align = "center",
  className,
}: ToneProps & {
  content: InvitationContent;
  /** Sola dayalı temalar (Kırmızı Kına gibi) `start` kullanır */
  align?: "center" | "start";
}) {
  if (!content.brideParents && !content.groomParents) return null;

  const dark = tone === "dark";
  const muted = dark ? "text-white/45" : "text-black/40";
  const name = dark ? "text-white/85" : "text-ink";
  const start = align === "start";

  return (
    <div
      className={`flex flex-col sm:flex-row gap-5 sm:gap-10 ${
        start
          ? "items-start justify-start text-left"
          : "items-center justify-center"
      } ${className ?? ""}`}
    >
      {content.brideParents && (
        <div className={start ? undefined : "text-center"}>
          <p
            className={`m-0 mb-1.5 text-[10px] tracking-[0.28em] uppercase ${muted}`}
          >
            Kızları
          </p>
          <p className={`m-0 font-display text-[17px] leading-snug ${name}`}>
            {content.brideParents}
          </p>
        </div>
      )}

      {content.brideParents && content.groomParents && (
        <span
          aria-hidden="true"
          className={`hidden sm:block w-px h-9 ${dark ? "bg-white/20" : "bg-black/15"}`}
        />
      )}

      {content.groomParents && (
        <div className={start ? undefined : "text-center"}>
          <p
            className={`m-0 mb-1.5 text-[10px] tracking-[0.28em] uppercase ${muted}`}
          >
            Oğulları
          </p>
          <p className={`m-0 font-display text-[17px] leading-snug ${name}`}>
            {content.groomParents}
          </p>
        </div>
      )}
    </div>
  );
}

/* ===========================================================================
   PROGRAM — İKONLU ZAMAN ÇİZELGESİ
   ========================================================================= */

/**
 * Dikey zaman çizelgesi: her satırın başında daire içinde bir ikon,
 * daireler ince bir çizgiyle birbirine bağlı.
 */
export function ProgramTimeline({
  program,
  tone = "light",
  className,
}: ToneProps & { program: ProgramItem[] }) {
  if (!program.length) return null;

  const dark = tone === "dark";
  const line = dark ? "bg-white/18" : "bg-black/12";
  const ring = dark ? "border-white/30 text-white/80" : "border-black/20 text-ink";
  const time = dark ? "text-white/50" : "text-black/45";
  const title = dark ? "text-white/90" : "text-ink";

  return (
    <ol className={`list-none p-0 m-0 relative ${className ?? ""}`}>
      {/* Daireleri birbirine bağlayan çizgi — ilk ve son dairenin
          merkezinde başlayıp bitsin diye üstten/alttan kırpılıyor */}
      <span
        aria-hidden="true"
        className={`absolute left-[23px] top-6 bottom-6 w-px ${line}`}
      />

      {program.map((item, i) => (
        <li
          key={`${item.time}-${item.title}-${i}`}
          className="relative flex items-start gap-5 pb-9 last:pb-0"
        >
          <span
            className={`relative z-10 shrink-0 w-12 h-12 rounded-full border flex items-center justify-center ${ring} ${
              dark ? "bg-black/40" : "bg-white"
            }`}
          >
            <ProgramIcon name={programIcon(item.title)} className="w-5 h-5" />
          </span>

          <div className="pt-2.5">
            <p
              className={`m-0 text-[11px] tracking-[0.22em] uppercase ${time}`}
            >
              {item.time}
            </p>
            <p
              className={`m-0 mt-1 font-display text-[19px] leading-snug ${title}`}
            >
              {item.title}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ===========================================================================
   MENÜ VE EK BİLGİLER
   ========================================================================= */

/**
 * Yemek menüsü — çerçeveli kart içinde, ortalanmış liste.
 *
 * `showTitle`, bölümü zaten kendi başlığıyla etiketleyen temalar için
 * (Kırmızı Kına'nın numaralı başlıkları gibi) kapatılabilir; aksi hâlde
 * "MENÜ" iki kez üst üste yazılıyordu.
 */
export function MenuCard({
  menu,
  tone = "light",
  showTitle = true,
  className,
}: ToneProps & { menu: string[]; showTitle?: boolean }) {
  if (!menu.length) return null;

  const dark = tone === "dark";

  return (
    <div
      className={`relative px-7 sm:px-12 py-10 text-center ${
        dark ? "border border-white/15" : "border border-black/12"
      } ${className ?? ""}`}
    >
      <BotanicalSprig
        className={`w-20 h-auto mx-auto mb-6 ${dark ? "text-white/40" : "text-black/25"}`}
      />
      {showTitle && (
        <p
          className={`m-0 mb-7 text-[11px] tracking-[0.34em] uppercase ${
            dark ? "text-white/50" : "text-black/40"
          }`}
        >
          Menü
        </p>
      )}
      <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
        {menu.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className={`font-display text-[18px] leading-snug ${
              dark ? "text-white/85" : "text-ink"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Vale, otel, kıyafet kodu gibi pratik notlar. */
export function ExtraInfoCard({
  text,
  tone = "light",
  showTitle = true,
  className,
}: ToneProps & { text: string | null; showTitle?: boolean }) {
  if (!text?.trim()) return null;

  const dark = tone === "dark";

  return (
    <div
      className={`px-7 sm:px-12 py-10 ${
        dark ? "border border-white/15" : "border border-black/12"
      } ${className ?? ""}`}
    >
      {showTitle && (
        <p
          className={`m-0 mb-6 text-[11px] tracking-[0.34em] uppercase text-center ${
            dark ? "text-white/50" : "text-black/40"
          }`}
        >
          Ek Bilgiler
        </p>
      )}
      {/* Müşteri satır satır yazıyor; her satır ayrı bir madde olsun */}
      <ul className="list-none p-0 m-0 flex flex-col gap-3">
        {text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line, i) => (
            <li
              key={`${line}-${i}`}
              className={`flex items-start gap-3 text-[14.5px] leading-[1.7] ${
                dark ? "text-white/70" : "text-muted"
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-2.5 shrink-0 w-1 h-1 rounded-full ${
                  dark ? "bg-white/40" : "bg-black/30"
                }`}
              />
              {line}
            </li>
          ))}
      </ul>
    </div>
  );
}

/* ===========================================================================
   GERİ SAYIM KUTULARI
   ========================================================================= */

/**
 * Geri sayımın çerçeveli kutu biçimi.
 *
 * Yükseklik `min-h` ile sabit: sayaç ilk render'da boş gelir (hidrasyon
 * uyuşmazlığını önlemek için) ve sayı belirdiğinde sayfa zıplamamalı.
 */
export function CountdownBoxes({
  eventAt,
  tone = "dark",
  className,
}: ToneProps & { eventAt: string | null }) {
  const countdown = useCountdown(eventAt);
  const dark = tone === "dark";

  if (!eventAt) return null;

  const dateLabel = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(eventAt));

  const parts = countdown
    ? [
        { value: countdown.days, label: "Gün" },
        { value: countdown.hours, label: "Saat" },
        { value: countdown.minutes, label: "Dakika" },
        { value: countdown.seconds, label: "Saniye" },
      ]
    : null;

  return (
    <div className={`text-center ${className ?? ""}`}>
      <p
        className={`m-0 mb-7 text-[11px] tracking-[0.3em] uppercase ${
          dark ? "text-white/45" : "text-black/40"
        }`}
      >
        {dateLabel} tarihine kadar
      </p>

      <div className="min-h-[124px]">
        {parts && !countdown?.past && (
          <div className="flex justify-center gap-2 sm:gap-4">
            {parts.map((p) => (
              <div
                key={p.label}
                className={`min-w-[70px] sm:min-w-[94px] px-2 sm:px-3 py-5 ${
                  dark ? "border border-white/25" : "border border-black/15"
                }`}
              >
                <p
                  className={`m-0 font-display text-[clamp(1.7rem,6.5vw,2.5rem)] leading-none tabular-nums ${
                    dark ? "text-white" : "text-ink"
                  }`}
                >
                  {pad(p.value)}
                </p>
                <p
                  className={`m-0 mt-2.5 text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase ${
                    dark ? "text-white/45" : "text-black/40"
                  }`}
                >
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {countdown?.past && (
          <p
            className={`font-display italic text-2xl m-0 pt-8 ${
              dark ? "text-white/85" : "text-ink"
            }`}
          >
            O gün geldi.
          </p>
        )}
      </div>
    </div>
  );
}
