import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import OrderFilters from "@/components/admin/OrderFilters";
import { createClient, withTimeout } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { EVENT_TYPES, ORDER_STATUS, formatDate } from "@/lib/orders";
import type { OrderStatus } from "@/types/supabase";

export const metadata: Metadata = { title: "Sipariş Yönetimi" };

const gridCols = "grid grid-cols-[1.4fr_1.6fr_1.4fr_1.1fr_1.1fr_1fr_1.2fr] min-w-[950px]";

export default async function AdminSiparislerPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string; q?: string }>;
}) {
  const { durum = "all", q = "" } = await searchParams;
  let orders: any[] = [];

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from("orders")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false });

      if (durum !== "all" && durum in ORDER_STATUS) {
        query = query.eq("status", durum as OrderStatus);
      }
      if (q.trim()) {
        const term = `%${q.trim()}%`;
        query = query.or(
          `order_number.ilike.${term},bride_name.ilike.${term},groom_name.ilike.${term}`,
        );
      }

      const res = await withTimeout(query, 2000);
      if (res.data) orders = res.data;
    } catch (e) {
      console.warn("Supabase fetch error:", e);
    }
  }

  return (
    <AdminShell>
      <div className="mb-7">
        <div className="text-[11.5px] font-semibold tracking-[0.18em] uppercase text-gold mb-1">
          TÜM TALEPLER VE KONTROL
        </div>
        <h1 className="font-display font-medium text-3xl sm:text-4xl text-ink m-0 tracking-tight">
          Sipariş Yönetimi
        </h1>
      </div>

      <OrderFilters activeStatus={durum} initialQuery={q} />

      {/* Glass Table */}
      <div className="glass-luxury rounded-2xl border border-gold/25 overflow-hidden shadow-sm">
        <div
          className={`${gridCols} px-6 py-4 text-xs tracking-wider uppercase text-gold font-semibold border-b border-gold/15 bg-gold/5`}
        >
          <div>Sipariş No</div>
          <div>Müşteri</div>
          <div>Çift İsimleri</div>
          <div>Etkinlik</div>
          <div>Durum</div>
          <div>Tarih</div>
          <div className="text-right">İşlem</div>
        </div>

        {!orders?.length ? (
          <div className="px-6 py-12 text-center text-sm text-muted font-light">
            {q || durum !== "all"
              ? "Bu filtreyle eşleşen sipariş kaydı bulunamadı."
              : "Henüz verilmiş bir sipariş kaydı bulunmuyor."}
          </div>
        ) : (
          orders.map((o) => {
            const status = ORDER_STATUS[o.status as keyof typeof ORDER_STATUS] ?? ORDER_STATUS.new;
            const profile = o.profiles as { full_name: string } | null;

            return (
              <div
                key={o.id}
                className={`${gridCols} px-6 py-4 text-sm border-b border-gold/10 items-center text-ink hover:bg-gold/10 transition-colors`}
              >
                <div className="font-semibold text-ink">{o.order_number}</div>
                <div className="text-muted truncate">
                  {profile?.full_name ?? "—"}
                </div>
                <div className="truncate font-medium">
                  {[o.bride_name, o.groom_name].filter(Boolean).join(" & ") ||
                    "—"}
                </div>
                <div className="text-xs text-slate">{EVENT_TYPES[o.event_type as keyof typeof EVENT_TYPES] ?? "Düğün"}</div>
                <div>
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>
                <div className="text-xs text-muted font-light">{formatDate(o.created_at)}</div>
                <div className="text-right flex items-center justify-end gap-2">
                  <ButtonLink
                    href={`/admin/siparisler/${o.order_number}`}
                    variant="secondary"
                    size="sm"
                    shape="pill"
                    className="text-[11px] py-1 px-3 apple-press font-semibold"
                  >
                    Detay →
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
