"use client";

import { useActionState } from "react";
import {
  updatePasswordAction,
  type ProfileActionState,
} from "@/app/actions/profile";
import { inputClass, labelClass, hintClass } from "@/components/ui/field";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";

const field = inputClass("panel");

export default function PasswordForm() {
  const [state, formAction] = useActionState<ProfileActionState, FormData>(
    updatePasswordAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <FormMessage>{state.error}</FormMessage>}
      {state.ok && <FormMessage tone="ok">{state.ok}</FormMessage>}

      <div className="max-w-[320px]">
        <label htmlFor="current_password" className={labelClass}>
          Mevcut şifreniz
        </label>
        <input
          id="current_password"
          name="current_password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className={field}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="new_password" className={labelClass}>
            Yeni şifre
          </label>
          <input
            id="new_password"
            name="new_password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="En az 8 karakter"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="confirm_password" className={labelClass}>
            Yeni şifre (tekrar)
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Tekrar girin"
            className={field}
          />
        </div>
      </div>

      <p className={hintClass}>
        Şifreniz değiştikten sonra bu cihazdaki oturumunuz açık kalır.
      </p>

      <SubmitButton
        variant="secondary"
        size="sm"
        pendingLabel="Güncelleniyor…"
        className="self-start mt-1"
      >
        Şifreyi Değiştir
      </SubmitButton>
    </form>
  );
}
