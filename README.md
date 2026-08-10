# Moda Davetiye

Dijital davetiye ve RSVP platformu. Next.js 16 (App Router) + TypeScript +
Tailwind v4 + Supabase.

## Çalıştırma

```bash
cp .env.example .env    # ilk kurulumda bir kez
npm install
npm run dev             # http://localhost:3000
```

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm run lint` | ESLint |
| `npm run icons` | `public/icon.svg`'den favicon/PWA türevlerini üretir |
| `npm run types:supabase` | Canlı şemadan `src/types/supabase.ts` üretir |
| `npm run check:supabase` | Bağlantı, şema ve anahtar teşhisi |
| `npm run state` | Veritabanının anlık durumunu döker |
| `npm run admin -- <eposta>` | Kullanıcıyı admin yapar (argümansız: listeler) |
| `npm run e2e` | Sipariş akışı testi — gerçek oturumlarla, RLS dahil |
| `npm run e2e:http` | Aynı akışı çalışan sunucuda HTTP üzerinden test eder |

`e2e` testleri geçici kullanıcı oluşturup sonunda siler; canlı veriye
dokunmaz.

## İş modeli — concierge

Müşteri davetiyeyi kendisi kurgulamaz — önce demoyu görür, beğenirse
sipariş verir. Akış iki aşamalı:

```
1. AŞAMA — giriş gerekmez
   /davetiye-talebi          isim, tarih, tema (en az bilgi)
   /davetiye-talebi/onizleme sınırlı demo önizleme

2. AŞAMA — giriş gerekir
   /davetiye-talebi/detaylar mekan, program, hikaye, fotoğraf, RSVP, hediye
                             → sipariş oluşur (status: new, invitation_url boş)

3. ADMIN
   /admin/siparisler         siparişi görür, davetiyeyi platform dışında hazırlar
   .../[orderNumber]         "Davetiye Linki" alanına URL girer → Tamamlandı

4. MÜŞTERİ
   /panel/siparis/[no]       link belirir, müşteri açıp paylaşır
