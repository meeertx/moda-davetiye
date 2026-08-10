/** Panel ve admin tablolarındaki durum rozetleri. */
export type BadgeTone = "ok" | "warn" | "danger" | "neutral" | "muted";

const TONES: Record<BadgeTone, string> = {
  ok: "bg-ok-bg text-ok-fg",
  warn: "bg-warn-bg text-warn-fg",
  danger: "bg-danger-bg text-danger-fg",
  neutral: "bg-neutral-bg text-neutral-fg",
  muted: "bg-[oklch(90%_0.01_60)] text-muted",
};

export default function Badge({
  tone,
  children,
  className = "",
}: {
  tone: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-[11px] px-2.5 py-[3px] rounded-[10px] ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
