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
      className="py-25 px-6 sm:px-14 max-w-[820px] mx-auto text-center"
    >
      <Stars className="text-gold-light justify-center mb-8" />

      {/*
        Sabit yükseklik: yorumlar farklı uzunlukta, geçişte sayfa zıplamasın.
        Geçiş tek bir yetkilendirilmiş an — alıntı yumuşakça belirip hafifçe
        yükselir, dağınık efekt yığını yok.
      */}
      <div className="min-h-[190px] sm:min-h-[170px] flex flex-col justify-center">
        <blockquote key={index} className="m-0 animate-[fadeUp_0.6s_ease_both]">
          <p className="font-display italic text-[26px] sm:text-[32px] leading-[1.45] m-0 text-balance">
            &ldquo;{active.quote}&rdquo;
          </p>
        </blockquote>
      </div>

      <div
        key={`meta-${index}`}
        className="flex items-center justify-center gap-3.5 mt-8 animate-[fadeUp_0.6s_ease_0.05s_both]"
      >
        <Initials name={active.author} size={44} />
        <div className="text-left">
          <div className="text-sm text-ink">{active.author}</div>
          <div className="text-[13px] text-muted">{active.context}</div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-9">
        {HOME_TESTIMONIALS.map((t, i) => (
          <button
            key={t.author}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`${i + 1}. yorum: ${t.author}`}
            aria-current={i === index}
            className="cursor-pointer border-0 bg-transparent p-2 -m-2"
          >
            {/* Nokta yerine ince çizgi — aktif olan uzayıp yaldıza döner */}
            <span
              className={`block h-px transition-all duration-500 ${
                i === index ? "w-9 bg-gold" : "w-4 bg-hush"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
