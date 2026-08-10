/** Form üstünde gösterilen hata / bilgi kutusu. */
export default function FormMessage({
  tone = "error",
  children,
}: {
  tone?: "error" | "ok";
  children: React.ReactNode;
}) {
  if (!children) return null;

  return (
    <div
      role="alert"
      className={`text-[13px] leading-[1.5] px-3.5 py-3 rounded-[4px] border ${
        tone === "error"
          ? "border-[oklch(85%_0.06_30)] bg-danger-bg text-danger-fg"
          : "border-ok-fg/30 bg-ok-bg text-ok-fg"
      }`}
    >
      {children}
    </div>
  );
}
