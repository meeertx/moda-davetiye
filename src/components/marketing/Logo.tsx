import { BRAND } from "@/lib/brand";

/**
 * İnce çizgili zarf işareti. `currentColor` kullanır, bulunduğu yerin
 * metin rengini alır.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="0.65" y="0.65" width="22.7" height="16.7" rx="1.6" />
      <path d="M0.9 1.9 L12 9.6 L23.1 1.9" />
    </svg>
  );
}

const SIZES = {
  20: { text: "text-xl", mark: "w-[19px]", gap: "gap-2" },
  22: { text: "text-[22px]", mark: "w-[21px]", gap: "gap-2" },
  23: { text: "text-[23px]", mark: "w-[22px]", gap: "gap-2.5" },
  24: { text: "text-2xl", mark: "w-[23px]", gap: "gap-2.5" },
  26: { text: "text-[26px]", mark: "w-[25px]", gap: "gap-2.5" },
} as const;

interface LogoProps {
  size?: keyof typeof SIZES;
  /** Zarf işaretini gizler — dar alanlarda yalnızca kelime gösterilir */
  markless?: boolean;
  /** Koyu zeminde vurgu tonu açılır */
  tone?: "light-bg" | "dark-bg";
  className?: string;
}

/**
 * Yatay logo: zarf işareti + "Moda Davetiye" logotype'ı.
 *
 * Logotype iki ağırlıkta kurulur — "Moda" ince ve nötr, "Davetiye" kalın ve
 * vurgu renginde. İsim [[brand.ts]] üzerinden gelir, burada sabit yazılmaz.
 */
export default function Logo({
  size = 22,
  markless = false,
  tone = "light-bg",
  className = "",
}: LogoProps) {
  const s = SIZES[size];
  const accent = tone === "light-bg" ? "text-gold" : "text-gold-light";

  return (
    <span
      className={`inline-flex items-center ${s.gap} font-display ${s.text} italic whitespace-nowrap ${className}`}
    >
      {!markless && (
        <LogoMark className={`${s.mark} ${accent} shrink-0 not-italic`} />
      )}
      <span>
        <span className="font-normal">{BRAND.wordmark.light}</span>{" "}
        <span className={`font-semibold ${accent}`}>{BRAND.wordmark.bold}</span>
      </span>
    </span>
  );
}
