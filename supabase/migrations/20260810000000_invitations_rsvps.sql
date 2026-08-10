-- ============================================================
-- Davetiyeler + katılım bildirimleri (RSVP)
--
-- Davetiye artık platform dışında değil, burada üretiliyor:
-- admin siparişten bir davetiye kaydı oluşturur, içeriği düzenler,
-- yayına alır. Misafir modavetiye.com/<slug> adresinden görür.
--
-- Çalıştırma: Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- 1. INVITATIONS
-- ============================================================
create table public.invitations (
  id uuid primary key default gen_random_uuid(),

  -- Kök seviye adres: modavetiye.com/<slug>
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 3 and 80),

  -- Her siparişin en fazla bir davetiyesi olur
  order_id uuid not null unique references public.orders(id) on delete cascade,
  user_id  uuid not null references public.profiles(id) on delete cascade,

  theme_slug text not null,

  -- İçerik
  event_type   text not null check (event_type in ('dugun','nisan','kina','save_the_date')),
  bride_name   text,
  groom_name   text,
  -- Geri sayım saat de gerektirdiği için date değil timestamptz
  event_at     timestamptz,
  venue_name   text,
  venue_address text,
  venue_map_url text,
  story        text,
  -- [{ "time": "16:00", "title": "Nikah Töreni" }, ...]
  program      jsonb not null default '[]'::jsonb,
  -- Storage nesne yolları
  photos       jsonb not null default '[]'::jsonb,
  gift_note    text,
  gift_iban    text,

  -- RSVP ayarları
  rsvp_enabled   boolean not null default true,
  rsvp_deadline  date,
  rsvp_plus_one  boolean not null default true,
  -- ["Menü tercihiniz?", ...]
  rsvp_questions jsonb not null default '[]'::jsonb,

  published    boolean not null default false,
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint invitations_program_is_array   check (jsonb_typeof(program) = 'array'),
  constraint invitations_photos_is_array    check (jsonb_typeof(photos) = 'array'),
  constraint invitations_questions_is_array check (jsonb_typeof(rsvp_questions) = 'array'),
  -- Yayına alınan davetiyede en azından çiftin adı ve tarih olmalı
  constraint invitations_publish_requires_content check (
    not published or (
      coalesce(bride_name,'') <> '' and
      coalesce(groom_name,'') <> '' and
      event_at is not null
    )
  )
);

create index idx_invitations_slug on public.invitations(slug);
create index idx_invitations_user_id on public.invitations(user_id);
create index idx_invitations_order_id on public.invitations(order_id);

create trigger invitations_set_updated_at
  before update on public.invitations
  for each row execute function public.set_updated_at();

-- published_at otomatik dolsun
create or replace function public.set_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.published and (old.published is distinct from true) then
    new.published_at := now();
  end if;
  return new;
end;
$$;

create trigger invitations_set_published_at
  before update on public.invitations
  for each row execute function public.set_published_at();

-- ============================================================
-- 2. REZERVE SLUG'LAR
--
-- Davetiye adresleri site kökünde yaşıyor (modavetiye.com/<slug>).
-- Uygulamanın kendi sayfa adları slug olarak alınamaz, yoksa o sayfayı
-- gölgeler. Uygulama tarafında da kontrol var; asıl garanti burada.
-- ============================================================
create table public.reserved_slugs (
  slug text primary key
);

insert into public.reserved_slugs (slug) values
  ('admin'), ('panel'), ('giris'), ('kayit'), ('cikis'),
  ('sifremi-unuttum'), ('davetiye'), ('davetiye-talebi'),
  ('tasarimlar'), ('fiyatlar'), ('iletisim'), ('hakkimizda'),
  ('yorumlar'), ('yasal'), ('satin-al'),
  ('odeme-basarili'), ('odeme-basarisiz'),
  ('api'), ('auth'), ('_next'), ('static'), ('public'),
  ('favicon'), ('icon'), ('manifest'), ('robots'), ('sitemap'),
  ('opengraph-image'), ('apple-touch-icon'), ('images'), ('assets')
