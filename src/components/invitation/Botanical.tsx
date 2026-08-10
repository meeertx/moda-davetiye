/**
 * Botanik motif kütüphanesi.
 *
 * Davetiyelerdeki bezemelerin tamamı burada elle yazılmış SVG — dış bir
 * görsel varlığa bağımlılık yok. Bunun üç somut karşılığı var:
 *
 *  · Renk `currentColor` üzerinden gelir, aynı motif yedi temada da
 *    temanın kendi rengine bürünür.
 *  · Dosya boyutu birkaç kilobayt; davetiye linki mobil veriyle açılıyor.
 *  · Her boyutta net — geri sayım kartındaki 40px'lik dal da, sayfayı
 *    saran 900px'lik çerçeve de aynı yolları kullanır.
 *
 * ÇİZİM KURALI: motifler `viewBox` içinde 0-100 aralığına normalize
 * edilmiştir; ölçek çağıran tarafta `className` ile verilir.
 */

interface MotifProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hesaplanan SVG sayılarını sabit basamağa indirir.
 *
 * `Math.atan2` gibi transandantal fonksiyonlar Node ile tarayıcının V8'i
 * arasında son basamakta ayrışabiliyor; bu da React'te hidrasyon
 * uyuşmazlığına yol açıyordu. Yuvarlama hem bunu keser hem de üretilen
 * işaretlemeyi belirgin biçimde kısaltır.
 */
const r = (n: number) => Math.round(n * 1000) / 1000;

/* ===========================================================================
   TEK ÖĞELER — daha büyük kompozisyonların yapı taşları
   ========================================================================= */

/** Tek yaprak; sap noktasından (0,0) açılır. */
function Leaf({
  cx,
  cy,
  len,
  width,
  angle,
  filled,
}: {
  cx: number;
  cy: number;
  len: number;
  width: number;
  angle: number;
  filled?: boolean;
}) {
  // Kontrol noktaları sapın iki yanında simetrik — mercek biçimli bir yaprak
  const d = `M0 0 C ${r(width)} ${r(-len * 0.3)}, ${r(width)} ${r(-len * 0.7)}, 0 ${r(-len)} C ${r(-width)} ${r(-len * 0.7)}, ${r(-width)} ${r(-len * 0.3)}, 0 0 Z`;
  return (
    <path
      d={d}
      transform={`translate(${r(cx)} ${r(cy)}) rotate(${r(angle)})`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 0.7}
      vectorEffect="non-scaling-stroke"
    />
  );
}

/** Beş yapraklı küçük çiçek. */
function Blossom({
  cx,
  cy,
  // `r` adı yuvarlama yardımcısıyla çakışıyordu
  radius,
  petals = 5,
}: {
  cx: number;
  cy: number;
  radius: number;
  petals?: number;
}) {
  return (
    <g transform={`translate(${r(cx)} ${r(cy)})`}>
      {Array.from({ length: petals }, (_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={r(radius * -0.62)}
          rx={r(radius * 0.34)}
          ry={r(radius * 0.62)}
          fill="currentColor"
          opacity={0.85}
          transform={`rotate(${r((360 / petals) * i)})`}
        />
      ))}
      <circle cx={0} cy={0} r={r(radius * 0.24)} fill="currentColor" />
    </g>
  );
}

/**
 * Yapraklı dal — botanik kompozisyonların ana gövdesi.
 * Yapraklar sap boyunca dönüşümlü olarak iki yana dizilir.
 */
function Sprig({
  path,
  count = 7,
  leafLen = 9,
  leafWidth = 3,
  from = 0.12,
  to = 0.95,
  tipBlossom,
}: {
  /** Sapın kendisi — kübik bézier */
  path: string;
  count?: number;
  leafLen?: number;
  leafWidth?: number;
  from?: number;
  to?: number;
  tipBlossom?: number;
}) {
  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinecap="round"
      />
      <SprigLeaves
        path={path}
        count={count}
        leafLen={leafLen}
        leafWidth={leafWidth}
        from={from}
        to={to}
        tipBlossom={tipBlossom}
      />
    </g>
  );
}

