/**
 * Supabase şema tipleri.
 *
 * Bu dosya şu an EL YAZISI — supabase/migrations/ altındaki şemayla birebir
 * eşleşecek şekilde yazıldı, çünkü tip üretimi için canlı bir projeye
 * bağlanmak gerekiyor.
 *
 * Proje bağlandıktan sonra üretimle değiştirilmeli:
 *
 *   npx supabase login
 *   npx supabase link --project-ref <PROJE_REF>
 *   npm run types:supabase        # package.json'da tanımlı
 *
 * Üretilen çıktı bu dosyanın üzerine yazar; şema değiştikçe komut
 * tekrar çalıştırılmalı.
 */

export type OrderStatus = "new" | "in_progress" | "completed" | "cancelled";
export type EventType = "dugun" | "nisan" | "kina" | "save_the_date";
export type UserRole = "customer" | "admin";

/** Program akışındaki tek satır */
export interface ProgramItem {
  time: string;
  title: string;
}

/**
 * Siparişin 2. aşamada toplanan detayları — görüntüleme bileşenlerinin
 * beklediği alt küme. Tablo tipinden türetilir ki alanlar tek yerde dursun.
 */
export type OrderDetails = Pick<
  Database["public"]["Tables"]["orders"]["Row"],
  | "venue_name"
  | "venue_address"
  | "venue_map_url"
  | "program"
  | "story"
  | "photos"
  | "rsvp_deadline"
  | "rsvp_plus_one"
  | "rsvp_questions"
  | "gift_note"
  | "gift_iban"
  | "music_note"
  | "bride_parents"
  | "groom_parents"
  | "menu"
  | "extra_info"
