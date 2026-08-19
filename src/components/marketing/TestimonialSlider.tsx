"use client";

import { useEffect, useRef, useState } from "react";
import { HOME_TESTIMONIALS } from "@/data/testimonials";
import Initials from "./Initials";
import Stars from "@/components/ui/Stars";

const INTERVAL_MS = 7000;

/**
 * Ana sayfadaki dönen müşteri yorumu.
 *
 * Kendiliğinden ilerler; kullanıcı üzerine geldiğinde, klavyeyle
 * odaklandığında veya sekme arka plana düştüğünde durur. Hareketi azaltılmış
 * tercih edenlerde otomatik geçiş hiç çalışmaz, yalnızca noktalarla gezilir.
 */
export default function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const regionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % HOME_TESTIMONIALS.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [paused, reduced]);

  // Sekme arka plandayken boşuna dönmesin
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const active = HOME_TESTIMONIALS[index];

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label="Müşteri yorumları"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="py-24 px-6 sm:px-14 max-w-[920px] mx-auto text-center"
    >
      <div className="glass-luxury rounded-2xl p-8 sm:p-14 border border-gold/25 shadow-[0_20px_60px_-15px_rgba(212,175,55,0.12)] relative overflow-hidden">
        {/* Subtle decorative background quote icon */}
        <div className="absolute top-4 left-6 text-[120px] font-display italic text-gold/10 select-none pointer-events-none leading-none">
          “
        </div>
        <div className="absolute bottom-4 right-6 text-[120px] font-display italic text-gold/10 select-none pointer-events-none leading-none rotate-180">
          “
        </div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 backdrop-blur-sm">
              <Stars className="text-gold justify-center scale-95" />
            </div>
          </div>

          <div className="min-h-[160px] sm:min-h-[140px] flex flex-col justify-center">
            <blockquote key={index} className="m-0 animate-[fadeUp_0.6s_ease_both]">
              <p className="font-display italic text-[24px] sm:text-[30px] leading-[1.45] m-0 text-balance text-ink font-medium">
                &ldquo;{active.quote}&rdquo;
              </p>
            </blockquote>
          </div>

          <div
            key={`meta-${index}`}
            className="flex items-center justify-center gap-4 mt-8 animate-[fadeUp_0.6s_ease_0.05s_both]"
          >
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-gold to-gold-light shadow-md">
              <Initials name={active.author} size={44} />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-ink tracking-wide">{active.author}</div>
              <div className="text-[12.5px] text-muted font-light">{active.context}</div>
            </div>
          </div>

          <div className="flex justify-center gap-2.5 mt-9">
            {HOME_TESTIMONIALS.map((t, i) => (
              <button
                key={t.author}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}. yorum: ${t.author}`}
                aria-current={i === index}
                className="cursor-pointer border-0 bg-transparent p-2 -m-2"
              >
                <span
                  className={`block h-1 rounded-full transition-all duration-500 ${
                    i === index ? "w-10 bg-gradient-to-r from-gold to-gold-light shadow-sm" : "w-3 bg-gold/25 hover:bg-gold/50"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
