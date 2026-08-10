/**
 * Müşteri yorumları — ana sayfadaki dönen blok ve /yorumlar sayfasının kaynağı.
 *
 * ⚠️ DİKKAT: Buradaki yorumlar prototipten gelen YER TUTUCU metinlerdir,
 * gerçek müşteri geri bildirimi değildir. Yayına çıkmadan önce gerçek
 * yorumlarla değiştirilmeli.
 *
 * Ayrıca `metin-editor-celiskisi` işaretli kayıtlar, artık var olmayan
 * "müşterinin kendi düzenlediği editör" özelliğinden söz ediyor — ürün
 * concierge modeline geçtiği için bu ifadeler yanıltıcı.
 */

export interface Testimonial {
  quote: string;
  /** İsim — "Elif & Kaan" */
  author: string;
  /** Şehir ya da etkinlik bağlamı — "İstanbul", "Kına Sahibi" */
  context: string;
  /**
   * Ürünün artık sunmadığı bir özellikten söz ediyorsa işaretlenir;
   * gerçek yorumlarla değiştirilirken önceliklendirilsin diye.
   */
  outdated?: boolean;
}

/** Ana sayfada dönen yorumlar. */
export const HOME_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Davetiyemizi açan herkes önce şaşırdı, sonra bayıldı. RSVP takibi de inanılmaz pratikti.",
    author: "Elif & Kaan",
    context: "İstanbul",
  },
  {
    quote:
      "Kına gecemiz için seçtiğimiz tema tam istediğimiz enerjiyi verdi, misafirler linkten müziğe kadar her şeyi beğendi.",
    author: "Sude",
    context: "Kına Sahibi",
  },
  {
    quote:
      "Editör adım adım ilerlediği için hiç kafam karışmadı, 20 dakikada yayına aldım.",
    author: "Mert & Ada",
    context: "İzmir",
    outdated: true,
  },
];

/** /yorumlar sayfasındaki tam liste. */
export const ALL_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Davetiyemizi açan herkes önce şaşırdı, sonra bayıldı. RSVP takibi de inanılmaz pratikti.",
    author: "Elif & Kaan",
    context: "İstanbul",
  },
  {
    quote: "Kına gecemiz için seçtiğimiz tema tam istediğimiz enerjiyi verdi.",
    author: "Sude",
    context: "Kına Sahibi",
  },
  {
    quote:
      "Editör adım adım ilerlediği için hiç kafam karışmadı, 20 dakikada yayına aldım.",
    author: "Mert & Ada",
    context: "İzmir",
    outdated: true,
  },
  {
    quote: "Misafirlerimiz linkten müziğe kadar her şeyi çok beğendi.",
    author: "Naz & Onur",
    context: "İzmir",
  },
  {
    quote: "Fiyatına göre kalitesi gerçekten şaşırtıcı, kesinlikle öneririm.",
    author: "Deniz",
    context: "Ankara",
  },
  {
    quote:
      "RSVP istatistikleri sayesinde organizasyonu çok daha kolay yönettik.",
    author: "Ada & Kerem",
    context: "Bodrum",
  },
];

/** Ana sayfadaki "Nasıl Çalışır" adımları. */
export const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Temanı Seç",
    desc: "Yedi özenle tasarlanmış temadan davetinizin ruhuna en uygun olanı seçin.",
  },
  {
    num: "02",
    title: "Kişiselleştir",
    desc: "İsimleriniz, tarih, konum, hikayeniz ve fotoğraflarınızla adım adım editörde davetiyenizi oluşturun.",
  },
  {
    num: "03",
    title: "Yayınla ve Paylaş",
    desc: "Tek tıkla yayına alın, linki paylaşın, RSVP yanıtlarını panelinizden takip edin.",
  },
];
