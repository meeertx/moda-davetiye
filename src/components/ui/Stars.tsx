/**
 * Beş yıldızlık değerlendirme işareti.
 * Unicode "★" karakteri yerine çizilmiş SVG — yazı tipine göre biçimi
 * değişmesin ve çizgi kalınlığı markanın geri kalanıyla uyumlu kalsın diye.
 */
export default function Stars({
  count = 5,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex gap-1 ${className}`}
      role="img"
      aria-label={`${count} üzerinden ${count} yıldız`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 1.8l2.9 6.36 6.94.78-5.18 4.68 1.42 6.84L12 16.98l-6.08 3.48 1.42-6.84L2.16 8.94l6.94-.78z" />
        </svg>
      ))}
    </div>
  );
}
