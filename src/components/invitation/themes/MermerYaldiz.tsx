"use client";

import { useCountdown, pad } from "../useCountdown";
import RsvpBlock from "../RsvpBlock";
import GuestPhotoBlock from "../GuestPhotoBlock";
import OpeningGate from "../OpeningGate";
import {
  EventActions,
  ExtraInfoCard,
  MenuCard,
  ParentsLine,
  ProgramTimeline,
  VenueMap,
} from "../Sections";
import { EVENT_HEADINGS, type ThemeProps } from "@/types/invitation";

/**
 * Mermer & Yaldız — üst segment, en prestijli tema.
 *
 * YAPI KARARI: diğer iki temanın ikisi de tek sütun akıyordu. Bu tema
 * geniş ekranda İKİYE BÖLÜNÜR — solda sabit kalan bir isim paneli, sağda
 * kayan içerik. Sayfa boyunca çiftin adı ekranda kalır; davetiyeyi bir
 * kitapçık gibi okutur. Dar ekranda panel üste yerleşir.
 */

const marble = "#0e0d0c";
const marbleLift = "#161413";
const gold = "#c9a961";
const bone = "#ece7df";

/** Mermer damar dokusu — çok düşük kontrastlı, katmanlı. */
const marbleTexture =
  "repeating-linear-gradient(114deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 26px)," +
  "repeating-linear-gradient(72deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 41px)," +
  "radial-gradient(80% 55% at 30% 20%, rgba(201,169,97,0.07) 0%, transparent 70%)";