>;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      // NOT: Row/Insert alanları bilerek düz yazıldı. `{...} & OrderDetails`
      // gibi kesişim tipleri supabase-js'in tip çıkarımını bozup tüm
      // sorguları `never`'a düşürüyor.
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          status: OrderStatus;
          event_type: EventType;
          bride_name: string | null;
          groom_name: string | null;
          event_date: string | null;
          theme_preference: string | null;
          contact_phone: string;
          contact_note: string | null;
          invitation_url: string | null;
          admin_note: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
          venue_name: string | null;
          venue_address: string | null;
          venue_map_url: string | null;
          program: ProgramItem[];
          story: string | null;
          photos: string[];
          rsvp_deadline: string | null;
          rsvp_plus_one: boolean;
          rsvp_questions: string[];
          gift_note: string | null;
          gift_iban: string | null;
          music_note: string | null;
          bride_parents: string | null;
          groom_parents: string | null;
          menu: string[];
          extra_info: string | null;
        };
        Insert: {
          id?: string;
          /** Trigger üretir — insert sırasında gönderilmez */
          order_number?: string;
          user_id: string;
          status?: OrderStatus;
          event_type: EventType;
          bride_name?: string | null;
          groom_name?: string | null;
          event_date?: string | null;
          theme_preference?: string | null;
          contact_phone: string;
          contact_note?: string | null;
          invitation_url?: string | null;
          admin_note?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
          venue_name?: string | null;
          venue_address?: string | null;
          venue_map_url?: string | null;
          program?: ProgramItem[];
          story?: string | null;
          photos?: string[];
          rsvp_deadline?: string | null;
          rsvp_plus_one?: boolean;
          rsvp_questions?: string[];
          gift_note?: string | null;
          gift_iban?: string | null;
          music_note?: string | null;
          bride_parents?: string | null;
          groom_parents?: string | null;
          menu?: string[];
          extra_info?: string | null;
        };
        Update: {
          status?: OrderStatus;
          invitation_url?: string | null;
          admin_note?: string | null;
          updated_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      invitations: {
        Row: {
          id: string;
          slug: string;
          order_id: string;
          user_id: string;
          theme_slug: string;
          event_type: EventType;
          bride_name: string | null;
          groom_name: string | null;
          event_at: string | null;
          venue_name: string | null;
          venue_address: string | null;
          venue_map_url: string | null;
          story: string | null;
          program: ProgramItem[];
          photos: string[];
          gift_note: string | null;
          gift_iban: string | null;
          music_url: string | null;
          music_title: string | null;
          rsvp_enabled: boolean;
          rsvp_deadline: string | null;
          rsvp_plus_one: boolean;
          rsvp_questions: string[];
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          bride_parents: string | null;
          groom_parents: string | null;
          menu: string[];
          extra_info: string | null;
          guest_photos_enabled: boolean;
        };
        Insert: {
          id?: string;
          slug: string;
          order_id: string;
          user_id: string;
          theme_slug: string;
          event_type: EventType;
          bride_name?: string | null;
          groom_name?: string | null;
          event_at?: string | null;
          venue_name?: string | null;
          venue_address?: string | null;
          venue_map_url?: string | null;
          story?: string | null;
          program?: ProgramItem[];
          photos?: string[];
          gift_note?: string | null;
          gift_iban?: string | null;
          music_url?: string | null;
          music_title?: string | null;
          rsvp_enabled?: boolean;
          rsvp_deadline?: string | null;
          rsvp_plus_one?: boolean;
          rsvp_questions?: string[];
          published?: boolean;
          bride_parents?: string | null;
          groom_parents?: string | null;
          menu?: string[];
          extra_info?: string | null;
          guest_photos_enabled?: boolean;
        };
        Update: {
          slug?: string;
          theme_slug?: string;
          bride_name?: string | null;
          groom_name?: string | null;
          event_at?: string | null;
          venue_name?: string | null;
          venue_address?: string | null;
          venue_map_url?: string | null;
          story?: string | null;
          program?: ProgramItem[];
          photos?: string[];
          gift_note?: string | null;
          gift_iban?: string | null;
          music_url?: string | null;
          music_title?: string | null;
          rsvp_enabled?: boolean;
          rsvp_deadline?: string | null;
          rsvp_plus_one?: boolean;
          rsvp_questions?: string[];
          published?: boolean;
          bride_parents?: string | null;
          groom_parents?: string | null;
          menu?: string[];
          extra_info?: string | null;
          guest_photos_enabled?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "invitations_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      rsvps: {
        Row: {
          id: string;
          invitation_id: string;
          guest_name: string;
          attending: boolean;
          party_size: number;
          note: string | null;
          answers: Record<string, string>;
          created_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          guest_name: string;
          attending: boolean;
          party_size?: number;
          note?: string | null;
          answers?: Record<string, string>;
        };
        Update: {
          guest_name?: string;
          attending?: boolean;
          party_size?: number;
          note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rsvps_invitation_id_fkey";
            columns: ["invitation_id"];
            referencedRelation: "invitations";
            referencedColumns: ["id"];
          },
        ];
      };
      guest_photos: {
        Row: {
          id: string;
          invitation_id: string;
          path: string;
          guest_name: string | null;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          path: string;
          guest_name?: string | null;
          approved?: boolean;
        };
        Update: {
          approved?: boolean;
          guest_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "guest_photos_invitation_id_fkey";
            columns: ["invitation_id"];
            referencedRelation: "invitations";
            referencedColumns: ["id"];
          },
        ];
      };
      reserved_slugs: {
        Row: { slug: string };
        Insert: { slug: string };
        Update: { slug?: string };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];

/**
 * Müşteri tarafında kullanılan sipariş görünümü.
 * `admin_note` kasıtlı olarak dışarıda — müşteriye hiçbir zaman gönderilmez.
 */
export type CustomerOrder = Omit<Order, "admin_note">;

/**
 * Müşteri sorgularında select listesi olarak kullanılır.
 * `admin_note` kasıtlı olarak yok — müşteriye hiçbir zaman gönderilmez.
 */
// Tek parça literal olmak ZORUNDA: supabase-js satır tipini select()'e
// verilen string'in literal tipinden çıkarıyor. Dizi + join() ile üretilirse
// tip bilgisi kaybolur ve sorgular GenericStringError'a düşer.
export const CUSTOMER_ORDER_COLUMNS =
  "id, order_number, user_id, status, event_type, bride_name, groom_name, event_date, theme_preference, contact_phone, contact_note, invitation_url, created_at, updated_at, completed_at, venue_name, venue_address, venue_map_url, program, story, photos, rsvp_deadline, rsvp_plus_one, rsvp_questions, gift_note, gift_iban, music_note, bride_parents, groom_parents, menu, extra_info" as const;

/** Misafirin davetiyeye bıraktığı kare. */
export type GuestPhoto = Database["public"]["Tables"]["guest_photos"]["Row"];
