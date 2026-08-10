import Link from "next/link";
import Logo from "@/components/marketing/Logo";
import { inputClass } from "@/components/ui/field";

/** Auth formlarındaki ortak input görünümü. */
export const authInput = inputClass("marketing", "bg-cream");

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  /** Kartın altındaki yönlendirme satırları */
  below?: React.ReactNode;
  /** Kart genişliği — giriş/sıfırlama 400px, kayıt 420px */
  width?: 400 | 420;
  /** Başlık boyutu — sıfırlama sayfasında 26px, diğerlerinde 28px */
  titleSize?: 26 | 28;
  /**
   * Logonun altında görünen küçük bağlam etiketi.
   * Yönetim panelinde "Yönetim Paneli" olarak kullanılır.
   */
  eyebrow?: string;
}

/**
 * Giriş / kayıt / şifre sıfırlama ve yönetim girişi için ortak kart düzeni.
 * Dört ekran da aynı açık, sıcak dünyayı paylaşır — yönetim girişi ayrı bir
 * koyu tema taşımaz, farkı `eyebrow` etiketiyle belli eder.
 */
export default function AuthShell({
  title,
  subtitle,
  children,
  below,
  width = 400,
  titleSize = 28,
  eyebrow,
}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center font-body text-ink bg-cream px-5 py-10 sm:p-10">
      {/* Dar ekranlarda sabit genişlik taşmasın diye max-width kullanılıyor */}
      <div
        className={`w-full ${width === 400 ? "max-w-[400px]" : "max-w-[420px]"}`}
      >
        <Link
          href="/"
          className="block text-center text-ink mb-2"
        >
          <Logo size={26} />
        </Link>

        {eyebrow ? (
          <div className="text-center text-[11px] tracking-[0.16em] uppercase text-gold mb-8">
            {eyebrow}
          </div>
        ) : (
          <div className="mb-8" />
        )}

        <div className="bg-paper border border-line rounded-md p-10 shadow-[0_18px_40px_-28px_oklch(24%_0.02_50_/_0.35)]">
          <h1
            className={`font-display font-medium ${
              titleSize === 28 ? "text-[28px]" : "text-[26px]"
            } m-0 mb-2 text-center`}
          >
            {title}
          </h1>
          <p className="text-[13px] text-muted text-center m-0 mb-7">
            {subtitle}
          </p>
          {children}
        </div>

        {below}
      </div>
    </div>
  );
}
