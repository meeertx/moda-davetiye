import Link from "next/link";
import type { Metadata } from "next";
import Badge from "@/components/ui/Badge";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/Button";
import PanelShell from "@/components/panel/PanelShell";
import { createClient, withTimeout } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CUSTOMER_ORDER_COLUMNS } from "@/types/supabase";
import { EVENT_TYPES, ORDER_STATUS, formatDate } from "@/lib/orders";

export const metadata: Metadata = { title: "Siparişlerim & Kontrol Paneli" };

const cardClass =
  "glass-luxury rounded-2xl p-6 border border-gold/25 shadow-sm hover:shadow-md transition-all duration-200 apple-press";

export default async function PanelPage() {
  let orders: any[] = [];

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const res = await withTimeout(
        supabase
          .from("orders")
          .select(CUSTOMER_ORDER_COLUMNS)
          .order("created_at", { ascending: false }),
        2000,
      );
      if (res.data) orders = res.data;
    } catch (e) {
      console.warn("Supabase customer fetch error:", e);
    }
  }

  return (
    <PanelShell>
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-gold/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10.5px] font-semibold tracking-[0.18em] uppercase mb-2 shadow-xs">
            ★ VIP MÜŞTERİ PORTALI
          </div>
          <h1 className="font-display font-medium text-3xl sm:text-4xl text-ink m-0 tracking-tight">
            Siparişlerim &amp; Davetiyelerim
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="/panel/davetiyelerim" variant="secondary" size="sm" shape="pill" className="apple-press font-medium">
            ✉️ Davetiyelerim
          </ButtonLink>
          <ButtonLink href="/davetiye-talebi" variant="gold" size="sm" shape="pill" className="apple-press font-semibold">
            + Yeni Talep Oluştur
          </ButtonLink>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className={cardClass}>
          <div className="text-xs uppercase tracking-wider text-muted font-medium mb-2">Toplam Davetiye Talebi</div>
          <div className="font-display text-3xl font-semibold text-gold tracking-tight">{orders.length}</div>
        </div>
        <div className={cardClass}>
          <div className="text-xs uppercase tracking-wider text-muted font-medium mb-2">Yayındaki Davetiye</div>
          <div className="font-display text-3xl font-semibold text-emerald-600 tracking-tight">
            {orders.filter((o) => o.status === "completed").length}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs uppercase tracking-wider text-muted font-medium mb-2">Katılım Yanıtı (RSVP)</div>
          <div className="font-display text-3xl font-semibold text-ink tracking-tight">
            {orders.length > 0 ? "Canlı Takip Aktif" : "Henüz Yanıt Yok"}
          </div>
        </div>
      </div>

      {/* Orders List Header */}
      <div className="text-xs tracking-[0.16em] uppercase text-gold font-semibold mb-3">
        AKTİF TALEPLERİNİZ VE DURUMLARI
      </div>

      {!orders.length ? (
        <div className="glass-luxury rounded-2xl p-12 text-center border border-gold/20 shadow-md">
          <p className="text-base text-muted font-light m-0 mb-6">
            Henüz verilmiş aktif bir davetiye talebiniz bulunmuyor.
          </p>
          <ButtonLink href="/davetiye-talebi" variant="gold" size="md" shape="pill" className="apple-press font-semibold">
            İlk Talebimi Oluştur →
          </ButtonLink>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const status = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS] ?? ORDER_STATUS.new;
            const isReady = order.status === "completed" && order.invitation_url;

            return (
              <div
                key={order.id}
                className="glass-luxury rounded-2xl p-6 border border-gold/25 shadow-sm flex flex-col sm:flex-row gap-5 sm:items-center justify-between transition-all duration-200 apple-press"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <Link
                      href={`/panel/siparis/${order.order_number}`}
                      className="font-display text-2xl font-semibold text-ink hover:text-gold transition-colors tracking-tight"
                    >
                      {[order.bride_name, order.groom_name]
                        .filter(Boolean)
                        .join(" & ") || EVENT_TYPES[order.event_type as keyof typeof EVENT_TYPES] || "Davetiye Talebi"}
                    </Link>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>
                  <div className="text-xs text-muted font-light flex flex-wrap items-center gap-3">
                    <span>Sipariş No: <strong className="text-ink font-semibold">{order.order_number}</strong></span>
                    <span>•</span>
                    <span>{EVENT_TYPES[order.event_type as keyof typeof EVENT_TYPES] || "Düğün"}</span>
                    <span>•</span>
                    <span>Etkinlik Tarihi: <strong className="text-ink">{formatDate(order.event_date)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <ButtonLink
                    href={`/panel/siparis/${order.order_number}`}
                    variant="secondary"
                    size="sm"
                    shape="pill"
                    className="apple-press font-medium"
                  >
                    Sipariş Detayı
                  </ButtonLink>
                  {isReady && (
                    <ExternalButtonLink
                      href={order.invitation_url!}
                      variant="gold"
                      size="sm"
                      shape="pill"
                      className="apple-press font-semibold"
                    >
                      Davetiyeyi Aç →
                    </ExternalButtonLink>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PanelShell>
  );
}