on conflict do nothing;

create or replace function public.check_slug_not_reserved()
returns trigger
language plpgsql
as $$
begin
  if exists (select 1 from public.reserved_slugs where slug = new.slug) then
    raise exception 'Bu adres sistem tarafından ayrılmış: %', new.slug
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger invitations_slug_not_reserved
  before insert or update of slug on public.invitations
  for each row execute function public.check_slug_not_reserved();

-- ============================================================
-- 3. RSVP — misafir katılım bildirimleri
-- ============================================================
create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,

  guest_name text not null check (length(trim(guest_name)) between 2 and 80),
  attending  boolean not null,
  -- Katılmıyorsa 0; kötüye kullanımı sınırlamak için üst sınır var
  party_size int not null default 1 check (party_size between 0 and 20),
  note       text check (note is null or length(note) <= 500),
  -- Özel sorulara yanıtlar: { "Menü tercihiniz?": "Vejetaryen" }
  answers    jsonb not null default '{}'::jsonb
    check (jsonb_typeof(answers) = 'object'),

  created_at timestamptz not null default now()
);

create index idx_rsvps_invitation_id on public.rsvps(invitation_id);

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================
alter table public.invitations enable row level security;
alter table public.rsvps enable row level security;
alter table public.reserved_slugs enable row level security;

-- --- INVITATIONS ---

-- Misafir (giriş yapmamış) yalnızca YAYINDAKİ davetiyeyi görebilir
create policy "Yayındaki davetiye herkese açık"
  on public.invitations for select
  to anon, authenticated
  using (published = true);

-- Müşteri kendi davetiyesini yayınlanmadan da görebilir (panelde önizleme)
create policy "Müşteri kendi davetiyesini görebilir"
  on public.invitations for select
  to authenticated
  using (auth.uid() = user_id);

-- Davetiyeyi yalnızca admin oluşturur ve düzenler
create policy "Admin davetiye oluşturabilir"
  on public.invitations for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin davetiyeleri görebilir"
  on public.invitations for select
  to authenticated
  using (public.is_admin());

create policy "Admin davetiyeleri güncelleyebilir"
  on public.invitations for update
  to authenticated
  using (public.is_admin());

create policy "Admin davetiye silebilir"
  on public.invitations for delete
  to authenticated
  using (public.is_admin());

-- --- RSVPS ---

-- Misafir giriş yapmadan yanıt bırakabilir — ama YALNIZCA yayındaki
-- ve RSVP'si açık bir davetiyeye.
create policy "Misafir yayındaki davetiyeye yanıt bırakabilir"
  on public.rsvps for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id
        and i.published = true
        and i.rsvp_enabled = true
        and (i.rsvp_deadline is null or i.rsvp_deadline >= current_date)
    )
  );

-- Yanıtları yalnızca davetiye sahibi ve admin görebilir.
-- (Misafirler birbirlerinin yanıtlarını GÖREMEZ — okuma politikası yok.)
create policy "Davetiye sahibi yanıtları görebilir"
  on public.rsvps for select
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.user_id = auth.uid()
    )
  );

create policy "Admin tüm yanıtları görebilir"
  on public.rsvps for select
  to authenticated
  using (public.is_admin());

-- --- RESERVED SLUGS ---
create policy "Rezerve slug listesi okunabilir"
  on public.reserved_slugs for select
  to anon, authenticated
  using (true);

-- ============================================================
-- 5. ORDERS — davetiye linki artık türetiliyor
--
-- invitation_url alanı duruyor (platform dışında hazırlanmış eski
-- siparişler için), ama yeni akışta davetiye kaydı asıl kaynak.
-- ============================================================
comment on column public.orders.invitation_url is
  'Eski akış: platform dışında hazırlanan davetiyenin adresi. Yeni akışta public.invitations kullanılır.';
