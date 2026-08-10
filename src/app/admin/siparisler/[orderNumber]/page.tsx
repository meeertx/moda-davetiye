import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import OrderDetailForm from "@/components/admin/OrderDetailForm";
import InvitationLauncher from "@/components/admin/InvitationLauncher";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUserEmail, hasServiceRole } from "@/lib/supabase/admin";
import {
  EVENT_TYPES,
  ORDER_STATUS,
  formatDate,
  formatDateTime,
} from "@/lib/orders";
import { getTheme } from "@/data/themes";
import OrderDetailsView from "@/components/order/OrderDetailsView";
import { signPhotoUrls } from "@/lib/photos";

export const metadata: Metadata = { title: "Sipariş Detayı" };

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[170px_1fr] gap-4 py-3 border-b border-line-soft last:border-b-0">
      <div className="text-[13px] text-muted">{label}</div>
      <div className="text-sm break-words">{value || "—"}</div>
    </div>
  );
}

export default async function AdminSiparisDetayPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  if (!isSupabaseConfigured) {
    return (
      <AdminShell>
        <NotConfiguredNotice />
      </AdminShell>
    );
  }

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, profiles(full_name, phone)")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!order) notFound();

  const profile = order.profiles as {
    full_name: string;
    phone: string | null;
  } | null;
  const customerEmail = await getUserEmail(order.user_id);
  const photoUrls = await signPhotoUrls(supabase, order.photos ?? []);
  const { data: invitation } = await supabase
    .from("invitations")
    .select("slug, published")
    .eq("order_id", order.id)
    .maybeSingle();
  const status = ORDER_STATUS[order.status];
  const theme = getTheme(order.theme_preference ?? "");

  return (
    <AdminShell>
      <Link href="/admin/siparisler" className="text-[13px] text-muted">
        ← Siparişlere dön
      </Link>

      <div className="flex items-center gap-3 mt-4 mb-8">
        <h1 className="font-display font-medium text-[32px] m-0">
          {order.order_number}
        </h1>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-[1fr_420px] gap-6 items-start">
        {/* SALT OKUNUR TALEP BİLGİLERİ */}
        <div className="flex flex-col gap-6">
        <div className="bg-paper-alt border border-line-panel rounded-[10px] p-7">
          <div className="text-[13px] tracking-[0.03em] uppercase text-muted mb-3">
            Müşterinin Girdiği Bilgiler
          </div>
          <Row label="Müşteri" value={profile?.full_name} />
          <Row
            label="E-posta"
            value={
              customerEmail ??
              (hasServiceRole ? "—" : "service-role anahtarı gerekli")
            }
          />
          <Row
            label="Hesap telefonu"
            value={profile?.phone}
          />
          <Row label="İletişim telefonu" value={order.contact_phone} />
          <Row label="Etkinlik türü" value={EVENT_TYPES[order.event_type]} />
          <Row label="Gelin adı" value={order.bride_name} />
          <Row label="Damat adı" value={order.groom_name} />
          <Row label="Etkinlik tarihi" value={formatDate(order.event_date)} />
          <Row
            label="Tema tercihi"
            value={theme?.name ?? order.theme_preference}
          />
          <Row label="Ek not" value={order.contact_note} />
          <Row label="Talep tarihi" value={formatDateTime(order.created_at)} />
          <Row
            label="Tamamlanma"
            value={
              order.completed_at ? formatDateTime(order.completed_at) : "—"
            }
          />
        </div>

          <OrderDetailsView details={order} photoUrls={photoUrls} />
        </div>

        {/* DÜZENLEME */}
        <div className="flex flex-col gap-6">
          <InvitationLauncher
            orderNumber={order.order_number}
            invitation={
              invitation
                ? { slug: invitation.slug, published: invitation.published }
                : null
            }
          />
          <OrderDetailForm
            orderNumber={order.order_number}
            status={order.status}
            invitationUrl={order.invitation_url}
            adminNote={order.admin_note}
            canNotify={hasServiceRole}
          />
        </div>
      </div>
    </AdminShell>
  );
}
