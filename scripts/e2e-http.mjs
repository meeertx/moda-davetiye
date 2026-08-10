/**
 * Uçtan uca HTTP testi — çalışan dev/prod sunucusuna GERÇEK oturum
 * çerezleriyle istek atar, dönen HTML'i denetler.
 *
 *   node scripts/e2e-http.mjs [http://localhost:3001]
 *
 * Veri katmanı testi (e2e-order-flow.mjs) RLS'i doğrular; bu script
 * sayfaların o veriyi gerçekten ekrana bastığını doğrular.
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

const BASE = process.argv[2] ?? "http://localhost:3001";
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SECRET = env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = new globalThis.URL(URL_).hostname.split(".")[0];

const admin = createClient(URL_, SECRET, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = "E2e-Http-Parola-2026!";
const stamp = Date.now();
const created = [];
let failures = 0;

const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => {
  console.log(`  ✗ ${m}`);
  failures++;
};

async function makeUser(label, role) {
  const email = `e2ehttp-${label}-${stamp}@example.com`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: `HTTP ${label}` },
  });
  if (error) throw new Error(`${label}: ${error.message}`);
  created.push(data.user.id);
  if (role === "admin")
    await admin.from("profiles").update({ role: "admin" }).eq("id", data.user.id);
  return { id: data.user.id, email };
}

/**
 * @supabase/ssr oturumu `sb-<ref>-auth-token` çerezinde base64 olarak tutar
 * ve uzunsa .0/.1 parçalarına böler. Aynı biçimi burada üretiyoruz.
 */
