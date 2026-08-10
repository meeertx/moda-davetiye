"use client";

import { useCountdown } from "../useCountdown";
import RsvpBlock from "../RsvpBlock";
import GuestPhotoBlock from "../GuestPhotoBlock";
import OpeningGate from "../OpeningGate";
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
        // Tema bilinçli olarak yaldızsız ve sade: zarf da öyle. Mühür
        // kırmızı mum değil, mürekkep siyahı bir baskı.
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
        className="min-h-screen font-body"
        style={{ background: paper, color: ink }}
      >
        {/* AÇILIŞ — çok geniş boşluk, tek vurgu isimler */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-28">
          <LineHeart size={34} />

          <p
            className="mt-12 text-[10.5px] tracking-[0.44em] uppercase m-0"
            style={{ color: soft }}
          >
            {EVENT_HEADINGS[content.eventType]}
          </p>

          <h1 className="font-display font-normal m-0 mt-10 leading-[0.98] text-[clamp(3rem,13vw,7rem)]">
            {content.brideName}
            <span className="mx-4 font-normal" style={{ color: soft }}>
              +
            </span>
            {content.groomName}
          </h1>

          <ParentsLine content={content} tone="light" className="mt-11" />

          {fmt({ day: "numeric", month: "long", year: "numeric" }) && (
            <p
              className="mt-12 text-[13px] tracking-[0.28em] uppercase m-0"
              style={{ color: soft }}
            >
              {fmt({ day: "numeric", month: "long", year: "numeric" })}
              {fmt({ hour: "2-digit", minute: "2-digit" }) &&
                ` · ${fmt({ hour: "2-digit", minute: "2-digit" })}`}
            </p>
          )}

          {countdown && !countdown.past && (
            <p className="mt-16 text-[15px] m-0" style={{ color: soft }}>
              <span className="font-display text-[44px] text-black/85 tabular-nums align-middle">
                {countdown.days}
              </span>
              <span className="ml-3 align-middle">gün kaldı</span>
            </p>
          )}
        </section>

        {content.story && (
          <>
            <Thread />
            <section className="px-6 py-20">
              <div className="max-w-[660px] mx-auto text-center">
                <SectionTitle>Hikayemiz</SectionTitle>
                <p className="font-display text-[clamp(1.35rem,4vw,1.9rem)] leading-[1.65] m-0 whitespace-pre-line">
                  {content.story}
                </p>
              </div>
            </section>
          </>
        )}

        {content.program.length > 0 && (
          <>
            <Thread />
            <section className="px-6 py-20">
              <div className="max-w-[540px] mx-auto">
                <SectionTitle>Program</SectionTitle>
                {/* Saat ve başlık artık aynı satırda, aralarında noktalı
                    bir bağ var. Alt alta iki ortalanmış satır olarak
                    duruyorlardı ve başlıklar saatin gölgesinde kalıyordu. */}
                <ol className="list-none p-0 m-0 flex flex-col gap-6">
                  {content.program.map((p, i) => (
                    <li
                      key={`${p.time}-${i}`}
                      className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4"
                    >
                      <span className="font-display text-[26px] tabular-nums leading-none">
                        {p.time}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px translate-y-[-4px]"
                        style={{
                          background: `repeating-linear-gradient(90deg, ${soft}66 0 2px, transparent 2px 6px)`,
                        }}
                      />
                      <span className="text-[15px] tracking-[0.04em]">
                        {p.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </>
        )}

        {content.photoUrls.length > 0 && (
          <>
            <Thread />
            <section className="px-6 py-20">
              <div className="max-w-[880px] mx-auto">
                <SectionTitle>Fotoğraflar</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {content.photoUrls.map((url, i) => (
                    <div
                      key={url}
                      className="relative aspect-[4/5] overflow-hidden"
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
          </>
        )}

        {(content.venueName || content.venueAddress) && (
          <>
            <Thread />
            <section className="px-6 py-20">
              <div className="max-w-[640px] mx-auto text-center">
                <SectionTitle>Konum</SectionTitle>
                {content.venueName && (
                  <p className="font-display text-[28px] m-0 mb-3">
                    {content.venueName}
                  </p>
                )}
                {content.venueAddress && (
                  <p
                    className="text-[15px] leading-[1.7] m-0"
                    style={{ color: soft }}
                  >
                    {content.venueAddress}
                  </p>
                )}
                <VenueMap content={content} tone="light" className="mt-9" />
                <EventActions
                  content={content}
                  tone="light"
                  className="justify-center mt-7"
                />
              </div>
            </section>
          </>
        )}

        {(content.menu.length > 0 || content.extraInfo) && (
          <>
            <Thread />
            <section className="px-6 py-20">
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
          </>
        )}

        {content.rsvp.enabled && (
          <>
            <Thread />
            <section className="px-6 py-20">
              <div className="max-w-[500px] mx-auto">
                <SectionTitle>Katılım Bildirimi</SectionTitle>
                <RsvpBlock content={content} tone="light" preview={preview} />
              </div>
            </section>
          </>
        )}

        {content.guestPhotosEnabled && (
          <>
            <Thread />
            <section className="px-6 py-20">
              <div className="max-w-[560px] mx-auto">
                <SectionTitle>Anı Bırakın</SectionTitle>
                <p
                  className="text-[15px] leading-[1.7] text-center m-0 mb-9"
                  style={{ color: soft }}
                >
                  Çektiğiniz kareleri bizimle paylaşın.
                </p>
                <GuestPhotoBlock
                  content={content}
                  tone="light"
                  preview={preview}
                />
              </div>
            </section>
          </>
        )}

        {(content.giftNote || content.giftIban) && (
          <>
            <Thread />
            <section className="px-6 py-20">
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
                    style={{ color: soft }}
                  >
                    {content.giftIban}
                  </p>
                )}
              </div>
            </section>
          </>
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
