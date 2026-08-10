"use client";

import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Etkinlik geçtiyse true */
  past: boolean;
}

/**
 * Etkinliğe kalan süre.
 *
 * İlk render'da `null` döner: sunucuda hesaplanan değer istemcidekiyle
 * asla aynı olmayacağı için hidrasyon uyuşmazlığı çıkardı. Tema, null
 * geldiğinde alanı boş bırakır — sayı belirdiğinde yer değiştirmesin diye
 * yükseklik sabit tutulmalı.
 */
export function useCountdown(target: string | null): Countdown | null {
  const [value, setValue] = useState<Countdown | null>(null);

  useEffect(() => {
    if (!target) return;
    const at = new Date(target).getTime();
    if (Number.isNaN(at)) return;

    const tick = () => {
      const diff = at - Date.now();
      if (diff <= 0) {
        setValue({ days: 0, hours: 0, minutes: 0, seconds: 0, past: true });
        return;
      }
      setValue({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff / 3_600_000) % 24),
        minutes: Math.floor((diff / 60_000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        past: false,
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return value;
}

export const pad = (n: number) => String(n).padStart(2, "0");
