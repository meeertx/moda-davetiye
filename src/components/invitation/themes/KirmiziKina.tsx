"use client";

import { useCountdown } from "../useCountdown";
import RsvpBlock from "../RsvpBlock";
import GuestPhotoBlock from "../GuestPhotoBlock";
import OpeningGate from "../OpeningGate";
import {
  EventActions,
  ExtraInfoCard,
  MenuCard,
  ParentsLine,
  VenueMap,
} from "../Sections";
import { EVENT_HEADINGS, type ThemeProps } from "@/types/invitation";

/**
 * Kırmızı Kına — geleneksel kına gecesi.
 *
 * YAPI KARARI: Belle Époque ortalanmış, sessiz ve dikey bir davet kartı.
 * Bu tema bilerek onun yapısal zıttı:
 *  · içerik SOLA hizalı, sağda sabit bir motif rayı akıyor
 *  · başlıklar ortada değil, kenarda ve numaralı
 *  · geri sayım dört kutu değil, tek satırlık bir cümle
 *  · program dikey liste değil, YATAY zaman çizelgesi
 *  · bölümler dönüşümlü zeminlerle bantlanıyor
 *
 * Aynı içerik, tamamen başka bir okuma ritmi.
 */

const crimson = "#5c1220";
const crimsonDeep = "#33070f";
const crimsonBand = "#460d19";
const goldLeaf = "#e0b464";
const cream = "#f8ece0";

/** Sekizgen kına motifi. */
function Motif({ size = 26, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={goldLeaf}
      strokeWidth="0.9"
      opacity={opacity}
      aria-hidden="true"
    >
      <path d="M16 2l4.5 4.5H27l-4.5 4.5V16l4.5 4.5H20.5L16 25l-4.5-4.5H5l4.5-4.5V11L5 6.5h6.5z" />
      <circle cx="16" cy="13.5" r="3.4" />
    </svg>
  );
}

/** Sağ kenarda dikey akan motif rayı — sayfanın imzası. */
function SideRail() {
  return (
    <div
      aria-hidden="true"
      className="hidden lg:flex fixed top-0 right-0 h-screen w-16 flex-col items-center justify-center gap-8 pointer-events-none"
      style={{ borderLeft: `1px solid ${goldLeaf}22` }}
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <Motif key={i} size={16} opacity={0.28} />
      ))}
    </div>
  );
}