/**
 * Yaprakları sapın üzerine yerleştirir.
 *
 * Sap yolunu tarayıcıda ölçmek (getPointAtLength) sunucu tarafında
 * çalışmaz, o yüzden bézier noktaları elle hesaplanıyor: yol dizesinden
 * dört kontrol noktası ayrıştırılıp kübik formül uygulanıyor. Böylece
 * motifler sunucuda da doğru render olur.
 */
function SprigLeaves({
  path,
  count,
  leafLen,
  leafWidth,
  from,
  to,
  tipBlossom,
}: {
  path: string;
  count: number;
  leafLen: number;
  leafWidth: number;
  from: number;
  to: number;
  tipBlossom?: number;
}) {
  const n = path.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  if (n.length < 8) return null;

  const [x0, y0, x1, y1, x2, y2, x3, y3] = n;
  const at = (t: number) => {
    const u = 1 - t;
    return {
      x: u ** 3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3,
      y: u ** 3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3,
    };
  };
  // Türev — yaprağın sapa dik durması için teğet açısı
  const slope = (t: number) => {
    const u = 1 - t;
    return {
      x: 3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2),
      y: 3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2),
    };
  };

  const tip = at(1);

  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const t = from + ((to - from) * i) / Math.max(1, count - 1);
        const p = at(t);
        const d = slope(t);
        const tangent = (Math.atan2(d.y, d.x) * 180) / Math.PI;
        const side = i % 2 === 0 ? 52 : -52;
        // Uca doğru yapraklar küçülür — gerçek bir dalın silueti
        const scale = 0.55 + 0.45 * (1 - t);
        return (
          <Leaf
            key={i}
            cx={p.x}
            cy={p.y}
            len={leafLen * scale}
            width={leafWidth * scale}
            // atan2 sunucu/istemci arasında son basamakta ayrışıyor —
            // Leaf içinde yuvarlanıyor
            angle={tangent + 90 + side}
            filled
          />
        );
      })}
      {tipBlossom ? <Blossom cx={tip.x} cy={tip.y} radius={tipBlossom} /> : null}
    </g>
  );
}

/* ===========================================================================
   KOMPOZİSYONLAR
   ========================================================================= */

/**
 * Köşe bezemesi — sayfanın sol üst köşesine oturur, diğer üç köşe
 * CSS `scale-x`/`scale-y` ile aynalanarak elde edilir.
 * Referanstaki sayfayı saran botanik çerçevenin yapı taşı.
 */
export function BotanicalCorner({ className, style }: MotifProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={style}
      fill="none"
      aria-hidden="true"
    >
      {/* Kompozisyonun yoğun ucu KÖŞEDE (0,0): iki ana dal kenarlar
          boyunca uzanır, aynalanan dört kopya birleşince gerçek bir
          çerçeve okunur. Köşeden içeri doğru açılan bir düzen ise dört
          ayrı süs gibi durur, çerçeve gibi değil. */}
      {/* Üst kenar boyunca */}
      <Sprig
        path="M3 5 C 32 2, 72 7, 116 14"
        count={11}
        leafLen={11.5}
        leafWidth={3.9}
        tipBlossom={3.8}
      />
      {/* Sol kenar boyunca — üsttekinin köşeye göre aynası */}
      <Sprig
        path="M5 3 C 2 32, 7 72, 14 116"
        count={11}
        leafLen={11.5}
        leafWidth={3.9}
        tipBlossom={3.8}
      />
      {/* Köşeden içeri açılan kısa çapraz — kompozisyona derinlik verir */}
      <Sprig
        path="M7 7 C 24 22, 36 36, 52 58"
        count={7}
        leafLen={8.5}
        leafWidth={3}
        tipBlossom={3.2}
      />
      {/* Köşede yoğunlaşan çiçekler */}
      <Blossom cx={10} cy={10} radius={5} petals={6} />
      <Blossom cx={30} cy={13} radius={3} petals={5} />
      <Blossom cx={13} cy={30} radius={3} petals={5} />
      <circle cx={44} cy={20} r={1.3} fill="currentColor" opacity={0.7} />
      <circle cx={20} cy={44} r={1.3} fill="currentColor" opacity={0.7} />
      <circle cx={62} cy={16} r={1} fill="currentColor" opacity={0.55} />
      <circle cx={16} cy={62} r={1} fill="currentColor" opacity={0.55} />
    </svg>
  );
}

