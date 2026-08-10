"use client";

import { useActionState, useRef, useState } from "react";
import {
  uploadGuestPhotosAction,
  type GuestPhotoState,
} from "@/app/actions/guestPhotos";
import type { InvitationContent } from "@/types/invitation";

const MAX_FILES = 6;

/**
 * "Anı Bırakın" — misafirlerin davetiyeye kendi karelerini bırakması.
 *
 * Yüklenen fotoğraflar doğrudan yayınlanmaz; çift onaylayana kadar
 * gizli kalır. Formda bu açıkça yazılı — misafir karesinin neden hemen
 * görünmediğini merak etmesin.
 *
 * Davranış tüm temalarda ortak, görünüm `tone` ile zemine uyarlanıyor;
 * RsvpBlock ile aynı sözleşme.
 */
export default function GuestPhotoBlock({
  content,
  tone = "dark",
  preview = false,
}: {
  content: InvitationContent;
  tone?: "light" | "dark";
  preview?: boolean;
}) {
  const [state, formAction, pending] = useActionState<GuestPhotoState, FormData>(
    uploadGuestPhotosAction,
    {},
  );
  const [names, setNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const dark = tone === "dark";

  if (!content.guestPhotosEnabled) return null;

  const field = dark
    ? "w-full box-border px-0 py-3 text-[15px] bg-transparent border-0 border-b border-white/25 text-white placeholder:text-white/35 outline-none focus:border-white/70 transition-colors rounded-none"
    : "w-full box-border px-0 py-3 text-[15px] bg-transparent border-0 border-b border-black/18 text-ink placeholder:text-black/30 outline-none focus:border-black/55 transition-colors rounded-none";
  const label = dark
    ? "block text-[11px] tracking-[0.16em] uppercase text-white/45 mb-1"
    : "block text-[11px] tracking-[0.16em] uppercase text-black/40 mb-1";

  return (
    <div className="flex flex-col gap-9">
      {/* Onaylanmış kareler — misafirlerin ortak albümü */}
      {content.guestPhotoUrls.length > 0 && (
        <ul className="list-none p-0 m-0 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {content.guestPhotoUrls.map((url) => (
            <li key={url} className="relative aspect-square overflow-hidden">
              {/* Supabase depolama adresi — next/image'in uzak alan adı
                  yapılandırmasına bağlanmamak için düz <img>, temaların
                  galeri bölümleriyle aynı yaklaşım */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Misafir fotoğrafı"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </li>
          ))}
        </ul>
      )}

      {state.ok ? (
        <p
          className={`font-display italic text-[20px] text-center m-0 py-6 ${
            dark ? "text-white/85" : "text-ink"
          }`}
        >
          {state.ok}
        </p>
      ) : (
        <form action={formAction} className="flex flex-col gap-5">
          <input type="hidden" name="invitation_id" value={content.id} />
          <input type="hidden" name="slug" value={content.slug} />

          {preview && (
            <p
              className={`text-[12px] text-center m-0 ${dark ? "text-white/35" : "text-black/35"}`}
            >
              Örnek davetiye — fotoğraflar kaydedilmez.
            </p>
          )}

          {state.error && (
            <p
              role="alert"
              className={`text-[13px] text-center m-0 px-4 py-3 rounded-[4px] ${
                dark ? "bg-white/10 text-white" : "bg-danger-bg text-danger-fg"
              }`}
            >
              {state.error}
            </p>
          )}

          <div>
            <label htmlFor="guest_photo_name" className={label}>
              Adınız{" "}
              <span className="normal-case tracking-normal">(opsiyonel)</span>
            </label>
            <input
              id="guest_photo_name"
              name="guest_name"
              maxLength={80}
              autoComplete="name"
              className={field}
            />
          </div>

          <div>
            <span className={label}>Fotoğraflarınız</span>

            {/* Dosya seçici gizli: tarayıcının varsayılan "Dosya Seç"
                düğmesi davetiyenin havasına oturmuyor. Görünen alan
                gerçek <input>'u tetikleyen bir etiket. */}
            <label
              htmlFor="guest_photos"
              className={`flex flex-col items-center justify-center gap-2 px-6 py-9 cursor-pointer text-center transition-colors ${
                dark
                  ? "border border-dashed border-white/25 hover:border-white/55 text-white/70"
                  : "border border-dashed border-black/20 hover:border-black/50 text-muted"
              }`}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 17V7a2 2 0 0 1 2-2h2.5l1.2-2h4.6l1.2 2H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                <circle cx="12" cy="12.5" r="3.4" />
              </svg>
              <span className="text-[13px]">
                {names.length
                  ? `${names.length} fotoğraf seçildi`
                  : "Fotoğraf seçmek için dokunun"}
              </span>
              <span className="text-[11px] opacity-60">
                En fazla {MAX_FILES} kare · JPG, PNG veya WebP
              </span>
            </label>

            <input
              ref={inputRef}
              id="guest_photos"
              name="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              multiple
              required
              className="sr-only"
              onChange={(e) =>
                setNames(Array.from(e.target.files ?? []).map((f) => f.name))
              }
            />

            {names.length > 0 && (
              <ul
                className={`list-none p-0 mt-3 m-0 flex flex-col gap-1 text-[12px] ${
                  dark ? "text-white/55" : "text-muted"
                }`}
              >
                {names.map((n) => (
                  <li key={n} className="truncate">
                    {n}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p
            className={`text-[12px] leading-[1.6] m-0 ${dark ? "text-white/40" : "text-muted"}`}
          >
            Gönderdiğiniz kareler çift onayladıktan sonra davetiyede görünür.
          </p>

          <button
            type="submit"
            disabled={pending}
            className={`cursor-pointer border px-6 py-4 mt-1 rounded-full text-[12px] tracking-[0.18em] uppercase transition-colors disabled:opacity-50 disabled:cursor-default ${
              dark
                ? "bg-transparent border-white/45 text-white hover:bg-white hover:text-black"
                : "bg-transparent border-ink text-ink hover:bg-ink hover:text-cream"
            }`}
          >
            {pending ? "Gönderiliyor…" : "Anımı Gönder"}
          </button>
        </form>
      )}
    </div>
  );
}
