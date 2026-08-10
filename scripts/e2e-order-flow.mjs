/**
 * Uçtan uca sipariş akışı testi — GERÇEK kullanıcı oturumlarıyla.
 *
 *   node scripts/e2e-order-flow.mjs
 *
 * Uygulamanın kullandığı anon istemciyi ve gerçek JWT'leri kullanır, yani
 * RLS politikaları da test edilir. Test kullanıcıları sonunda silinir.
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

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SECRET = env.SUPABASE_SERVICE_ROLE_KEY;

const admin = createClient(URL, SECRET, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = "E2e-Test-Parola-2026!";
const stamp = Date.now();
const created = [];
let failures = 0;

const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => {
  console.log(`  ✗ ${m}`);
  failures++;
};

/** Doğrulanmış kullanıcı oluşturur (e-posta onayı beklemeden giriş yapılabilsin). */
async function makeUser(label, role) {
  const email = `e2e-${label}-${stamp}@example.com`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: `E2E ${label}`, phone: "05001112233" },
  });
  if (error) throw new Error(`${label} oluşturulamadı: ${error.message}`);
  created.push(data.user.id);

  if (role === "admin") {
    const { error: e } = await admin
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", data.user.id);
    if (e) throw new Error(`${label} admin yapılamadı: ${e.message}`);
  }
  return { id: data.user.id, email };
}

