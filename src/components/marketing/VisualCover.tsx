"use client";

import type { Theme } from "@/data/themes";

interface VisualCoverProps {
  theme: Theme;
  className?: string;
  size?: "sm" | "md" | "lg";
  customNames?: { bride: string; groom: string };
}

/**
 * Platform genelinde kullanılan, 3D simüle edilmiş lüks davetiye kapak bileşeni.
 */
export default function VisualCover({
  theme,
  className = "",
  size = "md",
  customNames,
}: VisualCoverProps) {
  const isFlagship = theme.slug === "royal-starlight" || theme.slug === "altin-bahce-kapisi";
  const bride = customNames?.bride || "Elif";
  const groom = customNames?.groom || "Kaan";

  return (
    <div
      className={`relative w-full aspect-[4/5] overflow-hidden flex flex-col items-center justify-between p-5 text-center select-none shadow-lg transition-transform duration-300 ${className}`}
      style={{ background: theme.stripe }}
    >
      {/* Dark gradient vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/45 pointer-events-none" />

      {/* Decorative Gold Frame Border */}
      <div className="absolute inset-2.5 border border-amber-300/40 pointer-events-none rounded-xs flex flex-col justify-between p-2">
        <div className="flex justify-between items-center text-[8.5px] text-amber-300/70 font-mono">
          <span>❖</span>
          <span>9:16</span>
          <span>❖</span>
        </div>
        <div className="flex justify-between items-center text-[8.5px] text-amber-300/70 font-mono">
          <span>❖</span>
          <span>VIP</span>
          <span>❖</span>
        </div>
      </div>

      {/* Top Badge */}
      <div className="relative z-10 w-full flex justify-between items-center">
        <span className="text-[9.5px] tracking-[0.18em] uppercase font-semibold text-amber-300 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-400/30">
          {theme.categoryLabel}
        </span>
        {isFlagship && (
          <span className="text-[9.5px] tracking-wider font-bold text-black bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 px-2 py-0.5 rounded-full shadow-md animate-pulse">
            ★ AMİRAL GEMİSİ
          </span>
        )}
      </div>

      {/* Center Simulated Invitation Cover Text */}
      <div className="relative z-10 my-auto py-2">
        <p className="text-[9px] uppercase tracking-[0.3em] text-amber-200/80 mb-1">
          Düğün Davetiyesi
        </p>
        <div className="font-script text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-200 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] leading-none">
          {bride} &amp; {groom}
        </div>
        <div className="w-10 h-px bg-amber-400/50 mx-auto my-2" />
        <p className="text-[9.5px] tracking-widest text-amber-100/90 font-serif uppercase">
          Tarihi Ayırın • 2027
        </p>
      </div>

      {/* Simulated Wax Seal Badge */}
      <div className="relative z-10 flex items-center gap-1.5 text-amber-200/90 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-amber-500/40 text-xs">
        <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-[8px] shadow-sm">
          {bride.charAt(0)}&amp;{groom.charAt(0)}
        </span>
        <span className="text-[9.5px] tracking-wide font-medium">Özel Açılış Sahnesi</span>
      </div>
    </div>
  );
}