async function cookieFor(email) {
  const c = createClient(URL_, ANON, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await c.auth.signInWithPassword({
    email,
    password: PASSWORD,
  });
  if (error) throw new Error(`giriş: ${error.message}`);

  const name = `sb-${PROJECT_REF}-auth-token`;
  const value =
    "base64-" + Buffer.from(JSON.stringify(data.session)).toString("base64url");

  const CHUNK = 3180;
  if (value.length <= CHUNK) return `${name}=${value}`;
  const parts = [];
  for (let i = 0; i * CHUNK < value.length; i++)
    parts.push(`${name}.${i}=${value.slice(i * CHUNK, (i + 1) * CHUNK)}`);
  return parts.join("; ");
}

async function get(pathname, cookie) {
  const res = await fetch(BASE + pathname, {
    headers: cookie ? { cookie } : {},
    redirect: "manual",
  });
  return { status: res.status, location: res.headers.get("location"), html: await res.text() };
}

try {
  console.log(`\nSunucu: ${BASE}\n`);

  const userA = await makeUser("a", "customer");
  const userB = await makeUser("b", "customer");
  const adminUser = await makeUser("admin", "admin");
  const cookieA = await cookieFor(userA.email);
  const cookieB = await cookieFor(userB.email);
  const cookieAdmin = await cookieFor(adminUser.email);

  console.log("=== OTURUM ÇEREZİ TANINIYOR MU ===");
  {
    const r = await get("/panel", cookieA);
    if (r.status === 307 || r.status === 302)
      bad(`/panel giriş yapmış kullanıcıyı yönlendirdi → ${r.location} (çerez tanınmadı)`);
    else if (r.status === 200) ok("/panel oturumu tanıdı (200)");
    else bad(`/panel beklenmedik durum: ${r.status}`);
  }

  console.log("\n=== 1. YENİ HESABIN PANELİ BOŞ MU ===");
  {
    const r = await get("/panel", cookieA);
    r.html.includes("Henüz bir davetiye talebiniz yok")
      ? ok("boş durum mesajı görünüyor")
      : bad("boş durum mesajı YOK — mock veri mi gösteriliyor?");
  }

  console.log("\n=== 1b. DİĞER PANEL SAYFALARI TEMİZ Mİ ===");
  for (const [p, leaks] of [
    ["/panel/davetiyelerim", ["Elif & Kaan", "Sude", "Ada & Mert"]],
    ["/panel/ayarlar", ["Elif Kaya", "elif@eposta.com"]],
  ]) {
    const r = await get(p, cookieA);
    const found = leaks.filter((s) => r.html.includes(s));
    found.length
      ? bad(`${p} → yabancı veri gösteriyor: ${found.join(", ")}`)
      : ok(`${p} temiz`);
  }
  {
    // Ayarlar sayfası oturum sahibinin gerçek bilgilerini göstermeli
    const r = await get("/panel/ayarlar", cookieA);
    r.html.includes(userA.email)
      ? ok("/panel/ayarlar oturum sahibinin e-postasını gösteriyor")
      : bad("/panel/ayarlar gerçek kullanıcı bilgisini göstermiyor");
  }
  for (const p of ["/panel/rsvp", "/panel/editor"]) {
    const r = await get(p, cookieA);
    r.status === 404
      ? ok(`${p} kaldırıldı (404)`)
      : bad(`${p} hâlâ erişilebilir (${r.status})`);
  }

  console.log("\n=== 2. SİPARİŞ OLUŞTUR (veri katmanı) ===");
  const cA = createClient(URL_, ANON, { auth: { persistSession: false } });
  await cA.auth.signInWithPassword({ email: userA.email, password: PASSWORD });
  const { data: order, error: insErr } = await cA
    .from("orders")
    .insert({
      user_id: userA.id,
      event_type: "dugun",
      bride_name: "Zeynep",
      groom_name: "Efe",
      event_date: "2026-12-05",
      theme_preference: "belle-epoque",
      contact_phone: "05009998877",
    })
    .select("order_number")
    .single();
  if (insErr) throw new Error(`sipariş: ${insErr.message}`);
  ok(`sipariş oluştu: ${order.order_number}`);

  console.log("\n=== 3. MÜŞTERİ PANELİNDE GÖRÜNÜYOR MU ===");
  {
    const r = await get("/panel", cookieA);
    r.html.includes(order.order_number)
      ? ok("sipariş listede görünüyor")
      : bad("sipariş listede YOK");
    r.html.includes("Zeynep") ? ok("çift adı görünüyor") : bad("çift adı yok");
  }

  console.log("\n=== 4. ADMIN PANELİNDE GÖRÜNÜYOR MU ===");
  {
    const r = await get("/admin/siparisler", cookieAdmin);
    r.status === 200 ? ok("/admin/siparisler açıldı") : bad(`durum ${r.status}`);
    r.html.includes(order.order_number)
      ? ok("sipariş admin listesinde görünüyor")
      : bad("sipariş admin listesinde YOK");
  }

  console.log("\n=== 5. ADMIN LİNK ATIYOR ===");
  const TEST_URL = "https://example.com/http-testi";
  {
    const cAdm = createClient(URL_, ANON, { auth: { persistSession: false } });
    await cAdm.auth.signInWithPassword({
      email: adminUser.email,
      password: PASSWORD,
    });
    const { data, error } = await cAdm
      .from("orders")
      .update({ status: "completed", invitation_url: TEST_URL })
      .eq("order_number", order.order_number)
      .select("invitation_url");
    error || !data?.length
      ? bad(`link atanamadı: ${error?.message ?? "0 satır"}`)
      : ok("link atandı");
  }

  console.log("\n=== 6. MÜŞTERİ PANELİNDE LİNK BELİRDİ Mİ ===");
  {
    const list = await get("/panel", cookieA);
    list.html.includes("Davetiyeyi Aç")
      ? ok("listede 'Davetiyeyi Aç' butonu belirdi")
      : bad("listede link butonu YOK");

    const detail = await get(`/panel/siparis/${order.order_number}`, cookieA);
    detail.html.includes(TEST_URL)
      ? ok("detay sayfasında link URL'i basılıyor")
      : bad("detay sayfasında link URL'i YOK");
    detail.html.includes("Davetiyenizi Görüntüleyin")
      ? ok("'Davetiyenizi Görüntüleyin' butonu görünüyor")
      : bad("buton görünmüyor");
    detail.html.includes("Tamamlandı")
      ? ok("durum 'Tamamlandı' görünüyor")
      : bad("durum güncel değil");
  }

  console.log("\n=== 6b. DAVETİYELERİM SAYFASI ===");
  {
    // NOT: /panel/davetiyelerim artık `orders` değil `invitations` tablosunu
    // okuyor. Bu senaryoda davetiye kaydı oluşturulmadığı için sayfanın BOŞ
    // durumu göstermesi doğru davranış. Davetiye akışının kendisi
    // e2e-invitation.mjs ile ayrıca test ediliyor.
    const r = await get("/panel/davetiyelerim", cookieA);
    r.html.includes("Henüz davetiyeniz hazırlanmadı")
      ? ok("davetiye kaydı yokken boş durum gösteriliyor")
      : bad("boş durum mesajı yok");
    r.html.includes(order.order_number)
      ? bad("davetiye kaydı olmayan sipariş 'Davetiyelerim'de görünüyor")
      : ok("sipariş yanlışlıkla davetiye olarak listelenmiyor");
  }

  console.log("\n=== 7. YETKİ İZOLASYONU (URL'den başkasının siparişi) ===");
  for (const [who, cookie] of [
    ["müşteri B", cookieB],
    ["admin (müşteri alanında)", cookieAdmin],
  ]) {
    const r = await get(`/panel/siparis/${order.order_number}`, cookie);
    r.status === 404 || !r.html.includes(TEST_URL)
      ? ok(`${who} A'nın sipariş detayına erişemiyor`)
      : bad(`${who} A'nın sipariş detayını görebiliyor!`);
  }
  {
    const r = await get("/panel", cookieB);
    r.html.includes(order.order_number)
      ? bad("müşteri B, A'nın siparişini listede görüyor!")
      : ok("müşteri B'nin listesinde A'nın siparişi yok");
  }

  console.log("\n=== 8. ADMIN OLMAYAN /admin'e GİREMEZ ===");
  {
    const r = await get("/admin", cookieA);
    r.status === 307 && r.location?.includes("/panel")
      ? ok("müşteri /admin'den /panel'e yönlendirildi")
      : bad(`beklenmedik: ${r.status} → ${r.location}`);
  }
} catch (e) {
  console.error(`\n✗ TEST ÇÖKTÜ: ${e.message}`);
  failures++;
} finally {
  console.log("\n=== TEMİZLİK ===");
  for (const id of created) await admin.auth.admin.deleteUser(id);
  console.log(`  ${created.length} test kullanıcısı silindi`);
}

console.log(
  failures === 0 ? "\n✓ TÜM ADIMLAR GEÇTİ\n" : `\n✗ ${failures} ADIM BAŞARISIZ\n`,
);
process.exit(failures ? 1 : 0);
