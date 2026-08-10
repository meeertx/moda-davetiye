"use client";

/**
 * Liste filtrelerindeki hap biçimli seçici.
 * Tema galerisi ve admin sipariş listesi aynı bileşeni kullanır.
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
      className={`cursor-pointer px-[18px] py-[9px] border rounded-[20px] text-[13px] transition-colors duration-150 ${
        active
          ? "bg-ink text-cream border-ink"
          : "bg-transparent text-slate border-line hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
