/**
 * Davetiye + RSVP akışı testi — gerçek oturumlarla, RLS dahil.
 *
 *   node scripts/e2e-invitation.mjs [taban-url]
 *
 * Sipariş → admin davetiye oluşturur → yayına alır → misafir görür →
 * RSVP bırakır → müşteri yanıtı görür. Her adımda yetki sınırları da
 * denenir. Test verileri sonunda silinir.
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
const admin = createClient(URL_, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PW = "Davetiye-Test-2026!";
const stamp = Date.now();
const created = [];
let failures = 0;
const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => { console.log(`  ✗ ${m}`); failures++; };

const session = () =>
  createClient(URL_, ANON, { auth: { persistSession: false } });

async function makeUser(label, role) {
  const email = `inv-${label}-${stamp}@modavetiye.com`;
  const { data, error } = await admin.auth.admin.createUser({
    email, password: PW, email_confirm: true,
    user_metadata: { full_name: `INV ${label}` },
  });
  if (error) throw new Error(`${label}: ${error.message}`);
  created.push(data.user.id);
  if (role === "admin")
    await admin.from("profiles").update({ role: "admin" }).eq("id", data.user.id);
  return { id: data.user.id, email };
}

let invitationId = null;
let slug = null;

const MISSING = "PGRST205";
/** Engellenmesi beklenen işlemlerde "tablo yok" hatasını başarı sayma. */
const blocked = (error, label) => {
  if (!error) { bad(`${label}: engellenmedi!`); return; }
  if (error.code === MISSING) { bad(`${label}: tablo yok (şema kurulmamış)`); return; }
  ok(`${label}: ${error.code}`);
};

