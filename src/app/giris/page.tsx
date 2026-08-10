import Link from "next/link";
import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "Siparişlerinize ve davetiyenize giriş yapın.",
};

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthShell
      title="Tekrar Hoş Geldiniz"
      subtitle="Siparişlerinizi ve davetiyenizi takip etmek için giriş yapın"
      // Yönetim girişi bilerek burada duyurulmuyor — /admin adresine giden
      // yetkili zaten giriş ekranına yönlendiriliyor.
      below={
        <div className="text-center mt-6 text-[13px] text-muted">
          Hesabınız yok mu?{" "}
          <Link
            href={next ? `/kayit?next=${encodeURIComponent(next)}` : "/kayit"}
          >
            Ücretsiz kayıt olun
          </Link>
        </div>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
