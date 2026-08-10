"use client";

import { useActionState } from "react";
import { resetPasswordAction, type ActionState } from "@/app/actions/auth";
import { authInput } from "./AuthShell";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";

type State = ActionState & { sent?: boolean };

export default function ResetPasswordForm() {
  const [state, formAction] = useActionState<State, FormData>(
    resetPasswordAction,
    {},
  );

  if (state.sent) {
    return (
      <FormMessage tone="ok">
        Sıfırlama bağlantısı gönderildi. Gelen kutunuzu (ve spam klasörünü)
        kontrol edin.
      </FormMessage>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <FormMessage>{state.error}</FormMessage>}
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="ornek@eposta.com"
        className={authInput}
        aria-label="E-posta"
      />
      <SubmitButton variant="primary" shape="sharp" block>
        Sıfırlama Bağlantısı Gönder
      </SubmitButton>
    </form>
  );
}
