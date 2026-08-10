"use client";

import RsvpBlock from "../RsvpBlock";
import GuestPhotoBlock from "../GuestPhotoBlock";
import OpeningGate from "../OpeningGate";
import { BotanicalDivider, BotanicalFrame, BotanicalSprig } from "../Botanical";
import {
  CountdownBoxes,
  EventActions,
  ExtraInfoCard,
  MenuCard,
  ParentsLine,
  ProgramTimeline,
  VenueMap,
} from "../Sections";
import { EVENT_HEADINGS, type ThemeProps } from "@/types/invitation";

/**
 * Belle Époque — vintage zarafet, ipek dokulu koyu zemin, yaldız hat.
 *
 * Tasarım kararları:
 *  · Açılış mühürlü bir zarf: davetiyeyi açma jesti ekrana taşınıyor.
 *  · İsimler kaligrafi, geri kalan her şey ince ve büyük harf aralıklı —
 *    kontrast tipografiden gelir, kutulardan değil.
 *  · Botanik çerçeve sayfayı sarar; bölümler yaldız ayraçlarla ayrılır.
 *  · Tek yetkilendirilmiş hareket: açılış sahnesi. Kaydırma boyunca
 *    ek efekt yok.
 */

const gold = "#c8a24c";
const ink = "#141010";
const inkSoft = "#1c1614";
const paper = "#efe7dc";

/**
 * Yaldız ayraç.
 *
 * Renkler `var(--gold)` yerine doğrudan sabitten geliyor: bu süsleme
 * açılış kapısına da geçiriliyor ve kapı, değişkenin tanımlandığı tema
 * sarmalayıcısının DIŞINDA render oluyor — değişken orada çözülmüyordu.
 */
