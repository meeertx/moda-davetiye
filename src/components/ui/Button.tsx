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
  | "on-dark"; // koyu yüzey üzerinde ana eylem

export type ButtonSize = "sm" | "md" | "lg";

/**
 * Köşe yarıçapı bilinçli olarak iki dünyaya ayrılıyor:
 * pazarlama sayfaları keskin (2px, davetiye kartı hissi),
 * panel/admin yumuşak (6px, arayüz hissi). Prototipteki ayrım korunuyor.
 */
export type ButtonShape = "sharp" | "soft";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-cream border border-ink hover:bg-ink-lift hover:border-ink-lift hover:text-cream",
  secondary:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-cream",
  ghost:
    "bg-transparent text-ink border border-transparent hover:bg-rail-hover hover:text-ink",
  danger:
    "bg-transparent text-danger-fg border border-danger-fg hover:bg-danger-bg hover:text-danger-fg",
  "on-dark":
    "bg-snow text-ink border border-snow hover:bg-cream hover:border-cream hover:text-ink",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "text-[13px] px-4 py-2.5",
  md: "text-sm px-6 py-3",
  lg: "text-sm px-8 py-4",
};

const SHAPES: Record<ButtonShape, string> = {
  sharp: "rounded-[2px]",
  soft: "rounded-md",
};

const BASE =
  "inline-flex items-center justify-center gap-2 text-center whitespace-nowrap cursor-pointer " +
  "transition-[background-color,border-color,color,transform] duration-200 " +
  "active:translate-y-px disabled:opacity-55 disabled:cursor-not-allowed disabled:active:translate-y-0";

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
