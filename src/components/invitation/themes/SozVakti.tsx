"use client";

import { useCountdown, pad } from "../useCountdown";
import OpeningGate from "../OpeningGate";
import RsvpBlock from "../RsvpBlock";
import { StarrySkyCanvas } from "../ThemeCanvases";
import { ParentsLine } from "../Sections";
import { EVENT_HEADINGS, type ThemeProps } from "@/types/invitation";

/**
 * Söz Vakti — save-the-date.
 *
 * YAPI KARARI: bu bir davetiye değil, bir DUYURU. Diğer altı tema uzun
 * uzun kaydırılırken bu tema TEK EKRAN: tarih, isimler, geri sayım ve
 * takvime ekleme. Program, hikaye, galeri ve RSVP bilerek yok — kimse
 * save-the-date'e katılım bildirmez, sadece takvime işaretler.
 *
 * İçerikte bu bölümler dolu olsa bile burada gösterilmez; tema sözleşmesi
 * "her alanı basmak" değil, "bu davetin işini yapmak".
 */

const navy = "#101a2e";
const navyLift = "#17233c";
const cream = "#f2ede3";
const brass = "#c2a86a";

function Star({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M6 0l1.4 4.6L12 6l-4.6 1.4L6 12l-1.4-4.6L0 6l4.6-1.4z"
        fill={brass}
      />
    </svg>
  );
}

/** .ics dosyası — takvime ekleme, sunucu gerektirmez. */
function calendarHref(content: {
  eventAt: string | null;
  brideName: string;
  groomName: string;
  venueName: string | null;
}) {
  if (!content.eventAt) return null;
  const start = new Date(content.eventAt);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start.getTime() + 4 * 3600_000);
  const stamp = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${content.brideName} & ${content.groomName}`,
    content.venueName ? `LOCATION:${content.venueName}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}