try {
  // Şema kontrolü — eksikse test anlamsız
  {
    const probe = createClient(URL_, ANON);
    for (const t of ["invitations", "rsvps", "reserved_slugs"]) {
      const { error } = await probe.from(t).select("*").limit(1);
      if (error?.code === MISSING)
        throw new Error(
          `public.${t} yok. Önce supabase/migrations/20260810000000_invitations_rsvps.sql dosyasını SQL Editor'da çalıştırın.`,
        );
    }
  }

  const customer = await makeUser("musteri", "customer");
  const other = await makeUser("baskasi", "customer");
  const adminUser = await makeUser("admin", "admin");
  console.log("\n=== HAZIRLIK ===");
  ok("3 test kullanıcısı");

  // Sipariş
  const cCust = session();
  await cCust.auth.signInWithPassword({ email: customer.email, password: PW });
  const { data: order, error: oErr } = await cCust.from("orders").insert({
    user_id: customer.id, event_type: "dugun",
    bride_name: "Ayşe", groom_name: "Mehmet",
    event_date: "2026-11-20", theme_preference: "belle-epoque",
    contact_phone: "05001112233", venue_name: "Test Yalısı",
    program: [{ time: "16:00", title: "Nikah" }],
    rsvp_questions: ["Menü tercihiniz?"],
  }).select("id, order_number").single();
  if (oErr) throw new Error(`sipariş: ${oErr.message}`);
  ok(`sipariş: ${order.order_number}`);

  // --- 1. Sadece admin davetiye oluşturabilir ---
  console.log("\n=== 1. DAVETİYE OLUŞTURMA YETKİSİ ===");
  {
    const { error } = await cCust.from("invitations").insert({
      slug: `musteri-denemesi-${stamp}`, order_id: order.id,
      user_id: customer.id, theme_slug: "belle-epoque", event_type: "dugun",
    });
    blocked(error, "müşteri davetiye oluşturamıyor");
  }

  const cAdmin = session();
  await cAdmin.auth.signInWithPassword({ email: adminUser.email, password: PW });
  slug = `ayse-mehmet-${stamp.toString(36)}`;
  {
    const { data, error } = await cAdmin.from("invitations").insert({
      slug, order_id: order.id, user_id: customer.id,
      theme_slug: "belle-epoque", event_type: "dugun",
      bride_name: "Ayşe", groom_name: "Mehmet",
      event_at: new Date(Date.now() + 90 * 864e5).toISOString(),
      venue_name: "Test Yalısı",
      program: [{ time: "16:00", title: "Nikah" }],
      rsvp_questions: ["Menü tercihiniz?"],
    }).select("id, published").single();
    if (error) bad(`admin oluşturamadı: ${error.message}`);
    else { invitationId = data.id; ok(`admin oluşturdu (yayında: ${data.published})`); }
  }

  // --- 2. Rezerve slug reddedilmeli ---
  console.log("\n=== 2. REZERVE SLUG KORUMASI ===");
  {
    const { error } = await cAdmin.from("invitations")
      .update({ slug: "panel" }).eq("id", invitationId);
    blocked(error, '"panel" slug reddedildi');
  }

  // --- 3. Yayınlanmamış davetiye misafire kapalı ---
  console.log("\n=== 3. TASLAK GİZLİLİĞİ ===");
  {
    const anon = createClient(URL_, ANON);
    const { data } = await anon.from("invitations").select("*").eq("slug", slug);
    !data?.length ? ok("misafir taslağı göremiyor")
                  : bad("misafir yayınlanmamış davetiyeyi görüyor!");

    const res = await fetch(`${BASE}/${slug}`);
    res.status === 404 ? ok("sayfa 404 dönüyor")
                       : bad(`sayfa ${res.status} döndü, 404 bekleniyordu`);
  }

  // --- 4. İçeriksiz yayına alınamaz ---
  console.log("\n=== 4. EKSİK İÇERİKLE YAYIN ENGELİ ===");
  {
    await cAdmin.from("invitations").update({ bride_name: null }).eq("id", invitationId);
    const { error } = await cAdmin.from("invitations")
      .update({ published: true }).eq("id", invitationId);
    blocked(error, "çift adı boşken yayın engellendi");
    await cAdmin.from("invitations").update({ bride_name: "Ayşe" }).eq("id", invitationId);
  }

  // --- 5. Yayına alma ---
  console.log("\n=== 5. YAYINA ALMA ===");
  {
    const { data, error } = await cAdmin.from("invitations")
      .update({ published: true }).eq("id", invitationId)
      .select("published, published_at");
    if (error || !data?.length) bad(`yayınlanamadı: ${error?.message ?? "0 satır"}`);
    else {
      ok("yayına alındı");
      data[0].published_at ? ok("published_at trigger ile doldu")
                           : bad("published_at boş");
    }
  }

  // --- 6. Misafir davetiyeyi görüyor ---
  console.log("\n=== 6. MİSAFİR DAVETİYEYİ GÖRÜYOR ===");
  {
    const res = await fetch(`${BASE}/${slug}`);
    const html = await res.text();
    res.status === 200 ? ok("sayfa 200") : bad(`sayfa ${res.status}`);
    html.includes("Ayşe") && html.includes("Mehmet")
      ? ok("çift adı basılıyor") : bad("çift adı yok");
    html.includes("Nikah") ? ok("program basılıyor") : bad("program yok");
    html.includes("Menü tercihiniz?") ? ok("RSVP sorusu basılıyor") : bad("RSVP sorusu yok");
  }

  // --- 7. Misafir RSVP bırakıyor (girişsiz) ---
  console.log("\n=== 7. MİSAFİR RSVP BIRAKIYOR ===");
  {
    const anon = createClient(URL_, ANON);
    const { error } = await anon.from("rsvps").insert({
      invitation_id: invitationId, guest_name: "Zeynep Arslan",
      attending: true, party_size: 2, note: "Vejetaryen menü",
      answers: { "Menü tercihiniz?": "Vejetaryen" },
    });
    error ? bad(`misafir yanıt bırakamadı: ${error.message}`)
          : ok("girişsiz yanıt kaydedildi");
  }

  // --- 8. Misafir yanıtları OKUYAMAMALI ---
  console.log("\n=== 8. YANIT GİZLİLİĞİ ===");
  {
    const anon = createClient(URL_, ANON);
    const { data } = await anon.from("rsvps").select("*").eq("invitation_id", invitationId);
    !data?.length ? ok("misafir yanıtları göremiyor")
                  : bad("misafir diğer yanıtları görebiliyor — GİZLİLİK AÇIĞI!");

    const cOther = session();
    await cOther.auth.signInWithPassword({ email: other.email, password: PW });
    const { data: d2 } = await cOther.from("rsvps").select("*").eq("invitation_id", invitationId);
    !d2?.length ? ok("başka müşteri yanıtları göremiyor")
                : bad("başka müşteri yanıtları görebiliyor!");
  }

  // --- 9. Davetiye sahibi yanıtı görüyor ---
  console.log("\n=== 9. SAHİBİ YANITI GÖRÜYOR ===");
  {
    const { data, error } = await cCust.from("rsvps").select("*").eq("invitation_id", invitationId);
    if (error) bad(`sorgu hatası: ${error.message}`);
    else if (!data?.length) bad("sahibi yanıtı göremiyor!");
    else {
      ok(`sahibi ${data.length} yanıt görüyor`);
      data[0].answers?.["Menü tercihiniz?"] === "Vejetaryen"
        ? ok("özel soru yanıtı kaydedilmiş") : bad("özel soru yanıtı kayıp");
    }
  }

  // --- 10. RSVP kapatılınca yeni yanıt alınmamalı ---
  console.log("\n=== 10. RSVP KAPATMA ===");
  {
    await cAdmin.from("invitations").update({ rsvp_enabled: false }).eq("id", invitationId);
    const anon = createClient(URL_, ANON);
    const { error } = await anon.from("rsvps").insert({
      invitation_id: invitationId, guest_name: "Geç Kalan", attending: true,
    });
    blocked(error, "RSVP kapalıyken yanıt engellendi");
  }
} catch (e) {
  console.error(`\n✗ TEST ÇÖKTÜ: ${e.message}`);
  failures++;
} finally {
  console.log("\n=== TEMİZLİK ===");
  if (invitationId) await admin.from("invitations").delete().eq("id", invitationId);
  for (const id of created) await admin.auth.admin.deleteUser(id);
  console.log(`  ${created.length} kullanıcı + davetiye silindi`);
}

console.log(failures === 0 ? "\n✓ TÜM ADIMLAR GEÇTİ\n" : `\n✗ ${failures} ADIM BAŞARISIZ\n`);
process.exit(failures ? 1 : 0);
