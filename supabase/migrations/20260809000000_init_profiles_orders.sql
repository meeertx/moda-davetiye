-- ============================================================
-- Moda Davetiye — başlangıç şeması: profiller + siparişler
--
-- Çalıştırma: Supabase Dashboard → SQL Editor → bu dosyanın tamamını yapıştır.
-- (Supabase CLI kullanılıyorsa: supabase db push)
-- ============================================================

-- ============================================================
-- 1. PROFILES TABLOSU (auth.users'ı genişletir)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Yeni kullanıcı auth.users'a eklendiğinde otomatik profil oluştur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. ORDERS TABLOSU
-- ============================================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid not null references public.profiles(id) on delete cascade,

  status text not null default 'new'
    check (status in ('new', 'in_progress', 'completed', 'cancelled')),

  -- Talep formundan gelen bilgiler
  event_type text not null check (event_type in ('dugun', 'nisan', 'kina', 'save_the_date')),
  bride_name text,
  groom_name text,
  event_date date,
  theme_preference text,
  contact_phone text not null,
  contact_note text,

  -- Admin tarafından doldurulan alanlar
  invitation_url text,
  admin_note text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Sipariş numarası otomatik üretimi: DV-2026-000042 formatında
create sequence if not exists public.order_number_seq;

create or replace function public.generate_order_number()
returns trigger
language plpgsql
as $$
begin
  new.order_number := 'DV-' || to_char(now(), 'YYYY') || '-' ||
                       lpad(nextval('public.order_number_seq')::text, 6, '0');
  return new;
end;
$$;

create trigger set_order_number
  before insert on public.orders
  for each row
  when (new.order_number is null)
  execute function public.generate_order_number();

-- updated_at otomatik güncelleme
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- completed_at otomatik set edilsin: status 'completed' olduğunda
create or replace function public.set_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then
    new.completed_at := now();
  end if;
  return new;
end;
$$;

create trigger orders_set_completed_at
  before update on public.orders
  for each row execute function public.set_completed_at();

-- ============================================================
-- 2b. VERİ BÜTÜNLÜĞÜ: link olmadan "completed" olunamaz
--
-- Uygulama tarafında da kontrol ediliyor ama asıl garanti burada:
-- status = 'completed' ise invitation_url dolu olmak zorunda.
-- ============================================================
alter table public.orders
  add constraint orders_completed_requires_url
  check (status <> 'completed' or (invitation_url is not null and invitation_url <> ''));

-- ============================================================
-- 3. INDEXLER
-- ============================================================
create index idx_orders_user_id on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_order_number on public.orders(order_number);

-- ============================================================
-- 4. YARDIMCI FONKSİYON: is_admin()
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.orders enable row level security;

-- PROFILES POLİTİKALARI
create policy "Kullanıcı kendi profilini görebilir"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admin tüm profilleri görebilir"
  on public.profiles for select
  using (public.is_admin());

create policy "Kullanıcı kendi profilini güncelleyebilir"
  on public.profiles for update
  using (auth.uid() = id);

-- ORDERS POLİTİKALARI
create policy "Müşteri sadece kendi siparişlerini görebilir"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Admin tüm siparişleri görebilir"
  on public.orders for select
  using (public.is_admin());

create policy "Müşteri kendi siparişini oluşturabilir"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admin siparişleri güncelleyebilir"
  on public.orders for update
  using (public.is_admin());

-- NOT: Müşterinin kendi siparişini UPDATE etmesine izin YOK (kasıtlı —
-- sipariş oluşturulduktan sonra sadece admin durumu/linki değiştirebilir).
-- Eğer müşterinin belirli alanları (örn. contact_note) düzenlemesine izin
-- vermek istersen, ayrı ve alan-kısıtlı bir policy eklenmeli.

-- ============================================================
-- 6. İlk admin kullanıcısını manuel ata
-- ============================================================
-- Bir kullanıcı normal kayıt olduktan sonra, Supabase SQL Editor'dan:
-- update public.profiles set role = 'admin' where id = '<KULLANICI_UUID>';
--
-- UUID'yi bulmak için:
-- select id, full_name, role from public.profiles order by created_at desc;
