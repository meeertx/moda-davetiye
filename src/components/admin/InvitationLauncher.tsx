"use client";

import { useActionState } from "react";
import {
  createInvitationAction,
  type InvitationState,
} from "@/app/actions/invitations";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";
import { ButtonLink } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { BRAND } from "@/lib/brand";

const card = "bg-paper-alt border border-line-panel rounded-[10px] p-7";
const sectionTitle =
  "text-[13px] tracking-[0.03em] uppercase text-muted mb-[18px]";

/**
 * Sipariş detayındaki davetiye kutusu: kayıt yoksa oluşturur,
 * varsa düzenleme sayfasına ve yayın adresine bağlar.
 */
export default function InvitationLauncher({
  orderNumber,
  invitation,
}: {
  orderNumber: string;
  invitation: { slug: string; published: boolean } | null;
}) {
  const [state, formAction] = useActionState<InvitationState, FormData>(
    createInvitationAction,
    {},
  );

  if (invitation) {
    return (
      <div className={card}>
        <div className={sectionTitle}>Davetiye</div>
        <div className="flex items-center gap-2.5 mb-3">
          <Badge tone={invitation.published ? "ok" : "neutral"}>
            {invitation.published ? "Yayında" : "Taslak"}
          </Badge>
          <span className="text-[13px] text-muted break-all">
            {BRAND.domain}/{invitation.slug}
          </span>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <ButtonLink
            href={`/admin/siparisler/${orderNumber}/davetiye`}
            variant="primary"
            size="sm"
          >
            Davetiyeyi Düzenle
          </ButtonLink>
          <ButtonLink
            href={`/${invitation.slug}`}
            variant="secondary"
            size="sm"
            target="_blank"
          >
            Önizle
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className={card}>
      <input type="hidden" name="order_number" value={orderNumber} />
      <div className={sectionTitle}>Davetiye</div>

      {state.error && (
        <div className="mb-4">
          <FormMessage>{state.error}</FormMessage>
        </div>
      )}

      <p className="text-sm text-muted leading-[1.7] m-0 mb-5">
        Müşterinin siparişte verdiği bilgilerle bir davetiye taslağı
        oluşturur. İçeriği sonraki adımda düzenleyip yayına alırsınız.
      </p>

      <SubmitButton
        variant="primary"
        size="sm"
        pendingLabel="Oluşturuluyor…"
        className="self-start"
      >
        Davetiye Oluştur
      </SubmitButton>
    </form>
  );
}
