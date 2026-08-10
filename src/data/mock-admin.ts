/**
 * Admin panelindeki örnek veriler. Backend turunda Prisma sorgularıyla
 * değiştirilecek.
 */
import type { BadgeTone } from "@/components/ui/Badge";

export type OrderStatus = "Ödendi" | "Beklemede" | "İade" | "Başarısız";

export const ORDER_TONES: Record<OrderStatus, BadgeTone> = {
  Ödendi: "ok",
  Beklemede: "warn",
  İade: "danger",
  Başarısız: "danger",
};

export interface AdminOrder {
  user: string;
  pkg: string;
  amount: string;
  provider: string;
  status: OrderStatus;
  /** Dashboard'da kısa ("07 Ağu"), sipariş listesinde uzun ("07 Ağu 2026") */
  date: string;
  dateLong: string;
}

export const ADMIN_ORDERS: AdminOrder[] = [
  { user: "Elif Kaya", pkg: "Standart", amount: "₺1.790", provider: "Iyzico", status: "Ödendi", date: "07 Ağu", dateLong: "07 Ağu 2026" },
  { user: "Sude Aksoy", pkg: "Premium", amount: "₺2.990", provider: "Iyzico", status: "Ödendi", date: "06 Ağu", dateLong: "06 Ağu 2026" },
  { user: "Mert Demir", pkg: "Başlangıç", amount: "₺990", provider: "Iyzico", status: "Beklemede", date: "06 Ağu", dateLong: "06 Ağu 2026" },
  { user: "Ada Yıldız", pkg: "Standart", amount: "₺1.790", provider: "Stripe", status: "İade", date: "05 Ağu", dateLong: "05 Ağu 2026" },
  { user: "Onur Şahin", pkg: "Premium", amount: "₺2.990", provider: "Iyzico", status: "Ödendi", date: "04 Ağu", dateLong: "04 Ağu 2026" },
  { user: "Naz Türk", pkg: "Standart", amount: "₺1.790", provider: "Iyzico", status: "Ödendi", date: "03 Ağu", dateLong: "03 Ağu 2026" },
  { user: "Kerem Aydın", pkg: "Başlangıç", amount: "₺990", provider: "Stripe", status: "Başarısız", date: "02 Ağu", dateLong: "02 Ağu 2026" },
  { user: "Deniz Şahin", pkg: "Premium", amount: "₺2.990", provider: "Iyzico", status: "Ödendi", date: "01 Ağu", dateLong: "01 Ağu 2026" },
];

/** Dashboard grafiğindeki 20 çubuğun yükseklik yüzdeleri. */
export const SALES_BARS = [
  40, 55, 35, 60, 72, 50, 45, 80, 65, 58, 70, 90, 60, 55, 75, 68, 82, 60, 95, 78,
];

export const ADMIN_STATS = [
  { label: "Bu Ay Satış", value: "₺284.600" },
  { label: "Sipariş Sayısı", value: "168" },
  { label: "Yeni Kullanıcı", value: "96" },
  { label: "Aktif Davetiye", value: "1.940" },
];

export interface AdminUser {
  name: string;
  email: string;
  invitations: number;
  active: boolean;
}

export const ADMIN_USERS: AdminUser[] = [
  { name: "Elif Kaya", email: "elif@eposta.com", invitations: 1, active: true },
  { name: "Sude Aksoy", email: "sude@eposta.com", invitations: 1, active: true },
  { name: "Mert Demir", email: "mert@eposta.com", invitations: 2, active: true },
  { name: "Ada Yıldız", email: "ada@eposta.com", invitations: 1, active: false },
  { name: "Onur Şahin", email: "onur@eposta.com", invitations: 1, active: true },
  { name: "Naz Türk", email: "naz@eposta.com", invitations: 1, active: true },
];
