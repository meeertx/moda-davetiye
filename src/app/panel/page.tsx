import Link from "next/link";
import type { Metadata } from "next";
import Badge from "@/components/ui/Badge";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/Button";
import PanelShell from "@/components/panel/PanelShell";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CUSTOMER_ORDER_COLUMNS } from "@/types/supabase";
import { EVENT_TYPES, ORDER_STATUS, formatDate } from "@/lib/orders";

export const metadata: Metadata = { title: "Siparişlerim" };

export default async function PanelPage() {
  if (!isSupabaseConfigured) {
    return (
      <PanelShell>
        <h1 className="font-display font-medium text-[32px] m-0 mb-8">
          Siparişlerim
        </h1>
        <NotConfiguredNotice />
      </PanelShell>
    );
  }

  const supabase = await createClient();
  // RLS zaten kullanıcının kendi kayıtlarıyla sınırlıyor.
  const { data: orders } = await supabase
    .from("orders")
    .select(CUSTOMER_ORDER_COLUMNS)
    .order("created_at", { ascending: false });

  return (
    <PanelShell>
      <div className="flex justify-between items-baseline mb-7">
        <h1 className="font-display font-medium text-[32px] m-0">
          Siparişlerim
        </h1>
        <ButtonLink href="/davetiye-talebi" variant="secondary" size="sm">
          + Yeni Talep
        </ButtonLink>
      </div>

      {!orders?.length ? (
        <div className="bg-paper-alt border border-line-panel rounded-[10px] p-10 text-center">
          <p className="text-sm text-muted leading-[1.7] m-0 mb-5">
            Henüz bir davetiye talebiniz yok.
          </p>
          <ButtonLink href="/davetiye-talebi" variant="primary" size="sm">
            İlk Talebimi Oluştur
          </ButtonLink>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {orders.map((order) => {
            const status = ORDER_STATUS[order.status];
            const isReady = order.status === "completed" && order.invitation_url;

            return (
              <div
                key={order.id}
                className="bg-paper-alt border border-line-panel rounded-[10px] p-5 flex gap-5 items-center"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <Link
                      href={`/panel/siparis/${order.order_number}`}
                      className="font-display text-xl font-semibold text-ink hover:text-gold"
                    >
                      {[order.bride_name, order.groom_name]
                        .filter(Boolean)
                        .join(" & ") || EVENT_TYPES[order.event_type]}
                    </Link>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>
                  <div className="text-[13px] text-muted">
                    {order.order_number} · {EVENT_TYPES[order.event_type]} ·{" "}
                    {formatDate(order.event_date)}
                  </div>
                </div>

                <div className="flex gap-2.5 shrink-0">
                  <ButtonLink
                    href={`/panel/siparis/${order.order_number}`}
                    variant="secondary"
                    size="sm"
                  >
                    Detay
                  </ButtonLink>
                  {isReady && (
                    <ExternalButtonLink
                      href={order.invitation_url!}
                      variant="primary"
                      size="sm"
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
