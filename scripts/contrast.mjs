/**
 * Gerçek sayfada hesaplanmış metin/zemin kontrast oranlarını ölçer.
 * WCAG AA: gövde metni ≥4.5, büyük metin ≥3.
 *
 *   node scripts/contrast.mjs [taban-url]
 *
 * BİLİNEN SINIR: zemin yalnızca `background-color` üzerinden bulunur.
 * Metin bir gradient/desen (`background-image`) üzerindeyse o katman
 * "şeffaf" görünür ve ölçüm bir üst zemine düşerek YANLIŞ POZİTİF üretir —
 * tema kartları ve koyu bindirmeli bölümler bu yüzden hatalı görünebilir.
 * Bulguları raporlamadan önce gözle doğrula.
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3001";

const TARGETS = [
  { url: "/giris", label: "Giriş" },
  { url: "/admin/giris", label: "Admin girişi" },
  { url: "/", label: "Ana sayfa" },
  { url: "/tasarimlar", label: "Tasarımlar" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const results = await (async () => {
  const out = [];
  for (const t of TARGETS) {
    await page.goto(BASE + t.url, { waitUntil: "networkidle" });
    const rows = await page.evaluate(() => {
      const srgb = (c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      const lum = ([r, g, b]) =>
        0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);

      // Tarayıcı oklch/lab renklerini computed style'da lab() olarak döndürür.
      // Elle ayrıştırmak yerine 1×1 canvas'a boyayıp gerçek sRGB'yi okuyoruz.
      const cv = document.createElement("canvas");
      cv.width = cv.height = 1;
      const ctx = cv.getContext("2d", { willReadFrequently: true });
      const parse = (css) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = "#000";
        ctx.fillStyle = css;
        ctx.fillRect(0, 0, 1, 1);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        return [d[0], d[1], d[2], d[3] / 255];
      };

      /** Şeffaf zeminleri atlayıp ilk opak arka planı bulur. */
      const bgOf = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const [r, g, b, a] = parse(getComputedStyle(n).backgroundColor);
          if (a > 0.9) return [r, g, b];
          n = n.parentElement;
        }
        return [251, 248, 244];
      };

      const seen = new Map();
      for (const el of document.querySelectorAll(
        "p, span, a, label, div, h1, h2, h3, button, li, td, th, input",
      )) {
        const text = (el.textContent ?? "").trim();
        const isInput = el.tagName === "INPUT";
        if (!isInput) {
          if (!text || el.children.length > 0) continue;
        }
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;

        const fg = parse(cs.color).slice(0, 3);
        const bg = bgOf(el);
        const L1 = lum(fg), L2 = lum(bg);
        const ratio =
          (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const size = parseFloat(cs.fontSize);
        const weight = Number(cs.fontWeight) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const need = large ? 3 : 4.5;

        if (ratio < need) {
          const key = `${cs.color}|${size}`;
          if (!seen.has(key))
            seen.set(key, {
              sample: (isInput ? el.placeholder : text).slice(0, 42),
              color: cs.color,
              size: `${size}px`,
              ratio: ratio.toFixed(2),
              need,
            });
        }
      }
      return [...seen.values()];
    });
    out.push({ page: t.label, rows });
  }
  return out;
})();

await browser.close();

let fails = 0;
for (const r of results) {
  console.log(`\n=== ${r.page} ===`);
  if (!r.rows.length) {
    console.log("  ✓ kontrast sorunu yok");
    continue;
  }
  for (const row of r.rows) {
    fails++;
    console.log(
      `  ✗ ${row.ratio} (gerekli ${row.need})  ${row.size}  ${row.color}  "${row.sample}"`,
    );
  }
}
console.log(fails ? `\n${fails} kontrast sorunu\n` : "\n✓ tümü geçti\n");