/** Uygulamanın kullandığı anon istemciyi verilen kullanıcıyla oturum açtırır. */
async function sessionFor(email) {
  const c = createClient(URL, ANON, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await c.auth.signInWithPassword({ email, password: PASSWORD });
  if (error) throw new Error(`giriş başarısız (${email}): ${error.message}`);
  return c;
}

try {
  console.log("\n=== HAZIRLIK ===");
  const userA = await makeUser("musteri-a", "customer");
  const userB = await makeUser("musteri-b", "customer");
  const adminUser = await makeUser("admin", "admin");
  ok(`3 test kullanıcısı oluşturuldu`);

  // --- 1. Profil trigger'ı ---
  console.log("\n=== 1. KAYIT → PROFİL TRIGGER ===");
  {
    const { data } = await admin
      .from("profiles")
      .select("full_name, role")
      .eq("id", userA.id)
      .single();
    data?.full_name === "E2E musteri-a"
      ? ok("profiles satırı trigger ile oluştu, full_name doğru")
      : bad(`profiles satırı beklenen gibi değil: ${JSON.stringify(data)}`);
  }

  // --- 2. Yeni hesabın paneli boş mu ---
  console.log("\n=== 2. YENİ HESAP BOŞ DURUM ===");
  const cA = await sessionFor(userA.email);
  {
    const { data, error } = await cA.from("orders").select("*");
    if (error) bad(`sipariş sorgusu hata verdi: ${error.message}`);
    else if (data.length === 0) ok("yeni hesabın sipariş listesi boş (RLS doğru)");
    else bad(`yeni hesap ${data.length} sipariş görüyor — SIZINTI!`);
  }

  // --- 3. Sipariş oluşturma ---
  console.log("\n=== 3. MÜŞTERİ SİPARİŞ OLUŞTURUYOR ===");
  let orderNumber = null;
  {
    const { data, error } = await cA
      .from("orders")
      .insert({
        user_id: userA.id,
        event_type: "dugun",
        bride_name: "Ayşe",
        groom_name: "Mehmet",
        event_date: "2026-11-20",
        theme_preference: "belle-epoque",
        contact_phone: "05001112233",
        venue_name: "Test Mekan",
        program: [{ time: "16:00", title: "Nikah" }],
        rsvp_questions: ["Menü tercihiniz?"],
      })
      .select("order_number, status")
      .single();

    if (error) bad(`sipariş oluşturulamadı: ${error.message}`);
    else {
      orderNumber = data.order_number;
      ok(`sipariş oluştu: ${orderNumber} (durum: ${data.status})`);
      /^DV-\d{4}-\d{6}$/.test(orderNumber)
        ? ok("sipariş numarası formatı doğru")
        : bad(`sipariş numarası formatı bozuk: ${orderNumber}`);
    }
  }

  // --- 4. Başkasının siparişini oluşturamama ---
  console.log("\n=== 4. BAŞKASI ADINA SİPARİŞ ENGELİ ===");
  {
    const { error } = await cA.from("orders").insert({
      user_id: userB.id, // A, B adına sipariş açmaya çalışıyor
      event_type: "nisan",
      contact_phone: "05000000000",
    });
    error
      ? ok(`RLS engelledi: ${error.code}`)
      : bad("A, B adına sipariş oluşturabildi — RLS AÇIĞI!");
  }

  // --- 5. Müşteri kendi siparişini güncelleyememeli ---
  console.log("\n=== 5. MÜŞTERİ KENDİ SİPARİŞİNİ GÜNCELLEYEMEZ ===");
  {
    const { data, error } = await cA
      .from("orders")
      .update({ status: "completed", invitation_url: "https://hile.example" })
      .eq("order_number", orderNumber)
      .select();

    if (error) ok(`RLS engelledi: ${error.code}`);
    else if (!data?.length)
      ok("güncelleme 0 satır etkiledi (RLS sessizce engelledi)");
    else bad("müşteri kendi siparişini güncelleyebildi — RLS AÇIĞI!");
  }

  // --- 6. Admin siparişi görüyor mu ---
  console.log("\n=== 6. ADMIN SİPARİŞİ GÖRÜYOR ===");
  const cAdmin = await sessionFor(adminUser.email);
  {
    const { data, error } = await cAdmin
      .from("orders")
      .select("order_number, profiles(full_name)")
      .eq("order_number", orderNumber)
      .maybeSingle();
    if (error) bad(`admin sorgusu hata: ${error.message}`);
    else if (!data) bad("admin siparişi göremiyor!");
    else ok(`admin siparişi görüyor (müşteri: ${data.profiles?.full_name})`);
  }

  // --- 7. Admin link atıyor (uygulamanın yaptığı sorgunun aynısı) ---
  console.log("\n=== 7. ADMIN LİNK ATIYOR ===");
  const TEST_URL = "https://example.com/test-davetiye";
  {
    const { data, error } = await cAdmin
      .from("orders")
      .update({
        status: "completed",
        invitation_url: TEST_URL,
        admin_note: "E2E test notu",
      })
      .eq("order_number", orderNumber)
      .select("order_number, status, invitation_url");

    if (error) bad(`admin güncellemesi hata: ${error.message}`);
    else if (!data?.length)
      bad("admin güncellemesi 0 satır etkiledi — SESSİZ BAŞARISIZLIK!");
    else ok(`link kaydedildi: ${data[0].invitation_url} (${data[0].status})`);
  }

  // --- 8. Link olmadan completed yapılamamalı ---
  console.log("\n=== 8. LİNKSİZ 'TAMAMLANDI' ENGELİ ===");
  {
    const { error } = await cAdmin
      .from("orders")
      .update({ invitation_url: null, status: "completed" })
      .eq("order_number", orderNumber);
    error
      ? ok(`CHECK kısıtı engelledi: ${error.code}`)
      : bad("linksiz 'completed' yapılabildi — KISIT ÇALIŞMIYOR!");
  }

  // --- 9. Müşteri linki görüyor mu (uygulamanın select listesiyle) ---
  console.log("\n=== 9. MÜŞTERİ LİNKİ GÖRÜYOR ===");
  {
    const cols =
      "id, order_number, user_id, status, event_type, bride_name, groom_name, event_date, theme_preference, contact_phone, contact_note, invitation_url, created_at, updated_at, completed_at, venue_name, venue_address, venue_map_url, program, story, photos, rsvp_deadline, rsvp_plus_one, rsvp_questions, gift_note, gift_iban";
    const { data, error } = await cA
      .from("orders")
      .select(cols)
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (error) bad(`müşteri sorgusu hata: ${error.message}`);
    else if (!data) bad("müşteri kendi siparişini göremiyor!");
    else {
      data.invitation_url === TEST_URL
        ? ok(`müşteri linki görüyor: ${data.invitation_url}`)
        : bad(`müşteri linki GÖREMİYOR: ${JSON.stringify(data.invitation_url)}`);
      data.status === "completed"
        ? ok("durum 'completed' görünüyor")
        : bad(`durum yanlış: ${data.status}`);
      data.completed_at
        ? ok("completed_at trigger ile doldu")
        : bad("completed_at boş — trigger çalışmamış");
      "admin_note" in data
        ? bad("admin_note müşteriye sızıyor!")
        : ok("admin_note müşteri select listesinde yok");
    }
  }

  // --- 10. Kullanıcı B, A'nın siparişini görememeli ---
  console.log("\n=== 10. YETKİ İZOLASYONU (B → A'nın siparişi) ===");
  {
    const cB = await sessionFor(userB.email);
    const { data, error } = await cB
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();
    if (error) ok(`B erişemedi: ${error.message}`);
    else if (!data) ok("B, A'nın siparişini göremiyor (RLS doğru)");
    else bad("B, A'nın siparişini GÖREBİLİYOR — CİDDİ RLS AÇIĞI!");
  }

  // --- 11. Anonim erişim ---
  console.log("\n=== 11. ANONİM ERİŞİM ===");
  {
    const anon = createClient(URL, ANON);
    const { data } = await anon
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber);
    !data?.length
      ? ok("giriş yapmamış ziyaretçi sipariş göremiyor")
      : bad("anonim erişim sipariş görüyor — RLS AÇIĞI!");
  }
} catch (e) {
  console.error(`\n✗ TEST ÇÖKTÜ: ${e.message}`);
  failures++;
} finally {
  console.log("\n=== TEMİZLİK ===");
  for (const id of created) await admin.auth.admin.deleteUser(id);
  console.log(`  ${created.length} test kullanıcısı ve siparişleri silindi`);
}

console.log(
  failures === 0
    ? "\n✓ TÜM ADIMLAR GEÇTİ\n"
    : `\n✗ ${failures} ADIM BAŞARISIZ\n`,
);
process.exit(failures ? 1 : 0);
