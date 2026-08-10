"use client";

import { useCountdown } from "../useCountdown";
import RsvpBlock from "../RsvpBlock";
import GuestPhotoBlock from "../GuestPhotoBlock";
import OpeningGate from "../OpeningGate";
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
          paper: "#f4e2de",
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
        className="min-h-screen font-body"
        style={{ background: blush, color: ink }}
      >
        {/* AÇILIŞ — isimler çemberin içinde */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">
          <div className="relative flex items-center justify-center">
            {/* İç içe iki çember */}
            <div
              aria-hidden="true"
              className="absolute rounded-full"
              style={{
                width: "min(78vw, 460px)",
                height: "min(78vw, 460px)",
                border: `1px solid ${rose}55`,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute rounded-full"
              style={{
                width: "min(66vw, 390px)",
                height: "min(66vw, 390px)",
                border: `1px solid ${rose}2e`,
              }}
            />

            <div className="relative px-8 py-16">
              <p
                className="text-[10px] tracking-[0.4em] uppercase m-0 mb-6"
                style={{ color: rose }}
              >
                {EVENT_HEADINGS[content.eventType]}
              </p>

              <h1 className="font-display font-medium m-0 leading-[1.05] text-[clamp(2.2rem,9vw,3.8rem)]">
                {content.brideName}
                <span
                  className="block italic text-[clamp(1rem,3vw,1.3rem)] my-2"
                  style={{ color: rose }}
                >
                  &amp;
                </span>
                {content.groomName}
              </h1>

              {fmt({ day: "numeric", month: "long", year: "numeric" }) && (
                <p
                  className="mt-7 text-[12.5px] tracking-[0.2em] uppercase m-0"
                  style={{ color: roseDeep }}
                >
                  {fmt({ day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          </div>

          {/* Aileler çemberin DIŞINDA: içeri alınınca çemberi taşırıyor
              ve temanın tek geometrik fikrini bozuyordu. */}
          <ParentsLine content={content} tone="light" className="mt-12" />

          {countdown && !countdown.past && (
            <p className="mt-12 text-[14px] m-0" style={{ color: roseDeep }}>
              {countdown.days} gün {countdown.hours} saat kaldı
            </p>
          )}
        </section>

        {/* FOTOĞRAFLAR — daire çerçeveler, sayfanın omurgası */}
        {photos.length > 0 && (
          <section
            className="px-6 py-24"
            style={{ background: blushDeep }}
          >
            <div className="max-w-[900px] mx-auto">
              <SectionTitle>Biz</SectionTitle>
              <div className="flex flex-wrap justify-center gap-6 sm:gap-9">
                {photos.map((url, i) => (
                  <div
                    key={url}
                    className="rounded-full overflow-hidden shrink-0"
                    style={{
                      width: i % 3 === 0 ? "clamp(150px,32vw,220px)" : "clamp(110px,24vw,160px)",
                      height: i % 3 === 0 ? "clamp(150px,32vw,220px)" : "clamp(110px,24vw,160px)",
                      border: `1px solid ${rose}66`,
                      padding: "6px",
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

        {content.story && (
          <section className="px-6 py-24">
            <div className="max-w-[600px] mx-auto text-center">
              <SectionTitle>Hikayemiz</SectionTitle>
              <p className="font-display text-[clamp(1.25rem,3.8vw,1.6rem)] leading-[1.7] m-0 whitespace-pre-line">
                {content.story}
              </p>
            </div>
          </section>
        )}

        {/* PROGRAM — her saat bir çember */}
        {content.program.length > 0 && (
          <section className="px-6 py-24" style={{ background: blushDeep }}>
            <div className="max-w-[760px] mx-auto">
              <SectionTitle>Program</SectionTitle>
              <div className="flex flex-wrap justify-center gap-8">
                {content.program.map((p, i) => (
                  <div
                    key={`${p.time}-${i}`}
                    className="w-[150px] text-center"
                  >
                    <div
                      className="w-[86px] h-[86px] rounded-full mx-auto flex items-center justify-center"
                      style={{ border: `1px solid ${rose}66` }}
                    >
                      <span
                        className="font-display text-[19px] tabular-nums"
                        style={{ color: roseDeep }}
                      >
                        {p.time}
                      </span>
                    </div>
                    <div className="text-[13.5px] mt-4 leading-[1.5]">
                      {p.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {(content.venueName || content.venueAddress) && (
          <section className="px-6 py-24">
            <div className="max-w-[520px] mx-auto text-center">
              <SectionTitle>Konum</SectionTitle>
              {content.venueName && (
                <p className="font-display text-[26px] m-0 mb-2">
                  {content.venueName}
                </p>
              )}
              {content.venueAddress && (
                <p className="text-[15px] leading-[1.7] m-0 opacity-70">
                  {content.venueAddress}
                </p>
              )}
              {/* Harita da çember geometrisine uyuyor */}
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

        {(content.menu.length > 0 || content.extraInfo) && (
          <section className="px-6 py-24" style={{ background: blushDeep }}>
            <div
              className={`mx-auto grid gap-5 ${
                content.menu.length && content.extraInfo
                  ? "max-w-[860px] md:grid-cols-2"
                  : "max-w-[460px]"
              }`}
            >
              <MenuCard menu={content.menu} tone="light" />
              <ExtraInfoCard text={content.extraInfo} tone="light" />
            </div>
          </section>
        )}

        {content.rsvp.enabled && (
          <section className="px-6 py-24">
            <div className="max-w-[420px] mx-auto">
              <SectionTitle>Katılım Bildirimi</SectionTitle>
              <RsvpBlock content={content} tone="light" preview={preview} />
            </div>
          </section>
        )}

        {content.guestPhotosEnabled && (
          <section className="px-6 py-24" style={{ background: blushDeep }}>
            <div className="max-w-[480px] mx-auto">
              <SectionTitle>Anı Bırakın</SectionTitle>
              <p className="text-[15px] leading-[1.7] text-center m-0 mb-9 opacity-70">
                Çektiğiniz kareleri bizimle paylaşın.
              </p>
              <GuestPhotoBlock
                content={content}
                tone="light"
                preview={preview}
              />
            </div>
          </section>
        )}

        {(content.giftNote || content.giftIban) && (
          <section className="px-6 py-24">
            <div className="max-w-[520px] mx-auto text-center">
              <SectionTitle>Hediye</SectionTitle>
              {content.giftNote && (
                <p className="font-display text-xl leading-[1.6] m-0">
                  {content.giftNote}
                </p>
              )}
              {content.giftIban && (
                <p
                  className="mt-5 text-[15px] tracking-[0.06em] tabular-nums m-0 break-all"
                  style={{ color: roseDeep }}
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
