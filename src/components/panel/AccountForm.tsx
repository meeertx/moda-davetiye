"use client";

import { useActionState } from "react";
import {
  updateProfileAction,
  type ProfileActionState,
} from "@/app/actions/profile";
import { inputClass, labelClass } from "@/components/ui/field";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";

const field = inputClass("panel");

export default function AccountForm({
  fullName,
  phone,
}: {
  fullName: string;
  phone: string | null;
}) {
  const [state, formAction] = useActionState<ProfileActionState, FormData>(
    updateProfileAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <FormMessage>{state.error}</FormMessage>}
      {state.ok && <FormMessage tone="ok">{state.ok}</FormMessage>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="full_name" className={labelClass}>
            Ad Soyad
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            maxLength={120}
            autoComplete="name"
            defaultValue={fullName}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={phone ?? ""}
            placeholder="05__ ___ __ __"
            className={field}
          />
        </div>
      </div>

      <SubmitButton
        variant="primary"
        size="sm"
        pendingLabel="Kaydediliyor…"
        className="self-start mt-1"
      >
        Kaydet
      </SubmitButton>
    </form>
  );
}
