-- ============================================================
-- Sipariş detay alanları + fotoğraf depolama
--
-- Akış iki aşamalı hale geldi:
--   1. aşama (giriş gerekmez): etkinlik türü, isimler, tarih, tema → demo
--   2. aşama (giriş gerekli):  aşağıdaki detaylar → sipariş oluşur
--
-- Çalıştırma: Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- 1. ORDERS — detay alanları
-- Tümü opsiyonel: müşteri bilmiyorsa boş bırakabilir, admin sonra tamamlar.
-- ============================================================
alter table public.orders
  -- Mekan ve konum
  add column venue_name text,
  add column venue_address text,
  add column venue_map_url text,

  -- Program akışı: [{ "time": "16:00", "title": "Nikah Töreni" }, ...]
  add column program jsonb not null default '[]'::jsonb,

  -- Çift hikayesi ve fotoğraflar
  add column story text,
  -- Storage'daki nesne yolları: ["<user_id>/abc.jpg", ...]
  add column photos jsonb not null default '[]'::jsonb,

  -- RSVP ayarları
  add column rsvp_deadline date,
  add column rsvp_plus_one boolean not null default true,
  -- Misafire sorulacak ek sorular: ["Menü tercihiniz?", ...]
  add column rsvp_questions jsonb not null default '[]'::jsonb,

  -- Hediye
  add column gift_note text,
  add column gift_iban text;

-- JSONB alanların dizi olduğunu garanti et (obje/string gelmesin)
alter table public.orders
  add constraint orders_program_is_array
    check (jsonb_typeof(program) = 'array'),
  add constraint orders_photos_is_array
    check (jsonb_typeof(photos) = 'array'),
  add constraint orders_rsvp_questions_is_array
    check (jsonb_typeof(rsvp_questions) = 'array');

-- ============================================================
-- 2. STORAGE — sipariş fotoğrafları
--
-- Dosya yolu daima "<user_id>/<dosya>" biçiminde; politikalar bu ilk
-- klasör adına bakarak sahipliği belirler.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'order-photos',
  'order-photos',
  false,                                    -- herkese açık DEĞİL, imzalı URL ile okunur
  8388608,                                  -- dosya başına 8 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Müşteri yalnızca kendi klasörüne yükleyebilir
create policy "Kullanıcı kendi klasörüne fotoğraf yükleyebilir"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'order-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Müşteri yalnızca kendi fotoğraflarını görebilir
create policy "Kullanıcı kendi fotoğraflarını görebilir"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'order-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Müşteri yalnızca kendi fotoğrafını silebilir
create policy "Kullanıcı kendi fotoğrafını silebilir"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'order-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin tüm sipariş fotoğraflarını görebilir
create policy "Admin tüm sipariş fotoğraflarını görebilir"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'order-photos' and public.is_admin());
