"use client";

import { useActionState } from "react";
import {
  updateEmailAction,
  type ProfileActionState,
} from "@/app/actions/profile";
import { inputClass, labelClass, hintClass } from "@/components/ui/field";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";

const field = inputClass("panel");

export default function EmailForm({ current }: { current: string }) {
  const [state, formAction] = useActionState<ProfileActionState, FormData>(
    updateEmailAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <FormMessage>{state.error}</FormMessage>}
      {state.ok && <FormMessage tone="ok">{state.ok}</FormMessage>}

      <div>
        <span className={labelClass}>Mevcut e-posta</span>
        <div className="text-sm py-3">{current}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="new_email" className={labelClass}>
            Yeni e-posta
          </label>
          <input
            id="new_email"
            name="new_email"
            type="email"
            required
            autoComplete="email"
            placeholder="yeni@eposta.com"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="email_current_password" className={labelClass}>
            Mevcut şifreniz
          </label>
          <input
            id="email_current_password"
            name="current_password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={field}
          />
        </div>
      </div>

      <p className={hintClass}>
        Güvenlik için şifrenizi soruyoruz. Yeni adrese bir onay bağlantısı
        gönderilir; siz onaylayana kadar giriş için eski adresiniz geçerli
        kalır.
      </p>

      <SubmitButton
        variant="secondary"
        size="sm"
        pendingLabel="Gönderiliyor…"
        className="self-start mt-1"
      >
        E-postayı Değiştir
      </SubmitButton>
    </form>
  );
}
