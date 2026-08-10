

-- ============================================================
-- 1. SİPARİŞ — müşteriden toplanan yeni alanlar
-- ============================================================
alter table public.orders
  add column bride_parents text,
  add column groom_parents text,
  -- ["Mevsim Salatası", "Kuzu Tandır", ...]
  add column menu jsonb not null default '[]'::jsonb,
  add column extra_info text,
  add constraint orders_menu_is_array check (jsonb_typeof(menu) = 'array');

-- ============================================================
-- 2. DAVETİYE — aynı alanlar + misafir fotoğrafı ayarı
-- ============================================================
alter table public.invitations
  add column bride_parents text,
  add column groom_parents text,
  add column menu jsonb not null default '[]'::jsonb,
  add column extra_info text,
  -- Misafirler davetiyeye fotoğraf bırakabilsin mi?
  add column guest_photos_enabled boolean not null default false,
  add constraint invitations_menu_is_array check (jsonb_typeof(menu) = 'array');

-- ============================================================
-- 3. MİSAFİR FOTOĞRAFLARI
--
-- Herkese açık yazım söz konusu olduğu için moderasyon şart:
-- yüklenen kare `approved = false` başlar, çift onaylayana kadar
-- davetiyede görünmez.
-- ============================================================
create table public.guest_photos (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,

  -- Storage yolu: "<invitation_id>/<dosya>"
  path text not null,
  guest_name text check (guest_name is null or length(trim(guest_name)) <= 80),
  approved boolean not null default false,

  created_at timestamptz not null default now()
);

create index idx_guest_photos_invitation on public.guest_photos(invitation_id);
create index idx_guest_photos_approved on public.guest_photos(invitation_id, approved);

alter table public.guest_photos enable row level security;

-- Misafir giriş yapmadan yükleyebilir — yalnızca yayında ve fotoğraf
-- toplama açık bir davetiyeye.
create policy "Misafir yayındaki davetiyeye fotoğraf bırakabilir"
  on public.guest_photos for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id
        and i.published = true
        and i.guest_photos_enabled = true
    )
  );

-- Onaylanmış kareleri herkes görebilir (davetiyede galeri olarak)
create policy "Onaylı misafir fotoğrafları herkese açık"
  on public.guest_photos for select
  to anon, authenticated
  using (approved = true);

-- Çift ve admin onay bekleyenleri de görür
create policy "Davetiye sahibi tüm fotoğrafları görebilir"
  on public.guest_photos for select
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.user_id = auth.uid()
    )
  );

create policy "Admin tüm misafir fotoğraflarını görebilir"
  on public.guest_photos for select
  to authenticated
  using (public.is_admin());

-- Onaylama/silme yalnızca çift ve admin
create policy "Davetiye sahibi fotoğrafı onaylayabilir"
  on public.guest_photos for update
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.user_id = auth.uid()
    )
  );

create policy "Davetiye sahibi fotoğrafı silebilir"
  on public.guest_photos for delete
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.user_id = auth.uid()
    )
  );

create policy "Admin misafir fotoğrafını yönetebilir"
  on public.guest_photos for update
  to authenticated
  using (public.is_admin());

create policy "Admin misafir fotoğrafını silebilir"
  on public.guest_photos for delete
  to authenticated
  using (public.is_admin());

-- ============================================================
-- 4. STORAGE — misafir fotoğrafları
--
-- Okuma herkese açık: onaylanan kareler davetiyede gösterilecek ve
-- <img> etiketi imzalı adresi yenileyemez. Gizlilik, hangi kaydın
-- `approved` olduğuna karar veren tabloda korunuyor — yol tahmin
-- edilemez bir UUID taşır.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'guest-photos',
  'guest-photos',
  true,
  8388608,                                  -- 8 MB
  array['image/jpeg','image/png','image/webp','image/heic']
)
on conflict (id) do nothing;

create policy "Misafir fotoğrafları okunabilir"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'guest-photos');

create policy "Misafir fotoğraf yükleyebilir"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'guest-photos');

create policy "Admin misafir fotoğrafı silebilir"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'guest-photos' and public.is_admin());
