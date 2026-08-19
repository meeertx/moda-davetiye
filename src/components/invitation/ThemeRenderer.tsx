import BelleEpoque from "./themes/BelleEpoque";
import KirmiziKina from "./themes/KirmiziKina";
import MermerYaldiz from "./themes/MermerYaldiz";
import KalpCizgisi from "./themes/KalpCizgisi";
import ZeytinBahcesi from "./themes/ZeytinBahcesi";
import SozVakti from "./themes/SozVakti";
import NisanCemberi from "./themes/NisanCemberi";
import RoyalStarlight from "./themes/RoyalStarlight";
import type { ThemeProps } from "@/types/invitation";

const RENDERERS: Record<string, (props: ThemeProps) => React.ReactElement> = {
  // Ultra Lüks & Efektli Amiral Gemisi Temalar
  "royal-starlight": (props) => <RoyalStarlight {...props} />,
  "altin-bahce-kapisi": (props) => <RoyalStarlight {...props} />,
  "mansion-lights": (props) => <RoyalStarlight {...props} />,
  "dream-mum-muhur": (props) => <RoyalStarlight {...props} />,

  // Standart & AI Görsel Üretim Temaları
  "atelier-indigo": (props) => <SozVakti {...props} />,
  "couplet-kugular": (props) => <ZeytinBahcesi {...props} />,
  "jasmine-pembe-yasemin": (props) => <NisanCemberi {...props} />,
  "arch-botanik-demir-kapi": (props) => <KalpCizgisi {...props} />,
  "meadow-kir-cicekleri": (props) => <ZeytinBahcesi {...props} />,
  "magnolia-saf-beyaz": (props) => <BelleEpoque {...props} />,
  "botanical-tropik-yesil": (props) => <ZeytinBahcesi {...props} />,
  "lavender-provence": (props) => <ZeytinBahcesi {...props} />,
  "wisteria-mor-salkim": (props) => <SozVakti {...props} />,
  "slot-machine-retro": (props) => <SozVakti {...props} />,
  "under-soft-lights": (props) => <SozVakti {...props} />,
  "nar-oryantal-kina": (props) => <KirmiziKina {...props} />,

  // Klasik Tema Slug'ları
  "belle-epoque": (props) => <BelleEpoque {...props} />,
  "kirmizi-kina": (props) => <KirmiziKina {...props} />,
  "mermer-yaldiz": (props) => <RoyalStarlight {...props} />,
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
