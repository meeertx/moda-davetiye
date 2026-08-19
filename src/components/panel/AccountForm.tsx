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
      {state.ok && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>✨ {state.ok}</span>
        </div>
      )}

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
            Telefon Numarası
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
        variant="gold"
        shape="pill"
        size="sm"
        pendingLabel="Supabase Veritabanına Kaydediliyor…"
        className="self-start mt-2 px-6 font-semibold apple-press"
      >
        💾 Değişiklikleri Veritabanına Kaydet
      </SubmitButton>
    </form>
  );
}