export default function SozVakti({ content, preview }: ThemeProps) {
  const countdown = useCountdown(content.eventAt);

  const fmt = (o: Intl.DateTimeFormatOptions) =>
    content.eventAt
      ? new Intl.DateTimeFormat("tr-TR", o).format(new Date(content.eventAt))
      : null;

  const ics = calendarHref(content);

  return (
    <OpeningGate
      content={content}
      palette={{
        base: navy,
        overlay: `radial-gradient(100% 60% at 50% 20%, ${navyLift} 0%, transparent 72%)`,
        foreground: cream,
        accent: brass,
        onAccent: navy,
        envelope: {
          paper: "#eae5d9",
          paperShade: "#dfd9ca",
          card: "#f8f5ee",
          seal: "#1c2a45",
          sealInk: "#d8bf83",
          accent: "#9a8449",
          ink: "#101a2e",
        },
      }}
      ornament={<Star size={14} />}
    >
      <div
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 font-body overflow-hidden"
        style={{ background: navy, color: cream }}
      >
        <StarrySkyCanvas />

        <div className="relative z-10 w-full max-w-[620px] p-8 sm:p-14 rounded-3xl bg-zinc-950/80 backdrop-blur-xl border border-amber-400/40 shadow-[0_0_80px_rgba(194,168,106,0.25)] flex flex-col items-center">
          <div className="flex justify-center gap-4 mb-8">
            <Star size={10} />
            <Star size={16} />
            <Star size={10} />
          </div>

          <p
            className="text-[11px] tracking-[0.45em] uppercase m-0 mb-6 font-semibold"
            style={{ color: brass }}
          >
            {EVENT_HEADINGS[content.eventType]}
          </p>

          <h1 className="font-display italic font-medium m-0 leading-[1] text-[clamp(2.8rem,11vw,5.2rem)] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-200 drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]">
            {content.brideName}
            <span className="mx-3 text-amber-400">
              &amp;
            </span>
            {content.groomName}
          </h1>

          <ParentsLine content={content} tone="dark" className="mt-8" />

          {fmt({ day: "numeric", month: "long", year: "numeric" }) && (
            <p
              className="mt-10 font-display text-[clamp(1.8rem,6vw,2.6rem)] m-0 font-semibold"
              style={{ color: brass }}
            >
              {fmt({ day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
          {content.venueName && (
            <p className="mt-3 text-xs tracking-[0.2em] uppercase m-0 text-amber-200/80 font-medium">
              {content.venueName}
            </p>
          )}

          {countdown && !countdown.past && (
            <div className="mt-10 flex justify-center gap-6 sm:gap-8">
              {[
                { v: countdown.days, l: "Gün" },
                { v: countdown.hours, l: "Saat" },
                { v: countdown.minutes, l: "Dakika" },
              ].map((u) => (
                <div key={u.l} className="px-4 py-3 rounded-2xl bg-black/60 border border-amber-400/30">
                  <div className="font-display text-[clamp(1.8rem,6vw,2.4rem)] leading-none tabular-nums text-amber-200">
                    {pad(u.v)}
                  </div>
                  <div
                    className="text-[9.5px] tracking-[0.22em] uppercase mt-2 font-semibold"
                    style={{ color: brass }}
                  >
                    {u.l}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* HİKAYEMİZ */}
          {content.story && (
            <div className="mt-8 w-full p-6 sm:p-8 rounded-2xl bg-black/50 border border-amber-400/30 text-center">
              <h2 className="text-xs tracking-[0.3em] uppercase text-amber-300 mb-4 font-semibold">Hikayemiz</h2>
              <p className="font-display italic text-lg leading-relaxed text-amber-100/90 whitespace-pre-line m-0">
                {content.story}
              </p>
            </div>
          )}

          {/* PROGRAM */}
          {content.program.length > 0 && (
            <div className="mt-8 w-full p-6 sm:p-8 rounded-2xl bg-black/50 border border-amber-400/30">
              <h2 className="text-xs tracking-[0.3em] uppercase text-amber-300 mb-6 text-center font-semibold">Program</h2>
              <div className="flex flex-col gap-4">
                {content.program.map((p, i) => (
                  <div key={`${p.time}-${i}`} className="flex justify-between items-center p-3 rounded-xl bg-amber-400/10 border border-amber-400/20">
                    <span className="font-display text-lg font-bold text-amber-300">{p.time}</span>
                    <span className="text-sm text-amber-100 font-medium">{p.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOTOĞRAFLAR */}
          {content.photoUrls.length > 0 && (
            <div className="mt-8 w-full p-6 sm:p-8 rounded-2xl bg-black/50 border border-amber-400/30">
              <h2 className="text-xs tracking-[0.3em] uppercase text-amber-300 mb-6 text-center font-semibold">Fotoğraflar</h2>
              <div className="grid grid-cols-2 gap-3">
                {content.photoUrls.map((url, i) => (
                  <div key={url} className="relative aspect-[4/5] rounded-xl overflow-hidden border border-amber-400/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Fotoğraf ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RSVP */}
          {content.rsvp.enabled && (
            <div className="mt-8 w-full p-6 sm:p-8 rounded-2xl bg-black/50 border border-amber-400/30">
              <h2 className="text-xs tracking-[0.3em] uppercase text-amber-300 mb-6 text-center font-semibold">Katılım Bildirimi</h2>
              <RsvpBlock content={content} tone="dark" preview={preview} />
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            {ics && (
              <a
                href={ics}
                download={`${content.brideName}-${content.groomName}.ics`}
                className="px-8 py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black border border-amber-300"
              >
                Takvime Ekle
              </a>
            )}
            {content.venueMapUrl && (
              <a
                href={content.venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white/10 border border-amber-400/40 text-amber-200"
              >
                Haritada Aç
              </a>
            )}
          </div>

          {content.musicTitle && (
            <p
              className="mt-6 text-[10.5px] tracking-[0.16em] uppercase m-0 opacity-55"
              style={{ color: brass }}
            >
              ♪ {content.musicTitle}
            </p>
          )}
        </div>
      </div>
    </OpeningGate>
  );
}
