"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "order-photos";
const MAX_PHOTOS = 12;
const MAX_BYTES = 8 * 1024 * 1024;

interface Uploaded {
  /** Storage nesne yolu: "<user_id>/<dosya>" */
  path: string;
  /** Yerel önizleme URL'i — imzalı URL almaya gerek kalmasın diye */
  previewUrl: string;
}

/**
 * Fotoğrafları Supabase Storage'a yükler.
 *
 * Dosyalar kullanıcının kendi klasörüne (`<user_id>/…`) yazılır; Storage
 * politikaları sahipliği bu klasör adından belirler. Sipariş henüz
 * oluşmadığı için yollar forma gizli alan olarak eklenir.
 */
export default function PhotoUploader({ userId }: { userId: string }) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Uploaded[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);

    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      setError(`En fazla ${MAX_PHOTOS} fotoğraf yükleyebilirsiniz.`);
      return;
    }

    setBusy(true);
    const added: Uploaded[] = [];

    for (const file of Array.from(files).slice(0, remaining)) {
      if (file.size > MAX_BYTES) {
        setError(`"${file.name}" 8 MB sınırını aşıyor, atlandı.`);
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        setError(`"${file.name}" yüklenemedi: ${uploadError.message}`);
        continue;
      }
      added.push({ path, previewUrl: URL.createObjectURL(file) });
    }

    setPhotos((prev) => [...prev, ...added]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function remove(target: Uploaded) {
    await supabase.storage.from(BUCKET).remove([target.path]);
    URL.revokeObjectURL(target.previewUrl);
    setPhotos((prev) => prev.filter((p) => p.path !== target.path));
  }

  return (
    <div>
      {/* Sunucuya yalnızca yollar gider */}
      <input
        type="hidden"
        name="photos"
        value={JSON.stringify(photos.map((p) => p.path))}
      />

      <div className="grid grid-cols-4 gap-2.5 mb-3">
        {photos.map((p) => (
          <div
            key={p.path}
            className="relative aspect-square rounded-[4px] overflow-hidden border border-line"
          >
            {/* Yerel blob önizlemesi — next/image optimizasyonuna uygun değil */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.previewUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(p)}
              aria-label="Fotoğrafı kaldır"
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-ink/80 text-cream text-xs cursor-pointer border-0 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="aspect-square border border-dashed border-[oklch(75%_0.01_60)] rounded-[4px] flex items-center justify-center text-[oklch(55%_0.01_60)] text-xl cursor-pointer bg-transparent disabled:cursor-wait"
          >
            {busy ? "…" : "+"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <p className="text-xs text-muted m-0">
        {photos.length}/{MAX_PHOTOS} fotoğraf · JPG, PNG veya WebP · dosya
        başına en fazla 8 MB
      </p>

      {error && (
        <p className="text-xs text-danger-fg mt-2 m-0" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
