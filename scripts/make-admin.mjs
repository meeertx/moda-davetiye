/**
 * Bir kullanıcıyı admin yapar (veya mevcut rolleri listeler).
 *
 *   npm run admin              → tüm profilleri ve rollerini listeler
 *   npm run admin -- <eposta>  → o kullanıcıyı admin yapar
 *   npm run admin -- <eposta> customer  → yetkiyi geri alır
 *
 * SUPABASE_SERVICE_ROLE_KEY gerektirir (RLS'i atlar).
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
const secret = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !secret) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.");
  process.exit(1);
}

const admin = createClient(url, secret, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const [email, role = "admin"] = process.argv.slice(2);

/** auth.users + public.profiles birleşimini yazdırır. */
async function list() {
  const { data: authData, error: authErr } =
    await admin.auth.admin.listUsers({ perPage: 200 });
  if (authErr) throw authErr;

  const { data: profiles, error: profErr } = await admin
    .from("profiles")
    .select("id, full_name, role");
  if (profErr) throw profErr;

  const byId = new Map(profiles.map((p) => [p.id, p]));

  console.log(`\nKullanıcılar (${authData.users.length}):\n`);
  for (const u of authData.users) {
    const p = byId.get(u.id);
    console.log(`  ${u.email}`);
    console.log(`    id      : ${u.id}`);
    if (p) {
      console.log(`    profil  : ${p.full_name || "(isim boş)"}`);
      console.log(`    rol     : ${p.role}${p.role === "admin" ? "  ★" : ""}`);
    } else {
      console.log(`    profil  : ✗ YOK — handle_new_user trigger'ı çalışmamış`);
    }
    console.log("");
  }
}

if (!email) {
  await list();
  console.log("Admin yapmak için:  npm run admin -- <eposta>");
  process.exit(0);
}

if (!["admin", "customer"].includes(role)) {
  console.error(`✗ Geçersiz rol: ${role} (admin veya customer olmalı)`);
  process.exit(1);
}

const { data: authData } = await admin.auth.admin.listUsers({ perPage: 200 });
const user = authData.users.find(
  (u) => u.email?.toLowerCase() === email.toLowerCase(),
);

if (!user) {
  console.error(`✗ "${email}" adresiyle kayıtlı kullanıcı yok.`);
  await list();
  process.exit(1);
}

const { error } = await admin
  .from("profiles")
  .update({ role })
  .eq("id", user.id);

if (error) {
  console.error(`✗ Güncellenemedi: ${error.message}`);
  process.exit(1);
}

console.log(`✓ ${email} → rol: ${role}`);
await list();
