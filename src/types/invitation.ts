import type { EventType, ProgramItem } from "./supabase";

/**
 * Bir davetiyenin tüm içeriği.
 *
 * TEMA SÖZLEŞMESİ: her tema bu tipi prop olarak alan bağımsız bir
 * bileşendir. Yeni tema eklemek = yeni bir bileşen yazmak; sistemin geri
 * kalanı değişmez.
 */
export interface InvitationContent {
  id: string;
  slug: string;
  themeSlug: string;
  eventType: EventType;

  brideName: string;
  groomName: string;
  /**
   * Ebeveyn isimleri — "Sibel & Hakan Yıldırım" biçiminde tek satır.
   * Türk davetiyelerinde çiftin isimlerinin hemen altında yer alır.
   */
  brideParents: string | null;
  groomParents: string | null;
  /** ISO timestamp — geri sayım ve tarih biçimlemesi buradan türer */
  eventAt: string | null;

  venueName: string | null;
  venueAddress: string | null;
  venueMapUrl: string | null;

  story: string | null;
  program: ProgramItem[];
  /** Görüntülenebilir (imzalanmış) fotoğraf adresleri */
  photoUrls: string[];

  /** Yemek menüsü — her satır bir tabak */
  menu: string[];
  /** Vale, otel, kıyafet kodu gibi serbest metin bilgiler */
  extraInfo: string | null;

  giftNote: string | null;
  giftIban: string | null;

  /** Doğrudan çalınabilir ses adresi — açılış kapısı tıklanınca başlar */
  musicUrl: string | null;
  musicTitle: string | null;

  rsvp: {
    enabled: boolean;
    deadline: string | null;
    plusOne: boolean;
    questions: string[];
  };

  /** "Anı Bırakın" — misafirler davetiyeye kendi karelerini yükleyebilir */
  guestPhotosEnabled: boolean;
  /** Onaylanmış misafir kareleri (herkese açık adresler) */
  guestPhotoUrls: string[];

  published: boolean;
}

/** Tema bileşenlerinin aldığı prop'lar. */
export interface ThemeProps {
  content: InvitationContent;
  /**
   * Önizleme modunda RSVP formu kayıt oluşturmaz ve üstte bir uyarı
   * şeridi gösterilir.
   */
  preview?: boolean;
}

/** Etkinlik türüne göre davetiye başlığı. */
export const EVENT_HEADINGS: Record<EventType, string> = {
  dugun: "Düğün Davetiyesi",
  nisan: "Nişan Davetiyesi",
  kina: "Kına Gecesi",
  save_the_date: "Tarihi Ayırın",
};
