"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signInAction, type ActionState } from "@/app/actions/auth";
import { authInput } from "./AuthShell";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";

export default function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    signInAction,
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
          <span>✨ Giriş Başarılı! Panelinize aktarılıyorsunuz…</span>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium tracking-[0.03em] mb-1.5 text-ink"
        >
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
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="password" className="text-xs font-medium tracking-[0.03em] text-ink">
            Şifre
          </label>
          <Link href="/sifremi-unuttum" className="text-xs text-gold hover:underline font-medium">
            Şifremi Unuttum?
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
        pendingLabel="Giriş Yapılıyor &amp; Yönlendiriliyor…"
        variant="gold"
        shape="pill"
        block
        className="mt-2 py-3.5 font-semibold tracking-wider text-xs apple-press shadow-md"
      >
        Giriş Yap ve Devam Et →
      </SubmitButton>
    </form>
  );
}
