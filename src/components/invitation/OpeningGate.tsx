"use client";

import { useEffect, useRef, useState } from "react";
import type { InvitationContent } from "@/types/invitation";
import { EVENT_HEADINGS } from "@/types/invitation";
import Envelope, { type EnvelopePalette } from "./Envelope";

/**
 * Her temanın kendi rengine bürünebilmesi için açılış kapısının
 * ihtiyaç duyduğu asgari palet.
 */
export interface GatePalette {
  /**
   * Kapının OPAK taban rengi. Düz renk olmak zorunda — kapı arkasındaki
   * davetiyeyi tamamen örtmeli.
   *
   * (Buraya doğrudan yarı saydam bir gradient verildiğinde kapı şeffaf
   * kalıyor ve iki katman üst üste biniyordu; taban ve süsleme bu yüzden
   * ayrıldı.)
   */
  base: string;
  /** Tabanın üzerine binen isteğe bağlı gradient/doku */
  overlay?: string;
  /** Ana metin rengi */
  foreground: string;
  /** Vurgu (çizgi, küçük etiket, buton kenarı) */
  accent: string;
  /** Buton dolgusu üzerindeki metin rengi */
  onAccent: string;
  /**
   * Mühürlü zarf açılışı. Verildiğinde kapı tipografik karttan çıkıp
   * gerçek bir davetiyeyi açma sahnesine dönüşür.
   */
  envelope?: EnvelopePalette;
}

/** Baş harfleri mühür kabartması için hazırlar: "Elif", "Kaan" → "E & K" */
function initialsOf(bride: string, groom: string) {
  const first = (s: string) => s.trim().charAt(0).toLocaleUpperCase("tr");
  const a = first(bride);
  const b = first(groom);
  if (!a && !b) return "♥";
  return [a, b].filter(Boolean).join(" & ");
}

/** Zarf sahnesinin toplam süresi — kapı bu sürenin sonunda kalkar */
const ENVELOPE_DURATION = 2050;

/**
 * Davetiyenin açılış kapısı.
 *
 * İki işi birden yapar:
 *  1. Davetiyeye tören havası veren bir açılış anı kurar.
 *  2. Müziğin başlaması için gereken kullanıcı etkileşimini toplar —
 *     tarayıcılar sesli otomatik oynatmayı engeller, dolayısıyla müzik
 *     ancak bir tıklamadan sonra başlayabilir.
 *
 * Müzik, davetiye kapatılana kadar döngüyle çalar; sağ alttaki düğmeyle
 * susturulabilir.
 */
