import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PanelShell from "@/components/panel/PanelShell";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import AccountForm from "@/components/panel/AccountForm";
import EmailForm from "@/components/panel/EmailForm";
import PasswordForm from "@/components/panel/PasswordForm";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatDate } from "@/lib/orders";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Hesap Bilgilerim" };

const card = "bg-paper-alt border border-line-panel rounded-[10px] p-7";
const sectionTitle = "font-display font-medium text-xl m-0 mb-1";
const sectionHint = "text-[13px] text-muted m-0 mb-5 leading-[1.6]";

export default async function PanelAyarlarPage() {
  if (!isSupabaseConfigured) {
    return (
      <PanelShell max={760}>
        <h1 className="font-display font-medium text-[32px] m-0 mb-8">
          Hesap Bilgilerim
        </h1>
        <NotConfiguredNotice />
      </PanelShell>
    );
  }

  const current = await getCurrentUser();
  if (!current) redirect("/giris?next=/panel/ayarlar");

  const { user, profile } = current;

  return (
    <PanelShell max={760}>
      <h1 className="font-display font-medium text-[32px] m-0 mb-1">
        Hesap Bilgilerim
      </h1>
      <p className="text-sm text-muted m-0 mb-8">
        Üyelik başlangıcı: {formatDate(profile?.created_at ?? null)}
      </p>

      <div className="flex flex-col gap-6">
        <section className={card}>
          <h2 className={sectionTitle}>Kişisel Bilgiler</h2>
          <p className={sectionHint}>
            Siparişlerinizde ve size ulaşırken kullandığımız bilgiler.
          </p>
          <AccountForm
            fullName={profile?.full_name ?? ""}
            phone={profile?.phone ?? null}
          />
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>E-posta Adresi</h2>
          <p className={sectionHint}>
            Giriş yaparken ve sipariş bildirimlerinde kullanılır.
          </p>
          <EmailForm current={user.email ?? "—"} />
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Şifre</h2>
          <p className={sectionHint}>
            Değiştirmek için önce mevcut şifrenizi doğrulamanız gerekir.
          </p>
          <PasswordForm />
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Bildirimler</h2>
          <p className="text-sm text-muted leading-[1.7] m-0">
            Sipariş durumunuz değiştiğinde ve davetiyeniz hazır olduğunda
            e-posta ile bilgilendirilirsiniz. Bildirimleri kapatmak isterseniz{" "}
            <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> adresine yazın.
          </p>
        </section>

        <section className="border border-[oklch(85%_0.06_30)] rounded-[10px] p-7">
          <h2 className="font-display font-medium text-xl m-0 mb-1 text-danger-fg">
            Hesabı Sil
          </h2>
          <p className="text-[13px] text-muted leading-[1.7] m-0">
            Hesabınızı ve tüm sipariş kayıtlarınızı kalıcı olarak silmek için{" "}
            <a href={`mailto:${BRAND.email}?subject=Hesap%20silme%20talebi`}>
              {BRAND.email}
            </a>{" "}
            adresine yazın. Talebiniz 30 gün içinde işlenir. Bu işlem geri
            alınamaz.
          </p>
        </section>
      </div>
    </PanelShell>
  );
}
