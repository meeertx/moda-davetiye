import Link from "next/link";
import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import OrderFilters from "@/components/admin/OrderFilters";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { EVENT_TYPES, ORDER_STATUS, formatDate } from "@/lib/orders";
import type { OrderStatus } from "@/types/supabase";

export const metadata: Metadata = { title: "Siparişler" };

const gridCols = "grid grid-cols-[1.5fr_1.6fr_1.2fr_1fr_1fr_1fr] min-w-[860px]";

export default async function AdminSiparislerPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string; q?: string }>;
}) {
  const { durum = "all", q = "" } = await searchParams;

  if (!isSupabaseConfigured) {
    return (
      <AdminShell>
        <h1 className="font-display font-medium text-[32px] m-0 mb-7">
          Siparişler
        </h1>
        <NotConfiguredNotice />
      </AdminShell>
    );
  }

  const supabase = await createClient();

  // RLS: is_admin() sayesinde tüm siparişler döner.
  let query = supabase
    .from("orders")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  if (durum !== "all" && durum in ORDER_STATUS) {
    query = query.eq("status", durum as OrderStatus);
  }
  if (q.trim()) {
    // Sipariş numarası veya gelin/damat adına göre arama
    const term = `%${q.trim()}%`;
    query = query.or(
      `order_number.ilike.${term},bride_name.ilike.${term},groom_name.ilike.${term}`,
    );
  }

  const { data: orders, error } = await query;

  return (
    <AdminShell>
      <h1 className="font-display font-medium text-[32px] m-0 mb-7">
        Siparişler
      </h1>

      <OrderFilters activeStatus={durum} initialQuery={q} />

      {error && (
        <div className="text-sm text-danger-fg mb-4">
          Siparişler yüklenemedi: {error.message}
        </div>
      )}

      <div className="bg-paper-alt border border-line-panel rounded-[10px] overflow-x-auto">
        <div
          className={`${gridCols} px-5 py-3.5 text-xs tracking-[0.03em] uppercase text-muted border-b border-line-panel`}
        >
          <div>Sipariş No</div>
          <div>Müşteri</div>
          <div>Çift</div>
          <div>Etkinlik</div>
          <div>Durum</div>
          <div>Tarih</div>
        </div>

        {!orders?.length ? (
          <div className="px-5 py-10 text-center text-sm text-muted">
            {q || durum !== "all"
              ? "Bu filtreyle eşleşen sipariş yok."
              : "Henüz sipariş yok."}
          </div>
        ) : (
          orders.map((o) => {
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
                    "—"}
                </div>
                <div>{EVENT_TYPES[o.event_type]}</div>
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
