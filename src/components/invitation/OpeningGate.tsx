"use client";

import { useEffect, useRef, useState } from "react";
import type { InvitationContent } from "@/types/invitation";
import { EVENT_HEADINGS } from "@/types/invitation";
import Envelope, { type EnvelopePalette } from "./Envelope";

export type GateMode = "envelope" | "curtain" | "double-gate" | "card";

export interface GatePalette {
  base: string;
  overlay?: string;
  foreground: string;
  accent: string;
  onAccent: string;
  mode?: GateMode;
  envelope?: EnvelopePalette;
}

function initialsOf(bride: string, groom: string) {
  const first = (s: string) => s.trim().charAt(0).toLocaleUpperCase("tr");
  const a = first(bride);
  const b = first(groom);
  if (!a && !b) return "♥";
  return [a, b].filter(Boolean).join(" & ");
}

const OPENING_DURATION = 1500;

/* ===========================================================================
   1. REALISTIC THEATRE STAGE CURTAIN OPENING (Tiyatro & Gala Sahne Perdesi)
   ========================================================================= */
function VelvetCurtains({
  opening,
  onClick,
  brideName,
  groomName,
  accent,
}: {
  opening: boolean;
  onClick: () => void;
  brideName: string;
  groomName: string;
  accent: string;
}) {
  return (
    <div
      onClick={onClick}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer select-none overflow-hidden bg-black"
    >
      {/* Stage Top Gold Valance / Pelmet (Sahne Saçağı & Altın Püsküller) */}
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-b from-red-950 via-amber-950/60 to-transparent border-b-2 border-amber-400/60 z-30 flex items-center justify-around px-4 pointer-events-none">
        <div className="w-full h-full flex justify-around opacity-80">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-16 sm:w-28 h-12 sm:h-16 bg-gradient-to-b from-red-900 to-red-950 border-b-2 border-amber-400/50 rounded-b-full shadow-lg"
            />
          ))}
        </div>
      </div>

      {/* Spotlights (Sahne Işıkları) */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[700px] bg-gradient-to-b from-amber-200/20 via-amber-400/5 to-transparent blur-3xl pointer-events-none transform -rotate-12" />
      <div className="absolute top-0 right-1/4 w-[350px] h-[700px] bg-gradient-to-b from-amber-200/20 via-amber-400/5 to-transparent blur-3xl pointer-events-none transform rotate-12" />

      {/* Sol Sahne Perdesi (Left Velvet Curtain) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[53%] bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-r-4 border-amber-400/80 shadow-[20px_0_50px_rgba(0,0,0,0.9)] transition-all duration-1200 cubic-bezier(0.65, 0, 0.35, 1) z-20"
        style={{
          transform: opening
            ? "translateX(-100%) scaleX(0.4)"
            : "translateX(0) scaleX(1)",
          transformOrigin: "left center",
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0 30px, rgba(212,175,55,0.06) 30px 60px)",
        }}
      >
        {/* Altın Perde Kordonu & Püskülü */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-2 h-32 bg-amber-400/80 rounded-full shadow-[0_0_15px_#d4af37]" />
          <div className="w-6 h-6 rounded-full bg-amber-400 border border-amber-200 shadow-md" />
        </div>
      </div>

      {/* Sağ Sahne Perdesi (Right Velvet Curtain) */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[53%] bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-l-4 border-amber-400/80 shadow-[-20px_0_50px_rgba(0,0,0,0.9)] transition-all duration-1200 cubic-bezier(0.65, 0, 0.35, 1) z-20"
        style={{
          transform: opening
            ? "translateX(100%) scaleX(0.4)"
            : "translateX(0) scaleX(1)",
          transformOrigin: "right center",
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0 30px, rgba(212,175,55,0.06) 30px 60px)",
        }}
      >
        {/* Altın Perde Kordonu & Püskülü */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-2 h-32 bg-amber-400/80 rounded-full shadow-[0_0_15px_#d4af37]" />
          <div className="w-6 h-6 rounded-full bg-amber-400 border border-amber-200 shadow-md" />
        </div>
      </div>

      {/* Sahne Açılış Başlığı & Dokun Butonu */}
      <div
        className={`relative z-30 flex flex-col items-center gap-6 text-center px-6 transition-all duration-500 ${
          opening ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-amber-300 bg-gradient-to-b from-red-900 to-black shadow-[0_0_80px_rgba(212,175,55,0.8)] flex items-center justify-center text-amber-300 font-display text-4xl font-bold animate-pulse">
            🎭
          </div>
          <div className="absolute -inset-2 rounded-full border border-amber-400/40 animate-ping opacity-30" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-amber-300 font-medium mb-3">
            ✨ Muhteşem Sahne Açılışı ✨
          </p>
          <h1 className="font-script text-5xl sm:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-200 drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] m-0">
            {brideName} &amp; {groomName}
          </h1>
        </div>

        <span className="text-xs uppercase tracking-[0.35em] text-amber-200 bg-black/80 px-8 py-3 rounded-full border border-amber-400/60 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform">
          🎬 Sahne Perdesini Açmak İçin Dokunun
        </span>
      </div>
    </div>
  );
}

/* ===========================================================================
   2. 3D ROYAL PALACE DOUBLE GATE OPENING (Saray Bahçe Kapısı 3D Açılışı)
   ========================================================================= */
function GoldenDoubleGate({
  opening,
  onClick,
  brideName,
  groomName,
  accent,
}: {
  opening: boolean;
  onClick: () => void;
  brideName: string;
  groomName: string;
  accent: string;
}) {
  return (
    <div
      onClick={onClick}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer select-none overflow-hidden bg-black/95 p-4"
      style={{ perspective: "1600px" }}
    >
      {/* Gate Arch Surround Frame */}
      <div className="relative w-[min(92vw,480px)] aspect-[1/1.4] flex items-center justify-center border-4 border-amber-500/40 rounded-t-full p-3 bg-gradient-to-b from-amber-950/30 via-zinc-950 to-black shadow-[0_0_100px_rgba(212,175,55,0.25)]">
        
        {/* Arch Crest Top Ornament */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 bg-black px-4 py-1 border border-amber-400/60 rounded-full shadow-lg">
          <span className="text-amber-300 font-serif text-sm tracking-widest uppercase">
            ⚜️ PALACE GATE ⚜️
          </span>
        </div>

        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-t-full">
          
          {/* Sol Kapı Kanadı (Left Gate Leaf) */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1/2 border-r-2 border-amber-400/80 bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/70 p-4 shadow-[15px_0_35px_rgba(0,0,0,0.8)] transition-all duration-1200 cubic-bezier(0.4, 0, 0.2, 1) z-20 flex flex-col justify-between"
            style={{
              transformOrigin: "left center",
              transform: opening ? "rotateY(-125deg)" : "rotateY(0deg)",
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0 40px, rgba(212,175,55,0.15) 40px 42px)",
            }}
          >
            {/* Wrought Iron Scrolls */}
            <div className="text-amber-400 text-xs font-mono">❖ ROYAL</div>
            <div className="border-r border-amber-400/40 h-full my-4 flex flex-col items-center justify-around py-4">
              <div className="w-14 h-24 border border-amber-400/50 rounded-t-full flex items-center justify-center">
                <span className="text-amber-400/60 text-xl">⚜️</span>
              </div>
              <div className="w-14 h-24 border border-amber-400/50 rounded-b-full flex items-center justify-center">
                <span className="text-amber-400/60 text-xl">⚜️</span>
              </div>
            </div>
            <div className="text-amber-400 text-xs font-mono">❖ GATE</div>
          </div>

          {/* Sağ Kapı Kanadı (Right Gate Leaf) */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1/2 border-l-2 border-amber-400/80 bg-gradient-to-l from-zinc-950 via-zinc-900 to-amber-950/70 p-4 shadow-[-15px_0_35px_rgba(0,0,0,0.8)] transition-all duration-1200 cubic-bezier(0.4, 0, 0.2, 1) z-20 flex flex-col justify-between"
            style={{
              transformOrigin: "right center",
              transform: opening ? "rotateY(125deg)" : "rotateY(0deg)",
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0 40px, rgba(212,175,55,0.15) 40px 42px)",
            }}
          >
            {/* Wrought Iron Scrolls */}
            <div className="text-amber-400 text-xs text-right font-mono">ROYAL ❖</div>
            <div className="border-l border-amber-400/40 h-full my-4 flex flex-col items-center justify-around py-4">
              <div className="w-14 h-24 border border-amber-400/50 rounded-t-full flex items-center justify-center">
                <span className="text-amber-400/60 text-xl">⚜️</span>
              </div>
              <div className="w-14 h-24 border border-amber-400/50 rounded-b-full flex items-center justify-center">
                <span className="text-amber-400/60 text-xl">⚜️</span>
              </div>
            </div>
            <div className="text-amber-400 text-xs text-right font-mono">GATE ❖</div>
          </div>

          {/* Orta Ağır Altın Mühür & Kilit */}
          <div
            className={`relative z-30 flex flex-col items-center gap-6 text-center transition-all duration-500 ${
              opening ? "opacity-0 scale-75" : "opacity-100 scale-100"
            }`}
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-amber-300 bg-amber-500/20 backdrop-blur-xl shadow-[0_0_80px_rgba(212,175,55,0.9)] flex items-center justify-center text-amber-300 font-display text-4xl font-bold animate-pulse">
                ⚜️
              </div>
              <div className="absolute -inset-3 rounded-full border border-amber-400/40 animate-spin opacity-30" style={{ animationDuration: "12s" }} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300 font-medium mb-2">
                ✨ Saray Bahçe Kapısı ✨
              </p>
              <h1 className="font-script text-4xl sm:text-5xl text-amber-100 drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] m-0">
                {brideName} &amp; {groomName}
              </h1>
            </div>

            <span className="text-xs uppercase tracking-[0.35em] text-amber-200 bg-black/90 px-6 py-3 rounded-full border border-amber-400/60 shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 transition-transform">
              🔑 Kapıyı Açmak İçin Dokunun
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function OpeningGate({
  content,
  palette,
  children,
  ornament,
}: {
  content: InvitationContent;
  palette: GatePalette;
  children: React.ReactNode;
  ornament?: React.ReactNode;
}) {
  const envelope = palette.envelope;
  const mode = palette.mode ?? (envelope ? "envelope" : "card");
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [muted, setMuted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  function open() {
    if (opening) return;

    setOpening(true);
    timerRef.current = setTimeout(() => setOpened(true), OPENING_DURATION);

    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    audio.play().then(
      () => {
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
      () => {}
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

      {/* KAPI / SAHNE */}
      {!opened && (
        <>
          {mode === "curtain" ? (
            <VelvetCurtains
              opening={opening}
              onClick={open}
              brideName={content.brideName}
              groomName={content.groomName}
              accent={palette.accent}
            />
          ) : mode === "double-gate" ? (
            <GoldenDoubleGate
              opening={opening}
              onClick={open}
              brideName={content.brideName}
              groomName={content.groomName}
              accent={palette.accent}
            />
          ) : (
            <div
              className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6"
              style={{
                backgroundColor: palette.base,
                backgroundImage: palette.overlay,
                color: palette.foreground,
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-4 sm:inset-7 pointer-events-none"
                style={{ border: `1px solid ${palette.accent}`, opacity: 0.22 }}
              />

              {envelope ? (
                <button
                  type="button"
                  onClick={open}
                  disabled={opening}
                  aria-label="Davetiyeyi aç"
                  className="relative flex flex-col items-center gap-10 bg-transparent border-0 p-0 cursor-pointer disabled:cursor-default"
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
                <>
                  <div className="relative">
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
                    }}
                  >
                    Davetiyeyi Aç
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* DAVETİYE İÇERİĞİ */}
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

      {/* MÜZİK DÜĞMESİ */}
      {opened && hasMusic && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Müziği aç" : "Müziği sustur"}
          className="fixed bottom-5 right-5 z-40 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-100 opacity-70"
          style={{
            background: palette.accent,
            color: palette.onAccent,
            border: "none",
          }}
        >
          {muted ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3l2.7-2.7-1.1-1.1L15.4 11l-2.7-2.8-1.1 1.1 2.7 2.7-2.7 2.7 1.1 1.1 2.7-2.7 2.7 2.7 1.1-1.1L16.5 12z" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 9v6h4l5 4V5L8 9H4zm11.5 3c0-1.6-.9-3-2.2-3.7v7.4A4.2 4.2 0 0 0 15.5 12zm-2.2-7.9v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.6 7-8.8s-3-7.8-7-8.8z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
