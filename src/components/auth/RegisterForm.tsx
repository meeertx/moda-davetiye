"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signUpAction, type ActionState } from "@/app/actions/auth";
import { authInput } from "./AuthShell";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";

export default function RegisterForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    signUpAction,
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      action={(formData) => {
        setSubmitted(true);
        formAction(formData);
      }}
      className="flex flex-col gap-4"
    >
      {next && <input type="hidden" name="next" value={next} />}
      {state.error && <FormMessage>{state.error}</FormMessage>}

      {submitted && !state.error && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-2 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>🎉 Hesabınız oluşturuldu! Müşteri panelinize yönlendiriliyorsunuz…</span>
        </div>
      )}

      <div>
        <label htmlFor="full_name" className="block text-xs font-medium mb-1.5 text-ink">
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
        <label htmlFor="email" className="block text-xs font-medium mb-1.5 text-ink">
          E-posta Adresi
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
        <label htmlFor="phone" className="block text-xs font-medium mb-1.5 text-ink">
          Telefon Numarası <span className="text-muted font-normal">(opsiyonel)</span>
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
        <label htmlFor="password" className="block text-xs font-medium mb-1.5 text-ink">
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

      <label className="flex gap-2.5 items-start text-xs text-muted leading-relaxed cursor-pointer select-none">
        <input type="checkbox" name="kvkk" value="1" required className="mt-0.5 rounded accent-gold" />
        <span>
          <Link href="/yasal#kvkk" className="text-gold font-medium hover:underline">KVKK Aydınlatma Metni</Link>&apos;ni okudum,
          kişisel verilerimin işlenmesini kabul ediyorum.
        </span>
      </label>

      <SubmitButton
        pendingLabel="Hesap Oluşturuluyor &amp; Yönlendiriliyor…"
        variant="gold"
        shape="pill"
        block
        className="mt-2 py-3.5 font-semibold tracking-wider text-xs apple-press shadow-md"
      >
        Hesap Oluştur ve Başla →
      </SubmitButton>
    </form>
  );
}