```

1. aşamanın verisi URL sorgu parametrelerinde taşınır. Böylece araya giren
kayıt/giriş adımından dönüldüğünde bilgiler kaybolmaz ve önizleme bağlantısı
paylaşılabilir olur — taslak kaydı tutmaya gerek kalmaz
([`order-draft.ts`](src/lib/order-draft.ts)).

## Supabase kurulumu

1. [supabase.com](https://supabase.com) üzerinde proje aç.
2. **SQL Editor** → `supabase/migrations/` altındaki dosyaları **sırayla**
   yapıştır ve çalıştır:
   1. `20260809000000_init_profiles_orders.sql` — profiller, siparişler, RLS
   2. `20260809100000_order_details.sql` — sipariş detay sütunları + fotoğraf
      için Storage bucket'ı ve politikaları

   Doğrulamak için: `npm run check:supabase`
3. **Project Settings → API** ekranından iki değeri alıp `.env`'e yaz:
   `NEXT_PUBLIC_SUPABASE_URL` (Project URL) ve
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon public). Aynı ekrandaki
   `service_role` anahtarı opsiyoneldir — yalnızca admin panelindeki
   "Müşteriye Bildirim Gönder" butonu için gerekir.

   > Prisma/Drizzle kullanmadığımız için `DATABASE_URL`/`DIRECT_URL`,
   > Supabase Auth kendi JWT'sini imzaladığı için `AUTH_SECRET` gerekmiyor.

4. Uygulamadan normal bir kullanıcı olarak kayıt ol, ardından SQL Editor'da
   kendini admin yap:
   ```sql
   select id, full_name from public.profiles order by created_at desc;
   update public.profiles set role = 'admin' where id = '<UUID>';
   ```
5. (Opsiyonel) Tip üretimini bağla:
   ```bash
   npx supabase login
   npx supabase link --project-ref <PROJE_REF>
   npm run types:supabase
   ```

> **Supabase bağlanmadan da site çalışır.** Anahtarlar boşken route
> korumaları devre dışı kalır ve veri ekranları "Supabase yapılandırılmadı"
> uyarısı gösterir; pazarlama sayfaları normal çalışmaya devam eder.

### Veri modeli

| Tablo | İçerik |
|---|---|
| `public.profiles` | `auth.users`'ı genişletir — `full_name`, `phone`, `role` (customer/admin). Kayıt sırasında trigger ile otomatik oluşur. |
| `public.orders` | Sipariş — durum, talep bilgileri, mekan/program/hikaye/RSVP/hediye detayları, `invitation_url`, `admin_note`. Sipariş numarası (`DV-2026-000042`) trigger ile üretilir. |
| `storage.order-photos` | Sipariş fotoğrafları. Herkese açık değil; dosyalar `<user_id>/…` klasörüne yazılır, görüntüleme imzalı URL ile yapılır. |

### Admin paneline giriş

Paylaşılacak tek adres **`/admin`** — ayrı bir giriş linki vermeye gerek yok:

| Kim `/admin`'e giderse | Ne olur |
|---|---|
| Giriş yapmamış ziyaretçi | `/admin/giris`'e yönlenir |
| Giriş yapmış müşteri (role: customer) | `/panel`'e yönlenir, admin arayüzünü göremez |
| Admin (role: admin) | Dashboard açılır |
| Zaten girmiş admin `/admin/giris`'e giderse | `/admin`'e yönlenir |

Admin girişi müşteri girişinden ayrı bir ekran ve rolü olmayan bir hesapla
giriş denenirse oturum hemen kapatılır.

### Güvenlik

Yetkilendirmenin **asıl garantisi RLS politikalarında** — frontend'de UI
gizlense bile, RLS olmadan biri doğrudan Supabase client'ı üzerinden başka
siparişlere erişebilirdi.

- Müşteri yalnızca kendi siparişlerini görür; başkasının sipariş numarasını
  URL'den denese bile sorgu boş döner.
- Müşteri sipariş oluşturur ama **güncelleyemez** — durum ve link yalnızca
  admin tarafından değiştirilir.
- `admin_note` müşteri sorgularının select listesinde yok
  (`CUSTOMER_ORDER_COLUMNS`).
- `status = 'completed'` olabilmesi için `invitation_url` dolu olmak zorunda —
  bu bir veritabanı CHECK kısıtı, uygulama hatası bu kuralı delemez.
- `src/proxy.ts` ayrıca route seviyesinde koruma yapar: `/panel/*` ve
  `/davetiye-talebi` oturum ister, `/admin/*` ayrıca `role = 'admin'` ister.
- Fotoğraflar herkese açık olmayan bir bucket'ta; Storage politikaları
  sahipliği dosya yolunun ilk klasörüne (`<user_id>/`) bakarak belirler.
  Görüntüleme kısa ömürlü imzalı URL ile yapılır.
- `SUPABASE_SERVICE_ROLE_KEY` RLS'i tamamen atlar. Yalnızca sunucuda ve tek
  bir iş için kullanılır: müşteri e-postasını `auth.users`'tan okumak
  (`src/lib/supabase/admin.ts`). Asla `NEXT_PUBLIC_` ön eki almaz.

## Klasör yapısı

```
src/
├── app/
│   ├── page.tsx                      Ana sayfa
│   ├── tasarimlar/[slug]/            Tema galerisi + detay
│   ├── fiyatlar/ hakkimizda/ iletisim/ yorumlar/ yasal/
│   ├── giris/ kayit/ sifremi-unuttum/
│   ├── davetiye-talebi/              Talep formu + teşekkürler
│   ├── davetiye/[slug]/              Misafir görünümü (RSVP formu)
│   ├── panel/                        Müşteri: sipariş listesi + siparis/[orderNumber]
│   ├── admin/                        Yönetim: siparisler + siparisler/[orderNumber]
│   ├── actions/                      Server action'lar (auth, orders)
│   ├── opengraph-image.tsx           Paylaşım görseli (next/og)
│   └── manifest.ts                   PWA manifest
├── components/  site/ marketing/ auth/ order/ invitation/ panel/ admin/ ui/
├── lib/
│   ├── brand.ts                      Marka adı, domain, iletişim, hex renkler
│   ├── orders.ts                     Durum sözlüğü, tarih biçimleme, URL doğrulama
│   ├── email/                        Resend gönderimi + HTML şablon
│   └── supabase/                     client / server / admin / proxy yardımcıları
├── data/                             Tema, paket, yorum katalogları + mock veriler
├── types/supabase.ts                 Şema tipleri
└── proxy.ts                          Oturum tazeleme + route koruması

supabase/migrations/                  SQL şeması
scripts/generate-icons.mjs            İkon üretimi
_kaynak/                              Taşınan HTML prototipinin ham hali
```

### Layout neden `layout.tsx` değil, kabuk bileşeni?

Sayfalar aynı gruptayken bile farklı çerçeveler kullanıyor: pazarlama
footer'ı iki varyantlı, kategori şeridi yalnızca dört sayfada, duyuru şeridi
yalnızca ana sayfada; `/panel/editor` ise `/panel` altında olmasına rağmen
sidebar kullanmıyor. Bunlar sayfa başına prop gerektirdiğinden
`SiteShell` / `PanelShell` / `AdminShell` bileşenleri layout dosyalarının
yerini alıyor.

## Marka ve görsel kimlik

Marka bilgileri **yalnızca** [`src/lib/brand.ts`](src/lib/brand.ts) içinde;
hiçbir sayfada elle yazılmaz. Logotype iki ağırlıkta kurulur — "Moda" ince ve
nötr, "Davetiye" kalın ve vurgu renginde — ve yanında ince çizgili bir zarf
işareti taşır ([`Logo.tsx`](src/components/marketing/Logo.tsx)).

| Dosya | Ne için |
|---|---|
| `public/icon.svg` | SVG favicon **ve** tüm PNG/ICO türevlerinin kaynağı |
| `public/favicon.ico` | Eski tarayıcılar (16/32/48) |
| `public/apple-touch-icon.png` | iOS ana ekran (180×180) |
| `public/icon-192.png`, `icon-512.png` | PWA / Android |
| `public/logo.svg` | Yatay logo — e-posta/dış kullanım |
| `public/logo-mark.svg` | Zeminsiz zarf işareti |

İkon değişirse `public/icon.svg` güncellenip `npm run icons` çalıştırılır.
İşaret geometriktir, yazı tipine bağlı değildir; `public/logo.svg` içindeki
kelime ise sistem serif'ine düşer — basılı kullanım için yazı tipi yola
çevrilmeli.

Paylaşım görseli `src/app/opengraph-image.tsx` ile derleme zamanında
üretilir. Satori değişken font desteklemediği için `src/assets/fonts/`
altında statik WOFF ağırlıkları tutuluyor (Cormorant Garamond, OFL).

## E-posta

Resend üzerinden transactional gönderim: [`src/lib/email/`](src/lib/email/).
Dört şablon sipariş akışına bağlı — talep alındı, hazırlanıyor, davetiyeniz
hazır, ekibe yeni sipariş bildirimi.

`RESEND_API_KEY` tanımlı değilse gönderim yapılmaz; e-posta konsola loglanır
ve fonksiyon `{ ok: false, skipped: true }` döner. Sipariş akışı e-posta
olmadan da uçtan uca çalışır.

Domain alındığında Resend'de doğrulanır (DNS kayıtları), sonra `EMAIL_FROM`
gerçek adrese çevrilir. Doğrulama öncesi Resend yalnızca
`onboarding@resend.dev` adresinden ve yalnızca hesap sahibinin e-postasına
gönderime izin verir.

## Ekranların veri durumu

Panel ve admin ekranlarının tamamı **gerçek veriye bağlı**. Sahte veri
gösteren hiçbir ekran kalmadı — `npm run e2e:http` bunu her çalıştırmada
doğrular.

Kaldırılan sayfalar (prototipten kalan, arkasında tablo olmayan ekranlar):

| Sayfa | Neden kaldırıldı |
|---|---|
| `/panel/rsvp` | RSVP tablosu yok; her kullanıcıya aynı uydurma katılımcı listesini gösteriyordu |
| `/panel/editor` | Müşterinin kendi davetiyesini kurgulaması concierge modeliyle çelişiyor; içeriği tamamen sabitti |

Tasarımları `_kaynak/` altındaki orijinal HTML'de ve git geçmişinde duruyor;
RSVP toplama özelliği geldiğinde geri getirilebilir.

Hâlâ statik olan yerler (bilinçli):

- **`/admin/temalar`** — tema kataloğu `src/data/themes.ts` dosyasında.
  Veritabanına taşınması ayrı bir iş; sayfa bunu açıkça yazıyor.
- **`/satin-al` ve ödeme sonuç sayfaları** — ödeme entegrasyonu ertelendi,
  menüden bağlantılı değil.
- **`/davetiye/[slug]`** — örnek davetiye gösterimi. Üstünde "bu bir tanıtım
  gösterimidir, katılım yanıtları kaydedilmez" uyarısı var.

Prototip yalnızca masaüstü genişliğinde tasarlandığı için responsive
kırılım noktaları eklenmedi — mobil düzen ayrı bir iş kalemi.