/**
 * Yatay ayraç — bölümler arasına giren simetrik botanik şerit.
 * Referanstaki bölüm aralarında duran çiçekli çizginin karşılığı.
 */
export function BotanicalDivider({ className }: MotifProps) {
  return (
    <svg
      viewBox="0 0 240 40"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <g>
        {/* Sol kanat */}
        <Sprig
          path="M8 20 C 40 12, 70 10, 104 18"
          count={8}
          leafLen={8}
          leafWidth={2.8}
        />
        <Sprig
          path="M14 24 C 44 30, 74 30, 100 24"
          count={6}
          leafLen={6}
          leafWidth={2.2}
        />
        {/* Sağ kanat — soldakinin aynası */}
        <g transform="translate(240 0) scale(-1 1)">
          <Sprig
            path="M8 20 C 40 12, 70 10, 104 18"
            count={8}
            leafLen={8}
            leafWidth={2.8}
          />
          <Sprig
            path="M14 24 C 44 30, 74 30, 100 24"
            count={6}
            leafLen={6}
            leafWidth={2.2}
          />
        </g>
        {/* Merkez çiçeği */}
        <Blossom cx={120} cy={20} radius={6} petals={6} />
        <Blossom cx={106} cy={26} radius={2.6} />
        <Blossom cx={134} cy={26} radius={2.6} />
      </g>
    </svg>
  );
}

/**
 * Tek dal — başlık altlarında ve kart köşelerinde kullanılan sade motif.
 */
export function BotanicalSprig({ className }: MotifProps) {
  return (
    <svg
      viewBox="0 0 100 34"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <Sprig
        path="M4 17 C 30 6, 62 6, 96 16"
        count={9}
        leafLen={7.5}
        leafWidth={2.6}
        tipBlossom={3.2}
      />
    </svg>
  );
}

/**
 * Çelenk — isimlerin veya tarihin çevresini saran oval botanik halka.
 */
export function BotanicalWreath({ className }: MotifProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* Sol yarım — üstte açık bırakılıyor ki isim nefes alsın */}
      <Sprig
        path="M100 14 C 44 22, 12 66, 22 118"
        count={12}
        leafLen={11}
        leafWidth={3.8}
      />
      <Sprig
        path="M22 118 C 30 160, 62 186, 100 190"
        count={10}
        leafLen={10}
        leafWidth={3.4}
        tipBlossom={4}
      />
      {/* Sağ yarım — soldakinin aynası */}
      <g transform="translate(200 0) scale(-1 1)">
        <Sprig
          path="M100 14 C 44 22, 12 66, 22 118"
          count={12}
          leafLen={11}
          leafWidth={3.8}
        />
        <Sprig
          path="M22 118 C 30 160, 62 186, 100 190"
          count={10}
          leafLen={10}
          leafWidth={3.4}
          tipBlossom={4}
        />
      </g>
      <Blossom cx={26} cy={72} radius={4.4} petals={6} />
      <Blossom cx={174} cy={72} radius={4.4} petals={6} />
    </svg>
  );
}

/**
 * Sayfayı saran tam çerçeve — dört köşeye aynalanmış köşe motifi.
 *
 * Referanstaki davetiyenin en belirgin öğesi bu: içerik, sayfanın
 * kenarlarını saran botanik bir çerçevenin içinde durur.
 */
export function BotanicalFrame({
  className,
  opacity = 1,
  size = "clamp(110px,24vw,230px)",
}: MotifProps & {
  opacity?: number;
  /** Köşe motifinin kenar uzunluğu — çerçevenin sıkılığını belirler */
  size?: string;
}) {
  // Motifin dalları viewBox kenarına dayanıyor; küçük bir iç boşluk
  // olmazsa ekranın dışına taşıp kesik görünüyorlar.
  const corner = "absolute inset-[10px] sm:inset-4";
  const box = { width: size, height: size } as const;

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <div className={corner}>
        <BotanicalCorner
          className="absolute top-0 left-0"
          style={box}
        />
        <BotanicalCorner
          className="absolute top-0 right-0 -scale-x-100"
          style={box}
        />
        <BotanicalCorner
          className="absolute bottom-0 left-0 -scale-y-100"
          style={box}
        />
        <BotanicalCorner
          className="absolute bottom-0 right-0 -scale-100"
          style={box}
        />
      </div>
    </div>
  );
}

