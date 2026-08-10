import BelleEpoque from "./themes/BelleEpoque";
import KirmiziKina from "./themes/KirmiziKina";
import MermerYaldiz from "./themes/MermerYaldiz";
import KalpCizgisi from "./themes/KalpCizgisi";
import ZeytinBahcesi from "./themes/ZeytinBahcesi";
import SozVakti from "./themes/SozVakti";
import NisanCemberi from "./themes/NisanCemberi";
import type { ThemeProps } from "@/types/invitation";

/**
 * Tema kayıt defteri.
 *
 * Yeni tema eklemek = `themes/` altına bir bileşen yazıp buraya kaydetmek.
 * Sistemin geri kalanı (route, veri okuma, admin editörü) değişmez.
 *
 * Bileşen tipi yerine render fonksiyonu tutuluyor: render sırasında
 * bileşen tipi seçmek React'in kimlik takibini bozabiliyor (aynı ağaçta
 * tema değişince tüm alt ağaç yeniden kurulurdu).
 *
 * Her tema kendi YAPISINI kurar, yalnızca paletini değil:
 *  · Belle Époque   — ortalanmış tek sütun, koyu ipek
 *  · Kırmızı Kına   — sola dayalı, numaralı bölümler, yatay zaman çizelgesi
 *  · Mermer & Yaldız— sabit sol panel + kayan sağ sütun
 *  · Kalp Çizgisi   — açık zemin, minimal, bölümleri bağlayan tek çizgi
 *  · Zeytin Bahçesi — açık zemin, etiket/içerik ızgarası
 *  · Söz Vakti      — tek ekran duyuru, kaydırma yok
 *  · Nişan Çemberi  — çember geometrisi, fotoğraf omurgalı
 */
const RENDERERS: Record<string, (props: ThemeProps) => React.ReactElement> = {
  "belle-epoque": (props) => <BelleEpoque {...props} />,
  "kirmizi-kina": (props) => <KirmiziKina {...props} />,
  "mermer-yaldiz": (props) => <MermerYaldiz {...props} />,
  "kalp-cizgisi": (props) => <KalpCizgisi {...props} />,
  "zeytin-bahcesi": (props) => <ZeytinBahcesi {...props} />,
  "soz-vakti": (props) => <SozVakti {...props} />,
  "nisan-cemberi": (props) => <NisanCemberi {...props} />,
};

/** Tasarımı tamamlanmış temalar — admin editöründe işaretlemek için. */
export const IMPLEMENTED_THEMES = new Set(Object.keys(RENDERERS));

const FALLBACK_THEME = "belle-epoque";

export default function ThemeRenderer(props: ThemeProps) {
  const render =
    RENDERERS[props.content.themeSlug] ?? RENDERERS[FALLBACK_THEME];
  return render(props);
}
