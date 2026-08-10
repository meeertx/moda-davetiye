"use client";

import { useActionState } from "react";
import { adminSignInAction, type ActionState } from "@/app/actions/auth";
import { BRAND } from "@/lib/brand";
import { authInput } from "@/components/auth/AuthShell";
import { labelClass } from "@/components/ui/field";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";

export default function AdminLoginForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    adminSignInAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <FormMessage>{state.error}</FormMessage>}

      <div>
        <label htmlFor="admin-email" className={labelClass}>
          E-posta
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={`admin@${BRAND.domain}`}
          className={authInput}
        />
      </div>

      <div>
        <label htmlFor="admin-password" className={labelClass}>
          Şifre
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className={authInput}
        />
      </div>

      <SubmitButton
        pendingLabel="Giriş yapılıyor…"
        variant="primary"
        shape="sharp"
        block
        className="mt-2"
      >
        Giriş Yap
      </SubmitButton>
    </form>
  );
}
