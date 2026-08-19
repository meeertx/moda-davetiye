"use client";

import { useActionState, useState } from "react";
import { submitRsvpAction, type RsvpState } from "@/app/actions/rsvp";
import type { InvitationContent } from "@/types/invitation";

/**
 * Misafir katılım formu.
 *
 * Davranış tüm temalarda ortak; görünüm `tone` ile açık ya da koyu
 * zemine uyarlanır. Böylece yedi tema için yedi form yazılmıyor ama her
 * tema kendi zemininde doğru görünüyor.
 */
export default function RsvpBlock({
  content,
  tone = "dark",
  preview = false,
}: {
  content: InvitationContent;
  tone?: "light" | "dark";
  preview?: boolean;
}) {
  const [state, formAction] = useActionState<RsvpState, FormData>(
    submitRsvpAction,
    {},
  );
  const [attending, setAttending] = useState<boolean | null>(null);

  const dark = tone === "dark";

  /*
    Kutulu form alanları davetiyenin havasını bozuyordu — bir web formu
    gibi duruyorlardı. Alanlar artık yalnızca alt çizgiyle tanımlanıyor:
    davet kartına elle yazılan boşluklara daha yakın.
  */
  const field = dark
    ? "w-full box-border px-0 py-3 text-[15px] bg-transparent border-0 border-b border-white/25 text-white placeholder:text-white/35 outline-none focus:border-white/70 transition-colors rounded-none"
    : "w-full box-border px-0 py-3 text-[15px] bg-transparent border-0 border-b border-black/18 text-ink placeholder:text-black/30 outline-none focus:border-black/55 transition-colors rounded-none";
  const label = dark
    ? "block text-[11px] tracking-[0.16em] uppercase text-white/45 mb-1"
    : "block text-[11px] tracking-[0.16em] uppercase text-black/40 mb-1";

  const deadlinePassed =
    content.rsvp.deadline != null &&
    new Date(content.rsvp.deadline) < new Date(new Date().toDateString());

  if (!content.rsvp.enabled) return null;

  if (state.sent) {
    return (
      <div className="text-center py-10 px-6 rounded-2xl bg-gold/10 border border-gold/40 shadow-xl backdrop-blur-md animate-fade-in">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F5E6B3] to-[#C09622] text-black text-2xl flex items-center justify-center shadow-lg">
          ✨
        </div>
        <h3 className={`font-display text-2xl font-semibold m-0 mb-2.5 ${dark ? "text-amber-200" : "text-ink"}`}>
          RSVP Yanıtınız Çifte İletildi!
        </h3>
        <p className={`text-sm leading-relaxed m-0 max-w-md mx-auto ${dark ? "text-amber-100/80" : "text-muted"}`}>
          Katılım durumunuz ve özel mesajınız başarıyla sisteme aktarıldı. Mutluluğumuzu paylaştığınız için teşekkür ederiz.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest shadow-xs">
          ✦ Katılımınız Onaylandı ❖
        </div>
      </div>
    );
  }

  if (deadlinePassed) {
    return (
      <p
        className={`text-sm text-center m-0 py-8 ${
          dark ? "text-white/60" : "text-muted"
        }`}
      >
        Katılım bildirimi süresi doldu. Çiftle doğrudan iletişime
        geçebilirsiniz.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="invitation_id" value={content.id} />

      {preview && (
        // Uyarı değil, dipnot: vurgu rengi kullanmıyor ki hata gibi durmasın
        <p
          className={`text-[12px] text-center m-0 ${dark ? "text-white/35" : "text-black/35"}`}
        >
          Örnek davetiye — yanıtlar kaydedilmez.
        </p>
      )}

      {state.error && (
        <p
          role="alert"
          className={`text-[13px] text-center m-0 px-4 py-3 rounded-[4px] ${
            dark
              ? "bg-white/10 text-white"
              : "bg-danger-bg text-danger-fg"
          }`}
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="guest_name" className={label}>
          Adınız Soyadınız
        </label>
        <input
          id="guest_name"
          name="guest_name"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          className={field}
        />
      </div>

      <fieldset className="border-0 p-0 m-0">
        <legend className={label}>Katılacak mısınız?</legend>
        <div className="flex gap-3">
          {[
            { value: "yes", text: "Katılıyorum" },
            { value: "no", text: "Katılamıyorum" },
          ].map((opt) => {
            const on = attending === (opt.value === "yes");
            return (
              <label
                key={opt.value}
                className={`flex-1 cursor-pointer text-center px-4 py-3.5 rounded-full text-[12px] tracking-[0.1em] uppercase border transition-colors ${
                  on
                    ? dark
                      ? "bg-white/95 text-black border-white/95"
                      : "bg-ink text-cream border-ink"
                    : dark
                      ? "border-white/25 text-white/80 hover:border-white/55"
                      : "border-black/18 text-ink hover:border-black/45"
                }`}
              >
                <input
                  type="radio"
                  name="attending"
                  value={opt.value}
                  required
                  checked={on}
                  onChange={() => setAttending(opt.value === "yes")}
                  className="sr-only"
                />
                {opt.text}
              </label>
            );
          })}
        </div>
      </fieldset>

      {attending === true && (
        <div>
          <label htmlFor="party_size" className={label}>
            Kaç kişi geleceksiniz?
            {!content.rsvp.plusOne && (
              <span className="normal-case tracking-normal"> (yalnızca siz)</span>
            )}
          </label>
          <input
            id="party_size"
            name="party_size"
            type="number"
            min={1}
            max={content.rsvp.plusOne ? 20 : 1}
            defaultValue={1}
            className={field}
          />
        </div>
      )}

      {content.rsvp.questions.map((q, i) => (
        <div key={q}>
          <label htmlFor={`soru_${i}`} className={label}>
            {q}
          </label>
          <input type="hidden" name={`soru_${i}__label`} value={q} />
          <input id={`soru_${i}`} name={`soru_${i}`} className={field} />
        </div>
      ))}

      <div>
        <label htmlFor="note" className={label}>
          Notunuz <span className="normal-case tracking-normal">(opsiyonel)</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          maxLength={500}
          className={`${field} resize-y`}
        />
      </div>

      <button
        type="submit"
        className={`cursor-pointer px-8 py-4 mt-3 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 transform hover:scale-105 shadow-lg ${
          dark
            ? "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black border border-amber-300 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            : "bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white border border-amber-600 shadow-[0_0_25px_rgba(180,130,40,0.3)]"
        }`}
      >
        ✨ Yanıtımı Gönder
      </button>
    </form>
  );
}
