"use client";

import { useActionState } from "react";
import {
  updateOrderAction,
  notifyCustomerAction,
  type ActionState,
} from "@/app/actions/orders";
import { ORDER_STATUS } from "@/lib/orders";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";
import { inputClass, labelClass, hintClass } from "@/components/ui/field";
import type { OrderStatus } from "@/types/supabase";

const input = inputClass("panel");
const cardClass = "bg-paper-alt border border-line-panel rounded-[10px] p-7";
const sectionTitle =
  "text-[13px] tracking-[0.03em] uppercase text-muted mb-[18px]";

export default function OrderDetailForm({
  orderNumber,
  status,
  invitationUrl,
  adminNote,
  canNotify,
}: {
  orderNumber: string;
  status: OrderStatus;
  invitationUrl: string | null;
  adminNote: string | null;
  /** Service-role anahtarı yoksa müşteri e-postası okunamaz */
  canNotify: boolean;
}) {
  const [saveState, saveAction] = useActionState<ActionState, FormData>(
    updateOrderAction,
    {},
  );
  const [notifyState, notifyAction] = useActionState<ActionState, FormData>(
    notifyCustomerAction,
    {},
  );

  return (
    <>
      <form action={saveAction} className={`${cardClass} mb-6`}>
        <input type="hidden" name="order_number" value={orderNumber} />
        <div className={sectionTitle}>Davetiye Teslimi</div>

        <div className="flex flex-col gap-4">
          {saveState.error && <FormMessage>{saveState.error}</FormMessage>}
          {saveState.ok && (
            <FormMessage tone="ok">{saveState.ok}</FormMessage>
          )}

          <div>
            <label htmlFor="invitation_url" className={labelClass}>
              Davetiye Linki
            </label>
            <input
              id="invitation_url"
              name="invitation_url"
              type="url"
              defaultValue={invitationUrl ?? ""}
              placeholder="https://…"
              className={input}
            />
            <p className={hintClass}>
              Link girilmeden durum &quot;Tamamlandı&quot; yapılamaz — bu kural
              veritabanı seviyesinde de kilitli.
            </p>
          </div>

          <div>
            <label htmlFor="status" className={labelClass}>
              Durum
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className={input}
            >
              {Object.entries(ORDER_STATUS).map(([key, v]) => (
                <option key={key} value={key}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="admin_note" className={labelClass}>
              İç Not{" "}
              <span className="text-muted">(müşteriye gösterilmez)</span>
            </label>
            <textarea
              id="admin_note"
              name="admin_note"
              rows={3}
              defaultValue={adminNote ?? ""}
              className={`${input} resize-y`}
            />
          </div>

          <SubmitButton
            variant="primary"
            size="sm"
            pendingLabel="Kaydediliyor…"
            className="self-start mt-1"
          >
            Kaydet
          </SubmitButton>
        </div>
      </form>

      <form action={notifyAction} className={cardClass}>
        <input type="hidden" name="order_number" value={orderNumber} />
        <div className={sectionTitle}>Müşteri Bildirimi</div>

        <div className="flex flex-col gap-4">
          {notifyState.error && <FormMessage>{notifyState.error}</FormMessage>}
          {notifyState.ok && (
            <FormMessage tone="ok">{notifyState.ok}</FormMessage>
          )}

          <p className="text-sm text-muted leading-[1.7] m-0">
            Siparişin güncel durumuna uygun şablonu müşteriye e-posta ile
            gönderir. Durum &quot;Tamamlandı&quot; ise davetiye linkini içerir.
          </p>

          {!canNotify && (
            <FormMessage>
              Müşteri e-postasını okumak için{" "}
              <code>SUPABASE_SERVICE_ROLE_KEY</code> tanımlı olmalı.
            </FormMessage>
          )}

          <SubmitButton
            variant="secondary"
            size="sm"
            pendingLabel="Gönderiliyor…"
            className="self-start"
          >
            Müşteriye Bildirim Gönder
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
