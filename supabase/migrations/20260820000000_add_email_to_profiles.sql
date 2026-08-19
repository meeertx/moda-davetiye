-- ============================================================
-- Moda Davetiye — Profiles Tablosuna E-posta (Email) Ekleme & Senkronizasyon
--
-- Bu SQL dosyasını Supabase Dashboard → SQL Editor ekranına yapıştırıp RUN deyin.
-- ============================================================

-- 1. Profiles tablosuna email kolonunu ekle
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS email text;

-- 2. Yeni kullanıcı kayıt trigger'ını email bilgisini de otomatik kopyalayacak şekilde güncelle
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, email)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone',
    new.email
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;
  RETURN new;
END;
$$;

-- 3. Mevcut tüm auth.users kayıtlarındaki e-postaları public.profiles tablosuna aktar (Backfill)
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email <> u.email);

-- 4. Email arama performansını artırmak için index oluştur
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
