import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Badge from "@/components/ui/Badge";
import PanelShell from "@/components/panel/PanelShell";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CUSTOMER_ORDER_COLUMNS } from "@/types/supabase";
import {
  EVENT_TYPES,
  ORDER_STATUS,
  STATUS_TIMELINE,
  formatDate,
  formatDateTime,
} from "@/lib/orders";
import { getTheme } from "@/data/themes";
import OrderDetailsView from "@/components/order/OrderDetailsView";
import { ExternalButtonLink } from "@/components/ui/Button";
import { signPhotoUrls } from "@/lib/photos";

export const metadata: Metadata = { title: "Sipariş Detayı" };

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-4 py-3 border-b border-line-soft last:border-b-0">
      <div className="text-[13px] text-muted">{label}</div>
      <div className="text-sm">{value || "—"}</div>
    </div>
  );
}

export default async function SiparisDetayPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  if (!isSupabaseConfigured) {
    return (
      <PanelShell>
        <NotConfiguredNotice />
      </PanelShell>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/giris?next=/panel/siparis/${orderNumber}`);

  // RLS zaten müşteriyi kendi kayıtlarıyla sınırlıyor; user_id filtresi
  // müşteri alanını rolden bağımsız olarak "kendi siparişim"e kilitler
  // (admin RLS'i tüm siparişleri görmesine izin verdiği için gerekli).
  const { data: order } = await supabase
    .from("orders")
    .select(CUSTOMER_ORDER_COLUMNS)
    .eq("order_number", orderNumber)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) notFound();

  const photoUrls = await signPhotoUrls(supabase, order.photos ?? []);
  const status = ORDER_STATUS[order.status];
  const isReady = order.status === "completed" && order.invitation_url;
  const theme = getTheme(order.theme_preference ?? "");
  const currentStep = STATUS_TIMELINE.indexOf(order.status);

  return (
    <PanelShell>
      <Link href="/panel" className="text-[13px] text-muted">
        ← Siparişlerime dön
      </Link>

      <div className="flex items-center gap-3 mt-4 mb-1">
        <h1 className="font-display font-medium text-[32px] m-0">
          {order.order_number}
        </h1>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>
      <p className="text-sm text-muted m-0 mb-8">{status.description}</p>

      {/* DURUM ÇİZELGESİ */}
      {order.status !== "cancelled" && (
        <div className="bg-paper-alt border border-line-panel rounded-[10px] p-6 mb-6">
          <div className="flex items-center">
            {STATUS_TIMELINE.map((step, i) => {
              const done = i <= currentStep;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] ${
                        done
                          ? "bg-gold text-cream"
                          : "bg-[oklch(90%_0.006_70)] text-muted"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-[12px] whitespace-nowrap ${
                        done ? "text-ink" : "text-muted"
                      }`}
                    >
                      {ORDER_STATUS[step].label === "Yeni"
                        ? "Talep alındı"
                        : ORDER_STATUS[step].label === "İşlemde"
                          ? "İşleme alındı"
                          : "Tamamlandı"}
                    </span>
                  </div>
                  {i < STATUS_TIMELINE.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-3 mb-6 ${
                        i < currentStep ? "bg-gold" : "bg-line-panel"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAVETİYE LİNKİ */}
      {isReady ? (
        <div className="bg-ink text-snow rounded-[10px] p-7 mb-6">
          <div className="text-[13px] tracking-[0.03em] uppercase text-gold-light mb-2">
            Davetiyeniz hazır
          </div>
          <p className="text-sm text-mist leading-[1.7] m-0 mb-5">
            Aşağıdaki bağlantıyı misafirlerinizle WhatsApp, SMS veya sosyal
            medya üzerinden paylaşabilirsiniz.
          </p>
          <ExternalButtonLink
            href={order.invitation_url!}
            variant="on-dark"
            size="lg"
          >
            Davetiyenizi Görüntüleyin →
          </ExternalButtonLink>
          <div className="text-xs text-faint mt-4 break-all">
            {order.invitation_url}
          </div>
        </div>
      ) : (
        order.status !== "cancelled" && (
          <div className="bg-paper-alt border border-line-panel rounded-[10px] p-7 mb-6 text-center">
            <div className="font-display text-xl mb-2">
              Davetiyeniz hazırlanıyor
            </div>
            <p className="text-sm text-muted leading-[1.7] m-0">
              Tamamlandığında burada bir bağlantı belirecek ve size e-posta ile
              bildirim göndereceğiz.
            </p>
          </div>
        )
      )}

      {/* TALEP BİLGİLERİ */}
      <div className="flex flex-col gap-6">
        <div className="bg-paper-alt border border-line-panel rounded-[10px] p-7">
          <div className="text-[13px] tracking-[0.03em] uppercase text-muted mb-3">
            Talep Bilgileriniz
          </div>
          <Row label="Etkinlik türü" value={EVENT_TYPES[order.event_type]} />
          <Row label="Gelin adı" value={order.bride_name} />
          <Row label="Damat adı" value={order.groom_name} />
          <Row label="Etkinlik tarihi" value={formatDate(order.event_date)} />
          <Row
            label="Tema tercihi"
            value={theme?.name ?? order.theme_preference}
          />
          <Row label="İletişim telefonu" value={order.contact_phone} />
          <Row label="Ek not" value={order.contact_note} />
          <Row label="Talep tarihi" value={formatDateTime(order.created_at)} />
        </div>

        <OrderDetailsView details={order} photoUrls={photoUrls} />
      </div>
    </PanelShell>
  );
}
