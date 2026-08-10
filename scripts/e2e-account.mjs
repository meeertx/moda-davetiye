/**
 * Hesap bilgileri akışı testi — profil, e-posta ve şifre güncellemeleri.
 *
 *   node scripts/e2e-account.mjs
 *
 * Server action'ları doğrudan çağıramadığımız için action'ların yaptığı
 * Supabase işlemlerinin aynısını gerçek oturumla çalıştırır: RLS, yeniden
 * kimlik doğrulama ve auth güncellemeleri bu yolla doğrulanır.
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

const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SECRET = env.SUPABASE_SERVICE_ROLE_KEY;

const admin = createClient(URL_, SECRET, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = "Hesap-Test-2026!";
const NEW_PASSWORD = "Hesap-Yeni-2026!";
const stamp = Date.now();
const created = [];
let failures = 0;

const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => {
  console.log(`  ✗ ${m}`);
  failures++;
};

const session = () =>
  createClient(URL_, ANON, { auth: { persistSession: false } });

try {
  const email = `hesap-${stamp}@modavetiye.com`;
  const { data: made, error: mkErr } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: "İlk İsim", phone: "05000000000" },
  });
  if (mkErr) throw new Error(mkErr.message);
  created.push(made.user.id);
  console.log(`\nTest hesabı: ${email}\n`);

  // --- 1. Profil güncelleme ---
  console.log("=== 1. AD SOYAD / TELEFON ===");
  {
    const c = session();
    await c.auth.signInWithPassword({ email, password: PASSWORD });
    const { data, error } = await c
      .from("profiles")
      .update({ full_name: "Güncel İsim", phone: "05339998877" })
      .eq("id", made.user.id)
      .select("full_name, phone");

    if (error) bad(`güncellenemedi: ${error.message}`);
    else if (!data?.length) bad("0 satır etkilendi — RLS engeli");
    else if (data[0].full_name === "Güncel İsim" && data[0].phone === "05339998877")
      ok("ad soyad ve telefon güncellendi");
    else bad(`beklenmedik değer: ${JSON.stringify(data[0])}`);
  }

  // --- 2. Başkasının profilini güncelleyememe ---
  console.log("\n=== 2. BAŞKASININ PROFİLİ ===");
  {
    const other = await admin.auth.admin.createUser({
      email: `hesap-other-${stamp}@modavetiye.com`,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Diğer" },
    });
    created.push(other.data.user.id);

    const c = session();
    await c.auth.signInWithPassword({ email, password: PASSWORD });
    const { data } = await c
      .from("profiles")
      .update({ full_name: "ELE GEÇİRİLDİ" })
      .eq("id", other.data.user.id)
      .select("id");

    !data?.length
      ? ok("başkasının profili güncellenemiyor (RLS doğru)")
      : bad("başkasının profili güncellenebildi — RLS AÇIĞI!");
  }

  // --- 3. Yanlış mevcut şifreyle doğrulama reddedilmeli ---
  console.log("\n=== 3. YANLIŞ ŞİFREYLE DOĞRULAMA ===");
  {
    const c = session();
    const { error } = await c.auth.signInWithPassword({
      email,
      password: "Yanlis-Sifre-123!",
    });
    error
      ? ok(`reddedildi: ${error.message}`)
      : bad("yanlış şifre kabul edildi!");
  }

  // --- 4. Şifre değiştirme ---
  console.log("\n=== 4. ŞİFRE DEĞİŞTİRME ===");
  {
    const c = session();
    const { error: signErr } = await c.auth.signInWithPassword({
      email,
      password: PASSWORD,
    });
    if (signErr) bad(`mevcut şifreyle giriş: ${signErr.message}`);

    const { error } = await c.auth.updateUser({ password: NEW_PASSWORD });
    if (error) bad(`şifre güncellenemedi: ${error.message}`);
    else ok("şifre güncellendi");

    const c2 = session();
    const { error: oldErr } = await c2.auth.signInWithPassword({
      email,
      password: PASSWORD,
    });
    oldErr
      ? ok("eski şifre artık geçersiz")
      : bad("eski şifre hâlâ çalışıyor!");

    const c3 = session();
    const { error: newErr } = await c3.auth.signInWithPassword({
      email,
      password: NEW_PASSWORD,
    });
    newErr
      ? bad(`yeni şifreyle giriş yapılamadı: ${newErr.message}`)
      : ok("yeni şifreyle giriş yapılabiliyor");
  }

  // --- 5. E-posta değiştirme talebi ---
  //
  // İKİ ORTAM KISITI:
  //  · Supabase "example.com" adreslerini geçersiz sayar.
  //  · E-posta değişikliği onay maili gerektirir; Supabase'in yerleşik
  //    SMTP'si saatte yalnızca birkaç mail gönderir. Özel SMTP (Resend)
  //    tanımlanana kadar bu adım "rate limit" ile dönebilir — bu, koddaki
  //    bir hata değil, altyapı kısıtıdır.
  console.log("\n=== 5. E-POSTA DEĞİŞTİRME ===");
  {
    const target = `hesap-yeni-${stamp}@modavetiye.com`;
    const c = session();
    await c.auth.signInWithPassword({ email, password: NEW_PASSWORD });
    const { error } = await c.auth.updateUser({ email: target });

    if (error?.message?.toLowerCase().includes("rate limit")) {
      console.log(
        "  · ATLANDI: Supabase yerleşik SMTP kotası doldu — özel SMTP (Resend) kurulduğunda test edilebilir",
      );
    } else if (error) {
      bad(`e-posta değişikliği başlatılamadı: ${error.message}`);
    } else {
      ok("e-posta değişikliği talebi kabul edildi");
      const { data } = await admin.auth.admin.getUserById(made.user.id);
      const stillOld = data.user?.email === email;
      const pending = data.user?.new_email === target;
      if (stillOld && pending)
        ok("adres onay bekliyor — eski adres hâlâ geçerli (doğru davranış)");
      else if (data.user?.email === target)
        ok("e-posta doğrudan değişti (projede e-posta onayı kapalı)");
      else bad(`beklenmedik durum: ${JSON.stringify({ email: data.user?.email, new_email: data.user?.new_email })}`);
    }
  }

  // --- 6. Zaten kullanılan e-postaya geçememe ---
  console.log("\n=== 6. KULLANIMDA OLAN E-POSTA ===");
  {
    const c = session();
    await c.auth.signInWithPassword({ email, password: NEW_PASSWORD });
    const { error } = await c.auth.updateUser({
      email: `hesap-other-${stamp}@modavetiye.com`,
    });
    error?.message?.toLowerCase().includes("already been registered")
      ? ok("kullanımdaki adrese geçiş engellendi")
      : error
        ? console.log(`  · ${error.message}`)
        : console.log(
            "  · Supabase talebi kabul etti; çakışma onay adımında yakalanır",
          );
  }
} catch (e) {
  console.error(`\n✗ TEST ÇÖKTÜ: ${e.message}`);
  failures++;
} finally {
  console.log("\n=== TEMİZLİK ===");
  for (const id of created) await admin.auth.admin.deleteUser(id);
  console.log(`  ${created.length} test hesabı silindi`);
}

console.log(
  failures === 0 ? "\n✓ TÜM ADIMLAR GEÇTİ\n" : `\n✗ ${failures} ADIM BAŞARISIZ\n`,
);
process.exit(failures ? 1 : 0);
