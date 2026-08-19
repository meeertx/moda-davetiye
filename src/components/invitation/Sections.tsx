"use client";

import { BotanicalSprig, ProgramIcon, programIcon } from "./Botanical";
import { useCountdown, pad } from "./useCountdown";
import type { InvitationContent } from "@/types/invitation";
import type { ProgramItem } from "@/types/supabase";

type Tone = "light" | "dark";

interface ToneProps {
  tone?: Tone;
  className?: string;
}

/* ===========================================================================
   GÖMÜLÜ HARİTA
   ========================================================================= */
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
      className={`relative overflow-hidden rounded-2xl ${
        dark
          ? "border border-amber-400/30 bg-black/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          : "border border-amber-600/20 bg-white/80 shadow-lg"
      } ${className ?? ""}`}
    >
      <iframe
        src={src}
        title={`${content.venueName ?? "Mekân"} haritası`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full h-[280px] sm:h-[340px] border-0"
        style={dark ? { filter: "grayscale(0.3) brightness(0.85) contrast(1.1)" } : undefined}
      />
    </div>
  );
}

/* ===========================================================================
   HARİTA VE TAKVİM EYLEMLERİ
   ========================================================================= */
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

  const button = `inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 transform hover:scale-105 shadow-md ${
    dark
      ? "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black border border-amber-300/80 hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
      : "bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white border border-amber-600/50 hover:shadow-[0_0_20px_rgba(180,130,40,0.3)]"
  }`;

  if (!directionsUrl && !content.eventAt) return null;

  return (
    <div className={`flex flex-wrap justify-center gap-4 ${className ?? ""}`}>
      {directionsUrl && (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={button}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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

function icsStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function calendarFileName(content: InvitationContent) {
  return `${content.slug || "davetiye"}.ics`;
}

function calendarHref(content: InvitationContent) {
  const start = new Date(content.eventAt!);
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
export function ParentsLine({
  content,
  tone = "light",
  align = "center",
  className,
}: ToneProps & {
  content: InvitationContent;
  align?: "center" | "start";
}) {
  if (!content.brideParents && !content.groomParents) return null;

  const dark = tone === "dark";
  const muted = dark ? "text-amber-300/60" : "text-amber-900/60";
  const name = dark ? "text-amber-100" : "text-amber-950";
  const start = align === "start";

  return (
    <div
      className={`flex flex-col sm:flex-row gap-5 sm:gap-12 ${
        start
          ? "items-start justify-start text-left"
          : "items-center justify-center text-center"
      } ${className ?? ""}`}
    >
      {content.brideParents && (
        <div className={start ? undefined : "text-center"}>
          <p className={`m-0 mb-1 text-[10.5px] tracking-[0.3em] uppercase font-medium ${muted}`}>
            Kızları
          </p>
          <p className={`m-0 font-display text-lg font-semibold ${name}`}>
            {content.brideParents}
          </p>
        </div>
      )}

      {content.brideParents && content.groomParents && (
        <span
          aria-hidden="true"
          className={`hidden sm:block w-px h-10 ${dark ? "bg-amber-400/30" : "bg-amber-800/20"}`}
        />
      )}

      {content.groomParents && (
        <div className={start ? undefined : "text-center"}>
          <p className={`m-0 mb-1 text-[10.5px] tracking-[0.3em] uppercase font-medium ${muted}`}>
            Oğulları
          </p>
          <p className={`m-0 font-display text-lg font-semibold ${name}`}>
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
export function ProgramTimeline({
  program,
  tone = "light",
  className,
}: ToneProps & { program: ProgramItem[] }) {
  if (!program.length) return null;

  const dark = tone === "dark";
  const line = dark ? "bg-gradient-to-b from-amber-400/80 via-amber-500/40 to-transparent" : "bg-gradient-to-b from-amber-600/60 via-amber-500/30 to-transparent";
  const ring = dark
    ? "border-amber-400/60 bg-zinc-950 text-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
    : "border-amber-600/40 bg-amber-50 text-amber-800 shadow-md";
  const time = dark ? "text-amber-400 font-semibold" : "text-amber-800 font-semibold";
  const title = dark ? "text-amber-100" : "text-zinc-900";

  return (
    <ol className={`list-none p-0 m-0 relative ${className ?? ""}`}>
      <span
        aria-hidden="true"
        className={`absolute left-[23px] top-6 bottom-6 w-0.5 ${line}`}
      />

      {program.map((item, i) => (
        <li
          key={`${item.time}-${item.title}-${i}`}
          className="relative flex items-start gap-5 pb-9 last:pb-0 group"
        >
          <span
            className={`relative z-10 shrink-0 w-12 h-12 rounded-full border flex items-center justify-center transition-transform group-hover:scale-110 ${ring}`}
          >
            <ProgramIcon name={programIcon(item.title)} className="w-5 h-5" />
          </span>

          <div className="pt-2">
            <p className={`m-0 text-xs tracking-[0.25em] uppercase ${time}`}>
              {item.time}
            </p>
            <p className={`m-0 mt-1 font-display text-xl font-medium leading-snug ${title}`}>
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
      className={`relative px-8 sm:px-14 py-12 text-center rounded-2xl backdrop-blur-md ${
        dark
          ? "border border-amber-400/30 bg-zinc-950/80 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          : "border border-amber-600/20 bg-white/90 shadow-xl"
      } ${className ?? ""}`}
    >
      <BotanicalSprig
        className={`w-20 h-auto mx-auto mb-6 ${dark ? "text-amber-400/80" : "text-amber-700/80"}`}
      />
      {showTitle && (
        <p className={`m-0 mb-8 text-xs font-semibold tracking-[0.35em] uppercase ${dark ? "text-amber-400" : "text-amber-800"}`}>
          Düğün Menüsü
        </p>
      )}
      <ul className="list-none p-0 m-0 flex flex-col gap-4">
        {menu.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className={`font-display text-lg font-medium leading-snug ${
              dark ? "text-amber-100/90" : "text-zinc-800"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

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
      className={`px-8 sm:px-14 py-12 rounded-2xl backdrop-blur-md ${
        dark
          ? "border border-amber-400/30 bg-zinc-950/80 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          : "border border-amber-600/20 bg-white/90 shadow-xl"
      } ${className ?? ""}`}
    >
      {showTitle && (
        <p className={`m-0 mb-6 text-xs font-semibold tracking-[0.35em] uppercase text-center ${dark ? "text-amber-400" : "text-amber-800"}`}>
          Faydalı Bilgiler &amp; Notlar
        </p>
      )}
      <ul className="list-none p-0 m-0 flex flex-col gap-4">
        {text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line, i) => (
            <li
              key={`${line}-${i}`}
              className={`flex items-start gap-3.5 text-sm leading-relaxed ${
                dark ? "text-amber-100/80" : "text-zinc-700"
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-2 shrink-0 w-2 h-2 rounded-full ${
                  dark ? "bg-amber-400 shadow-[0_0_8px_#d4af37]" : "bg-amber-600"
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
      <p className={`m-0 mb-8 text-xs font-semibold tracking-[0.35em] uppercase ${dark ? "text-amber-300/80" : "text-amber-800/80"}`}>
        {dateLabel} Tarihine Kalan Süre
      </p>

      <div className="min-h-[130px]">
        {parts && !countdown?.past && (
          <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
            {parts.map((p) => (
              <div
                key={p.label}
                className={`min-w-[75px] sm:min-w-[105px] px-3 sm:px-4 py-5 rounded-2xl backdrop-blur-md border transition-transform hover:scale-105 ${
                  dark
                    ? "border-amber-400/40 bg-black/60 shadow-[0_0_25px_rgba(212,175,55,0.2)]"
                    : "border-amber-600/30 bg-amber-50 shadow-md"
                }`}
              >
                <p
                  className={`m-0 font-display text-3xl sm:text-4xl font-bold leading-none tabular-nums ${
                    dark ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400" : "text-amber-900"
                  }`}
                >
                  {pad(p.value)}
                </p>
                <p
                  className={`m-0 mt-3 text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase ${
                    dark ? "text-amber-300/70" : "text-amber-800/70"
                  }`}
                >
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {countdown?.past && (
          <p className={`font-display italic text-3xl m-0 pt-6 ${dark ? "text-amber-300" : "text-amber-900"}`}>
            Büyük gün geldi! 🎉
          </p>
        )}
      </div>
    </div>
  );
}

