import { redirect } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import OrderDetailsForm from "@/components/order/OrderDetailsForm";
import { draftFromParams, draftToQuery } from "@/lib/order-draft";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";

export const metadata: Metadata = {
  title: "Sipariş Detayları",
  robots: { index: false },
};

export default async function DetaylarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const draft = draftFromParams(params);
  if (!draft) redirect("/davetiye-talebi");

  if (!isSupabaseConfigured) {
    return (
      <SiteShell footer={40}>
        <main className="flex-1 max-w-[760px] mx-auto pt-14 px-6 pb-[110px] w-full box-border">
          <NotConfiguredNotice />
        </main>
      </SiteShell>
    );
  }

  // Proxy zaten girişsiz erişimi engelliyor; burada yalnızca kullanıcı
  // kimliğini alıyoruz (fotoğraf yükleme klasörü için gerekli).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/giris?next=${encodeURIComponent(`/davetiye-talebi/detaylar?${draftToQuery(draft)}`)}`,
    );
  }

  return (
    <SiteShell footer={40}>
      <main className="flex-1 max-w-[760px] mx-auto pt-14 px-6 pb-[110px] w-full box-border">
        <div className="text-[13px] tracking-[0.12em] uppercase text-gold mb-3">
          Adım 2 / 2
        </div>
        <h1 className="font-display font-medium text-[40px] m-0 mb-3">
          Sipariş Detayları
        </h1>
        <p className="text-base leading-[1.7] text-muted max-w-[560px] m-0 mb-8">
          Bildiğiniz kadarını doldurun — zorunlu olan tek alan telefon.
          Eksikleri sonra birlikte tamamlarız.
        </p>

        <OrderDetailsForm draft={draft} userId={user.id} />
      </main>
    </SiteShell>
  );
}
