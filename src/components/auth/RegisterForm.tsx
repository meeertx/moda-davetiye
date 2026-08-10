"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction, type ActionState } from "@/app/actions/auth";
import { authInput } from "./AuthShell";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";

export default function RegisterForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    signUpAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}
      {state.error && <FormMessage>{state.error}</FormMessage>}

      <div>
        <label htmlFor="full_name" className="block text-xs mb-1.5">
          Ad Soyad
        </label>
        <input
          id="full_name"
          name="full_name"
          required
          autoComplete="name"
          placeholder="Adınız Soyadınız"
          className={authInput}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs mb-1.5">
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
        <label htmlFor="phone" className="block text-xs mb-1.5">
          Telefon <span className="text-muted">(opsiyonel)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="05__ ___ __ __"
          className={authInput}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs mb-1.5">
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="En az 8 karakter"
          className={authInput}
        />
      </div>

      <label className="flex gap-2 items-start text-xs text-muted leading-[1.5]">
        <input type="checkbox" name="kvkk" value="1" className="mt-0.5" />
        <span>
          <Link href="/yasal#kvkk">KVKK Aydınlatma Metni</Link>&apos;ni okudum,
          kişisel verilerimin işlenmesini kabul ediyorum.
        </span>
      </label>

      <SubmitButton
        pendingLabel="Hesap oluşturuluyor…"
        variant="primary"
        shape="sharp"
        block
        className="mt-1"
      >
        Hesap Oluştur
      </SubmitButton>
    </form>
  );
}
