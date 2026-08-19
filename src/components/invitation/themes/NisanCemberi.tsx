"use client";

import { useCountdown } from "../useCountdown";
import RsvpBlock from "../RsvpBlock";
import GuestPhotoBlock from "../GuestPhotoBlock";
import OpeningGate from "../OpeningGate";
import { FloatingPetalsCanvas } from "../ThemeCanvases";
// ProgramTimeline alınmadı: bu temanın programı çemberler üzerinde
// duruyor — dikey ikon çizelgesi kimliğini bozardı.
import {
  EventActions,
  ExtraInfoCard,
  MenuCard,
  ParentsLine,
  VenueMap,
} from "../Sections";
import { EVENT_HEADINGS, type ThemeProps } from "@/types/invitation";

/**
 * Nişan Çemberi — pudra pembesi, fotoğraf odaklı nişan davetiyesi.
 *
 * YAPI KARARI: tek geometrik fikir üstüne kurulu — ÇEMBER. İsimler bir
 * çember içinde, fotoğraflar daire çerçevelerde, program bir yay üstünde
 * ilerliyor. Diğer temalarda fotoğraf bir bölüm; burada sayfanın omurgası.
 * Fotoğraf yoksa çember boş kalmasın diye tipografiye dönüşüyor.
 */

const blush = "#fdf4f2";
const blushDeep = "#f6e3e0";
const rose = "#b4736e";
const roseDeep = "#7d4844";
const ink = "#33211f";

function Ring({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="none"
        stroke={rose}
        strokeWidth="1"
      />
      <circle
        cx="20"
        cy="20"
        r="12.5"
        fill="none"
        stroke={rose}
        strokeWidth="0.7"
        opacity="0.55"
      />
    </svg>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[11px] tracking-[0.3em] uppercase text-center m-0 mb-9"
      style={{ color: rose }}
    >
      {children}
    </h2>
  );
}



