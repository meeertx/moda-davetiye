import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import InvitationEditorForm from "@/components/admin/InvitationEditorForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Davetiye Düzenle" };

export default async function AdminDavetiyePage({
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
    .select("id, order_number, bride_name, groom_name")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!order) notFound();

  const { data: invitation } = await supabase
    .from("invitations")
    .select("*")
    .eq("order_id", order.id)
    .maybeSingle();

  if (!invitation) notFound();

  const couple =
    [order.bride_name, order.groom_name].filter(Boolean).join(" & ") ||
    order.order_number;

  return (
    <AdminShell>
      <Link
        href={`/admin/siparisler/${orderNumber}`}
        className="text-[13px] text-muted"
      >
        ← Sipariş detayına dön
      </Link>

      <h1 className="font-display font-medium text-[32px] m-0 mt-4 mb-1">
        {couple}
      </h1>
      <p className="text-sm text-muted m-0 mb-8">
        {order.order_number} · Davetiye içeriği
      </p>

      <div className="max-w-[760px]">
        <InvitationEditorForm
          invitation={invitation}
          orderNumber={orderNumber}
        />
      </div>
    </AdminShell>
  );
}
