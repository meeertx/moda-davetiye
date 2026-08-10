import Link from "next/link";
import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Şifremi Unuttum",
  description: "E-posta adresinize şifre sıfırlama bağlantısı gönderelim.",
};

export default function SifremiUnuttumPage() {
  return (
    <AuthShell
      titleSize={26}
      title="Şifrenizi mi unuttunuz?"
      subtitle="E-posta adresinize bir sıfırlama bağlantısı gönderelim"
      below={
        <div className="text-center mt-6 text-[13px] text-muted">
          <Link href="/giris">← Girişe dön</Link>
        </div>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
