"use client";

import { useFormStatus } from "react-dom";
import { buttonClass, type ButtonStyleProps } from "./Button";

/**
 * Form gönderimi sürerken kendini kilitleyen buton.
 * Görünümü [[Button]] ile aynı varyant sisteminden gelir.
 */
export default function SubmitButton({
  children,
  pendingLabel,
  variant,
  size,
  shape,
  block,
  className,
}: ButtonStyleProps & {
  children: React.ReactNode;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={buttonClass({ variant, size, shape, block, className })}
    >
      {pending ? (pendingLabel ?? "Gönderiliyor…") : children}
    </button>
  );
}