/** Sola hizalı, numaralı bölüm başlığı. */
function SectionHead({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 mb-8">
      <span
        className="font-display text-[15px] tabular-nums"
        style={{ color: `${goldLeaf}99` }}
      >
        {n}
      </span>
      <h2
        className="text-[12px] tracking-[0.3em] uppercase m-0"
        style={{ color: goldLeaf }}
      >
        {children}
      </h2>
      <span
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, ${goldLeaf}55, transparent)` }}
      />
    </div>
  );
}

export default function KirmiziKina({ content, preview }: ThemeProps) {
  const countdown = useCountdown(content.eventAt);

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

  /*
    İçerik sütunu.

    Önceden `ml-auto lg:mr-24` idi — niyet sağdaki motif rayına yer
    bırakmaktı ama sonuç sütunun tamamen ekranın sağına yapışması,
    solda kocaman boş bir alan kalmasıydı. Ray zaten `fixed w-16`;
    ortalanmış bir sütunla çakışmıyor. Metnin SOLA hizalı olması
    temanın kimliği, sütunun sağa kaçması değildi.
  */
  const col = "w-full max-w-[820px] mx-auto px-6 sm:px-10";

  /*
    Bölüm numaraları bu temanın ana grafik öğesi, dolayısıyla ARALIKSIZ
    olmalı. Sabit yazıldığında koşullu bölümler atlanınca "01, 03, 06"
    gibi boşluklu bir sıra çıkıyordu; numara artık görünen bölümlerin
    listesinden türetiliyor.
  */
  const shown = [
    content.story && "story",
    content.program.length > 0 && "program",
    content.photoUrls.length > 0 && "photos",
    (content.venueName || content.venueAddress) && "venue",
    content.menu.length > 0 && "menu",
    content.extraInfo && "info",
    content.rsvp.enabled && "rsvp",
    content.guestPhotosEnabled && "memories",
    (content.giftNote || content.giftIban) && "gift",
  ].filter(Boolean) as string[];

  const num = (key: string) =>
    String(shown.indexOf(key) + 1).padStart(2, "0");

  /*
    Bölüm zeminleri de aynı listeden türetiliyor.

    Sabit yazıldığında (bir bölüm `crimsonBand`, sonraki düz) koşullu
    bölümler gizlenince iki AYNI renkli bölüm yan yana geliyordu; aradaki
    192px'lik boşluk band geçişi olmadan çıplak bir boşluğa dönüşüyordu.
    Sıraya göre hesaplanınca dönüşüm her koşulda korunuyor.
  */
  const bandStyle = (key: string) =>
    shown.indexOf(key) % 2 === 0
      ? undefined
      : { background: crimsonBand };

  return (
    <OpeningGate
      content={content}
      palette={{
        base: crimsonDeep,
        overlay: `linear-gradient(160deg, ${crimson} 0%, transparent 100%)`,
        foreground: cream,
        accent: goldLeaf,
        onAccent: crimsonDeep,
        // Şampanya kâğıt, bordo mum mührü. Bordo zarf denendi ama
        // bordo zeminde kayboluyordu — kapı zemini koyu olduğu için
        // kâğıdın açık olması şart.
        envelope: {
          paper: "#e9d6b2",
          paperShade: "#ddc79c",
          card: "#fdf7ec",
          seal: "#7d1526",
          sealInk: "#f0d49a",
          accent: "#a8823a",
          ink: "#33070f",
        },
      }}
      ornament={<Motif size={30} />}
    >
      <div
        className="min-h-screen font-body"
        style={{ background: crimsonDeep, color: cream }}
      >
        <SideRail />

        {/* AÇILIŞ — sola hizalı, asimetrik */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `radial-gradient(80% 60% at 18% 40%, ${crimson} 0%, transparent 70%)`,
            }}
          />
          <div className={`relative ${col} py-24`}>
            <div className="mb-10">
              <Motif size={34} />
            </div>

            <p
              className="text-[11px] tracking-[0.42em] uppercase m-0 mb-7"
              style={{ color: goldLeaf }}
            >
              {EVENT_HEADINGS[content.eventType]}
            </p>

            {/* İsimler alt alta ve sola dayalı — Belle Époque'ta ortalıydı */}
            <h1 className="font-display font-semibold m-0 leading-[0.92] text-[clamp(3rem,12vw,6.5rem)]">
              <span className="block">{content.brideName}</span>
              <span
                className="block text-[clamp(1rem,3vw,1.4rem)] font-normal my-4 tracking-[0.3em] uppercase"
                style={{ color: goldLeaf }}
              >
                ile
              </span>
              <span className="block">{content.groomName}</span>
            </h1>

            {/* Aileler — temanın sola dayalı düzenine uyar */}
            <ParentsLine content={content} tone="dark" align="start" className="mt-10" />

            {dateLabel && (
              <div
                className="mt-12 pt-7 flex flex-wrap items-baseline gap-x-6 gap-y-2"
                style={{ borderTop: `1px solid ${goldLeaf}33` }}
              >
                <span className="text-[17px] tracking-[0.08em]">
                  {dateLabel}
                </span>
                {timeLabel && (
                  <span
                    className="text-[15px] tracking-[0.14em]"
                    style={{ color: goldLeaf }}
                  >
                    {timeLabel}
                  </span>
                )}
                {content.venueName && (
                  <span className="text-[14px] opacity-65">
                    {content.venueName}
                  </span>
                )}
              </div>
            )}

            {/* Geri sayım: dört kutu değil, tek cümle */}
            {countdown && !countdown.past && (
              <p className="mt-8 text-[15px] m-0 opacity-80">
                <span
                  className="font-display text-[30px] tabular-nums align-baseline"
                  style={{ color: goldLeaf }}
                >
                  {countdown.days}
                </span>{" "}
                gün{" "}
                <span
                  className="font-display text-[30px] tabular-nums align-baseline"
                  style={{ color: goldLeaf }}
                >
                  {countdown.hours}
                </span>{" "}
                saat kaldı
              </p>
            )}
            {countdown?.past && (
              <p
                className="mt-8 font-display text-2xl m-0"
                style={{ color: goldLeaf }}
              >
                Kınamız kutlu olsun.
              </p>
            )}
          </div>
        </section>

        {/* HİKAYE — bantlı zemin */}
        {content.story && (
          <section className="py-20" style={bandStyle("story")}>
            <div className={col}>
              <SectionHead n={num("story")}>Hikayemiz</SectionHead>
              <p className="font-display text-[clamp(1.3rem,4vw,1.75rem)] leading-[1.6] m-0 max-w-[620px] whitespace-pre-line">
                {content.story}
              </p>
            </div>
          </section>
        )}

        {/* PROGRAM — yatay zaman çizelgesi */}
        {content.program.length > 0 && (
          <section className="py-20" style={bandStyle("program")}>
            <div className={col}>
              <SectionHead n={num("program")}>Program</SectionHead>
              <ol className="list-none p-0 m-0 flex gap-0 overflow-x-auto pb-2">
                {content.program.map((p, i) => (
                  <li
                    key={`${p.time}-${i}`}
                    className="min-w-[170px] flex-1 pr-6 relative"
                  >
                    {/* Zaman çizgisi ve düğüm noktası */}
                    <div className="flex items-center mb-5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: goldLeaf }}
                      />
                      <span
                        className="h-px flex-1"
                        style={{
                          background:
                            i === content.program.length - 1
                              ? "transparent"
                              : `${goldLeaf}44`,
                        }}
                      />
                    </div>
                    <div
                      className="font-display text-[26px] tabular-nums leading-none mb-2"
                      style={{ color: goldLeaf }}
                    >
                      {p.time}
                    </div>
                    <div className="text-[15px] leading-[1.5] pr-3">
                      {p.title}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* GALERİ — bantlı zemin, düzensiz ızgara */}
        {content.photoUrls.length > 0 && (
          <section className="py-20" style={bandStyle("photos")}>
            <div className={col}>
              <SectionHead n={num("photos")}>Fotoğraflar</SectionHead>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {content.photoUrls.map((url, i) => (
                  <div
                    key={url}
                    className={`relative overflow-hidden rounded-[2px] ${
                      i % 5 === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[3/4]"
                    }`}
                    style={{ border: `1px solid ${goldLeaf}33` }}
                  >
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

        {/* KONUM — iki sütun, sola hizalı */}
        {(content.venueName || content.venueAddress) && (
          <section className="py-20" style={bandStyle("venue")}>
            <div className={col}>
              <SectionHead n={num("venue")}>Konum</SectionHead>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 items-end">
                <div>
                  {content.venueName && (
                    <p className="font-display text-[30px] m-0 mb-2">
                      {content.venueName}
                    </p>
                  )}
                  {content.venueAddress && (
                    <p className="text-[15px] leading-[1.7] m-0 opacity-70 max-w-[420px]">
                      {content.venueAddress}
                    </p>
                  )}
                </div>
                <EventActions
                  content={content}
                  tone="dark"
                  className="justify-self-start sm:justify-self-end"
                />
              </div>

              <VenueMap content={content} tone="dark" className="mt-10" />
            </div>
          </section>
        )}

        {/* MENÜ — bantlı zemin */}
        {content.menu.length > 0 && (
          <section className="py-20" style={bandStyle("menu")}>
            <div className={col}>
              <SectionHead n={num("menu")}>Menü</SectionHead>
              <MenuCard menu={content.menu} tone="dark" showTitle={false} />
            </div>
          </section>
        )}

        {/* EK BİLGİLER */}
        {content.extraInfo && (
          <section className="py-20" style={bandStyle("info")}>
            <div className={col}>
              <SectionHead n={num("info")}>Ek Bilgiler</SectionHead>
              <ExtraInfoCard text={content.extraInfo} tone="dark" showTitle={false} />
            </div>
          </section>
        )}

        {/* RSVP — bantlı zemin */}
        {content.rsvp.enabled && (
          <section className="py-20" style={bandStyle("rsvp")}>
            <div className={col}>
              <SectionHead n={num("rsvp")}>Katılım Bildirimi</SectionHead>
              <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1fr] gap-12 items-start">
                {/* Sol sütun formla aynı yükseklikte kalsın diye yalnızca
                    başlık değil, misafirin ihtiyaç duyduğu bilgiler de burada */}
                <div className="lg:sticky lg:top-16">
                  <p className="font-display text-[clamp(1.4rem,4vw,1.9rem)] leading-[1.45] m-0">
                    Kınamıza bekliyoruz.
                    <br />
                    <span style={{ color: goldLeaf }}>
                      Bize haber verir misiniz?
                    </span>
                  </p>

                  <dl className="mt-8 m-0 flex flex-col gap-4">
                    {dateLabel && (
                      <div>
                        <dt className="text-[11px] tracking-[0.16em] uppercase opacity-45 m-0">
                          Tarih
                        </dt>
                        <dd className="text-[15px] m-0 mt-1">
                          {dateLabel}
                          {timeLabel && ` · ${timeLabel}`}
                        </dd>
                      </div>
                    )}
                    {content.venueName && (
                      <div>
                        <dt className="text-[11px] tracking-[0.16em] uppercase opacity-45 m-0">
                          Yer
                        </dt>
                        <dd className="text-[15px] m-0 mt-1">
                          {content.venueName}
                        </dd>
                      </div>
                    )}
                    {content.rsvp.deadline && (
                      <div>
                        <dt className="text-[11px] tracking-[0.16em] uppercase opacity-45 m-0">
                          Son Yanıt Tarihi
                        </dt>
                        <dd className="text-[15px] m-0 mt-1">
                          {new Intl.DateTimeFormat("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }).format(new Date(content.rsvp.deadline))}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <RsvpBlock content={content} tone="dark" preview={preview} />
              </div>
            </div>
          </section>
        )}

        {/* ANI BIRAKIN */}
        {content.guestPhotosEnabled && (
          <section className="py-20" style={bandStyle("memories")}>
            <div className={col}>
              <SectionHead n={num("memories")}>Anı Bırakın</SectionHead>
              <p className="text-[15px] leading-[1.7] m-0 mb-9 max-w-[560px] opacity-75">
                Çektiğiniz kareleri bizimle paylaşın — bu geceyi sizin
                gözünüzden de görelim.
              </p>
              <div className="max-w-[560px]">
                <GuestPhotoBlock
                  content={content}
                  tone="dark"
                  preview={preview}
                />
              </div>
            </div>
          </section>
        )}

        {/* HEDİYE */}
        {(content.giftNote || content.giftIban) && (
          <section className="py-20" style={bandStyle("gift")}>
            <div className={col}>
              <SectionHead n={num("gift")}>Hediye</SectionHead>
              {content.giftNote && (
                <p className="font-display text-[22px] leading-[1.6] m-0 max-w-[520px]">
                  {content.giftNote}
                </p>
              )}
              {content.giftIban && (
                <p
                  className="mt-5 text-[15px] tracking-[0.08em] tabular-nums m-0 break-all"
                  style={{ color: goldLeaf }}
                >
                  {content.giftIban}
                </p>
              )}
            </div>
          </section>
        )}

        <footer
          className="py-16"
          style={{ borderTop: `1px solid ${goldLeaf}22` }}
        >
          <div className={`${col} flex flex-wrap items-center justify-between gap-4`}>
            <p className="font-display text-xl m-0">
              {content.brideName} ile {content.groomName}
            </p>
            {content.musicTitle && (
              <p
                className="text-[11px] tracking-[0.14em] uppercase m-0 opacity-70"
                style={{ color: goldLeaf }}
              >
                ♪ {content.musicTitle}
              </p>
            )}
          </div>
        </footer>
      </div>
    </OpeningGate>
  );
}
