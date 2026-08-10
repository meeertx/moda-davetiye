import Link from "next/link";
import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Yönetim Paneli Girişi",
  robots: { index: false },
};

export default function AdminGirisPage() {
  return (
    <AuthShell
      eyebrow="Yönetim Paneli"
      title="Yönetim Girişi"
      subtitle="Siparişleri görüntülemek ve davetiye linki atamak için giriş yapın"
      below={
        <div className="text-center mt-6 text-[13px]">
          <Link href="/giris" className="text-muted hover:text-ink">
            ← Müşteri girişine dön
          </Link>
        </div>
      }
    >
      <AdminLoginForm />
    </AuthShell>
  );
}
