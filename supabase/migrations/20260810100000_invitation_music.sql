-- ============================================================
-- Davetiye müziği
--
-- Akış: müşteri sipariş formunda istediği parçayı yazar/bağlantısını
-- verir (YouTube, Spotify, şarkı adı — serbest metin). Ekip parçayı
-- hazırlayıp ses dosyasını yükler, davetiyeye doğrudan çalınabilir bir
-- adres olarak ekler.
--
-- Tarayıcılar sesli otomatik oynatmayı engellediği için davetiye bir
-- "açılış kapısı" ile açılır; müzik kullanıcının ilk tıklamasıyla başlar.
--
-- Çalıştırma: Supabase Dashboard → SQL Editor
-- ============================================================

-- Müşterinin talebi (serbest metin: bağlantı ya da şarkı adı)
alter table public.orders
  add column music_note text;

-- Davetiyede çalacak parça
alter table public.invitations
  add column music_url text,
  add column music_title text;

-- ============================================================
-- Müzik dosyaları için herkese açık bucket
--
-- Davetiye herkese açık olduğu için ses dosyası da açık erişilebilir
-- olmalı; imzalı adres kullanılamaz çünkü <audio> etiketi adresi
-- yenileyemez. Yazma yetkisi yalnızca giriş yapmış kullanıcıda.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'invitation-music',
  'invitation-music',
  true,                                     -- okuma herkese açık
  15728640,                                 -- 15 MB
  array['audio/mpeg','audio/mp3','audio/mp4','audio/x-m4a','audio/ogg','audio/wav']
)
on conflict (id) do nothing;

create policy "Müzik dosyaları herkese açık okunur"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'invitation-music');

create policy "Admin müzik yükleyebilir"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'invitation-music' and public.is_admin());

create policy "Admin müzik silebilir"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'invitation-music' and public.is_admin());