function Rule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3.5 ${className}`}>
      <span
        className="block h-px w-16"
        style={{ background: `linear-gradient(90deg, transparent, ${gold}99)` }}
      />
      <svg width="11" height="11" viewBox="0 0 8 8" aria-hidden="true">
        <path d="M4 0l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill={gold} opacity="0.9" />
      </svg>
      <span
        className="block h-px w-16"
        style={{ background: `linear-gradient(270deg, transparent, ${gold}99)` }}
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-10">
      <BotanicalSprig className="w-24 h-auto mx-auto mb-5 text-[var(--gold)]/45" />
      <h2 className="text-[12px] tracking-[0.3em] uppercase text-[var(--gold)] m-0">
        {children}
      </h2>
    </div>
  );
}

/** Aynı zemini paylaşan iki bölüm arasına giren botanik ayraç. */
function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`px-6 pb-24 flex justify-center ${className}`}>
      <BotanicalDivider className="w-[min(78vw,260px)] h-auto text-[var(--gold)]/30" />
    </div>
  );
}

/**
 * Bir ton açık zemin şeridi.
 *
 * Davetiyenin ritmi buradan geliyor: her bölümü botanik ayraçla ayırmak
 * yerine ilişkili bölümler bir şeritte toplanıyor, şeritler de zemin
 * değişimiyle birbirinden ayrılıyor. Ayraçlar böylece tekrar eden bir
 * süs olmaktan çıkıp şerit İÇİNDEKİ geçişleri işaret ediyor.
 */
function Band({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="py-24 border-y border-[var(--gold)]/15"
      style={{ background: inkSoft }}
    >
      {children}
    </section>
  );
}

export default function BelleEpoque({ content, preview }: ThemeProps) {
  const dateLabel = content.eventAt
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(content.eventAt))
    : null;

  const timeLabel = content.eventAt
    ? new Intl.DateTimeFormat("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(content.eventAt))
    : null;

  const hasMenuOrInfo = content.menu.length > 0 || Boolean(content.extraInfo);

  return (
    <OpeningGate
      content={content}
      palette={{
        base: ink,
        overlay: `radial-gradient(120% 80% at 50% 30%, rgba(200,162,76,0.14) 0%, transparent 62%)`,
        foreground: paper,
        accent: gold,
        onAccent: ink,
        // Zarf koyu değil FİLDİŞİ: koyu ipek zemininde koyu bir zarf
        // silik bir dikdörtgene dönüşüyordu. Açık kâğıt hem gerçek bir
        // davetiye zarfının rengi hem de mum mührünü öne çıkarıyor.
        envelope: {
          paper: "#ece2d1",
          paperShade: "#e3d7c2",
          card: "#fbf6ec",
          seal: "#8f2f2a",
          sealInk: "#f6e3b8",
          accent: "#a8823a",
          ink: "#2a211c",
        },
      }}
      ornament={<Rule />}
    >
      <div
        style={
          {
            "--gold": gold,
            "--ink": ink,
            background: ink,
          } as React.CSSProperties
        }
        className="min-h-screen text-[#efe7dc] font-body selection:bg-[var(--gold)] selection:text-[var(--ink)]"
      >
        {/* ================= AÇILIŞ ================= */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
          {/* İpek dokusu — çok düşük kontrastlı diyagonal tarama */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.5]"
            style={{
              background:
                "repeating-linear-gradient(135deg, rgba(255,255,255,0.018) 0 2px, transparent 2px 7px)",
            }}
          />
          {/* Zeminde sıcak bir ışık havuzu */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 75% at 50% 22%, rgba(200,162,76,0.16) 0%, transparent 62%)",
            }}
          />

          {/* Botanik çerçeve içeriği SARAR — ekran kenarına değil metnin
              etrafına oturur, yoksa geniş ekranda dört ayrı süs gibi durur */}
          <div className="relative w-full max-w-[820px] px-4 sm:px-14 py-10 sm:py-16">
            <BotanicalFrame className="text-[var(--gold)]" opacity={0.42} />

            {/* İçerik `relative`: konumlandırılmış çerçeve aksi hâlde
                metnin üzerine boyanır */}
            <div className="relative">
            <p
              className="text-[11px] sm:text-[12px] tracking-[0.4em] uppercase text-[var(--gold)] m-0 mb-10"
              style={{ animation: "fadeUp 1s ease 0.05s both" }}
            >
              {EVENT_HEADINGS[content.eventType]}
            </p>

            <h1
              className="font-script font-normal m-0 leading-[1.02]"
              style={{ animation: "fadeUp 1.1s ease 0.2s both" }}
            >
              <span className="block text-[clamp(3.2rem,15vw,7rem)]">
                {content.brideName}
              </span>
              <span className="block text-[clamp(1.5rem,5vw,2.2rem)] text-[var(--gold)] my-1 sm:my-2">
                &amp;
              </span>
              <span className="block text-[clamp(3.2rem,15vw,7rem)]">
                {content.groomName}
              </span>
            </h1>

            <Rule className="mt-11 mb-9" />

            <ParentsLine
              content={content}
              tone="dark"
              className="mb-9"
            />

            {dateLabel && (
              <p
                className="text-[15px] sm:text-base tracking-[0.16em] uppercase m-0 text-[#efe7dc]/85"
                style={{ animation: "fadeUp 1.1s ease 0.45s both" }}
              >
                {dateLabel}
                {timeLabel && <span className="mx-3 text-[var(--gold)]">·</span>}
                {timeLabel}
              </p>
            )}

            {content.venueName && (
              <p
                className="text-[13px] tracking-[0.1em] uppercase m-0 mt-4 text-[#efe7dc]/55"
                style={{ animation: "fadeUp 1.1s ease 0.55s both" }}
              >
                {content.venueName}
              </p>
            )}
            </div>
          </div>
        </section>

        {/* ================= GERİ SAYIM ================= */}
        {content.eventAt && (
          <Band>
            <CountdownBoxes
              eventAt={content.eventAt}
              tone="dark"
              className="max-w-[620px] mx-auto"
            />
          </Band>
        )}

        {/* ================= HİKAYE + GALERİ =================
            İkisi aynı zeminde; aralarında botanik ayraç var. */}
        {(content.story || content.photoUrls.length > 0) && (
          <div className="pt-24">
            {content.story && (
              <section className="px-6 pb-24">
                <div className="max-w-[620px] mx-auto text-center">
                  <SectionTitle>Hikayemiz</SectionTitle>
                  <p className="font-display italic text-[clamp(1.25rem,4.2vw,1.6rem)] leading-[1.65] m-0 text-[#efe7dc]/90 whitespace-pre-line">
                    {content.story}
                  </p>
                </div>
              </section>
            )}

            {content.story && content.photoUrls.length > 0 && <Divider />}

            {content.photoUrls.length > 0 && (
              <section className="px-6 pb-24">
                <div className="max-w-[900px] mx-auto">
                  <SectionTitle>Fotoğraflar</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {content.photoUrls.map((url, i) => (
                      <div
                        key={url}
                        className="relative aspect-[4/5] overflow-hidden rounded-[2px] ring-1 ring-[var(--gold)]/20"
                      >
                        {/* Supabase imzalı adres, kısa ömürlü — next/image ile
                            önbelleklemek anlamsız olurdu */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`${content.brideName} & ${content.groomName} — fotoğraf ${i + 1}`}
                          loading={i < 3 ? "eager" : "lazy"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ================= KONUM + PROGRAM =================
            "Nerede" ve "ne zaman ne olacak" aynı soruya cevap veriyor;
            tek bir şeritte birlikte duruyorlar. */}
        {(content.venueName ||
          content.venueAddress ||
          content.program.length > 0) && (
          <Band>
            {(content.venueName || content.venueAddress) && (
              <section className="px-6">
                <div className="max-w-[640px] mx-auto text-center">
                  <SectionTitle>Konum</SectionTitle>
                  {content.venueName && (
                    <p className="font-display text-[26px] m-0 mb-3">
                      {content.venueName}
                    </p>
                  )}
                  {content.venueAddress && (
                    <p className="text-[15px] leading-[1.7] m-0 mb-9 text-[#efe7dc]/70">
                      {content.venueAddress}
                    </p>
                  )}

                  <VenueMap content={content} tone="dark" />

                  <EventActions
                    content={content}
                    tone="dark"
                    className="justify-center mt-8"
                  />
                </div>
              </section>
            )}

            {(content.venueName || content.venueAddress) &&
              content.program.length > 0 && <Divider className="pt-24" />}

            {content.program.length > 0 && (
              <section className="px-6">
                <div className="max-w-[520px] mx-auto">
                  <SectionTitle>Program</SectionTitle>
                  <ProgramTimeline program={content.program} tone="dark" />
                </div>
              </section>
            )}
          </Band>
        )}

        {/* ================= MENÜ + EK BİLGİLER =================
            İkisi de varsa yan yana, biri varsa tam genişlikte. */}
        {hasMenuOrInfo && (
          <section className="px-6 py-24">
            <div
              className={`mx-auto grid gap-5 ${
                content.menu.length && content.extraInfo
                  ? "max-w-[900px] md:grid-cols-2"
                  : "max-w-[520px]"
              }`}
            >
              <MenuCard menu={content.menu} tone="dark" />
              <ExtraInfoCard text={content.extraInfo} tone="dark" />
            </div>
          </section>
        )}

        {/* ================= RSVP + ANI BIRAKIN =================
            İkisi de misafirden bir şey isteyen bölümler; birlikte
            duruyorlar ki davetiye "önce oku, sonra yanıtla" ritmini
            korusun. */}
        {(content.rsvp.enabled || content.guestPhotosEnabled) && (
          <Band>
            {content.rsvp.enabled && (
              <section className="px-6">
                <div className="max-w-[460px] mx-auto">
                  <SectionTitle>Katılım Bildirimi</SectionTitle>
                  <p className="text-center text-[15px] leading-[1.7] m-0 mb-10 text-[#efe7dc]/70">
                    Bu güzel günde yanımızda olacak mısınız?
                  </p>
                  <RsvpBlock content={content} tone="dark" preview={preview} />
                </div>
              </section>
            )}

            {content.rsvp.enabled && content.guestPhotosEnabled && (
              <Divider className="pt-24" />
            )}

            {content.guestPhotosEnabled && (
              <section className="px-6">
                <div className="max-w-[560px] mx-auto">
                  <SectionTitle>Anı Bırakın</SectionTitle>
                  <p className="text-center text-[15px] leading-[1.7] m-0 mb-10 text-[#efe7dc]/70">
                    Çektiğiniz kareleri bizimle paylaşın — bu günü sizin
                    gözünüzden de görelim.
                  </p>
                  <GuestPhotoBlock
                    content={content}
                    tone="dark"
                    preview={preview}
                  />
                </div>
              </section>
            )}
          </Band>
        )}

        {/* ================= HEDİYE ================= */}
        {(content.giftNote || content.giftIban) && (
          <section className="px-6 py-24">
            <div className="max-w-[520px] mx-auto text-center">
              <SectionTitle>Hediye</SectionTitle>
              {content.giftNote && (
                <p className="font-display italic text-xl leading-[1.6] m-0 text-[#efe7dc]/85">
                  {content.giftNote}
                </p>
              )}
              {content.giftIban && (
                <p className="mt-6 text-[15px] tracking-[0.08em] tabular-nums m-0 text-[var(--gold)] break-all">
                  {content.giftIban}
                </p>
              )}
            </div>
          </section>
        )}

        <footer className="relative px-6 pt-6 pb-20 text-center overflow-hidden">
          <BotanicalDivider className="w-[min(78vw,300px)] h-auto mx-auto mb-9 text-[var(--gold)]/35" />
          <p className="font-script text-[clamp(2rem,8vw,3rem)] leading-none m-0 text-[#efe7dc]/85">
            {content.brideName} &amp; {content.groomName}
          </p>
          {content.musicTitle && (
            <p className="text-[11px] tracking-[0.14em] uppercase m-0 mt-6 text-[var(--gold)]/60">
              ♪ {content.musicTitle}
            </p>
          )}
        </footer>
      </div>
    </OpeningGate>
  );
}
