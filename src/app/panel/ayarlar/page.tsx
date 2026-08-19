import type { Metadata } from "next";
import PanelShell from "@/components/panel/PanelShell";
import AccountForm from "@/components/panel/AccountForm";
import EmailForm from "@/components/panel/EmailForm";
import PasswordForm from "@/components/panel/PasswordForm";
import DeleteAccountForm from "@/components/panel/DeleteAccountForm";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatDate } from "@/lib/orders";

export const metadata: Metadata = { title: "Hesap Bilgilerim" };

const card = "glass-luxury rounded-2xl p-7 border border-gold/25 shadow-sm";
const sectionTitle = "font-display font-medium text-2xl text-ink m-0 mb-1 tracking-tight";
const sectionHint = "text-xs text-muted m-0 mb-6 font-light leading-relaxed";

export default async function PanelAyarlarPage() {
  let profile = {
    full_name: "Selin Yılmaz",
    phone: "0532 555 0102",
    created_at: new Date().toISOString(),
  };
  let userEmail = "selin.yilmaz@example.com";

  if (isSupabaseConfigured) {
    try {
      const current = await getCurrentUser();
      if (current) {
        profile = current.profile as any;
        userEmail = current.user.email ?? "";
      }
    } catch (e) {
      console.warn("Supabase ayarlar fetch fallback:", e);
    }
  }

  return (
    <PanelShell max={760}>
      <div className="flex justify-between items-baseline mb-8 gap-4 pb-6 border-b border-gold/15">
        <div>
          <div className="text-[11.5px] font-semibold tracking-[0.16em] uppercase text-gold mb-1">
            HESAP &amp; GÜVENLİK AYARLARI
          </div>
          <h1 className="font-display font-medium text-3xl sm:text-4xl text-ink m-0 tracking-tight">
            Hesap Bilgilerim
          </h1>
        </div>
        <div className="text-xs text-muted font-light">
          Üyelik başlangıcı: <strong className="text-ink font-semibold">{formatDate(profile?.created_at ?? null)}</strong>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <section className={card}>
          <h2 className={sectionTitle}>Kişisel Bilgiler</h2>
          <p className={sectionHint}>
            Siparişlerinizde ve iletişim kurulurken kullanılan resmi müşteri profil bilgileriniz.
          </p>
          <AccountForm
            fullName={profile?.full_name ?? ""}
            phone={profile?.phone ?? null}
          />
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>E-posta Adresi</h2>
          <p className={sectionHint}>
            Giriş yaparken ve sipariş bildirimlerinde kullanılan e-posta adresiniz.
          </p>
          <EmailForm current={userEmail} />
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Şifre &amp; Güvenlik</h2>
          <p className={sectionHint}>
            Hesap güvenliğinizi korumak için şifrenizi periyodik olarak güncelleyebilirsiniz.
          </p>
          <PasswordForm />
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Bildirim Tercihleri</h2>
          <p className="text-xs text-muted leading-relaxed font-light m-0">
            Tüm sipariş güncellemesi, davetiye durumu değişikliği ve katılım (RSVP) bildirimleriniz otomatik olarak kayıtlı e-posta adresinize (<strong>{userEmail || "eposta adresiniz"}</strong>) e-posta yoluyla anlık iletilmektedir.
          </p>
        </section>

        <section className="glass-luxury rounded-2xl p-7 border border-red-500/30 shadow-xs">
          <h2 className="font-display font-medium text-2xl m-0 mb-1 text-red-700 tracking-tight">
            Hesabı Sil
          </h2>
          <DeleteAccountForm />
        </section>
      </div>
    </PanelShell>
  );
}
