import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatDate } from "@/lib/orders";

export const metadata: Metadata = { title: "Kullanıcı Yönetimi" };

const gridCols = "grid grid-cols-[1.8fr_1fr_1fr_1fr] min-w-[680px]";

export default async function AdminKullanicilarPage() {
  if (!isSupabaseConfigured) {
    return (
      <AdminShell>
        <h1 className="font-display font-medium text-3xl sm:text-4xl text-ink m-0 mb-8 tracking-tight">
          Kullanıcı Yönetimi
        </h1>
        <NotConfiguredNotice />
      </AdminShell>
    );
  }

  const supabase = await createClient();

  const [profilesRes, ordersRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, phone, role, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("orders").select("user_id"),
  ]);

  const profiles = profilesRes.data ?? [];
  const orderCount = new Map<string, number>();
  for (const o of ordersRes.data ?? [])
    orderCount.set(o.user_id, (orderCount.get(o.user_id) ?? 0) + 1);

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-gold/15">
        <div>
          <div className="text-[11.5px] font-semibold tracking-[0.18em] uppercase text-gold mb-1">
            KULLANICI VERİ TABANI
          </div>
          <h1 className="font-display font-medium text-3xl sm:text-4xl text-ink m-0 tracking-tight">
            Kullanıcılar &amp; Üyeler
          </h1>
        </div>
        <div className="px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-wider">
          {profiles.length} Kayıtlı Kullanıcı
        </div>
      </div>

      {profilesRes.error && (
        <div className="text-sm text-danger-fg mb-4 glass-luxury p-4 rounded-xl border border-danger-fg/30">
          Kullanıcılar yüklenemedi: {profilesRes.error.message}
        </div>
      )}

      {/* User Table */}
      <div className="glass-luxury rounded-2xl border border-gold/25 overflow-hidden shadow-sm">
        <div
          className={`${gridCols} px-6 py-4 text-xs tracking-wider uppercase text-gold font-semibold border-b border-gold/15 bg-gold/5`}
        >
          <div>Müşteri / Üye İsim</div>
          <div>Telefon</div>
          <div>Toplam Sipariş</div>
          <div>Kayıt Tarihi</div>
        </div>

        {!profiles.length ? (
          <div className="px-6 py-12 text-center text-sm text-muted font-light">
            Henüz kayıtlı kullanıcı bulunmuyor.
          </div>
        ) : (
          profiles.map((u) => (
            <div
              key={u.id}
              className={`${gridCols} px-6 py-4 text-sm border-b border-gold/10 items-center text-ink hover:bg-gold/10 transition-colors`}
            >
              <div className="flex items-center gap-3 min-w-0 font-medium">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center font-bold text-xs shrink-0">
                  {(u.full_name || "M").charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{u.full_name || "(İsimsiz Müşteri)"}</span>
                {u.role === "admin" && <Badge tone="ok">★ Admin</Badge>}
              </div>
              <div className="text-muted text-xs">{u.phone || "—"}</div>
              <div className="font-semibold text-gold">{orderCount.get(u.id) ?? 0} Sipariş</div>
              <div className="text-xs text-muted font-light">{formatDate(u.created_at)}</div>
            </div>
          ))
        )}
      </div>

      <div className="glass-luxury p-4 rounded-xl border border-gold/20 mt-6 text-xs text-muted leading-relaxed font-light">
        🔒 E-posta adresleri güvenlik gereği burada listelenmemektedir; sipariş detay sayfasında ilgili müşterinin e-posta adresine erişebilirsiniz. Yetkili kullanıcı atamak için terminal üzerinden <code>npm run admin -- &lt;eposta&gt;</code> komutunu çalıştırabilirsiniz.
      </div>
    </AdminShell>
  );
}
