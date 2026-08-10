/**
 * Görsel doğrulama — belirtilen sayfaların masaüstü ve mobil ekran
 * görüntülerini alır. Oturum gerektiren sayfalar için gerçek bir test
 * kullanıcısıyla giriş yapar.
 *
 *   node scripts/shots.mjs [taban-url] [çıktı-klasörü]
 */
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
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
const OUT = process.argv[3] ?? path.join(root, ".shots");
mkdirSync(OUT, { recursive: true });

const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SECRET = env.SUPABASE_SERVICE_ROLE_KEY;
const REF = new globalThis.URL(URL_).hostname.split(".")[0];

const admin = createClient(URL_, SECRET, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = "Shots-Parola-2026!";
const stamp = Date.now();
const created = [];

async function makeUser(label, role) {
  const email = `shots-${label}-${stamp}@example.com`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: label === "admin" ? "Ekip Yöneticisi" : "Deniz Kaya" },
  });
  if (error) throw new Error(error.message);
  created.push(data.user.id);
  if (role === "admin")
    await admin.from("profiles").update({ role: "admin" }).eq("id", data.user.id);
  return { id: data.user.id, email };
}

async function sessionCookie(email) {
  const c = createClient(URL_, ANON, { auth: { persistSession: false } });
  const { data, error } = await c.auth.signInWithPassword({ email, password: PASSWORD });
  if (error) throw new Error(error.message);
  const value =
    "base64-" + Buffer.from(JSON.stringify(data.session)).toString("base64url");
  const CHUNK = 3180;
  const host = new globalThis.URL(BASE).hostname;
  if (value.length <= CHUNK)
    return [{ name: `sb-${REF}-auth-token`, value, domain: host, path: "/" }];
  const out = [];
  for (let i = 0; i * CHUNK < value.length; i++)
    out.push({
      name: `sb-${REF}-auth-token.${i}`,
      value: value.slice(i * CHUNK, (i + 1) * CHUNK),
      domain: host,
      path: "/",
    });
  return out;
}

const VIEWPORTS = [
  { name: "masaustu", width: 1440, height: 1000 },
  { name: "mobil", width: 390, height: 844 },
];

const browser = await chromium.launch();

try {
  const user = await makeUser("musteri", "customer");
  const adm = await makeUser("admin", "admin");

  // Ekranlarda içerik görünsün diye bir sipariş oluştur
  const cu = createClient(URL_, ANON, { auth: { persistSession: false } });
  await cu.auth.signInWithPassword({ email: user.email, password: PASSWORD });
  const { data: order } = await cu
    .from("orders")
    .insert({
      user_id: user.id,
      event_type: "dugun",
      bride_name: "Deniz",
      groom_name: "Arda",
      event_date: "2026-10-18",
      theme_preference: "belle-epoque",
      contact_phone: "05321234567",
      venue_name: "Sait Halim Paşa Yalısı",
    })
    .select("order_number")
    .single();

  const ca = createClient(URL_, ANON, { auth: { persistSession: false } });
  await ca.auth.signInWithPassword({ email: adm.email, password: PASSWORD });
  await ca
    .from("orders")
    .update({ status: "completed", invitation_url: "https://example.com/deniz-arda" })
    .eq("order_number", order.order_number);

  const PAGES = [
    { path: "/giris", as: null, name: "01-giris" },
    { path: "/kayit", as: null, name: "02-kayit" },
    { path: "/admin/giris", as: null, name: "03-admin-giris" },
    { path: "/panel", as: "user", name: "04-panel" },
    { path: `/panel/siparis/${order.order_number}`, as: "user", name: "05-panel-detay" },
    { path: "/panel/davetiyelerim", as: "user", name: "06-davetiyelerim" },
    { path: "/panel/ayarlar", as: "user", name: "07-ayarlar" },
    { path: "/admin", as: "admin", name: "08-admin" },
    { path: "/admin/siparisler", as: "admin", name: "09-admin-siparisler" },
    { path: `/admin/siparisler/${order.order_number}`, as: "admin", name: "10-admin-detay" },
    { path: "/", as: null, name: "11-anasayfa" },
    { path: "/davetiye-talebi", as: null, name: "12-talep" },
  ];

  const cookies = {
    user: await sessionCookie(user.email),
    admin: await sessionCookie(adm.email),
  };

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    for (const p of PAGES) {
      if (p.as) await ctx.addCookies(cookies[p.as]);
      const page = await ctx.newPage();
      await page.goto(BASE + p.path, { waitUntil: "networkidle" });
      await page.screenshot({
        path: path.join(OUT, `${p.name}-${vp.name}.png`),
        fullPage: false,
      });
      await page.close();
      if (p.as) await ctx.clearCookies();
    }
    await ctx.close();
    console.log(`✓ ${vp.name} (${PAGES.length} sayfa)`);
  }
  console.log(`\nÇıktı: ${OUT}`);
} finally {
  await browser.close();
  for (const id of created) await admin.auth.admin.deleteUser(id);
  console.log(`${created.length} test kullanıcısı silindi`);
}
