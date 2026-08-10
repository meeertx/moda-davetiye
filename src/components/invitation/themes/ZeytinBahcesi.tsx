"use client";

import { useCountdown } from "../useCountdown";
import RsvpBlock from "../RsvpBlock";
import GuestPhotoBlock from "../GuestPhotoBlock";
import OpeningGate from "../OpeningGate";
// MenuCard/ExtraInfoCard/ProgramTimeline alınmadı: hepsi kendi
// çerçevesini çiziyor, bu tema ise içeriği etiket/içerik ızgarasında
// çerçevesiz sunuyor. Aynı veri, temanın kendi diliyle yazıldı.
import { EventActions, ParentsLine, VenueMap } from "../Sections";
import { EVENT_HEADINGS, type ThemeProps } from "@/types/invitation";

/**
 * Zeytin Bahçesi — Ege esintili nişan daveti.
 *
 * YAPI KARARI: açık zeminli ikinci tema ama Kalp Çizgisi'nin tam zıddı
 * kurgusu var. Orada her şey ortalanmış ve boşluk hakim; burada içerik
 * ETİKET/İÇERİK ikili ızgarasında akıyor (solda küçük etiket, sağda
 * içerik) — bir bahçe defteri düzeni. Köşelerde zeytin dalı süslemeleri.
 */

const linen = "#f7f3ea";
const linenDeep = "#efe9dc";
const olive = "#5d6b4a";
const oliveDeep = "#3b452f";
const bark = "#2f2a22";

/** Zeytin dalı — kapıya da geçtiği için renk sabitten. */
function OliveBranch({
  size = 44,
  flip = false,
}: {
  size?: number;
  flip?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 64 40"
      fill="none"
      stroke={olive}
      strokeWidth="1.1"
      strokeLinecap="round"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M2 34C14 30 30 22 44 8" />
      {[
        [16, 27],
        [26, 21],
        [36, 14],
        [45, 8],
      ].map(([x, y], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y - 5}
          rx="5"
          ry="3"
          transform={`rotate(-32 ${x} ${y - 5})`}
          fill={olive}
          fillOpacity="0.18"
        />
      ))}
    </svg>
  );
}

/**
 * Sol etiket + sağ içerik ızgarası — temanın okuma ritmi.
 *
 * Etiketin altına küçük bir zeytin dalı giriyor: bölümler önceden
 * yalnızca ince bir çizgiyle ayrılıyordu ve sayfa bir defter kadar
 * çıplak duruyordu. Dal, bezemeyi açılış ekranından gövdeye taşıyor.
 */
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-10 gap-y-4 py-14 border-t"
      style={{ borderColor: `${olive}2e` }}
    >
      <div className="pt-1.5">
        <h2
          className="text-[11px] tracking-[0.24em] uppercase m-0"
          style={{ color: olive }}
        >
          {label}
        </h2>
        <div aria-hidden="true" className="mt-4 hidden sm:block opacity-70">
          <OliveBranch size={58} />
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}

