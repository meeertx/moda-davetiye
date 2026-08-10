"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, type ActionState } from "@/app/actions/auth";
import { authInput } from "./AuthShell";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";

export default function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    signInAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}
      {state.error && <FormMessage>{state.error}</FormMessage>}

      <div>
        <label
          htmlFor="email"
          className="block text-xs tracking-[0.03em] mb-1.5"
        >
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="ornek@eposta.com"
          className={authInput}
        />
      </div>

      <div>
        <div className="flex justify-between mb-1.5">
          <label htmlFor="password" className="text-xs tracking-[0.03em]">
            Şifre
          </label>
          <Link href="/sifremi-unuttum" className="text-xs">
            Şifremi Unuttum
          </Link>
        </div>
        <input
          id="password"
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
