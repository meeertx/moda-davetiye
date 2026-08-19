"use client";

import { useActionState } from "react";
import {
  deleteGuestPhotoAction,
  moderateGuestPhotoAction,
  type GuestPhotoState,
} from "@/app/actions/guestPhotos";
import Badge from "@/components/ui/Badge";
import FormMessage from "@/components/ui/FormMessage";
import Toast from "@/components/ui/Toast";
import { formatDateTime } from "@/lib/orders";

export interface ModerationPhoto {
  id: string;
  url: string;
  guest_name: string | null;
  approved: boolean;
  created_at: string;
}

/**
 * Misafir fotoğraflarının onay ekranı.
 */
export default function GuestPhotoModeration({
  photos,
  slug,
}: {
  photos: ModerationPhoto[];
  slug: string;
}) {
  const [state, moderate] = useActionState<GuestPhotoState, FormData>(
    moderateGuestPhotoAction,
    {},
  );
  const [deleteState, remove] = useActionState<GuestPhotoState, FormData>(
    deleteGuestPhotoAction,
    {},
  );

  const message = state.error ?? deleteState.error;
  const success = state.ok ?? deleteState.ok;

  if (!photos.length) {
    return (
      <div className="bg-paper-alt border border-line-panel rounded-[10px] p-10 text-center">
        <div className="font-display text-xl mb-2">Henüz fotoğraf yok</div>
        <p className="text-sm text-muted leading-[1.7] m-0">
          Misafirleriniz davetiyedeki &ldquo;Anı Bırakın&rdquo; bölümünden
          fotoğraf gönderdikçe burada birikecek.
        </p>
      </div>
    );
  }

  return (
    <>
      {message && (
        <div className="mb-5">
          <FormMessage>{message}</FormMessage>
        </div>
      )}
      {success && (
        <div className="mb-5">
          <FormMessage tone="ok">{success}</FormMessage>
          <Toast
            title="Anılar Güncellendi ✨"
            message={success}
            type="success"
          />
        </div>
      )}

      <ul className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <li
            key={photo.id}
            className="bg-paper-alt border border-line-panel rounded-[10px] overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[4/3] bg-shell">
              {/* Supabase depolama adresi — next/image'in uzak alan adı
                  yapılandırmasına bağlanmamak için düz <img> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={
                  photo.guest_name
                    ? `${photo.guest_name} tarafından gönderilen fotoğraf`
                    : "Misafir fotoğrafı"
                }
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[14px]">
                  {photo.guest_name || "İsimsiz misafir"}
                </span>
                <Badge tone={photo.approved ? "ok" : "neutral"}>
                  {photo.approved ? "Yayında" : "Onay bekliyor"}
                </Badge>
              </div>

              <div className="text-[12.5px] text-muted">
                {formatDateTime(photo.created_at)}
              </div>

              <div className="flex gap-2 mt-auto pt-1">
                <form action={moderate} className="flex-1">
                  <input type="hidden" name="photo_id" value={photo.id} />
                  <input type="hidden" name="slug" value={slug} />
                  <input
                    type="hidden"
                    name="approve"
                    value={photo.approved ? "0" : "1"}
                  />
                  <button
                    type="submit"
                    className={`w-full cursor-pointer px-3 py-2.5 rounded-md text-[12.5px] transition-colors ${
                      photo.approved
                        ? "border border-line-panel bg-transparent text-slate hover:text-ink hover:border-gold"
                        : "border border-ink bg-ink text-cream hover:bg-ink-lift"
                    }`}
                  >
                    {photo.approved ? "Gizle" : "Yayınla"}
                  </button>
                </form>

                <form action={remove}>
                  <input type="hidden" name="photo_id" value={photo.id} />
                  <input type="hidden" name="slug" value={slug} />
                  <button
                    type="submit"
                    aria-label="Fotoğrafı sil"
                    className="cursor-pointer px-3 py-2.5 rounded-md text-[12.5px] border border-line-panel bg-transparent text-muted hover:text-danger-fg hover:border-danger-fg transition-colors"
                  >
                    Sil
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
