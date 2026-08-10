/**
 * Veritabanının anlık durumunu döker (service-role, RLS atlanır).
 * Denetim/teşhis amaçlı — üretimde kullanılmaz.
 *
 *   node scripts/dump-state.mjs
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

const admin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const { data: profiles } = await admin
  .from("profiles")
  .select("id, full_name, role, created_at")
  .order("created_at");

console.log(`\n=== PROFILES (${profiles?.length ?? 0}) ===`);
for (const p of profiles ?? []) {
  console.log(`  ${p.role.padEnd(8)} ${p.full_name.padEnd(22)} ${p.id}`);
}

const { data: orders } = await admin
  .from("orders")
  .select(
    "order_number, user_id, status, event_type, bride_name, groom_name, invitation_url, venue_name, photos, created_at, updated_at",
  )
  .order("created_at");

console.log(`\n=== ORDERS (${orders?.length ?? 0}) ===`);
for (const o of orders ?? []) {
  console.log(`  ${o.order_number}  ${o.status.padEnd(12)} ${o.bride_name ?? "?"} & ${o.groom_name ?? "?"}`);
  console.log(`     user_id       : ${o.user_id}`);
  console.log(`     invitation_url: ${o.invitation_url ?? "(boş)"}`);
  console.log(`     venue / foto  : ${o.venue_name ?? "—"} / ${(o.photos ?? []).length} adet`);
  console.log(`     updated_at    : ${o.updated_at}`);
}
if (!orders?.length) console.log("  (hiç sipariş yok)");
console.log("");
