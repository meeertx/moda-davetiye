import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatDate } from "@/lib/orders";

export const metadata: Metadata = { title: "Kullanıcılar" };

const gridCols = "grid grid-cols-[1.8fr_1fr_1fr_1fr] min-w-[640px]";

export default async function AdminKullanicilarPage() {
  if (!isSupabaseConfigured) {
    return (
      <AdminShell>
        <h1 className="font-display font-medium text-[32px] m-0 mb-8">
          Kullanıcılar
        </h1>
        <NotConfiguredNotice />
      </AdminShell>
    );
  }

  const supabase = await createClient();

  // RLS: "Admin tüm profilleri görebilir" politikası sayesinde hepsi döner.
  // Sipariş sayısı için ayrı sorgu — profiles→orders ilişkisi üzerinden say.
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
      <div className="flex justify-between items-baseline mb-6">
        <h1 className="font-display font-medium text-[32px] m-0">
          Kullanıcılar
        </h1>
        <div className="text-[13px] text-muted">
          {profiles.length} kayıtlı kullanıcı
        </div>
      </div>

      {profilesRes.error && (
        <div className="text-sm text-danger-fg mb-4">
          Kullanıcılar yüklenemedi: {profilesRes.error.message}
        </div>
      )}

      <div className="bg-paper-alt border border-line-panel rounded-[10px] overflow-x-auto">
        <div
          className={`${gridCols} px-5 py-3.5 text-xs tracking-[0.03em] uppercase text-muted border-b border-line-panel`}
        >
          <div>Ad Soyad</div>
          <div>Telefon</div>
          <div>Sipariş</div>
          <div>Kayıt Tarihi</div>
        </div>

        {!profiles.length ? (
          <div className="px-5 py-10 text-center text-sm text-muted">
            Henüz kayıtlı kullanıcı yok.
          </div>
        ) : (
          profiles.map((u) => (
            <div
              key={u.id}
              className={`${gridCols} px-5 py-3.5 text-[13.5px] border-b border-line-soft items-center`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="truncate">{u.full_name || "(isimsiz)"}</span>
                {u.role === "admin" && <Badge tone="ok">Admin</Badge>}
              </div>
              <div className="text-muted">{u.phone || "—"}</div>
              <div>{orderCount.get(u.id) ?? 0}</div>
              <div className="text-muted">{formatDate(u.created_at)}</div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-muted mt-4">
        E-posta adresleri güvenlik gereği burada listelenmiyor; sipariş detay
        sayfasında ilgili müşterinin adresini görebilirsiniz. Rol değişikliği
        için: <code>npm run admin -- &lt;eposta&gt;</code>
      </p>
    </AdminShell>
  );
}
