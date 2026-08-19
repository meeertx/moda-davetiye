/**
 * Tema kataloğu — prototipteki üç ayrı sayfada (tasarimlar, tasarim-detay,
 * admin-temalar) tekrar eden tema listelerinin tek kaynağı.
 *
 * `stripe` alanları prototipte gerçek tema görsellerinin yerini tutan
 * yer tutucu desenlerdir; gerçek görseller geldiğinde `image` alanı eklenip
 * bunlar kaldırılacak.
 */

export type ThemeCategory = "dugun" | "nisan" | "kina" | "save_the_date";

export interface ThemePromptInfo {
  /** AI Görsel Üretim Promptu (İngilizce) */
  aiPrompt: string;
  /** Türkçe Tasarım Özeti */
  designSummary: string;
  /** Düzenlenebilir parametre açıklamaları */
  editableParams: string[];
  /** Görsel format oranı (varsayılan: "9:16") */
  aspectRatio?: string;
  /** Midjourney parametre tavsiyeleri */
  midjourneyParams?: string;
}

export interface Theme {
  slug: string;
  name: string;
  category: ThemeCategory;
  categoryLabel: string;
  tierLabel: string;
  blurb: string;
  longDesc: string;
  features: string[];
  /** Galeri/detay kartlarındaki geniş desen */
  stripe: string;
  /** Admin tablosundaki küçük önizleme deseni */
  stripeSmall: string;
  /** Admin panelindeki sıra ve yayın durumu */
  order: number;
  active: boolean;
  /** AI görsel üretim promptu & tasarım detayları */
  promptInfo?: ThemePromptInfo;
}