export default function ZeytinBahcesi({ content, preview }: ThemeProps) {
  const countdown = useCountdown(content.eventAt);

  const fmt = (o: Intl.DateTimeFormatOptions) =>
    content.eventAt
      ? new Intl.DateTimeFormat("tr-TR", o).format(new Date(content.eventAt))
      : null;

  const col = "w-full max-w-[860px] mx-auto px-6 sm:px-10";

  return (
    <OpeningGate
      content={content}
      palette={{
        base: linen,
        overlay: `radial-gradient(90% 60% at 50% 15%, ${linenDeep} 0%, transparent 70%)`,
        foreground: bark,
        accent: olive,
        onAccent: linen,
        // Keten dokulu, zeytin yeşili mühürlü kraft zarf.
        envelope: {
          paper: "#e7dfcd",
          paperShade: "#ddd3bd",
          card: "#f9f6ee",
          seal: "#5d6b4a",
          sealInk: "#eef0e4",
          accent: "#7b8a63",
          ink: "#2f2a22",
        },
      }}
      ornament={<OliveBranch size={54} />}
    >
      <div
        className="min-h-screen font-body"
        style={{ background: linen, color: bark }}
      >
        {/* AÇILIŞ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
          <div aria-hidden="true" className="absolute top-10 left-8 opacity-70">
            <OliveBranch size={90} />
          </div>
          <div
            aria-hidden="true"
            className="absolute bottom-10 right-8 opacity-70"
          >
            <OliveBranch size={90} flip />
          </div>

          <div className="relative">
            <p
              className="text-[10.5px] tracking-[0.42em] uppercase m-0 mb-8"
              style={{ color: olive }}
            >
              {EVENT_HEADINGS[content.eventType]}
            </p>

            <h1 className="font-display font-medium m-0 leading-[1] text-[clamp(2.8rem,11vw,5.4rem)]">
              {content.brideName}
              <span
                className="block text-[clamp(1.1rem,3vw,1.5rem)] italic my-3"
                style={{ color: olive }}
              >
                ve
              </span>
              {content.groomName}
            </h1>

            <ParentsLine content={content} tone="light" className="mt-10" />

            {fmt({ day: "numeric", month: "long", year: "numeric" }) && (
              <p className="mt-10 text-[15px] tracking-[0.16em] uppercase m-0">
                {fmt({ day: "numeric", month: "long", year: "numeric" })}
                {fmt({ hour: "2-digit", minute: "2-digit" }) && (
                  <span style={{ color: olive }}>
                    {" · "}
                    {fmt({ hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </p>
            )}

            {countdown && !countdown.past && (
              <p
                className="mt-6 text-[14px] m-0"
                style={{ color: oliveDeep }}
              >
                {countdown.days} gün {countdown.hours} saat kaldı
              </p>
            )}
          </div>
        </section>

        {/* İÇERİK — etiket/içerik ızgarası */}
        <div className={`${col} pb-24`}>
          {content.story && (
            <Row label="Hikayemiz">
              <p className="font-display text-[clamp(1.2rem,3.4vw,1.55rem)] leading-[1.7] m-0 whitespace-pre-line">
                {content.story}
              </p>
            </Row>
          )}

          {content.program.length > 0 && (
            <Row label="Program">
              <ol className="list-none p-0 m-0 flex flex-col gap-4">
                {content.program.map((p, i) => (
                  <li
                    key={`${p.time}-${i}`}
                    className="flex gap-5 items-baseline"
                  >
                    <span
                      className="font-display text-lg tabular-nums w-16 shrink-0"
                      style={{ color: oliveDeep }}
                    >
                      {p.time}
                    </span>
                    <span className="text-[15px]">{p.title}</span>
                  </li>
                ))}
              </ol>
            </Row>
          )}

          {content.photoUrls.length > 0 && (
            <Row label="Fotoğraflar">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {content.photoUrls.map((url, i) => (
                  <div
                    key={url}
                    className="relative aspect-[4/5] overflow-hidden rounded-[3px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${content.brideName} ve ${content.groomName} — fotoğraf ${i + 1}`}
                      loading={i < 3 ? "eager" : "lazy"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </Row>
          )}

          {(content.venueName || content.venueAddress) && (
            <Row label="Konum">
              {content.venueName && (
                <p className="font-display text-[24px] m-0 mb-2">
                  {content.venueName}
                </p>
              )}
              {content.venueAddress && (
                <p className="text-[15px] leading-[1.7] m-0 opacity-70">
                  {content.venueAddress}
                </p>
              )}
              <VenueMap content={content} tone="light" className="mt-6" />
              <EventActions content={content} tone="light" className="mt-5" />
            </Row>
          )}

          {content.menu.length > 0 && (
            <Row label="Menü">
              {/* Kart çerçevesi bu temanın ızgarasıyla çakışıyordu:
                  satırlar zaten `Row` içinde etiketlenmiş durumda. */}
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {content.menu.map((item, i) => (
                  <li
                    key={`${item}-${i}`}
                    className="font-display text-[17px] leading-snug"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Row>
          )}

          {content.extraInfo && (
            <Row label="Ek Bilgiler">
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {content.extraInfo
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line, i) => (
                    <li
                      key={`${line}-${i}`}
                      className="text-[15px] leading-[1.7] opacity-75"
                    >
                      {line}
                    </li>
                  ))}
              </ul>
            </Row>
          )}

          {content.rsvp.enabled && (
            <Row label="Katılım">
              <RsvpBlock content={content} tone="light" preview={preview} />
            </Row>
          )}

          {content.guestPhotosEnabled && (
            <Row label="Anı Bırakın">
              <GuestPhotoBlock
                content={content}
                tone="light"
                preview={preview}
              />
            </Row>
          )}

          {(content.giftNote || content.giftIban) && (
            <Row label="Hediye">
              {content.giftNote && (
                <p className="font-display text-lg leading-[1.6] m-0">
                  {content.giftNote}
                </p>
              )}
              {content.giftIban && (
                <p
                  className="mt-4 text-[15px] tracking-[0.06em] tabular-nums m-0 break-all"
                  style={{ color: oliveDeep }}
                >
                  {content.giftIban}
                </p>
              )}
            </Row>
          )}

          <footer
            className="pt-12 border-t flex flex-wrap items-center justify-between gap-4"
            style={{ borderColor: `${olive}2e` }}
          >
            <p className="font-display text-lg m-0">
              {content.brideName} ve {content.groomName}
            </p>
            <OliveBranch size={40} />
          </footer>
        </div>
      </div>
    </OpeningGate>
  );
}
