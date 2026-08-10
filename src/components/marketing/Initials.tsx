/** "Elif & Kaan" → "EK" */
export function initialsOf(name: string): string {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toLocaleUpperCase("tr-TR") ?? "")
    .join("");
}

/**
 * Yorum sahibinin baş harfleri.
 * Fotoğraf yerine kullanılan çizgisel madalyon — prototipteki çizgili
 * gri daire yer tutucusunun yerini alır.
 */
export default function Initials({
  name,
  size = 56,
}: {
  name: string;
  size?: 44 | 56;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-full border border-gold/40 text-gold font-display italic shrink-0 ${
        size === 56 ? "w-14 h-14 text-lg" : "w-11 h-11 text-base"
      }`}
    >
      {initialsOf(name)}
    </span>
  );
}