export default function NisanCemberi({ content, preview }: ThemeProps) {
  const countdown = useCountdown(content.eventAt);

  const fmt = (o: Intl.DateTimeFormatOptions) =>
    content.eventAt
      ? new Intl.DateTimeFormat("tr-TR", o).format(new Date(content.eventAt))
      : null;

  const photos = content.photoUrls;

  return (
    <OpeningGate
      content={content}
      palette={{
        base: blush,
        overlay: `radial-gradient(80% 55% at 50% 25%, ${blushDeep} 0%, transparent 70%)`,
        foreground: ink,
        accent: rose,
        onAccent: blush,
        // Pudra pembe kâğıt, gül kurusu mühür.
        envelope: {
          paper: "#f5e8e5",
          paperShade: "#ecd5d0",
          card: "#fdf7f5",
          seal: "#a8615c",
          sealInk: "#fbecea",
          accent: "#b4736e",
          ink: "#33211f",
        },
      }}
      ornament={<Ring size={40} />}
    >
      <div
        className="relative min-h-screen font-body overflow-hidden"
        style={{ background: blush, color: ink }}
      >
        <FloatingPetalsCanvas />

        {/* AÇILIŞ — Centered 3D Floral Ring Plaque Card */}
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 py-24">
          <div className="relative w-full max-w-[760px] p-8 sm:p-16 rounded-3xl bg-white/85 backdrop-blur-xl border-2 border-rose-300/60 shadow-[0_20px_70px_rgba(200,100,120,0.2)] flex flex-col items-center">
            
            {/* Glowing Circular Monogram Wreath Container */}
            <div className="relative flex items-center justify-center my-6">
              <div
                aria-hidden="true"
                className="absolute rounded-full animate-spin opacity-40"
                style={{
                  width: "min(68vw, 380px)",
                  height: "min(68vw, 380px)",
                  border: `2px dashed ${rose}`,
                  animationDuration: "25s",
                }}
              />
              <div className="relative z-10 py-10 px-6 text-center max-w-[320px]">
                <p
                  className="text-xs tracking-[0.4em] uppercase m-0 mb-4 font-semibold"
                  style={{ color: roseDeep }}
                >
                  🌸 {EVENT_HEADINGS[content.eventType]} 🌸
                </p>

                <h1 className="font-display font-medium m-0 leading-[0.98] text-[clamp(2.8rem,10vw,4.8rem)] text-zinc-900">
                  {content.brideName}
                  <span
                    className="block text-xl italic my-2 font-script text-rose-700"
                  >
                    &amp;
                  </span>
                  {content.groomName}
                </h1>

                {fmt({ day: "numeric", month: "long", year: "numeric" }) && (
                  <p
                    className="mt-6 text-sm tracking-[0.2em] uppercase m-0 font-semibold text-rose-950"
                  >
                    🗓️ {fmt({ day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
            </div>

            <ParentsLine content={content} tone="light" className="mt-6" />

            {countdown && !countdown.past && (
              <div className="mt-8 px-6 py-3 rounded-full bg-rose-50 border border-rose-300/70 shadow-sm text-sm" style={{ color: roseDeep }}>
                <span className="font-display text-3xl font-bold text-rose-900 tabular-nums align-middle mr-2">
                  {countdown.days}
                </span>
                <span className="align-middle uppercase tracking-widest text-xs font-semibold text-rose-800">gün kaldı</span>
              </div>
            )}
          </div>
        </section>

        {/* FOTOĞRAFLAR KARTI */}
        {photos.length > 0 && (
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-[920px] mx-auto p-8 sm:p-14 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/80 shadow-[0_15px_45px_rgba(200,100,120,0.15)] text-center">
              <SectionTitle>Fotoğraflarımız</SectionTitle>
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                {photos.map((url, i) => (
                  <div
                    key={url}
                    className="rounded-full overflow-hidden shrink-0 transform hover:scale-105 transition-transform duration-300 shadow-md"
                    style={{
                      width: i % 3 === 0 ? "clamp(150px,32vw,210px)" : "clamp(110px,24vw,150px)",
                      height: i % 3 === 0 ? "clamp(150px,32vw,210px)" : "clamp(110px,24vw,150px)",
                      border: `3px solid ${rose}88`,
                      padding: "5px",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${content.brideName} & ${content.groomName} — fotoğraf ${i + 1}`}
                      loading={i < 3 ? "eager" : "lazy"}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* HİKAYEMİZ KARTI */}
        {content.story && (
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-[700px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/80 shadow-[0_15px_45px_rgba(200,100,120,0.15)] text-center">
              <SectionTitle>Hikayemiz</SectionTitle>
              <p className="font-display italic text-[clamp(1.25rem,3.8vw,1.75rem)] leading-[1.7] m-0 text-zinc-900 whitespace-pre-line">
                {content.story}
              </p>
            </div>
          </section>
        )}

        {/* PROGRAM KARTI */}
        {content.program.length > 0 && (
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-[800px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/80 shadow-[0_15px_45px_rgba(200,100,120,0.15)]">
              <SectionTitle>Program</SectionTitle>
              <div className="flex flex-wrap justify-center gap-8">
                {content.program.map((p, i) => (
                  <div
                    key={`${p.time}-${i}`}
                    className="w-[150px] text-center"
                  >
                    <div
                      className="w-[90px] h-[90px] rounded-full mx-auto flex items-center justify-center bg-rose-50 border-2 border-rose-300 shadow-md"
                    >
                      <span
                        className="font-display text-xl font-bold tabular-nums text-rose-900"
                      >
                        {p.time}
                      </span>
                    </div>
                    <div className="text-sm font-semibold mt-4 text-zinc-800">
                      {p.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* KONUM KARTI */}
        {(content.venueName || content.venueAddress) && (
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-[700px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/80 shadow-[0_15px_45px_rgba(200,100,120,0.15)] text-center">
              <SectionTitle>Konum</SectionTitle>
              {content.venueName && (
                <p className="font-display text-3xl font-bold text-zinc-900 m-0 mb-2">
                  📍 {content.venueName}
                </p>
              )}
              {content.venueAddress && (
                <p className="text-sm leading-relaxed m-0 text-zinc-600 font-medium">
                  {content.venueAddress}
                </p>
              )}
              <VenueMap
                content={content}
                tone="light"
                className="mt-8 rounded-[24px]"
              />
              <EventActions
                content={content}
                tone="light"
                className="justify-center mt-7"
              />
            </div>
          </section>
        )}

        {/* MENÜ & NOTLAR */}
        {(content.menu.length > 0 || content.extraInfo) && (
          <section className="relative z-10 px-4 py-12">
            <div
              className={`mx-auto grid gap-6 ${
                content.menu.length && content.extraInfo
                  ? "max-w-[900px] md:grid-cols-2"
                  : "max-w-[480px]"
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
            <div className="max-w-[560px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/80 shadow-[0_15px_45px_rgba(200,100,120,0.15)]">
              <SectionTitle>Katılım Bildirimi</SectionTitle>
              <RsvpBlock content={content} tone="light" preview={preview} />
            </div>
          </section>
        )}

        {/* ANI BIRAKIN KARTI */}
        {content.guestPhotosEnabled && (
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-[600px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/80 shadow-[0_15px_45px_rgba(200,100,120,0.15)] text-center">
              <SectionTitle>Anı Bırakın</SectionTitle>
              <p className="text-sm leading-relaxed text-center m-0 mb-8 text-zinc-600 font-medium">
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
            <div className="max-w-[560px] mx-auto p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/80 shadow-[0_15px_45px_rgba(200,100,120,0.15)] text-center">
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

        <footer className="px-6 pb-20 text-center">
          <div className="flex justify-center mb-6">
            <Ring size={26} />
          </div>
          <p className="font-display text-lg m-0">
            {content.brideName} &amp; {content.groomName}
          </p>
          {content.musicTitle && (
            <p
              className="text-[10.5px] tracking-[0.16em] uppercase m-0 mt-3"
              style={{ color: rose }}
            >
              ♪ {content.musicTitle}
            </p>
          )}
        </footer>
      </div>
    </OpeningGate>
  );
}
