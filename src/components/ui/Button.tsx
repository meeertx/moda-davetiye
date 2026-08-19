import Link from "next/link";

/**
 * Sitedeki tek buton kaynağı.
 *
 * Daha önce her buton kendi sınıflarını elle taşıyordu; sonuç üç ayrı köşe
 * yarıçapı, hover'ı olan ve olmayan aynı rolde butonlar ve hiçbir yerde
 * klavye odağı olmayan bir arayüzdü. Varyantlar burada tanımlı.
 */

export type ButtonVariant =
  | "primary" // koyu dolgu — sayfadaki tek ana eylem
  | "secondary" // çerçeveli — ikincil eylem
  | "ghost" // zeminsiz — üçüncül / satır içi eylem
  | "danger" // yıkıcı eylem
  | "on-dark" // koyu yüzey üzerinde ana eylem
  | "gold"; // lüks altın dolgulu eylem

export type ButtonSize = "sm" | "md" | "lg";

/**
 * Köşe yarıçapı bilinçli olarak iki dünyaya ayrılıyor:
 * pazarlama sayfaları keskin (2px, davetiye kartı hissi),
 * panel/admin yumuşak (6px, arayüz hissi). Prototipteki ayrım korunuyor.
 */
export type ButtonShape = "sharp" | "soft" | "pill";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[oklch(68%_0.15_85)] via-[oklch(78%_0.14_85)] to-[oklch(64%_0.14_85)] text-ink-deep font-semibold border border-gold/45 shadow-md hover:shadow-xl hover:brightness-105 hover:-translate-y-0.5 transition-all duration-300",
  secondary:
    "bg-white text-ink font-semibold border border-gold/45 shadow-xs hover:bg-ink hover:text-white hover:border-ink hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
  ghost:
    "bg-transparent text-ink font-semibold border border-transparent hover:bg-gold/15 hover:text-gold transition-colors duration-200",
  danger:
    "bg-white text-danger-fg font-semibold border border-danger-fg/60 hover:bg-danger-bg hover:text-danger-fg transition-colors duration-200",
  "on-dark":
    "bg-snow text-ink font-semibold border border-gold/40 shadow-sm hover:bg-white hover:border-gold/60 hover:text-ink hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
  gold:
    "bg-gradient-to-r from-[#D4AF37] via-[#F5E6B3] to-[#C09622] text-ink-deep font-bold border border-gold/50 shadow-[0_10px_25px_-5px_rgba(212,175,55,0.4)] hover:shadow-[0_14px_32px_-5px_rgba(212,175,55,0.6)] hover:brightness-105 hover:-translate-y-0.5 transition-all duration-300 tracking-wider uppercase text-xs",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "text-[12.5px] tracking-[0.04em] px-4 py-2",
  md: "text-sm tracking-[0.04em] px-6.5 py-3",
  lg: "text-[14.5px] tracking-[0.05em] px-8.5 py-4",
};

const SHAPES: Record<ButtonShape, string> = {
  sharp: "rounded-[2px]",
  soft: "rounded-md",
  pill: "rounded-full",
};

const BASE =
  "inline-flex items-center justify-center gap-2 text-center whitespace-nowrap cursor-pointer " +
  "transition-all duration-200 ease-out " +
  "active:scale-[0.97] active:opacity-90 disabled:opacity-55 disabled:cursor-not-allowed disabled:active:scale-100";

export function buttonClass({
  variant = "primary",
  size = "md",
  shape = "soft",
  block = false,
  className = "",
}: ButtonStyleProps = {}) {
  return [
    BASE,
    VARIANTS[variant],
    SIZES[size],
    SHAPES[shape],
    block ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  /** Satırın tamamını kaplasın */
  block?: boolean;
  className?: string;
}

type ButtonProps = ButtonStyleProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant,
  size,
  shape,
  block,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, shape, block, className })}
      {...rest}
    />
  );
}

type ButtonLinkProps = ButtonStyleProps &
  React.ComponentProps<typeof Link> & { href: string };

/** Buton görünümündeki iç bağlantı. */
export function ButtonLink({
  variant,
  size,
  shape,
  block,
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClass({ variant, size, shape, block, className })}
      {...rest}
    />
  );
}

type ExternalButtonLinkProps = ButtonStyleProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

/** Buton görünümündeki dış bağlantı — yeni sekmede açılır. */
export function ExternalButtonLink({
  variant,
  size,
  shape,
  block,
  className,
  ...rest
}: ExternalButtonLinkProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass({ variant, size, shape, block, className })}
      {...rest}
    />
  );
}
