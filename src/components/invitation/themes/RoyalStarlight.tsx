"use client";

import { useEffect, useRef, useState } from "react";
import RsvpBlock from "../RsvpBlock";
import GuestPhotoBlock from "../GuestPhotoBlock";
import OpeningGate from "../OpeningGate";
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

/* ===========================================================================
   INTERACTIVE CANVAS PARTICLE ENGINE
   Altın parçacıklar, parıldayan yıldızlar ve etkileşimli ışık hüzmeleri
   ========================================================================= */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse tracking for interactive glow
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Particle pool
    const particleCount = Math.min(Math.floor(width / 15), 70);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      pulse: Math.random() * 0.02 + 0.005,
      goldHue: Math.random() > 0.5 ? 45 : 38, // Warm amber / champagne gold
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse ambient aura
      const gradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        280
      );
      gradient.addColorStop(0, "rgba(212, 175, 55, 0.12)");
      gradient.addColorStop(0.5, "rgba(180, 130, 40, 0.04)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render & update particles
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.alpha += Math.sin(Date.now() * p.pulse) * 0.01;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.goldHue}, 85%, 65%, ${Math.max(
          0.1,
          Math.min(0.9, p.alpha)
        )})`;
        ctx.shadowColor = "rgba(234, 190, 80, 0.8)";
        ctx.shadowBlur = p.radius * 4;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 opacity-70"
    />
  );
}

/* ===========================================================================
   3D CARD HOVER SHINE EFFECT
   ========================================================================= */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [shine, setShine] = useState("opacity-0");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (centerY - y) / 25;
    const rotateY = (x - centerX) / 25;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`);
    setShine("opacity-100");
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setShine("opacity-0");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)" }}
      className={`relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-zinc-950/80 via-zinc-900/60 to-zinc-950/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.1)] hover:border-amber-400/60 hover:shadow-[0_15px_50px_rgba(212,175,55,0.25)] ${className}`}
    >
      {/* Animated Metallic Border Glow */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl border border-amber-300/20 bg-gradient-to-r from-amber-500/0 via-amber-400/20 to-amber-500/0 opacity-50" />
      {/* Dynamic Shine Overlay */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-amber-200/10 to-transparent transition-opacity duration-300 ${shine}`}
      />
      {children}
    </div>
  );
}

/* ===========================================================================
   LIGHTBOX MODAL FOR PHOTO GALLERY
   ========================================================================= */
function PhotoLightbox({
  urls,
  initialIndex,
  onClose,
}: {
  urls: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-amber-300 hover:text-amber-100 text-2xl w-12 h-12 rounded-full border border-amber-500/40 bg-black/60 flex items-center justify-center transition-transform hover:scale-110"
      >
        ✕
      </button>

      {urls.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i > 0 ? i - 1 : urls.length - 1))}
            className="absolute left-6 text-amber-300 hover:text-amber-100 text-3xl w-12 h-12 rounded-full border border-amber-500/40 bg-black/60 flex items-center justify-center transition-transform hover:scale-110"
          >
            ‹
          </button>
          <button
            onClick={() => setIndex((i) => (i < urls.length - 1 ? i + 1 : 0))}
            className="absolute right-6 text-amber-300 hover:text-amber-100 text-3xl w-12 h-12 rounded-full border border-amber-500/40 bg-black/60 flex items-center justify-center transition-transform hover:scale-110"
          >
            ›
          </button>
        </>
      )}

      <div className="relative max-w-4xl max-h-[85vh] p-2 border border-amber-400/50 rounded-xl bg-black/40 shadow-[0_0_80px_rgba(212,175,55,0.3)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urls[index]}
          alt="Fotoğraf Büyük Görünüm"
          className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}

/* ===========================================================================
   ROYAL STARLIGHT FLAGSHIP THEME COMPONENT
   ========================================================================= */
export default function RoyalStarlight({ content, preview }: ThemeProps) {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

  const dateLabel = content.eventAt
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
      }).format(new Date(content.eventAt))
    : null;

  const timeLabel = content.eventAt
    ? new Intl.DateTimeFormat("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(content.eventAt))
    : null;

  return (
    <OpeningGate
      content={content}
      palette={{
        base: "#090a0f",
        mode: "double-gate",
        overlay: "radial-gradient(ellipse at center, rgba(212,175,55,0.2) 0%, rgba(9,10,15,1) 75%)",
        foreground: "#f5ebd6",
        accent: "#d4af37",
        onAccent: "#090a0f",
        envelope: {
          paper: "#12141d",
          paperShade: "#0b0c12",
          card: "#191c28",
          seal: "#d4af37",
          sealInk: "#090a0f",
          accent: "#f3e5ab",
          ink: "#f5ebd6",
        },
      }}
    >
      {/* Background Interactive Particle Canvas */}
      <ParticleCanvas />

      {/* Main Luxury Dark Backdrop */}
      <div className="relative min-h-screen bg-[#07080c] text-[#f5ebd6] font-body selection:bg-amber-400 selection:text-black overflow-x-hidden">
        
        {/* Ambient Light Orbs */}
        <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-[140px] z-0" />
        <div className="pointer-events-none fixed bottom-0 right-0 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[160px] z-0" />

        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-16 sm:space-y-24">

          {/* ================= HERO SECTION ================= */}
          <section className="text-center pt-8 sm:pt-16 pb-10">
            {/* Crest / Monogram Banner */}
            <div className="inline-flex items-center justify-center p-3 mb-8 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <span className="text-xs uppercase tracking-[0.4em] text-amber-300 font-medium px-4">
                ✨ {EVENT_HEADINGS[content.eventType]} ✨
              </span>
            </div>

            {/* Glowing Main Names */}
            <h1 className="font-script font-normal m-0 leading-tight">
              <span className="block text-[clamp(3.8rem,14vw,7.5rem)] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 drop-shadow-[0_10px_35px_rgba(212,175,55,0.4)]">
                {content.brideName}
              </span>
              <span className="block text-[clamp(1.8rem,5vw,2.8rem)] text-amber-300/80 my-2 font-serif italic">
                &amp;
              </span>
              <span className="block text-[clamp(3.8rem,14vw,7.5rem)] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-400 to-amber-200 drop-shadow-[0_10px_35px_rgba(212,175,55,0.4)]">
                {content.groomName}
              </span>
            </h1>

            {/* Ornamental Divider */}
            <div className="my-8 flex items-center justify-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
              <div className="w-2.5 h-2.5 rotate-45 border border-amber-300 bg-amber-400 shadow-[0_0_12px_#d4af37]" />
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
            </div>

            {/* Family Names */}
            <ParentsLine content={content} tone="dark" className="mb-8 text-amber-200/80" />

            {/* Event Date & Time Banner */}
            {dateLabel && (
              <div className="inline-block px-8 py-3.5 rounded-full border border-amber-400/40 bg-zinc-900/60 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.15)] text-amber-200 tracking-[0.2em] uppercase text-sm sm:text-base">
                {dateLabel} {timeLabel && <span className="mx-2 text-amber-400">•</span>} {timeLabel}
              </div>
            )}
          </section>

          {/* ================= COUNTDOWN TIMER ================= */}
          {content.eventAt && (
            <TiltCard className="p-8 sm:p-12 text-center">
              <h2 className="text-xs uppercase tracking-[0.35em] text-amber-400 mb-6 font-semibold">
                ⏳ Büyük Güne Kalan Süre
              </h2>
              <CountdownBoxes eventAt={content.eventAt} tone="dark" className="max-w-xl mx-auto" />
            </TiltCard>
          )}

          {/* ================= STORY SECTION ================= */}
          {content.story && (
            <TiltCard className="p-8 sm:p-14 text-center">
              <div className="inline-block text-2xl mb-3">🕊️</div>
              <h2 className="text-xs uppercase tracking-[0.35em] text-amber-400 mb-6 font-semibold">
                Bizim Hikayemiz
              </h2>
              <p className="font-display italic text-lg sm:text-2xl leading-relaxed text-amber-100/90 whitespace-pre-line max-w-2xl mx-auto">
                "{content.story}"
              </p>
            </TiltCard>
          )}

          {/* ================= PHOTO GALLERY WITH LIGHTBOX ================= */}
          {content.photoUrls.length > 0 && (
            <section>
              <div className="text-center mb-8">
                <span className="text-2xl">📸</span>
                <h2 className="text-xs uppercase tracking-[0.35em] text-amber-400 mt-2 font-semibold">
                  Fotoğraf Galerisi
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {content.photoUrls.map((url, i) => (
                  <div
                    key={url}
                    onClick={() => setActivePhoto(i)}
                    className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-amber-500/30 bg-black cursor-pointer shadow-lg hover:border-amber-400 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Fotoğraf ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                      <span className="text-xs text-amber-200 uppercase tracking-widest font-medium">
                        🔍 Büyüt
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {activePhoto !== null && (
                <PhotoLightbox
                  urls={content.photoUrls}
                  initialIndex={activePhoto}
                  onClose={() => setActivePhoto(null)}
                />
              )}
            </section>
          )}

          {/* ================= VENUE MAP & ACTIONS ================= */}
          {(content.venueName || content.venueAddress) && (
            <TiltCard className="p-8 sm:p-12 text-center">
              <div className="text-2xl mb-2">📍</div>
              <h2 className="text-xs uppercase tracking-[0.35em] text-amber-400 mb-4 font-semibold">
                Tören &amp; Kutlama Yeri
              </h2>

              {content.venueName && (
                <h3 className="font-display text-2xl sm:text-3xl text-amber-100 mb-2">
                  {content.venueName}
                </h3>
              )}
              {content.venueAddress && (
                <p className="text-sm text-amber-200/70 mb-8 max-w-lg mx-auto leading-relaxed">
                  {content.venueAddress}
                </p>
              )}

              <VenueMap content={content} tone="dark" />

              <div className="mt-8 flex justify-center">
                <EventActions content={content} tone="dark" />
              </div>
            </TiltCard>
          )}

          {/* ================= PROGRAM TIMELINE ================= */}
          {content.program.length > 0 && (
            <TiltCard className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <span className="text-2xl">✨</span>
                <h2 className="text-xs uppercase tracking-[0.35em] text-amber-400 mt-2 font-semibold">
                  Akış &amp; Program
                </h2>
              </div>
              <ProgramTimeline program={content.program} tone="dark" />
            </TiltCard>
          )}

          {/* ================= MENU & EXTRA INFO ================= */}
          {(content.menu.length > 0 || content.extraInfo) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.menu.length > 0 && (
                <TiltCard className="p-8">
                  <MenuCard menu={content.menu} tone="dark" />
                </TiltCard>
              )}
              {content.extraInfo && (
                <TiltCard className="p-8">
                  <ExtraInfoCard text={content.extraInfo} tone="dark" />
                </TiltCard>
              )}
            </div>
          )}

          {/* ================= RSVP & GUEST PHOTOS ================= */}
          {content.rsvp.enabled && (
            <TiltCard className="p-8 sm:p-12">
              <div className="text-center mb-6">
                <span className="text-2xl">💌</span>
                <h2 className="text-xs uppercase tracking-[0.35em] text-amber-400 mt-2 font-semibold">
                  Katılım Bildirimi (RSVP)
                </h2>
                <p className="text-sm text-amber-200/70 mt-2">
                  Lütfen katılım durumunuzu aşağıdaki form üzerinden bildiriniz.
                </p>
              </div>
              <RsvpBlock content={content} tone="dark" preview={preview} />
            </TiltCard>
          )}

          {content.guestPhotosEnabled && (
            <TiltCard className="p-8 sm:p-12">
              <div className="text-center mb-6">
                <span className="text-2xl">📷</span>
                <h2 className="text-xs uppercase tracking-[0.35em] text-amber-400 mt-2 font-semibold">
                  Misafir Anı Duvarı
                </h2>
                <p className="text-sm text-amber-200/70 mt-2">
                  Düğün günümüzden çektiğiniz harika kareleri buraya yükleyin!
                </p>
              </div>
              <GuestPhotoBlock content={content} tone="dark" preview={preview} />
            </TiltCard>
          )}

          {/* ================= GIFT & IBAN ================= */}
          {(content.giftNote || content.giftIban) && (
            <TiltCard className="p-8 sm:p-12 text-center">
              <div className="text-2xl mb-2">🎁</div>
              <h2 className="text-xs uppercase tracking-[0.35em] text-amber-400 mb-4 font-semibold">
                Tebrik &amp; Hediye
              </h2>
              {content.giftNote && (
                <p className="font-display italic text-lg text-amber-100 mb-4">
                  "{content.giftNote}"
                </p>
              )}
              {content.giftIban && (
                <div className="inline-block p-4 rounded-xl border border-amber-400/40 bg-black/60 font-mono text-amber-300 text-sm tracking-wider break-all select-all">
                  IBAN: {content.giftIban}
                </div>
              )}
            </TiltCard>
          )}

          {/* ================= FOOTER ================= */}
          <footer className="text-center pt-12 pb-16 border-t border-amber-500/20">
            <h2 className="font-script text-4xl sm:text-6xl text-amber-300 mb-3">
              {content.brideName} &amp; {content.groomName}
            </h2>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-400/60">
              Teşekkür Ederiz
            </p>
          </footer>

        </div>
      </div>
    </OpeningGate>
  );
}
