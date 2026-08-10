import type { InvitationContent } from "@/types/invitation";
import type { EventType } from "@/types/supabase";
import { getTheme, type ThemeCategory } from "./themes";

/** Tema kategorisi → önizlemede gösterilecek etkinlik türü. */
const CATEGORY_EVENT: Record<ThemeCategory, EventType> = {
  dugun: "dugun",
  nisan: "nisan",
  kina: "kina",
  save_the_date: "save_the_date",
};

/**
 * Tema önizlemelerinde kullanılan örnek içerik.
 *
 * Açıkça kurgusaldır ve önizleme sayfası bunu üstte belirtir — gerçek bir
 * davetiye ya da müşteri verisi değildir. Fotoğraf yok: gerçek görseller
 * gelene kadar uydurma görsel koymak yerine galeri bölümü gizleniyor.
 */

/** Önizleme tarihi hep ileride olsun ki geri sayım çalışsın. */
function demoDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 4);
  d.setHours(18, 0, 0, 0);
  return d.toISOString();
}

export function demoContentFor(themeSlug: string): InvitationContent {
  const theme = getTheme(themeSlug);
  return {
    id: `demo-${themeSlug}`,
    slug: `demo-${themeSlug}`,
    themeSlug,
    eventType: theme ? CATEGORY_EVENT[theme.category] : "dugun",
    brideName: "Elif",
    groomName: "Kaan",
    brideParents: "Sibel & Hakan Yıldırım",
    groomParents: "Gül & Erdem Şahin",
    eventAt: demoDate(),
    venueName: "Sait Halim Paşa Yalısı",
    venueAddress: "Köybaşı Cad. No:83, Sarıyer, İstanbul",
    venueMapUrl: "https://maps.google.com/?q=Sait+Halim+Pasa+Yalisi",
    story:
      "Üniversitede bir kütüphane rafında başlayan hikayemiz, yıllar sonra aynı şehrin farklı bir köşesinde evet demeye vardı. Bu güzel günde yanımızda olmanızı çok isteriz.",
    program: [
      { time: "16:00", title: "Nikah Töreni" },
      { time: "18:00", title: "Kokteyl" },
      { time: "19:30", title: "Yemek ve Dans" },
    ],
    photoUrls: [],
    menu: [
      "Mevsim Salatası",
      "Fırın Levrek",
      "Kuzu Tandır",
      "Sütlü Tatlı Seçkisi",
    ],
    extraInfo:
      "Vale hizmeti mevcuttur\nAnlaşmalı otel: Swissôtel — çift adına %20 indirim\nKıyafet kodu: Şık günlük",
    giftNote: "Varlığınız en güzel hediyemiz olacak.",
    giftIban: null,
    // Önizlemede müzik yok: telifsiz bir parça seçilene kadar ses dosyası
    // koymuyoruz. Açılış kapısı müziksiz de çalışır.
    musicUrl: null,
    musicTitle: null,
    rsvp: {
      enabled: true,
      deadline: null,
      plusOne: true,
      questions: ["Menü tercihiniz? (Et / Vejetaryen)"],
    },
    // Önizlemede form görünsün ama yüklenmiş kare olmasın — gerçek
    // misafir fotoğrafı uydurmuyoruz.
    guestPhotosEnabled: true,
    guestPhotoUrls: [],
    published: false,
  };
}
