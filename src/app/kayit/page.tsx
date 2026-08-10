import Link from "next/link";
import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "Davetiye siparişinizi oluşturmak için ücretsiz kayıt olun.",
};

export default async function KayitPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthShell
      width={420}
      title="Hesap Oluşturun"
      subtitle="Siparişinizi oluşturmak ve takip etmek için ücretsiz kayıt olun"
      below={
        <div className="text-center mt-6 text-[13px] text-muted">
          Zaten hesabınız var mı?{" "}
          <Link
            href={next ? `/giris?next=${encodeURIComponent(next)}` : "/giris"}
          >
            Giriş yapın
          </Link>
        </div>
      }
    >
      <RegisterForm next={next} />
    </AuthShell>
  );
}