/* ===========================================================================
   PROGRAM İKONLARI
   Referanstaki zaman çizelgesinde her satırın başında daire içinde bir
   ikon var. Program başlığındaki anahtar kelimeye göre eşleştiriliyor.
   ========================================================================= */

const ICON_STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ICONS = {
  /** Nikâh, tören */
  rings: (
    <g {...ICON_STROKE}>
      <circle cx="9.5" cy="14.5" r="5.5" />
      <circle cx="14.5" cy="14.5" r="5.5" />
      <path d="M12 4.2 14 6.6h-4L12 4.2Z" />
    </g>
  ),
  /** Karşılama, kokteyl */
  glass: (
    <g {...ICON_STROKE}>
      <path d="M7 3h10l-1.2 5.2A4 4 0 0 1 12 11.4 4 4 0 0 1 8.2 8.2Z" />
      <path d="M12 11.4V19M8.5 21h7" />
    </g>
  ),
  /** Yemek */
  dining: (
    <g {...ICON_STROKE}>
      <path d="M7 3v7M5 3v4a2 2 0 0 0 2 2M9 3v4a2 2 0 0 1-2 2M7 10v11" />
      <path d="M17 3c-1.6 1.2-2.4 3-2.4 5s.8 3 2.4 3.2V21" />
    </g>
  ),
  /** Müzik, dans */
  music: (
    <g {...ICON_STROKE}>
      <path d="M9 18V5.5l10-2V16" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </g>
  ),
  /** İlk dans, kalp */
  heart: (
    <g {...ICON_STROKE}>
      <path d="M12 20.2 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13Z" />
    </g>
  ),
  /** Pasta */
  cake: (
    <g {...ICON_STROKE}>
      <path d="M4 20h16v-6a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3Z" />
      <path d="M4 15.5c1.6 1.4 3.2 1.4 4.8 0s3.2-1.4 4.8 0 3.2 1.4 4.8 0" />
      <path d="M12 8V5M9 8V6M15 8V6" />
    </g>
  ),
  /** Havai fişek, kutlama */
  sparkle: (
    <g {...ICON_STROKE}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6 8.4 8.4M15.6 15.6l2.8 2.8M18.4 5.6 15.6 8.4M8.4 15.6l-2.8 2.8" />
    </g>
  ),
  /** Kına */
  henna: (
    <g {...ICON_STROKE}>
      <path d="M12 21c4-2.6 6-5.6 6-9a6 6 0 0 0-12 0c0 3.4 2 6.4 6 9Z" />
      <path d="M12 15.5V9M12 11.5 9.8 9.6M12 11.5l2.2-1.9" />
    </g>
  ),
  /** Uğurlama, kapanış */
  moon: (
    <g {...ICON_STROKE}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </g>
  ),
} as const;

export type ProgramIconName = keyof typeof ICONS;

/**
 * Program satırının başlığından ikon seçer.
 *
 * Müşteriden ikon istemek yerine metinden çıkarıyoruz: sipariş formu
 * zaten uzun ve "Nikâh Töreni" yazan bir satırın hangi ikonu istediği
 * belli. Eşleşme bulunamazsa nötr bir yıldıza düşer.
 */
export function programIcon(title: string): ProgramIconName {
  const t = title.toLocaleLowerCase("tr");
  const has = (...words: string[]) => words.some((w) => t.includes(w));

  if (has("nikah", "nikâh", "tören", "toren", "söz", "soz", "yüzük", "yuzuk"))
    return "rings";
  if (has("karşılama", "karsilama", "kokteyl", "resepsiyon", "kabul"))
    return "glass";
  if (has("yemek", "akşam yemeği", "menü", "menu", "ziyafet")) return "dining";
  if (has("dans", "ilk dans")) return "heart";
  if (has("müzik", "muzik", "orkestra", "dj", "eğlence", "eglence"))
    return "music";
  if (has("pasta", "kesim")) return "cake";
  if (has("kına", "kina")) return "henna";
  if (has("uğurlama", "ugurlama", "veda", "kapanış", "kapanis", "bitiş"))
    return "moon";
  return "sparkle";
}

/** Daire içinde program ikonu — zaman çizelgesinin madde işareti. */
export function ProgramIcon({
  name,
  className,
}: {
  name: ProgramIconName;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}
