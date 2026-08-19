import Link from "next/link";
import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { createClient, withTimeout } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { EVENT_TYPES, ORDER_STATUS } from "@/lib/orders";
import type { OrderStatus } from "@/types/supabase";

export const metadata: Metadata = { title: "Yönetim Kontrol Paneli" };

const cardClass =
  "glass-luxury rounded-2xl p-6 border border-gold/25 shadow-sm hover:shadow-md transition-all duration-200 apple-press";
const gridCols = "grid grid-cols-[1.4fr_1.6fr_1.4fr_1.1fr_1fr_1.2fr] min-w-[900px]";

const COUNTERS: { status: OrderStatus | "all"; label: string; icon: string }[] = [
  { status: "all", label: "Toplam Sipariş", icon: "📦" },
  { status: "new", label: "Yeni Bekleyen Talep", icon: "🔔" },
  { status: "in_progress", label: "İşlemde / Hazırlanıyor", icon: "⏳" },
  { status: "completed", label: "Tamamlanan & Yayında", icon: "✨" },
];

export default async function AdminDashboardPage() {
  let all: any[] = [];
  let userCount = 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const [ordersRes, usersRes] = await withTimeout(
        Promise.all([
          supabase
            .from("orders")
            .select("*, profiles(full_name, email, phone)")
            .order("created_at", { ascending: false }),
          supabase.from("profiles").select("id", { count: "exact", head: true }),
        ]),
        2000,
      );
      if (ordersRes.data) all = ordersRes.data;
      if (usersRes.count !== null) userCount = usersRes.count;
    } catch (e) {
      console.warn("Supabase fetch error:", e);
    }
  }

  const countOf = (s: OrderStatus | "all") =>
    s === "all" ? all.length : all.filter((o) => o.status === s).length;

  return (
    <AdminShell>
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-gold/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10.5px] font-semibold tracking-[0.18em] uppercase mb-2 shadow-xs">
            ★ SİSTEM YÖNETİCİSİ KONTROL MERKEZİ
          </div>
          <h1 className="font-display font-medium text-3xl sm:text-4xl text-ink m-0 tracking-tight">
            Genel Bakış &amp; Yönetim
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="/admin/siparisler" variant="secondary" size="sm" shape="pill" className="apple-press font-medium">
            📋 Tüm Siparişler
          </ButtonLink>
          <ButtonLink href="/admin/temalar" variant="gold" size="sm" shape="pill" className="apple-press font-semibold">
            🎨 Temalar &amp; AI Promptlar
          </ButtonLink>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {COUNTERS.map((c) => (
          <div key={c.label} className={cardClass}>
            <div className="flex justify-between items-start mb-3">
              <div className="text-xs uppercase tracking-wider text-muted font-medium">{c.label}</div>
              <span className="text-lg">{c.icon}</span>
            </div>
            <div className="font-display text-3xl sm:text-4xl font-semibold text-gold tracking-tight">
              {countOf(c.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div className={cardClass}>
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs uppercase tracking-wider text-muted font-medium">Kayıtlı Müşteri Sayısı</div>
            <Link href="/admin/kullanicilar" className="text-xs text-gold font-semibold hover:underline">Kullanıcılar →</Link>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            {userCount}
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs uppercase tracking-wider text-muted font-medium">Aktif İşlem Bekleyen Davetiyeler</div>
            <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Acil İşlem</span>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-semibold text-gold tracking-tight">
            {countOf("new") + countOf("in_progress")}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="flex justify-between items-baseline mb-4">
        <div>
          <div className="text-xs tracking-[0.16em] uppercase text-gold font-semibold mb-1">
            SON SİPARİŞ HAREKETLERİ
          </div>
          <h2 className="font-display font-medium text-2xl text-ink m-0">
            Son Talepler &amp; Siparişler
          </h2>
        </div>
        <Link href="/admin/siparisler" className="text-xs text-gold hover:underline font-semibold apple-press">
          Tüm Siparişleri Filtrele →
        </Link>
      </div>

      {/* Glassmorphic Table Container */}
      <div className="glass-luxury rounded-2xl border border-gold/25 overflow-hidden shadow-sm">
        <div
          className={`${gridCols} px-6 py-4 text-xs tracking-wider uppercase text-gold font-semibold border-b border-gold/15 bg-gold/5`}
        >
          <div>Sipariş No</div>
          <div>Müşteri Bilgisi</div>
          <div>Çift İsimleri</div>
          <div>Etkinlik Türü</div>
          <div>Durum</div>
          <div className="text-right">Eylem</div>
        </div>

        {!all.length ? (
          <div className="px-6 py-12 text-center text-sm text-muted font-light">
            Henüz veritabanında verilmiş bir sipariş kaydı bulunmuyor.
          </div>
        ) : (
          all.slice(0, 8).map((o) => {
            const status = ORDER_STATUS[o.status as keyof typeof ORDER_STATUS] ?? ORDER_STATUS.new;
            const profile = o.profiles as { full_name: string } | null;
            return (
              <div
                key={o.id}
                className={`${gridCols} px-6 py-4 text-sm border-b border-gold/10 items-center text-ink hover:bg-gold/10 transition-colors`}
              >
                <div className="font-semibold text-ink">{o.order_number}</div>
                <div className="text-muted truncate">
                  {profile?.full_name ?? "İsimsiz Müşteri"}
                </div>
                <div className="truncate font-medium">
                  {[o.bride_name, o.groom_name].filter(Boolean).join(" & ") ||
                    "Davetiye Detayı Girilmedi"}
                </div>
                <div className="text-xs text-slate">{EVENT_TYPES[o.event_type as keyof typeof EVENT_TYPES] ?? "Düğün"}</div>
                <div>
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>
                <div className="text-right flex items-center justify-end gap-2">
                  <ButtonLink
                    href={`/admin/siparisler/${o.order_number}`}
                    variant="secondary"
                    size="sm"
                    shape="pill"
                    className="text-[11px] py-1 px-3 apple-press font-semibold"
                  >
                    Yönet →
                  </ButtonLink>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminShell>
  );
}