export default function OpeningGate({
  content,
  palette,
  children,
  /** Kapının altındaki ince süsleme — tema kendi motifini geçer */
  ornament,
}: {
  content: InvitationContent;
  palette: GatePalette;
  children: React.ReactNode;
  ornament?: React.ReactNode;
}) {
  const envelope = palette.envelope;
  const [opened, setOpened] = useState(false);
  /** Zarf sahnesi oynuyor — kapı hâlâ ekranda ama artık tıklanamaz */
  const [opening, setOpening] = useState(false);
  const [muted, setMuted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Kapı açıkken arkadaki sayfa kaydırılmasın
  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  function open() {
    if (opening) return;

    // Zarf sahnesi varsa kapı hemen kalkmaz — açılış animasyonu oynar.
    // Müzik ise BEKLEMEZ: tarayıcı politikası sesi ancak kullanıcı
    // etkileşiminin hemen ardından başlatmaya izin verir, animasyonun
    // bitmesini beklersek jest bağlantısı kopar ve ses hiç çalmaz.
    if (envelope && !reduced) {
      setOpening(true);
      timerRef.current = setTimeout(() => setOpened(true), ENVELOPE_DURATION);
    } else {
      setOpened(true);
    }

    const audio = audioRef.current;
    if (!audio) return;
    // Kullanıcı etkileşiminin hemen ardından: tarayıcı politikası buna izin verir
    audio.volume = 0;
    audio.play().then(
      () => {
        // Ani ses patlaması olmasın diye kısa bir açılış
        const target = 0.65;
        const step = target / 30;
        const id = setInterval(() => {
          if (!audioRef.current) return clearInterval(id);
          const next = audioRef.current.volume + step;
          if (next >= target) {
            audioRef.current.volume = target;
            clearInterval(id);
          } else {
            audioRef.current.volume = next;
          }
        }, 60);
      },
      () => {
        // Oynatma reddedilirse sessizce geç — davetiye yine açılır
      },
    );
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  const hasMusic = Boolean(content.musicUrl);

  const dateLabel = content.eventAt
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(content.eventAt))
    : null;

  return (
    <>
      {hasMusic && (
        <audio ref={audioRef} src={content.musicUrl!} loop preload="auto" />
      )}

      {/* KAPI */}
      {!opened && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6"
          style={{
            // Opak taban + üzerine süsleme: kapı hiçbir koşulda
            // arkasındaki davetiyeyi göstermez.
            backgroundColor: palette.base,
            backgroundImage: palette.overlay,
            color: palette.foreground,
          }}
        >
          {/* İnce iç çerçeve — davet kartının kenar baskısı gibi */}
          <div
            aria-hidden="true"
            className="absolute inset-4 sm:inset-7 pointer-events-none"
            style={{ border: `1px solid ${palette.accent}`, opacity: 0.22 }}
          />

          {envelope ? (
            /* ---- ZARF SAHNESİ ----
               Tüm alan tek bir düğme: mühre nişan almak yerine zarfın
               herhangi bir yerine dokunmak yetiyor. Mobilde bu fark
               açılışın hissini tamamen değiştiriyor. */
            <button
              type="button"
              onClick={open}
              disabled={opening}
              aria-label="Davetiyeyi aç"
              className="relative flex flex-col items-center gap-10 bg-transparent border-0 p-0 cursor-pointer disabled:cursor-default"
              style={
                reduced ? undefined : { animation: "fadeUp 1.2s ease 0.1s both" }
              }
            >
              <div
                style={
                  reduced || opening
                    ? undefined
                    : { animation: "breathe 4.5s ease-in-out infinite" }
                }
              >
                <Envelope
                  palette={envelope}
                  initials={initialsOf(content.brideName, content.groomName)}
                  opening={opening}
                  brideName={content.brideName}
                  groomName={content.groomName}
                  dateLabel={dateLabel}
                  reduced={reduced}
                />
              </div>

              <span
                className="text-[11px] sm:text-[12px] tracking-[0.34em] uppercase transition-opacity duration-500"
                style={{
                  color: palette.accent,
                  opacity: opening ? 0 : 0.85,
                }}
              >
                Davetiyeyi açmak için dokunun
              </span>
            </button>
          ) : (
            /* ---- TİPOGRAFİK KART ----
               Zarf paleti verilmemiş temalar için sade açılış. */
            <>
              <div
                className="relative"
                style={
                  reduced
                    ? undefined
                    : { animation: "fadeUp 1.1s ease 0.1s both" }
                }
              >
                {ornament && (
                  <div className="flex justify-center mb-9">{ornament}</div>
                )}

                <p
                  className="text-[10.5px] sm:text-[11px] tracking-[0.42em] uppercase m-0 mb-7"
                  style={{ color: palette.accent }}
                >
                  {EVENT_HEADINGS[content.eventType]}
                </p>

                <h1 className="font-script font-normal m-0 leading-[1.1] text-[clamp(3rem,13vw,6rem)]">
                  {content.brideName}
                  <span className="mx-3" style={{ color: palette.accent }}>
                    &amp;
                  </span>
                  {content.groomName}
                </h1>

                {dateLabel && (
                  <p
                    className="mt-8 text-[12.5px] tracking-[0.24em] uppercase m-0 opacity-70"
                    style={{ color: palette.foreground }}
                  >
                    {dateLabel}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={open}
                className="relative mt-12 px-10 py-4 rounded-full text-[12px] tracking-[0.24em] uppercase cursor-pointer transition-all duration-300 hover:scale-[1.04]"
                style={{
                  border: `1px solid ${palette.accent}`,
                  color: palette.accent,
                  background: "transparent",
                  animation: reduced ? undefined : "fadeUp 1.1s ease 0.5s both",
                }}
              >
                Davetiyeyi Aç
              </button>

              {hasMusic && (
                <p
                  className="relative mt-6 text-[11px] tracking-[0.14em] m-0 opacity-50"
                  style={{
                    color: palette.foreground,
                    animation: reduced
                      ? undefined
                      : "fadeUp 1.1s ease 0.7s both",
                  }}
                >
                  ♪ müzik eşliğinde
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* DAVETİYE
          Kapı kapalıyken `invisible`: opak zemine ek bir güvence — hem
          içerik sızmaz hem de arkadaki form alanları sekmeyle
          odaklanılamaz. */}
      <div
        className={opened ? undefined : "invisible"}
        style={
          opened && !reduced
            ? { animation: "fadeUp 0.9s ease both" }
            : undefined
        }
        aria-hidden={!opened}
      >
        {children}
      </div>

      {/* MÜZİK DÜĞMESİ — davetiye açıldıktan sonra */}
      {opened && hasMusic && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Müziği aç" : "Müziği sustur"}
          aria-pressed={muted}
          className="fixed bottom-5 right-5 z-40 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-100 opacity-70"
          style={{
            background: palette.accent,
            color: palette.onAccent,
            border: "none",
          }}
        >
          {muted ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3l2.7-2.7-1.1-1.1L15.4 11l-2.7-2.8-1.1 1.1 2.7 2.7-2.7 2.7 1.1 1.1 2.7-2.7 2.7 2.7 1.1-1.1L16.5 12z" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4zm11.5 3c0-1.6-.9-3-2.2-3.7v7.4A4.2 4.2 0 0 0 15.5 12zm-2.2-7.9v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.6 7-8.8s-3-7.8-7-8.8z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
