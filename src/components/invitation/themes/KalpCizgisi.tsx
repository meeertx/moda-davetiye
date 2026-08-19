"use client";

import { useCountdown } from "../useCountdown";
import RsvpBlock from "../RsvpBlock";
import GuestPhotoBlock from "../GuestPhotoBlock";
import OpeningGate from "../OpeningGate";
import { RomanticHeartCanvas } from "../ThemeCanvases";
// ProgramTimeline bilinçli olarak alınmadı: bu temanın program listesi
// ikonsuz ve ortalanmış — sadeliği kimliğinin parçası.
import {
  EventActions,
  ExtraInfoCard,
  MenuCard,
  ParentsLine,
  VenueMap,
} from "../Sections";
import { EVENT_HEADINGS, type ThemeProps } from "@/types/invitation";

/**
 * Kalp Çizgisi — minimal, modern, tek çizgi illüstrasyon estetiği.
 *
 * YAPI KARARI: diğer üç tema da KOYU. Bu tema bilerek AÇIK zeminli —
 * neredeyse beyaz kağıt. Süsleme yok, yaldız yok; hiyerarşiyi yalnızca
 * tipografi ölçeği ve bol boşluk kuruyor. Bölümler arasında tek bir ince
 * çizgi akıyor; temanın adı da oradan geliyor.
 */

const paper = "#fbfaf8";
const ink = "#1b1a18";
const soft = "#8d8a85";

/** Tek çizgi kalp — temanın imzası. Kapıya da geçiyor. */
function LineHeart({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 22"
      fill="none"
      stroke={ink}
      strokeWidth="0.9"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 20.5S1.5 13.8 1.5 7.2A5.2 5.2 0 0 1 12 4.6a5.2 5.2 0 0 1 10.5 2.6c0 6.6-10.5 13.3-10.5 13.3z" />
    </svg>
  );
}

/** Bölümleri birbirine bağlayan dikey ince çizgi. */
function Thread() {
  return (
    <span
      aria-hidden="true"
      className="block w-px h-14 mx-auto"
      style={{ background: `linear-gradient(180deg, ${soft}66, transparent)` }}
    />
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[11px] tracking-[0.36em] uppercase text-center m-0 mb-9"
      style={{ color: soft }}
    >
      {children}
    </h2>
  );
}



