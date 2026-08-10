/**
 * Supabase bağlantısını ve şemanın kurulu olup olmadığını doğrular.
 *
 * Çalıştır:  npm run check:supabase
 *
 * Anahtarların geçerli olduğunu, migration'ın çalıştırıldığını ve secret
 * anahtarın gerçekten yönetici yetkisi taşıdığını tek seferde gösterir.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const env = Object.fromEntries(
  readFileSync(path.join(root, ".env"), "utf8")
    .split("\n")
    .filter((l) => /^[A-Z]/.test(l))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const pub = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secret = env.SUPABASE_SERVICE_ROLE_KEY;

const mask = (k) => (k ? `${k.slice(0, 18)}…(${k.length} karakter)` : "(boş)");

console.log("URL         :", url || "(boş)");
console.log("publishable :", mask(pub));
console.log("secret      :", mask(secret));
console.log("");

if (!url || !pub) {
  console.log("✗ NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY zorunlu.");
  process.exit(1);
}

let failed = false;
const anon = createClient(url, pub);

// --- 1. Şema kurulu mu ---
for (const table of ["profiles", "orders"]) {
  const { error, count } = await anon
    .from(table)
    .select("*", { count: "exact", head: true });

  if (!error) {
    console.log(
      `✓ public.${table} erişilebilir (RLS sonrası görünen kayıt: ${count ?? 0})`,
    );
  } else if (/does not exist|schema cache/i.test(error.message)) {
    console.log(
      `✗ public.${table} bulunamadı → supabase/migrations/ altındaki SQL henüz çalıştırılmamış`,
    );
    failed = true;
  } else if (/invalid api key|jwt/i.test(error.message)) {
    console.log(`✗ Anahtar reddedildi: ${error.message}`);
    failed = true;
  } else {
    console.log(`? public.${table}: [${error.code}] ${error.message}`);
  }
}

// --- 1b. Detay migration'ı uygulanmış mı ---
{
  const { error } = await anon
    .from("orders")
    .select("venue_name, program, photos, rsvp_plus_one, gift_iban")
    .limit(1);

  if (!error) {
    console.log("✓ sipariş detay sütunları mevcut (2. migration uygulanmış)");
  } else if (/does not exist|schema cache/i.test(error.message)) {
    console.log(
      "✗ sipariş detay sütunları yok → 20260809100000_order_details.sql çalıştırılmalı",
    );
    failed = true;
  } else {
    console.log(`? detay sütunları: [${error.code}] ${error.message}`);
  }
}

// --- 1c. Davetiye/RSVP migration'ı uygulanmış mı ---
for (const [table, migration] of [
  ["invitations", "20260810000000_invitations_rsvps.sql"],
  ["rsvps", "20260810000000_invitations_rsvps.sql"],
  ["reserved_slugs", "20260810000000_invitations_rsvps.sql"],
  ["guest_photos", "20260811000000_parents_menu_guest_photos.sql"],
]) {
  // head:true kullanma — tablo yokken bile hatasız dönebiliyor ve
  // eksik şemayı "mevcut" gibi gösteriyor.
  const { error } = await anon.from(table).select("*").limit(1);
  if (!error) {
    console.log(`✓ public.${table} mevcut`);
  } else if (
    error.code === "PGRST205" ||
    /does not exist|schema cache/i.test(error.message)
  ) {
    console.log(`✗ public.${table} yok → ${migration} çalıştırılmalı`);
    failed = true;
  } else {
    console.log(`? public.${table}: [${error.code}] ${error.message}`);
  }
}

// --- 1d. Ebeveyn/menü/ek bilgi sütunları uygulanmış mı ---
//
// Bu sütunlar hem `orders` hem `invitations` sorgularında seçiliyor;
// eksiklerse sipariş ve davetiye sayfaları komple boş döner. Ayrı
// kontrol ediliyor ki hata mesajı doğrudan eksik migration'ı göstersin.
for (const table of ["orders", "invitations"]) {
  const { error } = await anon
    .from(table)
    .select("bride_parents, groom_parents, menu, extra_info")
    .limit(1);

  if (!error) {
    console.log(`✓ ${table}: ebeveyn/menü/ek bilgi sütunları mevcut`);
  } else if (/does not exist|schema cache/i.test(error.message)) {
    console.log(
      `✗ ${table}: ebeveyn/menü sütunları yok → 20260811000000_parents_menu_guest_photos.sql çalıştırılmalı`,
    );
    failed = true;
  } else {
    console.log(`? ${table} yeni sütunlar: [${error.code}] ${error.message}`);
  }
}

// --- 2. Auth ayakta mı ---
const { error: authErr } = await anon.auth.getSession();
console.log(
  authErr ? `✗ auth: ${authErr.message}` : "✓ auth uç noktası yanıt veriyor",
);

// --- 3. Secret anahtar gerçekten yönetici mi ---
if (secret) {
  const admin = createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: buckets, error: bucketErr } = await admin.storage.listBuckets();
  if (bucketErr) {
    console.log(`? storage: ${bucketErr.message}`);
  } else {
    for (const [id, migration] of [
      ["order-photos", "20260809100000_order_details.sql"],
      ["invitation-music", "20260810100000_invitation_music.sql"],
      ["guest-photos", "20260811000000_parents_menu_guest_photos.sql"],
    ]) {
      if (buckets.some((b) => b.id === id)) {
        console.log(`✓ ${id} bucket mevcut`);
      } else {
        console.log(`✗ ${id} bucket yok → ${migration} çalıştırılmalı`);
        failed = true;
      }
    }
  }

  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) {
    console.log(`✗ secret anahtarın admin yetkisi yok: ${error.message}`);
    failed = true;
  } else {
    console.log(`✓ secret anahtar admin yetkili`);
    console.log("");
    if (data.users.length === 0) {
      console.log("Kayıtlı kullanıcı yok — /kayit sayfasından ilk hesabı açın.");
    } else {
      console.log(`Kayıtlı kullanıcılar (${data.users.length}):`);
      for (const u of data.users) console.log(`  · ${u.email}  ${u.id}`);
    }
  }
} else {
  console.log("· secret anahtar tanımlı değil (opsiyonel)");
}

process.exit(failed ? 1 : 0);
