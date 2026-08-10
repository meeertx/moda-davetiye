/**
 * Supabase henüz bağlanmadığında veri ekranlarında gösterilir.
 * Boş bir liste yerine nedenini söyler.
 */
export default function NotConfiguredNotice() {
  return (
    <div className="border border-[oklch(85%_0.06_30)] bg-danger-bg/40 rounded-[10px] p-6">
      <div className="text-[13px] tracking-[0.03em] uppercase text-danger-fg mb-2">
        Supabase yapılandırılmadı
      </div>
      <p className="text-sm text-muted leading-[1.7] m-0">
        Sipariş verileri Supabase&apos;den geliyor. Bağlanmak için{" "}
        <code className="text-[13px] bg-shell px-1.5 py-0.5 rounded-[3px]">
          .env
        </code>{" "}
        dosyasındaki{" "}
        <code className="text-[13px] bg-shell px-1.5 py-0.5 rounded-[3px]">
          NEXT_PUBLIC_SUPABASE_URL
        </code>{" "}
        ve{" "}
        <code className="text-[13px] bg-shell px-1.5 py-0.5 rounded-[3px]">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>{" "}
        değerlerini doldurun, ardından{" "}
        <code className="text-[13px] bg-shell px-1.5 py-0.5 rounded-[3px]">
          supabase/migrations/
        </code>{" "}
        altındaki SQL dosyasını Supabase SQL Editor&apos;da çalıştırın.
      </p>
    </div>
  );
}
