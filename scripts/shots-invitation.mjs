/**
 * Davetiye temalarının görsel doğrulaması.
 *
 *   node scripts/shots-invitation.mjs [taban-url] [çıktı-klasörü]
 *
 * Her tema için ÜÇ durum yakalanır:
 *   1. kapi   — açılış kapısı (zarf / tipografik kart)
 *   2. acilis — kapı tıklandıktan sonraki ilk ekran
 *   3. tam    — davetiyenin tamamı (full page)
 *
 * Kapı durumunun ayrıca yakalanması bilinçli: geçmişte yalnızca tıklama
 * SONRASI ekran görüntüsü alındığı için kapının şeffaf kaldığı ve
 * içeriğin arkadan sızdığı hata gözden kaçmıştı.
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.argv[2] ?? "http://localhost:3001";
const OUT = process.argv[3] ?? path.join(root, ".shots-tema");
mkdirSync(OUT, { recursive: true });

const THEMES = [
  "belle-epoque",
  "kirmizi-kina",
  "mermer-yaldiz",
  "kalp-cizgisi",
  "zeytin-bahcesi",
  "soz-vakti",
  "nisan-cemberi",
];

const VIEWPORTS = [
  { name: "masaustu", width: 1440, height: 900 },
  { name: "mobil", width: 390, height: 844 },
];

const browser = await chromium.launch();
let problems = 0;

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // Konsol hatalarını yakala — ekran görüntüsü doğru görünse bile
  // çalışma zamanı hatası varsa bilmemiz gerekiyor.
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  for (const theme of THEMES) {
    const url = `${BASE}/davetiye/${theme}`;
    await page.goto(url, { waitUntil: "networkidle" });

    // 1. KAPI
    await page.screenshot({
      path: path.join(OUT, `${theme}-1-kapi-${vp.name}.png`),
    });

    // Kapı gerçekten örtüyor mu? Arkadaki içerik görünür olmamalı.
    const leaked = await page.evaluate(() => {
      const gate = document.querySelector(".fixed.inset-0.z-50");
      if (!gate) return "kapı bulunamadı";
      const style = getComputedStyle(gate);
      const bg = style.backgroundColor;
      // rgba(...,0) ya da transparent = kapı örtmüyor
      if (bg === "transparent" || /,\s*0\)$/.test(bg))
        return `kapı zemini saydam: ${bg}`;
      return null;
    });
    if (leaked) {
      console.log(`  ✗ ${theme} (${vp.name}): ${leaked}`);
      problems++;
    }

    // Zarf, kapı zemininden AYIRT EDİLEBİLİR olmalı. Koyu temaya koyu
    // zarf verildiğinde zarf silik bir dikdörtgene dönüşüyordu ve bu
    // yalnızca ekran görüntüsüne bakılarak fark ediliyordu.
    const contrast = await page.evaluate(() => {
      const gate = document.querySelector(".fixed.inset-0.z-50");
      if (!gate) return null;
      // Zarfın gövdesi: kapının içindeki en büyük gölgeli kutu
      const paper = gate.querySelector('[style*="box-shadow"]');
      if (!paper) return null;

      // Tarayıcı lab()/oklch() döndürebiliyor; gerçek sRGB için 1×1
      // tuvale boyayıp piksel okunuyor.
      const toRgb = (color) => {
        const c = document.createElement("canvas");
        c.width = c.height = 1;
        const ctx = c.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
      };
      const lum = (rgb) => {
        const [r, g, b] = rgb.map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };

      const a = lum(toRgb(getComputedStyle(gate).backgroundColor));
      const b = lum(toRgb(getComputedStyle(paper).backgroundColor));
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      return {
        gate: Math.round(a * 1000) / 1000,
        ratio: Math.round(ratio * 100) / 100,
      };
    });

    /*
      Eşik zeminin koyuluğuna göre değişiyor, çünkü zarfı ayıran şey her
      iki durumda aynı değil:

       · AÇIK zeminde zarfı gölgesi ve kat çizgileri ayırıyor; ölçülen
         parlaklık farkı düşük olsa da (Zeytin Bahçesi 1.2) göz zarfı
         rahatça seçiyor.
       · KOYU zeminde gölge görünmez olduğu için ayrım yalnızca
         parlaklıktan gelebiliyor — burada gerçek bir fark şart.
    */
    if (contrast) {
      const dark = contrast.gate < 0.12;
      const min = dark ? 2 : 1.06;
      if (contrast.ratio < min) {
        console.log(
          `  ✗ ${theme} (${vp.name}): zarf zeminden ayrışmıyor ` +
            `(kontrast ${contrast.ratio}, ${dark ? "koyu" : "açık"} zeminde en az ${min} gerekli)`,
        );
        problems++;
      }
    }

    // 2. AÇILIŞ — kapıdaki düğmeye bas
    const button = page.locator('button:has-text("Davetiyeyi")').first();
    if ((await button.count()) === 0) {
      console.log(`  ✗ ${theme} (${vp.name}): açılış düğmesi yok`);
      problems++;
      continue;
    }
    await button.click();
    // Zarf sahnesi ~2 sn sürüyor; bitmesini bekle
    await page.waitForTimeout(2600);
    await page.screenshot({
      path: path.join(OUT, `${theme}-2-acilis-${vp.name}.png`),
    });

    // 3. KAYDIRILMIŞ — tam sayfa görüntü `position: sticky` öğeleri
    //    doğal konumlarında yakalıyor; sabit panelin gerçekten takip
    //    edip etmediği ancak gerçek bir kaydırmayla görülüyor.
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6));
    await page.waitForTimeout(700);
    await page.screenshot({
      path: path.join(OUT, `${theme}-3-kaydirilmis-${vp.name}.png`),
    });
    await page.evaluate(() => window.scrollTo(0, 0));

    // 4. TAM SAYFA
    await page.screenshot({
      path: path.join(OUT, `${theme}-4-tam-${vp.name}.png`),
      fullPage: true,
    });

    // Yatay taşma kontrolü — mobilde en sık görülen kusur
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    if (overflow > 2) {
      console.log(`  ✗ ${theme} (${vp.name}): ${overflow}px yatay taşma`);
      problems++;
    }

    if (errors.length) {
      console.log(`  ✗ ${theme} (${vp.name}) konsol hatası: ${errors.join(" | ")}`);
      problems += errors.length;
      errors.length = 0;
    }

    console.log(`  ✓ ${theme} (${vp.name})`);
  }

  await context.close();
}

await browser.close();

console.log(
  problems === 0
    ? `\n✓ Sorun bulunmadı — görüntüler: ${OUT}\n`
    : `\n✗ ${problems} sorun — görüntüler: ${OUT}\n`,
);
process.exit(problems ? 1 : 0);
