"use client";

import { useCountdown } from "../useCountdown";
import RsvpBlock from "../RsvpBlock";
import GuestPhotoBlock from "../GuestPhotoBlock";
import OpeningGate from "../OpeningGate";
import { SunlightAuraCanvas } from "../ThemeCanvases";
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
        className="relative min-h-screen font-body overflow-hidden"
        style={{ background: linen, color: bark }}
      >
        <SunlightAuraCanvas />

        {/* AÇILIŞ — Centered Mediterranean Parchment Card */}
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 py-24 overflow-hidden">
          <div className="relative w-full max-w-[720px] p-8 sm:p-16 rounded-3xl border-2 border-amber-600/40 bg-white/85 backdrop-blur-xl shadow-[0_20px_60px_rgba(78,90,56,0.2)] flex flex-col items-center">
            
            <div className="mb-6 animate-pulse">
              <OliveBranch size={64} />
            </div>

            <p
              className="text-xs tracking-[0.45em] uppercase m-0 mb-6 font-semibold"
              style={{ color: olive }}
            >
              🌿 {EVENT_HEADINGS[content.eventType]} 🌿
            </p>

            <h1 className="font-display font-medium m-0 leading-[1] text-[clamp(3.2rem,11vw,5.5rem)] text-zinc-900">
              {content.brideName}
              <span
                className="block text-2xl italic my-2 text-amber-700 font-script"
              >
                &amp;
              </span>
              {content.groomName}
            </h1>

            <ParentsLine content={content} tone="light" className="mt-8" />

            {fmt({ day: "numeric", month: "long", year: "numeric" }) && (
              <p
                className="mt-8 text-base sm:text-lg tracking-[0.2em] uppercase m-0 font-medium text-amber-900"
              >
                🗓️ {fmt({ day: "numeric", month: "long", year: "numeric" })}
                {fmt({ hour: "2-digit", minute: "2-digit" }) &&
                  ` · ⏰ ${fmt({ hour: "2-digit", minute: "2-digit" })}`}
              </p>
            )}

            {content.venueName && (
              <p className="mt-3 text-sm tracking-[0.14em] uppercase m-0 text-zinc-600 font-medium">
                📍 {content.venueName}
              </p>
            )}

            {countdown && !countdown.past && (
              <div className="mt-8 px-6 py-3 rounded-full bg-amber-50 border border-amber-600/30 shadow-sm text-sm" style={{ color: bark }}>
                <span className="font-display text-3xl font-bold text-amber-900 tabular-nums align-middle mr-2">
                  {countdown.days}
                </span>
                <span className="align-middle uppercase tracking-widest text-xs font-semibold text-amber-800">gün kaldı</span>
              </div>
            )}
          </div>
        </section>

        {/* İÇERİK — Fiziksel Cam Kartlar */}
        <div className="relative z-10 w-full max-w-[840px] mx-auto px-4 pb-24">
          {content.story && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-amber-600/30 shadow-[0_15px_45px_rgba(78,90,56,0.12)] mb-8">
              <Row label="Hikayemiz">
                <p className="font-display text-[clamp(1.2rem,3.4vw,1.55rem)] leading-[1.7] m-0 text-zinc-900 whitespace-pre-line">
                  {content.story}
                </p>
              </Row>
            </div>
          )}

          {content.program.length > 0 && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-amber-600/30 shadow-[0_15px_45px_rgba(78,90,56,0.12)] mb-8">
              <Row label="Program">
                <ol className="list-none p-0 m-0 flex flex-col gap-4">
                  {content.program.map((p, i) => (
                    <li
                      key={`${p.time}-${i}`}
                      className="flex gap-5 items-center p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/50"
                    >
                      <span
                        className="font-display text-xl font-bold tabular-nums w-20 shrink-0 text-amber-900"
                      >
                        {p.time}
                      </span>
                      <span className="text-sm font-semibold text-zinc-800">{p.title}</span>
                    </li>
                  ))}
                </ol>
              </Row>
            </div>
          )}

          {content.photoUrls.length > 0 && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-amber-600/30 shadow-[0_15px_45px_rgba(78,90,56,0.12)] mb-8">
              <Row label="Fotoğraflar">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {content.photoUrls.map((url, i) => (
                    <div
                      key={url}
                      className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-amber-200 shadow-md transform hover:scale-105 transition-transform duration-300"
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
            </div>
          )}

          {(content.venueName || content.venueAddress) && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-amber-600/30 shadow-[0_15px_45px_rgba(78,90,56,0.12)] mb-8">
              <Row label="Konum">
                {content.venueName && (
                  <p className="font-display text-2xl font-bold text-zinc-900 m-0 mb-2">
                    📍 {content.venueName}
                  </p>
                )}
                {content.venueAddress && (
                  <p className="text-sm leading-relaxed m-0 text-zinc-600 font-medium">
                    {content.venueAddress}
                  </p>
                )}
                <VenueMap content={content} tone="light" className="mt-6 rounded-2xl" />
                <EventActions content={content} tone="light" className="mt-5" />
              </Row>
            </div>
          )}

          {content.menu.length > 0 && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-amber-600/30 shadow-[0_15px_45px_rgba(78,90,56,0.12)] mb-8">
              <Row label="Menü">
                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {content.menu.map((item, i) => (
                    <li
                      key={`${item}-${i}`}
                      className="font-display text-lg font-medium text-zinc-800"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </Row>
            </div>
          )}

          {content.extraInfo && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-amber-600/30 shadow-[0_15px_45px_rgba(78,90,56,0.12)] mb-8">
              <Row label="Ek Bilgiler">
                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {content.extraInfo
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line, i) => (
                      <li
                        key={`${line}-${i}`}
                        className="text-sm leading-relaxed text-zinc-700 font-medium"
                      >
                        ✓ {line}
                      </li>
                    ))}
                </ul>
              </Row>
            </div>
          )}

          {content.rsvp.enabled && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-amber-600/30 shadow-[0_15px_45px_rgba(78,90,56,0.12)] mb-8">
              <Row label="Katılım">
                <RsvpBlock content={content} tone="light" preview={preview} />
              </Row>
            </div>
          )}

          {content.guestPhotosEnabled && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-amber-600/30 shadow-[0_15px_45px_rgba(78,90,56,0.12)] mb-8">
              <Row label="Anı Bırakın">
                <GuestPhotoBlock
                  content={content}
                  tone="light"
                  preview={preview}
                />
              </Row>
            </div>
          )}

          {(content.giftNote || content.giftIban) && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-amber-600/30 shadow-[0_15px_45px_rgba(78,90,56,0.12)] mb-8">
              <Row label="Hediye">
                {content.giftNote && (
                  <p className="font-display text-lg leading-relaxed m-0 text-zinc-800 italic">
                    {content.giftNote}
                  </p>
                )}
                {content.giftIban && (
                  <p
                    className="mt-4 text-sm tracking-wider font-mono tabular-nums m-0 break-all p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold"
                  >
                    {content.giftIban}
                  </p>
                )}
              </Row>
            </div>
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