function Hairline({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block h-px ${className}`}
      style={{ background: `linear-gradient(90deg, ${gold}aa, transparent)` }}
    />
  );
}

/** Kapıya da geçtiği için renkleri sabitten alır, CSS değişkeninden değil. */
function Diamond() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 0l6 6-6 6-6-6z" fill="none" stroke={gold} strokeWidth="1" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Diamond />
      <h2
        className="text-[11px] tracking-[0.34em] uppercase m-0"
        style={{ color: gold }}
      >
        {children}
      </h2>
      <Hairline className="flex-1" />
    </div>
  );
}

export default function MermerYaldiz({ content, preview }: ThemeProps) {
  const countdown = useCountdown(content.eventAt);

  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    content.eventAt
      ? new Intl.DateTimeFormat("tr-TR", opts).format(new Date(content.eventAt))
      : null;

  const dateLabel = fmt({ day: "numeric", month: "long", year: "numeric" });
  const timeLabel = fmt({ hour: "2-digit", minute: "2-digit" });

  return (
    <OpeningGate
      content={content}
      palette={{
        base: marble,
        overlay: marbleTexture,
        foreground: bone,
        accent: gold,
        onAccent: marble,
        // Mermer teması soğuk ve grafik: zarf da beyaz-gri mermer
        // tonunda, mühür yaldız.
        envelope: {
          paper: "#e8e4dd",
          paperShade: "#dcd7ce",
          card: "#f6f3ee",
          seal: "#8c7431",
          sealInk: "#f2e6c8",
          accent: "#a08a4e",
          ink: "#26241f",
        },
      }}
      ornament={<Diamond />}
    >
      <div
        className="min-h-screen font-body lg:flex"
        style={{ background: marble, color: bone }}
      >
        {/* SOL PANEL — geniş ekranda sabit kalır */}
        <aside
          className="lg:w-[42%] lg:h-screen lg:sticky lg:top-0 flex items-center px-8 sm:px-14 py-20 lg:py-0 relative overflow-hidden"
          style={{
            backgroundColor: marbleLift,
            backgroundImage: marbleTexture,
            borderRight: `1px solid ${gold}1f`,
          }}
        >
          {/* Blok panelde ortalanır, metin içinde sola hizalı kalır —
              temanın kimliği metnin hizası, bloğun kenara yapışması değil */}
          <div className="relative w-full max-w-[420px] mx-auto">
            <Diamond />
            <p
              className="mt-7 text-[10.5px] tracking-[0.42em] uppercase m-0"
              style={{ color: gold }}
            >
              {EVENT_HEADINGS[content.eventType]}
            </p>

            <h1 className="font-display font-medium m-0 mt-6 leading-[0.98] text-[clamp(2.8rem,7vw,4.4rem)]">
              <span className="block">{content.brideName}</span>
              <span
                className="block italic text-[clamp(1.4rem,3vw,2rem)] my-1"
                style={{ color: gold }}
              >
                &amp;
              </span>
              <span className="block">{content.groomName}</span>
            </h1>

            <Hairline className="my-9 w-24" />

            {/* Aileler — panelin sola dayalı düzenine uyar */}
            <ParentsLine
              content={content}
              tone="dark"
              align="start"
              className="mb-9"
            />

            {dateLabel && (
              <p className="text-[15px] tracking-[0.1em] m-0">
                {dateLabel}
                {timeLabel && (
                  <span className="block mt-1 opacity-60">{timeLabel}</span>
                )}
              </p>
            )}
            {content.venueName && (
              <p className="text-[13px] tracking-[0.06em] m-0 mt-4 opacity-55">
                {content.venueName}
              </p>
            )}

            {/* Geri sayım panelde dikey durur */}
            {countdown && !countdown.past && (
              <div className="mt-12 flex gap-6">
                {[
                  { v: countdown.days, l: "Gün" },
                  { v: countdown.hours, l: "Saat" },
                  { v: countdown.minutes, l: "Dk" },
                ].map((u) => (
                  <div key={u.l}>
                    <div className="font-display text-[30px] leading-none tabular-nums">
                      {pad(u.v)}
                    </div>
                    <div
                      className="text-[9.5px] tracking-[0.2em] uppercase mt-2"
                      style={{ color: gold }}
                    >
                      {u.l}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* SAĞ SÜTUN — kayan içerik */}
        {/* SAĞ SÜTUN — kayan içerik.
            `lg:mx-0` kaldırıldı: içerik 58%'lik panelin soluna yapışıp
            sağında geniş bir boşluk bırakıyordu. Artık kendi paneli
            içinde ortalanıyor. */}
        <main className="lg:w-[58%] px-8 sm:px-14 py-20 lg:py-28">
          <div className="max-w-[620px] mx-auto flex flex-col gap-20">
            {content.story && (
              <section>
                <SectionLabel>Hikayemiz</SectionLabel>
                <p className="font-display text-[clamp(1.2rem,3vw,1.5rem)] leading-[1.7] m-0 whitespace-pre-line opacity-90">
                  {content.story}
                </p>
              </section>
            )}

            {content.program.length > 0 && (
              <section>
                <SectionLabel>Program</SectionLabel>
                <ProgramTimeline program={content.program} tone="dark" />
              </section>
            )}

            {content.photoUrls.length > 0 && (
              <section>
                <SectionLabel>Fotoğraflar</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  {content.photoUrls.map((url, i) => (
                    <div
                      key={url}
                      className="relative aspect-[4/5] overflow-hidden"
                      style={{ border: `1px solid ${gold}33` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`${content.brideName} & ${content.groomName} — fotoğraf ${i + 1}`}
                        loading={i < 2 ? "eager" : "lazy"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(content.venueName || content.venueAddress) && (
              <section>
                <SectionLabel>Konum</SectionLabel>
                {content.venueName && (
                  <p className="font-display text-[26px] m-0 mb-2">
                    {content.venueName}
                  </p>
                )}
                {content.venueAddress && (
                  <p className="text-[15px] leading-[1.7] m-0 opacity-65">
                    {content.venueAddress}
                  </p>
                )}
                <VenueMap content={content} tone="dark" className="mt-7" />
                <EventActions content={content} tone="dark" className="mt-6" />
              </section>
            )}

            {content.menu.length > 0 && (
              <section>
                <SectionLabel>Menü</SectionLabel>
                <MenuCard menu={content.menu} tone="dark" showTitle={false} />
              </section>
            )}

            {content.extraInfo && (
              <section>
                <SectionLabel>Ek Bilgiler</SectionLabel>
                <ExtraInfoCard text={content.extraInfo} tone="dark" showTitle={false} />
              </section>
            )}

            {content.rsvp.enabled && (
              <section>
                <SectionLabel>Katılım Bildirimi</SectionLabel>
                <RsvpBlock content={content} tone="dark" preview={preview} />
              </section>
            )}

            {content.guestPhotosEnabled && (
              <section>
                <SectionLabel>Anı Bırakın</SectionLabel>
                <p className="text-[15px] leading-[1.7] m-0 mb-8 opacity-70">
                  Çektiğiniz kareleri bizimle paylaşın — bu günü sizin
                  gözünüzden de görelim.
                </p>
                <GuestPhotoBlock
                  content={content}
                  tone="dark"
                  preview={preview}
                />
              </section>
            )}

            {(content.giftNote || content.giftIban) && (
              <section>
                <SectionLabel>Hediye</SectionLabel>
                {content.giftNote && (
                  <p className="font-display text-xl leading-[1.6] m-0 opacity-90">
                    {content.giftNote}
                  </p>
                )}
                {content.giftIban && (
                  <p
                    className="mt-5 text-[15px] tracking-[0.08em] tabular-nums m-0 break-all"
                    style={{ color: gold }}
                  >
                    {content.giftIban}
                  </p>
                )}
              </section>
            )}

            <footer
              className="pt-10"
              style={{ borderTop: `1px solid ${gold}1a` }}
            >
              <p className="font-display text-lg m-0 opacity-70">
                {content.brideName} &amp; {content.groomName}
              </p>
              {content.musicTitle && (
                <p
                  className="text-[10.5px] tracking-[0.16em] uppercase m-0 mt-3 opacity-60"
                  style={{ color: gold }}
                >
                  ♪ {content.musicTitle}
                </p>
              )}
            </footer>
          </div>
        </main>
      </div>
    </OpeningGate>
  );
}