export default function KalpCizgisi({ content, preview }: ThemeProps) {
  const countdown = useCountdown(content.eventAt);

  const fmt = (o: Intl.DateTimeFormatOptions) =>
    content.eventAt
      ? new Intl.DateTimeFormat("tr-TR", o).format(new Date(content.eventAt))
      : null;

  return (
    <OpeningGate
      content={content}
      palette={{
        base: paper,
        foreground: ink,
        accent: soft,
        onAccent: paper,
        envelope: {
          paper: "#f2f0ec",
          paperShade: "#e8e5e0",
          card: "#ffffff",
          seal: "#1b1a18",
          sealInk: "#f2f0ec",
          accent: "#8d8a85",
          ink: "#1b1a18",
        },
      }}
      ornament={<LineHeart size={26} />}
    >
      <div
        className="relative min-h-screen font-body overflow-hidden"
        style={{ background: paper, color: ink }}
      >
        <RomanticHeartCanvas />

        {/* AÇILIŞ — Romantik Cam Kart */}
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 py-28">
          <div className="relative w-full max-w-[680px] p-8 sm:p-16 rounded-3xl bg-white/80 backdrop-blur-xl border border-rose-200/60 shadow-[0_20px_50px_rgba(225,150,165,0.15)] flex flex-col items-center">
            <div className="animate-pulse">
              <LineHeart size={42} />
            </div>

            <p
              className="mt-8 text-[11px] tracking-[0.45em] uppercase m-0 font-medium"
              style={{ color: soft }}
            >
              {EVENT_HEADINGS[content.eventType]}
            </p>

            <h1 className="font-display font-normal m-0 mt-8 leading-[0.98] text-[clamp(3.2rem,13vw,6.5rem)] text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-rose-900 to-zinc-800">
              {content.brideName}
              <span className="mx-4 font-normal text-rose-500">
                &amp;
              </span>
              {content.groomName}
            </h1>

            <ParentsLine content={content} tone="light" className="mt-9" />

            {fmt({ day: "numeric", month: "long", year: "numeric" }) && (
              <p
                className="mt-9 text-sm tracking-[0.28em] uppercase m-0 font-medium text-rose-900/80"
              >
                {fmt({ day: "numeric", month: "long", year: "numeric" })}
                {fmt({ hour: "2-digit", minute: "2-digit" }) &&
                  ` · ${fmt({ hour: "2-digit", minute: "2-digit" })}`}
              </p>
            )}

            {countdown && !countdown.past && (
              <div className="mt-10 px-6 py-3 rounded-full bg-rose-50/80 border border-rose-200/80 shadow-sm text-sm" style={{ color: soft }}>
                <span className="font-display text-3xl font-bold text-rose-900 tabular-nums align-middle mr-2">
                  {countdown.days}
                </span>
                <span className="align-middle uppercase tracking-widest text-xs font-semibold text-rose-800">gün kaldı</span>
              </div>
            )}
          </div>
        </section>

        {/* HİKAYEMİZ KARTI */}
        {content.story && (
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-[720px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/60 shadow-[0_15px_45px_rgba(225,150,165,0.15)] text-center">
              <SectionTitle>Hikayemiz</SectionTitle>
              <p className="font-display italic text-[clamp(1.35rem,4vw,1.9rem)] leading-[1.65] m-0 text-zinc-900 whitespace-pre-line">
                {content.story}
              </p>
            </div>
          </section>
        )}

        {/* PROGRAM KARTI */}
        {content.program.length > 0 && (
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-[680px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/60 shadow-[0_15px_45px_rgba(225,150,165,0.15)]">
              <SectionTitle>Program</SectionTitle>
              <ol className="list-none p-0 m-0 flex flex-col gap-6">
                {content.program.map((p, i) => (
                  <li
                    key={`${p.time}-${i}`}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-200/40"
                  >
                    <span className="font-display text-2xl font-bold tabular-nums text-rose-900 leading-none">
                      {p.time}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px bg-rose-300/50"
                    />
                    <span className="text-sm font-semibold tracking-wide text-zinc-900">
                      {p.title}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* FOTOĞRAFLAR KARTI */}
        {content.photoUrls.length > 0 && (
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-[900px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/60 shadow-[0_15px_45px_rgba(225,150,165,0.15)]">
              <SectionTitle>Fotoğraflarımız</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {content.photoUrls.map((url, i) => (
                  <div
                    key={url}
                    className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-rose-200/80 shadow-md transform hover:scale-105 transition-transform duration-300"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${content.brideName} + ${content.groomName} — fotoğraf ${i + 1}`}
                      loading={i < 3 ? "eager" : "lazy"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* KONUM KARTI */}
        {(content.venueName || content.venueAddress) && (
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-[740px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/60 shadow-[0_15px_45px_rgba(225,150,165,0.15)] text-center">
              <SectionTitle>Konum</SectionTitle>
              {content.venueName && (
                <p className="font-display text-3xl font-bold text-zinc-900 m-0 mb-3">
                  📍 {content.venueName}
                </p>
              )}
              {content.venueAddress && (
                <p
                  className="text-sm leading-relaxed m-0 text-zinc-600 font-medium"
                >
                  {content.venueAddress}
                </p>
              )}
              <VenueMap content={content} tone="light" className="mt-8" />
              <EventActions
                content={content}
                tone="light"
                className="justify-center mt-7"
              />
            </div>
          </section>
        )}

        {/* MENÜ VE EK BİLGİLER */}
        {(content.menu.length > 0 || content.extraInfo) && (
          <section className="relative z-10 px-4 py-12">
            <div
              className={`mx-auto grid gap-6 ${
                content.menu.length && content.extraInfo
                  ? "max-w-[900px] md:grid-cols-2"
                  : "max-w-[500px]"
              }`}
            >
              <MenuCard menu={content.menu} tone="light" />
              <ExtraInfoCard text={content.extraInfo} tone="light" />
            </div>
          </section>
        )}

        {/* RSVP KARTI */}
        {content.rsvp.enabled && (
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-[580px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/60 shadow-[0_15px_45px_rgba(225,150,165,0.15)]">
              <SectionTitle>Katılım Bildirimi</SectionTitle>
              <RsvpBlock content={content} tone="light" preview={preview} />
            </div>
          </section>
        )}

        {/* ANI BIRAKIN KARTI */}
        {content.guestPhotosEnabled && (
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-[620px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/60 shadow-[0_15px_45px_rgba(225,150,165,0.15)] text-center">
              <SectionTitle>Anı Bırakın</SectionTitle>
              <p
                className="text-sm leading-relaxed m-0 mb-8 text-zinc-600 font-medium"
              >
                Çektiğiniz özel kareleri bizimle paylaşın.
              </p>
              <GuestPhotoBlock
                content={content}
                tone="light"
                preview={preview}
              />
            </div>
          </section>
        )}

        {/* HEDİYE KARTI */}
        {(content.giftNote || content.giftIban) && (
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-[580px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/60 shadow-[0_15px_45px_rgba(225,150,165,0.15)] text-center">
              <SectionTitle>Hediye</SectionTitle>
              {content.giftNote && (
                <p className="font-display text-xl leading-relaxed m-0 text-zinc-800 italic">
                  {content.giftNote}
                </p>
              )}
              {content.giftIban && (
                <p
                  className="mt-5 text-sm tracking-wider font-mono tabular-nums m-0 break-all p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-semibold"
                >
                  {content.giftIban}
                </p>
              )}
            </div>
          </section>
        )}

        <footer className="px-6 pb-20 pt-4 text-center">
          <LineHeart size={20} />
          <p className="font-display text-lg m-0 mt-6">
            {content.brideName} + {content.groomName}
          </p>
          {content.musicTitle && (
            <p
              className="text-[10.5px] tracking-[0.16em] uppercase m-0 mt-3"
              style={{ color: soft }}
            >
              ♪ {content.musicTitle}
            </p>
          )}
        </footer>
      </div>
    </OpeningGate>
  );
}
