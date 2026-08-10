/**
 * Form alanlarının ortak görünümü.
 *
 * Daha önce her formda ayrı bir sınıf dizesi vardı; kenarlık rengi, zemin ve
 * köşe yarıçapı sayfadan sayfaya kayıyordu. Tek kaynak burası.
 */

type FieldSurface =
  | "marketing" // krem/kağıt zeminli pazarlama formları — keskin köşe
  | "panel"; // panel ve admin formları — yumuşak köşe

const SURFACES: Record<FieldSurface, string> = {
  marketing:
    "border-line bg-paper rounded-[2px] focus:border-gold hover:border-muted/60",
  panel:
    "border-line-panel bg-shell rounded-md focus:border-gold hover:border-muted/60",
};

/** Etiket metinleri için ortak stil. */
export const labelClass = "block text-xs tracking-[0.03em] text-slate mb-1.5";

/** Alan altındaki açıklama/yardım metni. */
export const hintClass = "text-xs text-muted mt-1.5 m-0";

export function inputClass(
  surface: FieldSurface = "panel",
  className = "",
): string {
  return [
    "w-full box-border px-3.5 py-3 text-sm border outline-none",
    "transition-colors duration-150 placeholder:text-muted",
    "disabled:opacity-60 disabled:cursor-not-allowed",
    SURFACES[surface],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
