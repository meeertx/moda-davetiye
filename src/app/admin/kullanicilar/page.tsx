import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import { createClient, withTimeout } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatDate } from "@/lib/orders";

export const metadata: Metadata = { title: "Kullanıcı Yönetimi" };

const gridCols = "grid grid-cols-[1.5fr_1.8fr_1.1fr_1fr_1fr] min-w-[780px]";

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

  let profiles: any[] = [];
  let orderCount = new Map<string, number>();
  let fetchError = "";

  try {
    const supabase = await createClient();
    const [profilesRes, ordersRes] = await withTimeout(
      Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, email, phone, role, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("orders").select("user_id"),
      ]),
      2000,
    );

    if (profilesRes.data) profiles = profilesRes.data;
    if (profilesRes.error) fetchError = profilesRes.error.message;

    for (const o of ordersRes.data ?? []) {
      orderCount.set(o.user_id, (orderCount.get(o.user_id) ?? 0) + 1);
    }
  } catch (e: any) {
    fetchError = e?.message ?? "Veritabanına ulaşılamadı";
  }

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-gold/15">
        <div>
          <div className="text-[11.5px] font-semibold tracking-[0.18em] uppercase text-gold mb-1">
            KULLANICI VERİ TABANI &amp; CRM
          </div>
          <h1 className="font-display font-medium text-3xl sm:text-4xl text-ink m-0 tracking-tight">
            Kullanıcılar &amp; Üyeler
          </h1>
        </div>
        <div className="px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-wider">
          {profiles.length} Kayıtlı Kullanıcı
        </div>
      </div>

      {fetchError && (
        <div className="text-sm text-danger-fg mb-4 glass-luxury p-4 rounded-xl border border-danger-fg/30">
          Kullanıcılar yüklenemedi: {fetchError}
        </div>
      )}

      {/* User Table */}
      <div className="glass-luxury rounded-2xl border border-gold/25 overflow-hidden shadow-sm">
        <div
          className={`${gridCols} px-6 py-4 text-xs tracking-wider uppercase text-gold font-semibold border-b border-gold/15 bg-gold/5`}
        >
          <div>Müşteri / Üye İsim</div>
          <div>E-posta Adresi</div>
          <div>Telefon</div>
          <div>Toplam Sipariş</div>
          <div>Kayıt Tarihi</div>
        </div>

        {!profiles.length ? (
          <div className="px-6 py-12 text-center text-sm text-muted font-light">
            Henüz veritabanında kayıtlı kullanıcı bulunmuyor.
          </div>
        ) : (
          profiles.map((u) => (
            <div
              key={u.id}
              className={`${gridCols} px-6 py-4 text-sm border-b border-gold/10 items-center text-ink hover:bg-gold/10 transition-colors`}
            >
              <div className="flex items-center gap-3 min-w-0 font-medium">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center font-bold text-xs shrink-0">
                  {(u.full_name || u.email || "M").charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{u.full_name || "(İsimsiz)"}</span>
                {u.role === "admin" && <Badge tone="ok">★ Admin</Badge>}
              </div>

              <div className="text-ink font-mono text-xs truncate">
                {u.email ? (
                  <a href={`mailto:${u.email}`} className="hover:text-gold hover:underline">
                    {u.email}
                  </a>
                ) : (
                  <span className="text-muted italic">(Henüz senkronize edilmedi)</span>
                )}
              </div>

              <div className="text-muted text-xs font-mono">{u.phone || "—"}</div>
              <div className="font-semibold text-gold">{orderCount.get(u.id) ?? 0} Sipariş</div>
              <div className="text-xs text-muted font-light">{formatDate(u.created_at)}</div>
            </div>
          ))
        )}
      </div>

      <div className="glass-luxury p-4 rounded-xl border border-gold/20 mt-6 text-xs text-muted leading-relaxed font-light flex flex-col gap-1">
        <span className="font-semibold text-ink">💡 Supabase E-posta Senkronizasyonu Bilgisi:</span>
        <span>
          Supabase SQL Editor ekranına gidip projenizdeki <code>supabase/migrations/20260820000000_add_email_to_profiles.sql</code> kodunu bir defa çalıştırarak kayıtlı tüm kullanıcıların e-posta adreslerini anında bu tabloya senkronize edebilirsiniz.
        </span>
      </div>
    </AdminShell>
  );
}