export const THEMES: Theme[] = [
  {
    slug: "royal-starlight",
    name: "Royal Starlight — Altın Galaksi & Işık Gösterisi",
    category: "dugun",
    categoryLabel: "Düğün (Amiral Gemisi)",
    tierLabel: "Ultra VIP",
    blurb: "İnteraktif 3D parçacıklar, altın yaldız şimmer, 3D kartlar & büyüleyici atmosfer.",
    longDesc:
      "Royal Starlight, en üst düzey düğünler için tasarlanmış amiral gemisi dijital davetiyemizdir. Canlı altın parçacık motoru (Canvas), fareye duyarlı 3D kart eğimleri, ışıklı galeri lightbox'ı, altın mühürlü zarf animasyonu ve görkemli tipografisiyle misafirlerinize unutulmaz bir ilk izlenim sunar.",
    features: [
      "İnteraktif 3D Parçacık Motoru (Canvas)",
      "3D Fareye Duyarlı Eğimli Kartlar (Tilt Cards)",
      "Altın Mühürlü Zarf & Müzik Oynatıcı",
      "Tam Ekran Işıklı Fotoğraf Lightbox'ı",
      "Göz Alıcı Metalik Geri Sayım",
      "Katılım Bildirimi (RSVP) & Anı Duvarı",
    ],
    stripe:
      "radial-gradient(ellipse at center, oklch(78% 0.16 75) 0%, oklch(15% 0.03 260) 80%)",
    stripeSmall:
      "radial-gradient(ellipse at center, oklch(78% 0.16 75) 0%, oklch(15% 0.03 260) 80%)",
    order: 1,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical luxury wedding invitation cover design, 9:16 ratio. Royal midnight navy and obsidian background with glowing floating gold dust particles, cinematic golden light rays streaming from the top. Elegant 3D gold foil typography reading "Royal Starlight" with calligraphy script names "Mert & Ece" in polished champagne gold lettering. Diamond and gold metallic ornament frames. Ultra high-end, luxurious, state-of-the-art stationery aesthetic, 8k resolution render.',
      designSummary:
        "İnteraktif 3D parçacıklar, fareye duyarlı cam efektli 3D kartlar, altın mühürlü zarf ve canlı altın parıltı ışık efektleriyle büyüleyici amiral gemisi düğün davetiyesi.",
      editableParams: ['"Mert & Ece" -> Çiftin İsimleri'],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "altin-bahce-kapisi",
    name: "Modern — Altın Bahçe Kapısı",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Premium",
    blurb: "Görkemli altın kapı, beyaz güller ve sarmaşıklar.",
    longDesc:
      "Görkemli İngiliz bahçesi tarzı altın parmaklıklı bir kapı, açılırken ekranda görünen süslemalı sarmaşıklar, beyaz güller, boş bir peyzaj ve mavi gökyüzü arka planı. Zarif, modern bir atmosfer.",
    features: [
      "Açılış kapısı animasyonu",
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(92% 0.05 85) 0 12px, oklch(97% 0.02 85) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(92% 0.05 85) 0 6px, oklch(97% 0.02 85) 6px 12px)",
    order: 1,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation cover design, 9:16 ratio. A beautiful golden wrought iron garden gate in front of an elegant estate setting, the gate decorated with ivory roses and climbing ivy cascading down. Background: a soft blue sky with white clouds, garden path stones, and manicured greenery. The gate has an arched top, and center reads "Our Wedding" in elegant hand-lettered calligraphy script, with the names "Mert & Ece" below in serif typeface. Soft, warm, romantic lighting. Gold accents, ivory and sage green color palette. Luxury stationery illustration aesthetic. High quality, sharp details.',
      designSummary:
        "Görkemli İngiliz bahçesi tarzı altın parmaklıklı bir kapı, açılırken ekranda görünen süslemalı sarmaşıklar, beyaz güller, boş bir peyzaj ve mavi gökyüzü arka planı. Zarif, modern bir atmosfer.",
      editableParams: ['"Mert & Ece" -> Çiftin İsimleri'],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "atelier-indigo",
    name: "Atelier Indigo — Mürekkep Sanatı",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Standart+",
    blurb: "Koyu lacivert mürekkep lekesi ve el yazması zarafet.",
    longDesc:
      "Koyu lacivert (indigo) tonlarında, mürekkep lekesi ve el yazması mürekkep damla estetiği, sade ve zamansız bir şıklık, artisan (el işçiliği) teması.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
    ],
    stripe:
      "repeating-linear-gradient(90deg, oklch(25% 0.08 250) 0 16px, oklch(32% 0.06 250) 16px 32px)",
    stripeSmall:
      "repeating-linear-gradient(90deg, oklch(25% 0.08 250) 0 8px, oklch(32% 0.06 250) 8px 16px)",
    order: 2,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. An elegant indigo blue ink wash background with soft watercolor ink bleed textures and scattered ink drop dots. A single tasteful calligraphy script reading "Join us" in white, below it "Mert & Ece" in modern serif typeface. Minimalist, artisanal, letterpress-inspired composition. Centered typographic layout with elegant negative space. Deep navy blue (#1a2b54) color palette, accent ivory white details. Letterpress paper texture feel. Refined, timeless, elegant mood.',
      designSummary:
        "Koyu lacivert (indigo) tonlarında, mürekkep lekesi ve el yazması mürekkep damla estetiği, sade ve zamansız bir şıklık, artisan (el işçiliği) teması.",
      editableParams: ['"Mert & Ece" -> Çiftin İsimleri'],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "couplet-kugular",
    name: "Couplet — Kuru Çiçek & Kuğular",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Standart+",
    blurb: "Oval kuru çiçek çelengi ve birbirine dönük kuğular.",
    longDesc:
      "Oval kuru çiçek (preserved flowers) çelengi ortasında, birbirine dönük iki beyaz kuğu figürü. Bohem, rustik romantik bir atmosfer, krem dokulu arka plan.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(88% 0.04 60) 0 12px, oklch(94% 0.02 60) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(88% 0.04 60) 0 6px, oklch(94% 0.02 60) 6px 12px)",
    order: 3,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. An oval wreath made of dried preserved flowers (pampas grass, wheat, pale roses, dried lavender, eucalyptus leaves) framing the center. In the center, two white elegant swans facing each other forming a heart shape with their necks. Background: cream beige parchment paper texture with subtle grain. Elegant hand-drawn calligraphy script "Mert & Ece" in earthy terracotta color, with serif typeface subtitle "Save the Date". Warm, bohemian, rustic romantic tone. Dried flower herbarium aesthetic. Soft natural lighting.',
      designSummary:
        "Oval kuru çiçek (preserved flowers) çelengi ortasında, birbirine dönük iki beyaz kuğu figürü. Bohem, rustik romantik bir atmosfer, krem dokulu arka plan.",
      editableParams: ['"Mert & Ece" -> Çiftin İsimleri'],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "jasmine-pembe-yasemin",
    name: "Jasmine — Pembe Yasemin Çelenk",
    category: "nisan",
    categoryLabel: "Nişan",
    tierLabel: "Standart+",
    blurb: "Pembe yasemin çiçekleri ve monogram çelenk.",
    longDesc:
      "Pembe yasemin çiçekleri ve çelenk formu, bahar bahçesi havası, romantik bohem bir stil. Monogram tasarımı önemli.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(90% 0.05 15) 0 12px, oklch(96% 0.02 15) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(90% 0.05 15) 0 6px, oklch(96% 0.02 15) 6px 12px)",
    order: 4,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. A delicate botanical wreath made of blooming jasmine flowers (white-pink blossoms) and trailing green leaves framing the center. In the center, an elegant hand-drawn floral monogram with initials "M & E" intertwined, surrounded by jasmine flowers and small buds. Background: pale blush pink, cream watercolor wash. Feminine, romantic, spring garden, boho elegant style. Elegant calligraphy script reading "Mert & Ece" in blush pink and gold. Soft morning light glow.',
      designSummary:
        "Pembe yasemin çiçekleri ve çelenk formu, bahar bahçesi havası, romantik bohem bir stil. Monogram tasarımı ön planda.",
      editableParams: [
        '"M & E" -> Çiftin Baş Harfleri',
        '"Mert & Ece" -> Çiftin İsimleri',
      ],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "mansion-lights",
    name: "Mansion Lights — Gündüz-Gece Malikane",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Premium",
    blurb: "Lüks malikane cephesi, gündüzden geceye ışık efekti.",
    longDesc:
      "Lüks bir konak/malikane cephesi, gündüz ışığından gece ışıklarına geçiş efekti, avizeler ve salon ışıkları. Grand, gala düğün atmosferi.",
    features: [
      "Gece/gündüz geçiş efekti",
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
    ],
    stripe:
      "repeating-linear-gradient(120deg, oklch(35% 0.06 240) 0 12px, oklch(85% 0.08 75) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(120deg, oklch(35% 0.06 240) 0 6px, oklch(85% 0.08 75) 6px 12px)",
    order: 5,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. An elegant illustration of a grand mansion estate facade, split scene: upper half is the same mansion in soft daylight with blue sky, lower half transitions to the same mansion at twilight glowing with golden chandelier lights through windows. Transition line creates a day-to-night effect. Luxury ballroom gala vibe. Gold, deep navy blue, warm amber color palette. Calligraphy script "Mert & Ece" in gold foil lettering. Refined, grand, elegant, royal wedding mood. Fine architectural illustration style.',
      designSummary:
        "Lüks bir konak/malikane cephesi, gündüz ışığından gece ışıklarına geçiş efekti, avizeler ve salon ışıkları. Grand, gala düğün atmosferi.",
      editableParams: ['"Mert & Ece" -> Çiftin İsimleri'],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "arch-botanik-demir-kapi",
    name: "Arch — Demir Kapı & Botanik Çiçekler",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Standart+",
    blurb: "El çizimi mürekkep demir kapı, lale ve kır çiçekleri.",
    longDesc:
      "El çizimi mürekkep tarzı demir parmaklıklı bahçe kapısı, lale, menekşe ve kır çiçekleri, arabesk süslemeler, kapakta kalp motifi.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(95% 0.02 120) 0 12px, oklch(88% 0.05 120) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(95% 0.02 120) 0 6px, oklch(88% 0.05 120) 6px 12px)",
    order: 6,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. A hand-drawn ink pen illustration of an ornate wrought iron arched garden gate, with arabesque scrollwork and a heart motif at the apex. Decorated with tulips (red, yellow, pink), wildflowers, and violet accents climbing the gate frame. Hanging greenery and wisteria cascading from the top. Background: clean ivory white parchment paper. Black ink line art style with hand-colored floral details. Elegant botanical cottage garden aesthetic. Calligraphy script "Mert & Ece" centered on the gate. Vintage hand-drawn engraving feel.',
      designSummary:
        "El çizimi mürekkep tarzı demir parmaklıklı bahçe kapısı, lale, menekşe ve kır çiçekleri, arabesk süslemeler, kapakta kalp motifi.",
      editableParams: ['"Mert & Ece" -> Çiftin İsimleri'],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "meadow-kir-cicekleri",
    name: "Meadow — Suluboya Kır Çiçekleri",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Başlangıç+",
    blurb: "Suluboya kır çiçekleri ve ferah pastoral hava.",
    longDesc:
      "Suluboya kır çiçekleri manzarası, çift fotoğrafı, doğal ve ferah bir pastoral atmosfer.",
    features: [
      "Geri sayım",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
    ],
    stripe:
      "repeating-linear-gradient(90deg, oklch(92% 0.04 100) 0 16px, oklch(97% 0.02 100) 16px 32px)",
    stripeSmall:
      "repeating-linear-gradient(90deg, oklch(92% 0.04 100) 0 8px, oklch(97% 0.02 100) 8px 16px)",
    order: 7,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. A loose watercolor painting of a wildflower meadow, soft green and cream tones, scattered wildflowers in pink, lilac, and pale yellow. Soft brush strokes, painterly organic shapes. Center area reserved for text: elegant calligraphy "Mert & Ece" in warm earthy color, with serif subtitle "Save the Date 29.07.2027". Soft natural daylight, serene meadow, fresh natural feel. Pastoral, artisan watercolor illustration style. High resolution, delicate paper texture overlay.',
      designSummary:
        "Suluboya kır çiçekleri manzarası, çift fotoğrafı, doğal ve ferah bir pastoral atmosfer.",
      editableParams: [
        '"Mert & Ece" -> Çiftin İsimleri',
        '"29.07.2027" -> Etkinlik Tarihi',
      ],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "magnolia-saf-beyaz",
    name: "Magnolia — Saf Beyaz Zarafet",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Standart+",
    blurb: "Suluboya manolya çiçekleri ve uçan kelebekler.",
    longDesc:
      "Suluboya manolya çiçekleri ve uçan kelebekler, tertemiz zarif bir şıklık, ilkbahar havası.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(96% 0.01 90) 0 12px, oklch(92% 0.03 90) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(96% 0.01 90) 0 6px, oklch(92% 0.03 90) 6px 12px)",
    order: 8,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. Delicate watercolor magnolia blossoms in white, cream, and pale pink tones with soft green leaves, framing the top and bottom. Several watercolor butterflies (pale blue and lavender) softly flying around the composition. Background: very soft cream ivory watercolor wash. Elegant calligraphy script "Mert & Ece" centered, with a serif "Wedding Invitation" subtitle. Pure, ethereal, elegant spring garden aesthetic. Soft glowing light. Botanical romantic illustration.',
      designSummary:
        "Suluboya manolya çiçekleri ve uçan kelebekler, tertemiz zarif bir şıklık, ilkbahar havası.",
      editableParams: ['"Mert & Ece" -> Çiftin İsimleri'],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "botanical-tropik-yesil",
    name: "Botanical — Tropik Yeşil & Kelebekler",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Premium",
    blurb: "Yoğun yeşil sarmaşıklar ve kelebekler.",
    longDesc:
      "Yoğun yeşil sarmaşıklar ve kelebekler, botanik bahçe havası, egzotik doğal bir atmosfer.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(38% 0.11 145) 0 12px, oklch(48% 0.10 145) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(38% 0.11 145) 0 6px, oklch(48% 0.10 145) 6px 12px)",
    order: 9,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. A lush botanical composition of dense green tropical leaves and vines (monstera, fern, eucalyptus) framing the border. Colorful tropical butterflies (pale blue, lavender, soft yellow) fluttering among the leaves. Background: rich deep botanical green gradient with subtle texture. Elegant calligraphy "Mert & Ece" in gold foil script centered. Exotic botanical garden wedding, lush green romantic vibe. Highly detailed botanical illustration, luxury stationery feel.',
      designSummary:
        "Yoğun yeşil sarmaşıklar ve kelebekler, botanik bahçe havası, egzotik doğal bir atmosfer.",
      editableParams: ['"Mert & Ece" -> Çiftin İsimleri'],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "dream-mum-muhur",
    name: "Dream — Mum Mühürlü Zarf",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Premium",
    blurb: "Gerçekçi krem kağıt zarf ve altın mum mühür.",
    longDesc:
      "Gerçekçi fotoğraf kalitesinde krem dokulu kağıt zarf, altın mum mührü üzerinde monogram, lüks stationery estetiği.",
    features: [
      "Zarf açılış animasyonu",
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
    ],
    stripe:
      "repeating-linear-gradient(90deg, oklch(93% 0.03 70) 0 16px, oklch(86% 0.05 70) 16px 32px)",
    stripeSmall:
      "repeating-linear-gradient(90deg, oklch(93% 0.03 70) 0 8px, oklch(86% 0.05 70) 8px 16px)",
    order: 10,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. A realistic photograph of a luxurious cream textured paper envelope with a wax seal in the center. The wax seal is ivory and gold colored, with embossed monogram initials "M & E". The envelope has subtle paper grain texture, soft warm golden lighting like sunlight filtering through trees. Elegant letterpress stationery aesthetic, luxury wedding invitation, timeless elegance. Calligraphy script reading "Mert & Ece" below. Cinematic soft focus background, refined and premium mood.',
      designSummary:
        "Gerçekçi fotoğraf kalitesinde krem dokulu kağıt zarf, altın mum mührü üzerinde 'M & E' monogramı, lüks stationery estetiği.",
      editableParams: [
        '"M & E" -> Monogram Baş Harfleri',
        '"Mert & Ece" -> Çiftin İsimleri',
      ],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "lavender-provence",
    name: "Lavender — Provençe Mor Romantizmi",
    category: "nisan",
    categoryLabel: "Nişan",
    tierLabel: "Standart+",
    blurb: "Suluboya lavanta dalları, Fransız çiftlik estetiği.",
    longDesc:
      "Suluboya lavanta dalları, Provençe / Fransız lavanta çiftliği estetiği, mor ve yeşil tonlar, sakin romantik bir atmosfer.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(88% 0.05 300) 0 12px, oklch(95% 0.02 300) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(88% 0.05 300) 0 6px, oklch(95% 0.02 300) 6px 12px)",
    order: 11,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. Soft watercolor illustration of lavender stems and sprigs arranged in a loose vertical bouquet on the right side. Background: pale cream lavender-washed watercolor wash. Elegant calligraphy script "Mert & Ece" in deep lavender purple, with serif "Save the Date" subtitle. Soft, serene, French Provençal lavender field romantic mood. Delicate painterly brushwork, soft natural daylight. Soft purple and green color palette, elegant and calm.',
      designSummary:
        "Suluboya lavanta dalları, Provençe / Fransız lavanta çiftliği estetiği, mor ve yeşil tonlar, sakin romantik bir atmosfer.",
      editableParams: ['"Mert & Ece" -> Çiftin İsimleri'],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "wisteria-mor-salkim",
    name: "Wisteria — Mor Salkım Çiçekleri",
    category: "save_the_date",
    categoryLabel: "Save the Date",
    tierLabel: "Başlangıç+",
    blurb: "Suluboya sarkan mor salkım çiçekleri.",
    longDesc:
      "Suluboya wisteria (mor salkım) çiçekleri sarkık bir kompozisyon, Japon / Fransız bahçesi romantizmi.",
    features: ["Geri sayım", "Harita/konum", "Takvime ekle"],
    stripe:
      "repeating-linear-gradient(90deg, oklch(84% 0.07 290) 0 14px, oklch(94% 0.03 290) 14px 28px)",
    stripeSmall:
      "repeating-linear-gradient(90deg, oklch(84% 0.07 290) 0 7px, oklch(94% 0.03 290) 7px 14px)",
    order: 12,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. Delicate watercolor wisteria flowers cascading in long drooping clusters from the top, purple, lavender and soft blue-mauve tones, with soft green leaves. Background: soft cream watercolor wash. Elegant hand-lettered calligraphy "Save the Date" centered, with "Mert & Ece" in elegant serif below, and "29.07.2027" below in smaller serif. Romantic Japanese-French garden aesthetic. Soft natural daylight, ethereal delicate painting style.',
      designSummary:
        "Suluboya wisteria (mor salkım) çiçekleri sarkık bir kompozisyon, Japon / Fransız bahçesi romantizmi.",
      editableParams: [
        '"Mert & Ece" -> Çiftin İsimleri',
        '"29.07.2027" -> Etkinlik Tarihi',
      ],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "slot-machine-retro",
    name: "Slot Machine — Retro Eğlenceli Sürpriz",
    category: "save_the_date",
    categoryLabel: "Save the Date",
    tierLabel: "Başlangıç+",
    blurb: "Vintage slot makinesi ile sürprizli tarih duyurusu.",
    longDesc:
      "Vintage slot makinesi çizimi, eğlenceli ve retro bir atmosfer, kalp ve düğün sembolleri, sürprizli tarih reveal konsepti.",
    features: ["İnteraktif tarih çarkı", "Geri sayım", "Takvime ekle"],
    stripe:
      "repeating-linear-gradient(45deg, oklch(88% 0.08 10) 0 12px, oklch(95% 0.04 10) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(88% 0.08 10) 0 6px, oklch(95% 0.04 10) 6px 12px)",
    order: 13,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. A cute retro illustrated slot machine in soft pink, gold, and white color palette, decorated with hearts, stars, and wedding symbols (rings, doves). The slot reels display the date "29 / 07 / 2027". A vintage pull lever on the side. Background: soft pastel pink gradient with playful confetti and sparkles. Fun, quirky, playful retro vibe. Bold serif typeface "Mert & Ece" at the top in playful style, with "Save the Date" below. Cheerful, whimsical, celebratory mood. Hand-drawn illustration aesthetic.',
      designSummary:
        "Vintage slot makinesi çizimi, eğlenceli ve retro bir atmosfer, kalp ve düğün sembolleri, sürprizli tarih reveal konsepti.",
      editableParams: [
        '"29 / 07 / 2027" -> Tarih Göstergesi',
        '"Mert & Ece" -> Çiftin İsimleri',
      ],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "under-soft-lights",
    name: "Under Soft Lights — Fairy Light Sketch",
    category: "save_the_date",
    categoryLabel: "Save the Date",
    tierLabel: "Başlangıç+",
    blurb: "Fairy light ışıklı romantik ağaç altı skeci.",
    longDesc:
      "Siyah kalem/ink çizim tarzında açık hava restoran sahnesi, sarkan fairy light ışıklı bir ağaç altında romantik yemek masası. Minimalist ve romantik.",
    features: ["Geri sayım", "Harita/konum", "Takvime ekle"],
    stripe:
      "repeating-linear-gradient(90deg, oklch(95% 0.01 80) 0 16px, oklch(90% 0.02 80) 16px 32px)",
    stripeSmall:
      "repeating-linear-gradient(90deg, oklch(95% 0.01 80) 0 8px, oklch(90% 0.02 80) 8px 16px)",
    order: 14,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio. A black ink pen sketch hand-drawn illustration of a romantic outdoor scene: under a large tree with hanging string fairy lights (warm glowing bulbs), a small table set for two with white tablecloth, two chairs, a vase with a single rose, wine bottle and glasses. In the background, a classical architectural column and a flowering bush. Background: warm cream parchment paper texture, black line art ink drawing style with subtle hand-colored warm light glow on the fairy lights. Elegant calligraphy "Save the Date" with "Mert & Ece" in handwritten script. Intimate, romantic, minimalist line art aesthetic.',
      designSummary:
        "Siyah kalem/ink çizim tarzında açık hava restoran sahnesi, sarkan fairy light ışıklı bir ağaç altında romantik yemek masası. Minimalist ve romantik.",
      editableParams: ['"Mert & Ece" -> Çiftin İsimleri'],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  {
    slug: "nar-oryantal-kina",
    name: "Nar — Oryantal Kına Gecesi",
    category: "kina",
    categoryLabel: "Kına",
    tierLabel: "Premium",
    blurb: "Bordo kadife perde, altın avize ve Osmanlı sarayı estetiği.",
    longDesc:
      "Kırmızı/bordo kadife perde sahne arka planı, altın avize, oryantal / Osmanlı sarayı estetiği, lüks kına gecesi atmosferi.",
    features: [
      "Geri sayım",
      "Kına müziği oynatıcı",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
      "Özel kına notu",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(40% 0.15 25) 0 12px, oklch(50% 0.14 25) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(40% 0.15 25) 0 6px, oklch(50% 0.14 25) 6px 12px)",
    order: 15,
    active: true,
    promptInfo: {
      aiPrompt:
        'A vertical wedding invitation design, 9:16 ratio, for a Turkish henna night (kına gecesi) celebration. Rich deep crimson red velvet curtains on either side as a stage backdrop, an ornate golden crystal chandelier hanging from the top center, luxurious Ottoman palace aesthetic. Gold ornamental arabesque patterns and traditional henna motifs in the corners. Elegant calligraphy script "Kına Gecesi" in gold, with "Mert & Ece" in serif typeface below. Background: deep red and gold color palette, warm candlelit glow. Luxurious, oriental, regal mood. Highly detailed ornamental illustration.',
      designSummary:
        "Kırmızı/bordo kadife perde sahne arka planı, altın avize, oryantal / Osmanlı sarayı estetiği, lüks kına gecesi atmosferi.",
      editableParams: ['"Mert & Ece" -> Çiftin İsimleri'],
      aspectRatio: "9:16",
      midjourneyParams: "--ar 9:16 --v 6 --style raw",
    },
  },
  // Geriye dönük uyumluluk için eski slug tanımları
  {
    slug: "belle-epoque",
    name: "Belle Époque",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Standart+",
    blurb: "Vintage zarafet, yaldız detaylar.",
    longDesc:
      "Belle Époque, ipek dokulu arka planlar ve ince yaldız çizgilerle klasik bir düğün havası sunar. Serif başlıklar ve yumuşak geçiş animasyonlarıyla davetinizi bir davet kartı zarafetinde dijitale taşır.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(93% 0.02 78) 0 12px, oklch(97% 0.012 78) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(93% 0.02 78) 0 6px, oklch(97% 0.012 78) 6px 12px)",
    order: 16,
    active: true,
  },
  {
    slug: "kalp-cizgisi",
    name: "Kalp Çizgisi",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Başlangıç+",
    blurb: "Modern, sade çizgisel tasarım.",
    longDesc:
      "Tek çizgi illüstrasyon estetiğiyle minimal ve modern bir düğün deneyimi. Bol beyaz alan, ince tipografi ve yumuşak kaydırma efektleriyle sade ama unutulmaz.",
    features: [
      "Geri sayım",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
    ],
    stripe:
      "repeating-linear-gradient(90deg, oklch(95% 0.006 75) 0 16px, oklch(98% 0.004 75) 16px 32px)",
    stripeSmall:
      "repeating-linear-gradient(90deg, oklch(95% 0.006 75) 0 8px, oklch(98% 0.004 75) 8px 16px)",
    order: 17,
    active: true,
  },
  {
    slug: "zeytin-bahcesi",
    name: "Zeytin Bahçesi",
    category: "nisan",
    categoryLabel: "Nişan",
    tierLabel: "Standart+",
    blurb: "Ege esintili, zeytin yeşili doku.",
    longDesc:
      "Zeytin yaprağı motifleri ve toprak tonlarıyla Ege kıyısında bir nişan atmosferi. Doğal dokular ve sıcak aydınlatma hissi veren renk paleti.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(88% 0.05 140) 0 12px, oklch(94% 0.03 140) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(88% 0.05 140) 0 6px, oklch(94% 0.03 140) 6px 12px)",
    order: 18,
    active: true,
  },
  {
    slug: "kirmizi-kina",
    name: "Kırmızı Kına",
    category: "kina",
    categoryLabel: "Kına",
    tierLabel: "Premium",
    blurb: "Geleneksel motifler, canlı kırmızı.",
    longDesc:
      "Geleneksel kına gecesi ruhunu canlı kırmızı ve yaldız işlemeli motiflerle yansıtır. Ritmik animasyonlar ve özel müzik kütüphanesiyle eğlenceli bir davet deneyimi.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
      "Özel davetli notu",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(45% 0.14 25) 0 12px, oklch(50% 0.13 25) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(45% 0.14 25) 0 6px, oklch(50% 0.13 25) 6px 12px)",
    order: 19,
    active: true,
  },
  {
    slug: "soz-vakti",
    name: "Söz Vakti",
    category: "save_the_date",
    categoryLabel: "Save the Date",
    tierLabel: "Başlangıç+",
    blurb: "Lacivert, kısa ve öz duyuru.",
    longDesc:
      "Tarih duyurusu için tasarlanmış, lacivert zemin üzerine krem tipografiyle sakin ve şık bir save-the-date. Tek ekranlık, hızlı yüklenen deneyim.",
    features: ["Geri sayım", "Harita/konum", "Takvime ekle"],
    stripe:
      "repeating-linear-gradient(90deg, oklch(30% 0.04 260) 0 14px, oklch(35% 0.035 260) 14px 28px)",
    stripeSmall:
      "repeating-linear-gradient(90deg, oklch(30% 0.04 260) 0 7px, oklch(35% 0.035 260) 7px 14px)",
    order: 20,
    active: true,
  },
  {
    slug: "mermer-yaldiz",
    name: "Mermer & Yaldız",
    category: "dugun",
    categoryLabel: "Düğün",
    tierLabel: "Premium",
    blurb: "Siyah mermer dokusu, yaldız çizgiler.",
    longDesc:
      "Koyu mermer dokusu ve ince yaldız çizgileriyle en prestijli temamız. Video arka plan desteği ve özel davetli galerisiyle üst segment düğünler için tasarlandı.",
    features: [
      "Geri sayım",
      "Müzik oynatıcı",
      "Harita/konum",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
      "Hediye/IBAN bilgisi",
    ],
    stripe:
      "repeating-linear-gradient(120deg, oklch(20% 0.01 50) 0 10px, oklch(26% 0.015 50) 10px 20px, oklch(20% 0.01 50) 20px 30px)",
    stripeSmall:
      "repeating-linear-gradient(120deg, oklch(20% 0.01 50) 0 5px, oklch(26% 0.015 50) 5px 10px)",
    order: 21,
    active: false,
  },
  {
    slug: "nisan-cemberi",
    name: "Nişan Çemberi",
    category: "nisan",
    categoryLabel: "Nişan",
    tierLabel: "Standart+",
    blurb: "Pudra pembesi, dairesel çerçeveler.",
    longDesc:
      "Pudra pembesi tonlar ve dairesel çerçeve motifleriyle romantik bir nişan davetiyesi. Fotoğraf odaklı galeri düzeni ön plandadır.",
    features: [
      "Geri sayım",
      "Fotoğraf galerisi",
      "RSVP formu",
      "Program/timeline",
    ],
    stripe:
      "repeating-linear-gradient(45deg, oklch(90% 0.04 20) 0 12px, oklch(95% 0.025 20) 12px 24px)",
    stripeSmall:
      "repeating-linear-gradient(45deg, oklch(90% 0.04 20) 0 6px, oklch(95% 0.025 20) 6px 12px)",
    order: 22,
    active: true,
  },
];

export function getTheme(slug: string): Theme | undefined {
  return THEMES.find((t) => t.slug === slug);
}

/** Galeri filtresi — "dugun_nisan" iki kategoriyi birleştirir. */
export const THEME_CATEGORIES = [
  { key: "all", label: "Tümü" },
  { key: "dugun_nisan", label: "Düğün & Nişan" },
  { key: "kina", label: "Kına" },
  { key: "save_the_date", label: "Save the Date" },
] as const;

export type ThemeFilterKey = (typeof THEME_CATEGORIES)[number]["key"];

export function filterThemes(key: string): Theme[] {
  if (key === "all") return THEMES;
  if (key === "dugun_nisan")
    return THEMES.filter((t) => t.category === "dugun" || t.category === "nisan");
  return THEMES.filter((t) => t.category === key);
}

