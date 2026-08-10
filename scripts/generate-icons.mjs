/**
 * public/icon.svg'den favicon/PWA türevlerini üretir.
 *
 * Çalıştır:  node scripts/generate-icons.mjs
 * İkon tasarımı değiştiğinde yalnızca public/icon.svg güncellenir,
 * sonra bu script tekrar çalıştırılır.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const source = await readFile(path.join(publicDir, "icon.svg"));

/** SVG'yi verilen kare boyutta PNG buffer'a çevirir. */
const render = (size) =>
  sharp(source, { density: 384 }).resize(size, size).png().toBuffer();

const PNG_TARGETS = [
  { file: "apple-touch-icon.png", size: 180 },
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
];

for (const { file, size } of PNG_TARGETS) {
  await writeFile(path.join(publicDir, file), await render(size));
  console.log(`✓ ${file} (${size}×${size})`);
}

// favicon.ico — eski tarayıcılar için çok boyutlu
const icoSizes = [16, 32, 48];
const ico = await pngToIco(await Promise.all(icoSizes.map(render)));
await writeFile(path.join(publicDir, "favicon.ico"), ico);
console.log(`✓ favicon.ico (${icoSizes.join(", ")})`);
