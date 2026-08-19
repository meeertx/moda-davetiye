"use client";

/**
 * Liste filtrelerindeki hap biçimli seçici.
 * 24K Altın Yaldız teması ile uyumlu lüks aktif buton görünümü.
 */
export default function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer px-5 py-2 rounded-full text-xs transition-all duration-200 apple-press font-semibold ${
        active
          ? "bg-gradient-to-r from-[#D4AF37] via-[#F5E6B3] to-[#C09622] text-[#16161D] border border-gold font-bold shadow-md shadow-gold/25 scale-[1.02]"
          : "bg-white/80 text-ink/80 border border-gold/30 hover:border-gold hover:text-gold hover:bg-gold/10"
      }`}
    >
      {children}
    </button>
  );
}
