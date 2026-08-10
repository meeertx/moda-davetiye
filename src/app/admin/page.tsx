import Link from "next/link";
import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { EVENT_TYPES, ORDER_STATUS, formatDate } from "@/lib/orders";
import type { OrderStatus } from "@/types/supabase";

export const metadata: Metadata = { title: "Genel Bakış" };

const cardClass =
  "bg-paper-alt border border-line-panel rounded-[10px] p-[22px]";
const gridCols = "grid grid-cols-[1.5fr_1.6fr_1.2fr_1fr_1fr] min-w-[760px]";

/** Dashboard'daki sayaçlar — hepsi gerçek sipariş kayıtlarından hesaplanır. */
const COUNTERS: { status: OrderStatus | "all"; label: string }[] = [
  { status: "all", label: "Toplam Sipariş" },
  { status: "new", label: "Yeni" },
  { status: "in_progress", label: "İşlemde" },
  { status: "completed", label: "Tamamlandı" },
];

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured) {
    return (
      <AdminShell>
        <h1 className="font-display font-medium text-[32px] m-0 mb-8">
          Genel Bakış
        </h1>
        <NotConfiguredNotice />
      </AdminShell>
    );
  }

  const supabase = await createClient();

  // RLS: is_admin() sayesinde tüm kayıtlar görünür.
  const [orders, userCount] = await Promise.all([
    supabase
      .from("orders")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const all = orders.data ?? [];
  const countOf = (s: OrderStatus | "all") =>
    s === "all" ? all.length : all.filter((o) => o.status === s).length;

  return (
    <AdminShell>
      <h1 className="font-display font-medium text-[32px] m-0 mb-8">
        Genel Bakış
      </h1>

      {orders.error && (
        <div className="text-sm text-danger-fg mb-4">
          Siparişler yüklenemedi: {orders.error.message}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[18px] mb-9">
        {COUNTERS.map((c) => (
          <div key={c.label} className={cardClass}>
            <div className="text-xs text-muted mb-2">{c.label}</div>
            <div className="font-display text-[28px] font-semibold">
              {countOf(c.status)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-[18px] mb-9">
        <div className={cardClass}>
          <div className="text-xs text-muted mb-2">Kayıtlı Kullanıcı</div>
          <div className="font-display text-[28px] font-semibold">
            {userCount.count ?? 0}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs text-muted mb-2">Bekleyen İş</div>
          <div className="font-display text-[28px] font-semibold">
            {countOf("new") + countOf("in_progress")}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-baseline mb-3.5">
        <div className="text-[13px] tracking-[0.03em] uppercase text-muted">
          Son Siparişler
        </div>
        <Link href="/admin/siparisler" className="text-[13px]">
          Tümünü gör →
        </Link>
      </div>

      <div className="bg-paper-alt border border-line-panel rounded-[10px] overflow-x-auto">
        <div
          className={`${gridCols} px-5 py-3.5 text-xs tracking-[0.03em] uppercase text-muted border-b border-line-panel`}
        >
          <div>Sipariş No</div>
          <div>Müşteri</div>
          <div>Çift</div>
          <div>Durum</div>
          <div>Tarih</div>
        </div>

        {!all.length ? (
          <div className="px-5 py-10 text-center text-sm text-muted">
            Henüz sipariş yok.
          </div>
        ) : (
          all.slice(0, 6).map((o) => {
            const status = ORDER_STATUS[o.status];
            const profile = o.profiles as { full_name: string } | null;
            return (
              <Link
                key={o.id}
                href={`/admin/siparisler/${o.order_number}`}
                className={`${gridCols} px-5 py-3.5 text-[13.5px] border-b border-line-soft items-center text-ink hover:bg-shell`}
              >
                <div className="font-medium">{o.order_number}</div>
                <div className="text-muted truncate">
                  {profile?.full_name ?? "—"}
                </div>
                <div className="truncate">
                  {[o.bride_name, o.groom_name].filter(Boolean).join(" & ") ||
                    EVENT_TYPES[o.event_type]}
                </div>
                <div>
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>
                <div className="text-muted">{formatDate(o.created_at)}</div>
              </Link>
            );
          })
        )}
      </div>
    </AdminShell>
  );
}
